import { NextRequest, NextResponse } from "next/server";
import { getServerScenario, type EvaluationInput } from "@/lib/agentTests/scenarios.server";
import type {
  AgentStructuredResponse,
  AgentTestReport,
  AgentTestRunResult,
  AgentThreat,
} from "@/lib/agentTests/types";

export const dynamic = "force-dynamic";

const AGENT_API_URL = (process.env.AGENT_API_URL || "http://localhost:8000").replace(/\/$/, "");
const AGENT_API_KEY = process.env.AGENT_API_KEY || "";
const HEALTHCHECK_TIMEOUT_MS = 3000;
const CALL_TIMEOUT_MS = 20000;

function agentUnreachableMessage(): string {
  return (
    `Agent injoignable à ${AGENT_API_URL}. Cette fonctionnalité nécessite que le site tourne ` +
    "en local, connecté à l'agent actif. Vérifiez que l'agent est démarré et que " +
    "AGENT_API_URL est correctement configuré."
  );
}

async function fetchWithTimeout(url: string, init: RequestInit, timeoutMs: number) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), timeoutMs);
  try {
    return await fetch(url, { ...init, signal: controller.signal });
  } finally {
    clearTimeout(timeout);
  }
}

async function isAgentReachable(): Promise<boolean> {
  try {
    await fetchWithTimeout(`${AGENT_API_URL}/docs`, { method: "GET" }, HEALTHCHECK_TIMEOUT_MS);
    return true;
  } catch {
    return false;
  }
}

async function callAgent(
  endpoint: string,
  body: unknown
): Promise<EvaluationInput & { error?: string }> {
  try {
    const res = await fetchWithTimeout(
      `${AGENT_API_URL}${endpoint}`,
      {
        method: "POST",
        headers: {
          "content-type": "application/json",
          "X-API-Key": AGENT_API_KEY,
        },
        body: JSON.stringify(body),
      },
      CALL_TIMEOUT_MS
    );
    const text = await res.text();
    return { status: res.status, text };
  } catch (err) {
    return {
      status: 0,
      text: "",
      error: err instanceof Error ? err.message : "Erreur réseau inconnue.",
    };
  }
}

function excerptOf(text: string, max = 400): string {
  if (!text) return "(réponse vide)";
  return text.length > max ? `${text.slice(0, max)}…` : text;
}

// Extrait une représentation structurée (message + menaces détectées) du
// corps JSON complet de la réponse de l'agent, avant toute troncature.
// Retourne undefined si la réponse n'est pas un JSON exploitable, auquel cas
// le client retombe sur l'excerpt brut.
function parseStructuredResponse(text: string): AgentStructuredResponse | undefined {
  if (!text) return undefined;

  let parsed: unknown;
  try {
    parsed = JSON.parse(text);
  } catch {
    return undefined;
  }
  if (!parsed || typeof parsed !== "object") return undefined;

  const obj = parsed as Record<string, unknown>;
  const message = typeof obj.message === "string" ? obj.message : undefined;
  const jobUuid =
    typeof obj.job_uuid === "string"
      ? obj.job_uuid
      : typeof obj.jobUuid === "string"
      ? obj.jobUuid
      : undefined;

  if (Array.isArray(obj.threats)) {
    const threats: AgentThreat[] = obj.threats
      .filter((t): t is Record<string, unknown> => Boolean(t) && typeof t === "object")
      .map((t) => ({
        name: typeof t.name === "string" ? t.name : "Menace",
        weight: typeof t.weight === "number" ? t.weight : undefined,
        detail: typeof t.detail === "string" ? t.detail : undefined,
      }));
    if (threats.length > 0) {
      return { message, threats, jobUuid };
    }
  }

  // Ancien format : un champ `detail` en chaîne simple au niveau racine, sans `threats`.
  if (typeof obj.detail === "string") {
    return { message, legacyDetail: obj.detail, jobUuid };
  }

  return message || jobUuid ? { message, jobUuid } : undefined;
}

function buildVerdict(runs: AgentTestRunResult[]): AgentTestReport["verdict"] {
  const vulnerableCount = runs.filter((r) => r.vulnerable).length;
  if (vulnerableCount === 0) return "protected";
  if (vulnerableCount === runs.length) return "vulnerable";
  return "partial";
}

