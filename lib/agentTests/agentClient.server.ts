// Client HTTP partagé pour proxifier les appels vers l'agent IA depuis les
// routes serveur Next.js (/api/agent-tests, /api/agent-tests/pending-decisions,
// /api/agent-tests/human-decision). Le header X-API-Key n'est ajouté qu'ici,
// côté serveur, et n'atteint jamais le navigateur. Jamais importé côté client.

export const AGENT_API_URL = (process.env.AGENT_API_URL || "http://localhost:8000").replace(
  /\/$/,
  ""
);
export const AGENT_API_KEY = process.env.AGENT_API_KEY || "";

export const HEALTHCHECK_TIMEOUT_MS = 3000;
export const CALL_TIMEOUT_MS = 20000;

export function agentUnreachableMessage(): string {
  return (
    `Agent injoignable à ${AGENT_API_URL}. Cette fonctionnalité nécessite que le site tourne ` +
    "en local, connecté à l'agent actif. Vérifiez que l'agent est démarré et que " +
    "AGENT_API_URL est correctement configuré."
  );
}

export async function fetchWithTimeout(url: string, init: RequestInit, timeoutMs: number) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), timeoutMs);
  try {
    return await fetch(url, { ...init, signal: controller.signal });
  } finally {
    clearTimeout(timeout);
  }
}

export async function isAgentReachable(): Promise<boolean> {
  try {
    await fetchWithTimeout(`${AGENT_API_URL}/docs`, { method: "GET" }, HEALTHCHECK_TIMEOUT_MS);
    return true;
  } catch {
    return false;
  }
}

export interface AgentCallResult {
  status: number;
  text: string;
  error?: string;
}

export async function callAgentJson(
  endpoint: string,
  body: unknown,
  timeoutMs: number = CALL_TIMEOUT_MS
): Promise<AgentCallResult> {
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
      timeoutMs
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

export async function callAgentGet(
  endpoint: string,
  timeoutMs: number = CALL_TIMEOUT_MS
): Promise<AgentCallResult> {
  try {
    const res = await fetchWithTimeout(
      `${AGENT_API_URL}${endpoint}`,
      { method: "GET", headers: { "X-API-Key": AGENT_API_KEY } },
      timeoutMs
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
