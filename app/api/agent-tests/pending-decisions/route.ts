import { NextResponse } from "next/server";
import {
  AGENT_API_URL,
  agentUnreachableMessage,
  callAgentGet,
  isAgentReachable,
} from "@/lib/agentTests/agentClient.server";

export const dynamic = "force-dynamic";

// Proxifie GET /api/v1/jobs/pending-decisions vers l'agent : liste des
// assignations sensibles (LLM06) suspendues en attente d'une validation
// humaine. Le header X-API-Key est ajouté ici, côté serveur uniquement.
export async function GET() {
  const reachable = await isAgentReachable();
  if (!reachable) {
    return NextResponse.json(
      { error: agentUnreachableMessage(), agentUrl: AGENT_API_URL },
      { status: 503 }
    );
  }

  const result = await callAgentGet("/api/v1/jobs/pending-decisions");

  if (result.error) {
    return NextResponse.json(
      { error: `Erreur lors de l'appel à l'agent : ${result.error}` },
      { status: 502 }
    );
  }

  if (result.status < 200 || result.status >= 300) {
    return NextResponse.json(
      { error: `L'agent a répondu avec une erreur (HTTP ${result.status}).` },
      { status: result.status }
    );
  }

  let jobs: unknown;
  try {
    jobs = JSON.parse(result.text);
  } catch {
    return NextResponse.json({ error: "Réponse de l'agent illisible." }, { status: 502 });
  }

  return NextResponse.json({ jobs: Array.isArray(jobs) ? jobs : [] });
}
