import { NextResponse } from "next/server";
import {
  AGENT_API_URL,
  agentUnreachableMessage,
  callAgentGet,
  isAgentReachable,
} from "@/lib/agentTests/agentClient.server";

export const dynamic = "force-dynamic";

// Tolère plusieurs formes de réponse (tableau nu, ou tableau imbriqué sous
// jobs/data/pending_decisions/results/items) au cas où l'agent n'encapsule
// pas la liste exactement comme prévu.
function extractJobs(raw: unknown): unknown[] {
  if (Array.isArray(raw)) return raw;
  if (raw && typeof raw === "object") {
    const obj = raw as Record<string, unknown>;
    for (const key of ["jobs", "data", "pending_decisions", "results", "items"]) {
      if (Array.isArray(obj[key])) return obj[key] as unknown[];
    }
  }
  return [];
}

// Proxifie GET /api/v1/jobs/pending-decisions vers l'agent : liste des
// assignations sensibles (LLM06) suspendues en attente d'une validation
// humaine. Le header X-API-Key est ajouté ici, côté serveur uniquement.
export async function GET() {
  console.log("[/api/agent-tests/pending-decisions] GET reçu");

  const reachable = await isAgentReachable();
  console.log(
    `[/api/agent-tests/pending-decisions] agent joignable=${reachable} (${AGENT_API_URL})`
  );
  if (!reachable) {
    return NextResponse.json(
      { error: agentUnreachableMessage(), agentUrl: AGENT_API_URL },
      { status: 503 }
    );
  }

  const result = await callAgentGet("/api/v1/jobs/pending-decisions");
  console.log(
    `[/api/agent-tests/pending-decisions] callAgentGet -> status=${result.status} ` +
      `error=${result.error ?? "-"} textLength=${result.text.length}`
  );

  if (result.error) {
    return NextResponse.json(
      { error: `Erreur lors de l'appel à l'agent : ${result.error}` },
      { status: 502 }
    );
  }

  if (result.status < 200 || result.status >= 300) {
    console.error(
      `[/api/agent-tests/pending-decisions] agent a répondu HTTP ${result.status} : ${result.text.slice(0, 500)}`
    );
    return NextResponse.json(
      { error: `L'agent a répondu avec une erreur (HTTP ${result.status}).` },
      { status: result.status }
    );
  }

  let parsed: unknown;
  try {
    parsed = JSON.parse(result.text);
  } catch (err) {
    console.error(
      "[/api/agent-tests/pending-decisions] réponse agent illisible :",
      result.text.slice(0, 500),
      err
    );
    return NextResponse.json({ error: "Réponse de l'agent illisible." }, { status: 502 });
  }

  const jobs = extractJobs(parsed);
  console.log(`[/api/agent-tests/pending-decisions] jobs extraits : ${jobs.length}`);

  return NextResponse.json({ jobs });
}
