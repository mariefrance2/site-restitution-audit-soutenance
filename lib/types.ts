export type CriticalityLevel = "critique" | "eleve" | "moyen" | "faible";

export type FindingCategory =
  | "infrastructure"
  | "garde-fous"
  | "llm01"
  | "llm02"
  | "llm06"
  | "llm08"
  | "llm10";

export interface Finding {
  id: string;
  category: FindingCategory;
  criticality: CriticalityLevel;
  title: string;
  description: string;
  impact: string;
  tool: string;
  statusBefore: string;
  remediation: string;
  statusAfter: string;
  remediated: boolean;
  dateFound: string;
  dateRemediated: string;
}

export interface CategoryMeta {
  id: FindingCategory;
  label: string;
  shortLabel: string;
  description: string;
}

export interface CriticalityMeta {
  id: CriticalityLevel;
  label: string;
  hex: string;
  order: number;
}

export interface TimelinePhase {
  id: string;
  title: string;
  period: string;
  description: string;
  icon: string;
}

export interface ToolItem {
  id: string;
  name: string;
  role: string;
  category: "infrastructure" | "llm";
}

export interface CategoryAttackRate {
  category: FindingCategory;
  before: number;
  after: number;
}

export interface ConsequenceStat {
  id: string;
  value: string;
  label: string;
  description: string;
  source: string;
  trend?: "up" | "down";
}
