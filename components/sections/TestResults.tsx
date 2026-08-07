"use client";

import { useMemo, useState } from "react";
import { ArrowRight, CheckCircle2, CircleDot, Wrench } from "lucide-react";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { CriticalityBadge } from "@/components/ui/CriticalityBadge";
import { FadeIn, StaggerGroup, StaggerItem } from "@/components/ui/FadeIn";
import { categories, criticalities, findings, getCategoryMeta, cx } from "@/lib/utils";
import type { CriticalityLevel, FindingCategory } from "@/lib/types";

export function TestResults() {
  const [categoryFilter, setCategoryFilter] = useState<FindingCategory | "all">("all");
  const [criticalityFilter, setCriticalityFilter] = useState<CriticalityLevel | "all">("all");

  const filtered = useMemo(() => {
    return findings.filter((f) => {
      if (categoryFilter !== "all" && f.category !== categoryFilter) return false;
      if (criticalityFilter !== "all" && f.criticality !== criticalityFilter) return false;
      return true;
    });
  }, [categoryFilter, criticalityFilter]);

  const groupedCategories = categories.filter((c) =>
    filtered.some((f) => f.category === c.id)
  );

  return (
    <section id="resultats" className="relative bg-white py-20 sm:py-28">
      <div className="container-page">
        <SectionHeading
          eyebrow="Section 2 — Résultats des tests"
          title="Le détail des 16 constats, catégorie par catégorie"
          subtitle="De l'audit infrastructure aux vulnérabilités spécifiques aux modèles de langage (OWASP LLM Top 10), chaque constat est documenté : contexte, impact, statut avant et après remédiation."
        />

        <FadeIn delay={0.1} className="mt-10 flex flex-col gap-4">
          <div className="flex flex-wrap items-center gap-2">
            <span className="mr-1 text-xs font-semibold uppercase tracking-wide text-neutral-400">
              Catégorie
            </span>
            <FilterPill active={categoryFilter === "all"} onClick={() => setCategoryFilter("all")}>
              Toutes
            </FilterPill>
            {categories.map((c) => (
              <FilterPill
                key={c.id}
                active={categoryFilter === c.id}
                onClick={() => setCategoryFilter(c.id)}
              >
                {c.shortLabel}
              </FilterPill>
            ))}
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <span className="mr-1 text-xs font-semibold uppercase tracking-wide text-neutral-400">
              Criticité
            </span>
            <FilterPill
              active={criticalityFilter === "all"}
              onClick={() => setCriticalityFilter("all")}
            >
              Toutes
            </FilterPill>
            {criticalities.map((c) => (
              <FilterPill
                key={c.id}
                active={criticalityFilter === c.id}
                onClick={() => setCriticalityFilter(c.id)}
                dotColor={c.hex}
              >
                {c.label}
              </FilterPill>
            ))}
          </div>
          <p className="text-xs text-neutral-400">
            {filtered.length} constat{filtered.length > 1 ? "s" : ""} affiché
            {filtered.length > 1 ? "s" : ""} sur {findings.length}
          </p>
        </FadeIn>

        <div className="mt-10 flex flex-col gap-14">
          {groupedCategories.map((cat) => {
            const items = filtered.filter((f) => f.category === cat.id);
            return (
              <div key={cat.id}>
                <FadeIn>
                  <h3 className="text-xl font-bold text-brand-red-darker">{cat.label}</h3>
                  <p className="mt-1 max-w-2xl text-sm text-neutral-500">{cat.description}</p>
                </FadeIn>
                <StaggerGroup className="mt-6 grid gap-5 md:grid-cols-2">
                  {items.map((finding) => (
                    <StaggerItem key={finding.id}>
                      <FindingCard finding={finding} />
                    </StaggerItem>
                  ))}
                </StaggerGroup>
              </div>
            );
          })}

          {filtered.length === 0 && (
            <FadeIn className="rounded-card border border-dashed border-black/10 bg-surface-card px-6 py-16 text-center">
              <p className="text-sm font-medium text-neutral-500">
                Aucun constat ne correspond à ces filtres.
              </p>
            </FadeIn>
          )}
        </div>
      </div>
    </section>
  );
}

function FilterPill({
  active,
  onClick,
  children,
  dotColor,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
  dotColor?: string;
}) {
  return (
    <button
      onClick={onClick}
      className={cx(
        "focus-ring inline-flex items-center gap-1.5 rounded-full border px-3.5 py-1.5 text-xs font-semibold transition-colors",
        active
          ? "border-brand-red bg-brand-red text-white"
          : "border-black/10 bg-white text-neutral-600 hover:border-brand-red/30 hover:text-brand-red-dark"
      )}
    >
      {dotColor && (
        <span
          className="h-1.5 w-1.5 rounded-full"
          style={{ backgroundColor: active ? "#fff" : dotColor }}
        />
      )}
      {children}
    </button>
  );
}

function FindingCard({ finding }: { finding: (typeof findings)[number] }) {
  const catMeta = getCategoryMeta(finding.category);
  return (
    <article className="card-surface card-surface-hover flex h-full flex-col p-6">
      <div className="flex items-start justify-between gap-3">
        <span className="font-mono text-[11px] font-semibold uppercase tracking-wider text-neutral-400">
          {finding.id}
        </span>
        <CriticalityBadge level={finding.criticality} size="sm" />
      </div>

      <h4 className="mt-3 text-base font-bold leading-snug text-brand-red-darker">
        {finding.title}
      </h4>
      <p className="mt-2 text-sm leading-relaxed text-neutral-600">{finding.description}</p>

      <div className="mt-4 rounded-lg bg-brand-red/[0.04] px-3.5 py-3 text-xs leading-relaxed text-brand-red-dark/90">
        <span className="font-semibold">Impact : </span>
        {finding.impact}
      </div>

      <div className="mt-4 flex flex-col gap-2 border-t border-black/[0.06] pt-4 text-sm">
        <div className="flex items-start gap-2">
          <CircleDot className="mt-0.5 h-3.5 w-3.5 shrink-0 text-brand-red" />
          <p>
            <span className="font-semibold text-neutral-700">Avant : </span>
            <span className="text-neutral-500">{finding.statusBefore}</span>
          </p>
        </div>
        <div className="flex items-start gap-2">
          <CheckCircle2 className="mt-0.5 h-3.5 w-3.5 shrink-0 text-criticality-low" />
          <p>
            <span className="font-semibold text-neutral-700">Après : </span>
            <span className="text-neutral-500">{finding.statusAfter}</span>
          </p>
        </div>
      </div>

      <div className="mt-4 flex items-center justify-between gap-2 border-t border-black/[0.06] pt-4">
        <span className="inline-flex items-center gap-1.5 text-xs font-medium text-neutral-400">
          <Wrench className="h-3.5 w-3.5" /> {finding.tool}
        </span>
        <span className="inline-flex items-center gap-1 text-xs font-semibold text-criticality-low">
          Corrigé <ArrowRight className="h-3 w-3" />
        </span>
      </div>
      <span className="sr-only">Catégorie : {catMeta.label}</span>
    </article>
  );
}
