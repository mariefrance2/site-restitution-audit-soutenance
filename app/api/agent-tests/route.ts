import { NextRequest, NextResponse } from "next/server";
import { getServerScenario, type EvaluationInput } from "@/lib/agentTests/scenarios.server";
import type { AgentTestReport, AgentTestRunResult } from "@/lib/agentTests/types";

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

function buildVerdict(runs: AgentTestRunResult[]): AgentTestReport["verdict"] {
  const vulnerableCount = runs.filter((r) => r.vulnerable).length;
  if (vulnerableCount === 0) return "protected";
  if (vulnerableCount === runs.length) return "vulnerable";
  return "partial";
}

export async function POST(request: NextRequest) {
  const { scenarioId } = (await request.json()) as { scenarioId?: string };

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
