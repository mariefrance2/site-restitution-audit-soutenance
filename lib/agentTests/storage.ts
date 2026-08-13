import type { AgentTestReport } from "./types";

const STORAGE_KEY = "audit-glpi-agent-tests-history-v1";
const MAX_ENTRIES = 200;

export interface StoredRunEntry {
  scenarioId: string;
  ranAt: string;
  verdict: AgentTestReport["verdict"];
  vulnerableCount: number;
  totalRuns: number;
}

export function loadHistory(): StoredRunEntry[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function appendHistory(report: AgentTestReport): StoredRunEntry[] {
  const entry: StoredRunEntry = {
    scenarioId: report.scenarioId,
    ranAt: report.ranAt,
    verdict: report.verdict,
    vulnerableCount: report.vulnerableCount,
    totalRuns: report.totalRuns,
  };
  const history = [entry, ...loadHistory()].slice(0, MAX_ENTRIES);
  if (typeof window !== "undefined") {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(history));
    } catch {
      // Stockage plein ou indisponible (navigation privée) : on continue sans historiser.
    }
  }
  return history;
}

export function clearHistory(): StoredRunEntry[] {
  if (typeof window !== "undefined") {
    try {
      window.localStorage.removeItem(STORAGE_KEY);
    } catch {
      // ignore
    }
  }
  return [];
}

export interface HistoryStats {
  totalTests: number;
  protectedRate: number; // % de runs jugés "protected" ou "partial" (défense au moins partiellement efficace)
  lastRunAt: string | null;
}

export function computeStats(history: StoredRunEntry[]): HistoryStats {
  if (history.length === 0) {
    return { totalTests: 0, protectedRate: 0, lastRunAt: null };
  }
  const protectedCount = history.filter((h) => h.verdict !== "vulnerable").length;
  return {
    totalTests: history.length,
    protectedRate: Math.round((protectedCount / history.length) * 100),
    lastRunAt: history[0].ranAt,
  };
}
