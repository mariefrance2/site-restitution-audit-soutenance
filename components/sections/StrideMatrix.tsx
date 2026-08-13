"use client";

import { FadeIn } from "@/components/ui/FadeIn";
import { CriticalityLegend } from "@/components/ui/Legend";
import { CriticalityIcon } from "@/components/ui/CriticalityIcon";
import {
  dominantCriticalityForCategory,
  getCategoryMeta,
  getCriticalityMeta,
} from "@/lib/utils";
import type { CriticalityLevel, FindingCategory } from "@/lib/types";

const COMPONENTS = [
  "Ollama (LLM local)",
  "Qdrant (base vectorielle)",
  "LangGraph (orchestrateur)",
  "FastAPI (API)",
  "Redis (cache)",
] as const;

const STRIDE_CATEGORIES = [
  { id: "spoofing", label: "Spoofing" },
  { id: "tampering", label: "Tampering" },
  { id: "repudiation", label: "Repudiation" },
  { id: "info-disclosure", label: "Information disclosure" },
  { id: "dos", label: "Denial of service" },
  { id: "privilege", label: "Elevation of privilege" },
] as const;

type StrideCategoryId = (typeof STRIDE_CATEGORIES)[number]["id"];

interface Mapping {
  component: (typeof COMPONENTS)[number];
  stride: StrideCategoryId;
  findingCategory: FindingCategory;
}

const MAPPINGS: Mapping[] = [
  { component: "Qdrant (base vectorielle)", stride: "tampering", findingCategory: "llm08" },
  { component: "FastAPI (API)", stride: "privilege", findingCategory: "llm06" },
  { component: "LangGraph (orchestrateur)", stride: "spoofing", findingCategory: "llm01" },
  { component: "FastAPI (API)", stride: "info-disclosure", findingCategory: "llm02" },
  { component: "FastAPI (API)", stride: "dos", findingCategory: "llm10" },
];

function findMapping(component: string, stride: StrideCategoryId): Mapping | undefined {
  return MAPPINGS.find((m) => m.component === component && m.stride === stride);
}

export function StrideMatrix() {
  const criticalityCounts = MAPPINGS.reduce<Record<CriticalityLevel, number>>(
    (acc, m) => {
      const level = dominantCriticalityForCategory(m.findingCategory);
      acc[level] = (acc[level] ?? 0) + 1;
      return acc;
    },
    { critique: 0, eleve: 0, moyen: 0, faible: 0 }
  );

  return (
    <FadeIn delay={0.1} className="mt-16">
      <div className="card-surface p-6 sm:p-8">
        <h3 className="text-xl font-bold text-brand-red-darker">
          Modélisation STRIDE-AI de l&apos;architecture de l&apos;agent
        </h3>
        <p className="mt-1.5 max-w-3xl text-sm leading-relaxed text-neutral-500">
          Chaque composant de l&apos;agent IA (modèle local, base vectorielle, orchestrateur,
          API, cache) croisé avec les six catégories STRIDE, pour situer précisément où les
          constats de l&apos;audit s&apos;inscrivent dans l&apos;architecture.
        </p>

        <div className="mt-6 overflow-x-auto">
          <table className="w-full min-w-[760px] border-separate border-spacing-1.5 text-sm">
            <thead>
              <tr>
                <th className="w-48 p-2 text-left text-xs font-semibold uppercase tracking-wide text-neutral-400">
                  Composant \ STRIDE
                </th>
                {STRIDE_CATEGORIES.map((s) => (
                  <th
                    key={s.id}
                    className="p-2 text-center text-[11px] font-semibold uppercase tracking-wide text-neutral-400"
                  >
                    {s.label}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {COMPONENTS.map((component) => (
                <tr key={component}>
                  <th className="p-2 text-left text-xs font-semibold text-brand-red-darker">
                    {component}
                  </th>
                  {STRIDE_CATEGORIES.map((s) => {
                    const mapping = findMapping(component, s.id);
                    if (!mapping) {
                      return (
                        <td
                          key={s.id}
                          className="rounded-lg bg-surface-card p-2 text-center text-[11px] text-neutral-300"
                          aria-label="Aucun constat associé"
                        >
                          —
                        </td>
                      );
                    }
                    const catMeta = getCategoryMeta(mapping.findingCategory);
                    const level = dominantCriticalityForCategory(mapping.findingCategory);
                    const hex = getCriticalityMeta(level).hex;
                    return (
                      <td
                        key={s.id}
                        className="rounded-lg p-2 text-center align-middle"
                        style={{ backgroundColor: `${hex}1A`, border: `1px solid ${hex}55` }}
                      >
                        <div className="flex flex-col items-center gap-1">
                          <span style={{ color: hex }}>
                            <CriticalityIcon level={level} className="h-4 w-4" strokeWidth={2.25} />
                          </span>
                          <span className="text-[11px] font-bold" style={{ color: hex }}>
                            {catMeta.shortLabel}
                          </span>
                        </div>
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="mt-6 border-t border-black/[0.06] pt-5">
          <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-neutral-400">
            Légende — criticité des constats associés
          </p>
          <CriticalityLegend counts={criticalityCounts} className="sm:flex-row sm:flex-wrap sm:gap-x-6" />
        </div>
      </div>
    </FadeIn>
  );
}
