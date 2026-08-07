import {
  CircleCheckBig,
  FlaskConical,
  Server,
  ShieldCheck,
  Swords,
  type LucideIcon,
} from "lucide-react";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { FadeIn, StaggerGroup, StaggerItem } from "@/components/ui/FadeIn";
import { BeforeAfterChart } from "@/components/charts/BeforeAfterChart";
import timeline from "@/lib/data/timeline.json";
import tools from "@/lib/data/tools.json";
import type { TimelinePhase, ToolItem } from "@/lib/types";

const ICONS: Record<string, LucideIcon> = {
  "flask-conical": FlaskConical,
  server: Server,
  swords: Swords,
  "shield-check": ShieldCheck,
  "circle-check-big": CircleCheckBig,
};

export function BilanDashboard() {
  const phases = timeline as TimelinePhase[];
  const toolItems = tools as ToolItem[];

  return (
    <section id="bilan" className="relative py-20 sm:py-28">
      <div className="container-page">
        <SectionHeading
          eyebrow="Section 3 — Bilan de restitution"
          title="De la mise en place du laboratoire au retest de validation"
          subtitle="Cinq mois de campagne structurée, des outils spécialisés, et une réduction mesurée du taux de réussite des attaques sur l'ensemble des catégories testées."
        />

        {/* Timeline */}
        <FadeIn delay={0.1} className="mt-14">
          <div className="relative">
            <div className="absolute left-0 right-0 top-6 hidden h-px bg-gradient-to-r from-brand-red/10 via-brand-red/40 to-brand-red/10 lg:block" />
            <StaggerGroup className="grid gap-8 lg:grid-cols-5 lg:gap-4">
              {phases.map((phase, i) => {
                const Icon = ICONS[phase.icon] ?? ShieldCheck;
                return (
                  <StaggerItem key={phase.id}>
                    <div className="relative flex flex-col items-start lg:items-center lg:text-center">
                      <span className="relative z-10 flex h-12 w-12 shrink-0 items-center justify-center rounded-full border-2 border-brand-red bg-white shadow-card">
                        <Icon className="h-5 w-5 text-brand-red" strokeWidth={1.75} />
                      </span>
                      <div className="mt-4 lg:px-2">
                        <p className="text-xs font-semibold uppercase tracking-wide text-brand-red">
                          {phase.period}
                        </p>
                        <h4 className="mt-1 text-sm font-bold text-brand-red-darker">
                          {phase.title}
                        </h4>
                        <p className="mt-1.5 text-xs leading-relaxed text-neutral-500">
                          {phase.description}
                        </p>
                      </div>
                      {i < phases.length - 1 && (
                        <span className="mt-4 h-6 w-px bg-brand-red/15 lg:hidden" aria-hidden />
                      )}
                    </div>
                  </StaggerItem>
                );
              })}
            </StaggerGroup>
          </div>
        </FadeIn>

        {/* Before / after chart */}
        <FadeIn delay={0.15} className="mt-16">
          <div className="card-surface p-6 sm:p-7">
            <h3 className="text-lg font-semibold text-brand-red-darker">
              Taux de réussite des attaques, avant / après remédiation
            </h3>
            <p className="mt-1 max-w-2xl text-sm text-neutral-500">
              Proportion de scénarios offensifs ayant abouti, par catégorie, mesurée lors du Red
              Teaming initial puis rejouée à l&apos;identique lors du retest de validation.
            </p>
            <div className="mt-6">
              <BeforeAfterChart />
            </div>
          </div>
        </FadeIn>

        {/* Tools */}
        <FadeIn delay={0.2} className="mt-8">
          <div className="card-surface p-6 sm:p-7">
            <h3 className="text-lg font-semibold text-brand-red-darker">Outils mobilisés</h3>
            <p className="mt-1 max-w-2xl text-sm text-neutral-500">
              Une combinaison d&apos;outils spécialisés en sécurité infrastructure et en Red
              Teaming applicatif dédié aux systèmes d&apos;IA générative.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              {toolItems.map((tool) => (
                <div
                  key={tool.id}
                  className="flex items-center gap-3 rounded-xl border border-black/[0.06] bg-surface-card px-4 py-3"
                >
                  <span
                    className={`flex h-9 w-9 items-center justify-center rounded-lg text-sm font-bold text-white ${
                      tool.category === "infrastructure" ? "bg-brand-red-dark" : "bg-brand-red"
                    }`}
                  >
                    {tool.name.slice(0, 1)}
                  </span>
                  <div>
                    <p className="text-sm font-semibold text-brand-red-darker">{tool.name}</p>
                    <p className="text-xs text-neutral-500">{tool.role}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </FadeIn>
      </div>
    </section>
  );
}