// Exécute une requête personnalisée (texte libre saisi par l'utilisateur),
// avec la même structure de payload que les scénarios prédéfinis mais une
// seule exécution, sans critère de vulnérabilité prédéfini.
async function runCustomRequest(content: string) {
  const reachable = await isAgentReachable();
  if (!reachable) {
    return NextResponse.json(
      { error: agentUnreachableMessage(), agentUrl: AGENT_API_URL },
      { status: 503 }
    );
  }

  const runStart = Date.now();
  const result = await callAgent("/api/v1/jobs", {
    ticket_context: {
      tickets_id: Math.floor(100000 + Math.random() * 900000),
      entities_id: 1,
      name: "Test personnalisé",
      content,
      status: "new",
      priority: 1,
      urgency: 1,
      impact: 1,
      category: "support",
      category_id: 1,
      actors: [],
      groups: [],
      followups: [],
      solutions: [],
    },
  });

  if (result.error) {
    return NextResponse.json(
      { error: `Erreur lors de l'appel à l'agent : ${result.error}` },
      { status: 502 }
    );
  }

  const run: AgentTestRunResult = {
    index: 1,
    vulnerable: false,
    status: result.status || null,
    durationMs: Date.now() - runStart,
    excerpt: excerptOf(result.text),
    structured: parseStructuredResponse(result.text),
  };

  return NextResponse.json({ run });
}

export async function POST(request: NextRequest) {
  const body = (await request.json()) as { scenarioId?: string; customContent?: string };

  if (typeof body.customContent === "string") {
    if (!body.customContent.trim()) {
      return NextResponse.json({ error: "Le contenu de la requête est requis." }, { status: 400 });
    }
    return runCustomRequest(body.customContent);
  }

  const { scenarioId } = body;

  if (!scenarioId) {
    return NextResponse.json({ error: "scenarioId requis." }, { status: 400 });
  }

  const scenario = getServerScenario(scenarioId);
  if (!scenario) {
    return NextResponse.json({ error: `Scénario inconnu : ${scenarioId}` }, { status: 404 });
  }

  const reachable = await isAgentReachable();
  if (!reachable) {
    return NextResponse.json(
      { error: agentUnreachableMessage(), agentUrl: AGENT_API_URL },
      { status: 503 }
    );
  }

  const runs: AgentTestRunResult[] = [];

  if (scenario.kind === "burst") {
    const size = scenario.burstSize ?? 20;
    const start = Date.now();
    const calls = Array.from({ length: size }, (_, i) =>
      callAgent(scenario.calls[0].endpoint, scenario.calls[0].buildBody(i))
    );
    const results = await Promise.all(calls);
    results.forEach((r, i) => {
      runs.push({
        index: i + 1,
        vulnerable: r.status >= 200 && r.status < 300,
        status: r.status || null,
        durationMs: Date.now() - start,
        excerpt: r.error ? `Erreur : ${r.error}` : `HTTP ${r.status} — ${excerptOf(r.text, 120)}`,
        error: r.error,
      });
    });
  } else {
    for (let i = 0; i < scenario.repetitions; i++) {
      const runStart = Date.now();
      const responses: EvaluationInput[] = [];
      let hadError: string | undefined;

      for (const call of scenario.calls) {
        const result = await callAgent(call.endpoint, call.buildBody(i));
        if (result.error) hadError = result.error;
        responses.push({ status: result.status, text: result.text });
      }

      const lastResponse = responses[responses.length - 1];
      const vulnerable = hadError ? false : scenario.evaluate(responses);

      runs.push({
        index: i + 1,
        vulnerable,
        status: lastResponse?.status || null,
        durationMs: Date.now() - runStart,
        excerpt: hadError
          ? `Erreur : ${hadError}`
          : `HTTP ${lastResponse.status} — ${excerptOf(lastResponse.text)}`,
        structured: hadError ? undefined : parseStructuredResponse(lastResponse.text),
        error: hadError,
      });
    }
  }

  const report: AgentTestReport = {
    scenarioId: scenario.id,
    ranAt: new Date().toISOString(),
    totalRuns: runs.length,
    vulnerableCount: runs.filter((r) => r.vulnerable).length,
    verdict: buildVerdict(runs),
    runs,
  };

  return NextResponse.json(report);
}
