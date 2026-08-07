import findingsData from "@/lib/data/findings.json";
import metaData from "@/lib/data/meta.json";
import type {
  CategoryMeta,
  CriticalityLevel,
  CriticalityMeta,
  Finding,
  FindingCategory,
} from "@/lib/types";

export const findings = findingsData as Finding[];
export const categories = metaData.categories as CategoryMeta[];
export const criticalities = metaData.criticalities as CriticalityMeta[];

export function getCriticalityMeta(level: CriticalityLevel): CriticalityMeta {
  const found = criticalities.find((c) => c.id === level);
  if (!found) throw new Error(`Unknown criticality: ${level}`);
  return found;
}

export function getCategoryMeta(category: FindingCategory): CategoryMeta {
  const found = categories.find((c) => c.id === category);
  if (!found) throw new Error(`Unknown category: ${category}`);
  return found;
}

export function countByCriticality(level: CriticalityLevel): number {
  return findings.filter((f) => f.criticality === level).length;
}

export function countByCategory(category: FindingCategory): number {
  return findings.filter((f) => f.category === category).length;
}

export function dominantCriticalityForCategory(
  category: FindingCategory
): CriticalityLevel {
  const items = findings.filter((f) => f.category === category);
  let worst = criticalities[criticalities.length - 1];
  for (const item of items) {
    const meta = getCriticalityMeta(item.criticality);
    if (meta.order < worst.order) worst = meta;
  }
  return worst.id as CriticalityLevel;
}

export const remediationRate = Math.round(
  (findings.filter((f) => f.remediated).length / findings.length) * 100
);

export function formatBytes(bytes: number): string {
  if (bytes === 0) return "0 o";
  const units = ["o", "Ko", "Mo", "Go"];
  const i = Math.floor(Math.log(bytes) / Math.log(1024));
  return `${(bytes / Math.pow(1024, i)).toFixed(1)} ${units[i]}`;
}

export function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString("fr-FR", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
}

export function cx(...classes: (string | false | null | undefined)[]) {
  return classes.filter(Boolean).join(" ");
}

export function sanitizeFilename(name: string): string {
  const base = (name.split(/[\\/]/).pop() || "rapport.pdf").replace(/[^a-zA-Z0-9._-]/g, "_");
  return base.toLowerCase().endsWith(".pdf") ? base : `${base}.pdf`;
}
