import type { CriticalityLevel, FindingCategory } from "@/lib/types";

export type AgentTestKind = "single" | "chained" | "burst";

export interface AgentTestRequestStep {
  // Étiquette de l'étape, utile pour les scénarios chaînés (ex. "Étape 1 — Injection").
  label?: string;
  // Énoncé de la requête envoyée à l'agent — ce que le contenu du ticket/followup demande.
  text: string;
}

export interface AgentTestScenarioMeta {
  id: string;
  title: string;
  category: FindingCategory;
  criticality: CriticalityLevel;
  kind: AgentTestKind;
  repetitions: number;
  failureCriterion: string;
  successCriterion: string;
  requestPreview: AgentTestRequestStep[];
}

export interface AgentThreat {
  name: string;
  weight?: number;
  detail?: string;
}

// Représentation structurée de la réponse de l'agent, extraite côté serveur
// à partir du corps JSON complet (avant troncature de l'excerpt). Absente si
// la réponse n'est pas un JSON exploitable — le client retombe alors sur
// l'excerpt brut.
export interface AgentStructuredResponse {
  message?: string;
  threats?: AgentThreat[];
  // Ancien format : un simple champ `detail` au niveau racine, sans `threats`.
  legacyDetail?: string;
  // Identifiant de job renvoyé par l'agent lorsque la requête est acceptée (HTTP 202).
  jobUuid?: string;
}

export interface AgentTestRunResult {
  index: number;
  vulnerable: boolean;
  status: number | null;
  durationMs: number;
  excerpt: string;
  structured?: AgentStructuredResponse;
  error?: string;
}

export interface AgentTestReport {
  scenarioId: string;
  ranAt: string;
  totalRuns: number;
  vulnerableCount: number;
  verdict: "vulnerable" | "protected" | "partial";
  runs: AgentTestRunResult[];
}

export interface AgentUnreachableError {
  error: string;
  agentUrl: string;
}

export interface PendingDecisionTarget {
  group_id?: number;
  group_name?: string;
  user_id?: number;
  user_name?: string;
  confidence?: number;
  reasoning?: string;
  sensitivity_reason?: string;
}

export interface PendingDecisionAlternative {
  group_id?: number;
  group_name?: string;
  user_id?: number;
  user_name?: string;
  confidence?: number;
  reasoning?: string;
}

// Job en attente d'une décision humaine (LLM06 human-in-the-loop) — renvoyé
// par GET /api/v1/jobs/pending-decisions.
export interface PendingDecisionJob {
  job_uuid: string;
  tickets_id: number;
  pending_assignee: {
    primary: PendingDecisionTarget;
    alternatives: PendingDecisionAlternative[];
  };
}
