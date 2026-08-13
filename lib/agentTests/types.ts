import type { CriticalityLevel, FindingCategory } from "@/lib/types";

export type AgentTestKind = "single" | "chained" | "burst";

export interface AgentTestScenarioMeta {
  id: string;
  title: string;
  category: FindingCategory;
  criticality: CriticalityLevel;
  kind: AgentTestKind;
  repetitions: number;
  failureCriterion: string;
  successCriterion: string;
}

export interface AgentTestRunResult {
  index: number;
  vulnerable: boolean;
  status: number | null;
  durationMs: number;
  excerpt: string;
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
