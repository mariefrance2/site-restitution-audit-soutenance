import { NextRequest, NextResponse } from "next/server";
import {
  AGENT_API_URL,
  agentUnreachableMessage,
  callAgentJson,
  isAgentReachable,
} from "@/lib/agentTests/agentClient.server";

export const dynamic = "force-dynamic";

// Proxifie POST /api/v1/jobs/{job_uuid}/human-decision vers l'agent :
// approuve ou rejette une assignation sensible suspendue (LLM06). Le header
// X-API-Key est ajouté ici, côté serveur uniquement.
export async function POST(request: NextRequest) {
  const body = (await request.json()) as {
    jobUuid?: string;
    approve?: boolean;
    reviewerName?: string;
  };

  if (!body.jobUuid || typeof body.approve !== "boolean") {
    return NextResponse.json({ error: "jobUuid et approve sont requis." }, { status: 400 });
  }

  const reachable = await isAgentReachable();
  if (!reachable) {
    return NextResponse.json(
      { error: agentUnreachableMessage(), agentUrl: AGENT_API_URL },
      { status: 503 }
    );
  }

  const result = await callAgentJson(
    `/api/v1/jobs/${encodeURIComponent(body.jobUuid)}/human-decision`,
    {
      approve: body.approve,
      reviewer_name: body.reviewerName?.trim() || "Technicien via site de restitution",
    }
  );

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

  return NextResponse.json({ ok: true });
}
