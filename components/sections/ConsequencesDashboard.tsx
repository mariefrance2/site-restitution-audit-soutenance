import { Globe2, TrendingDown, TrendingUp } from "lucide-react";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { FadeIn, StaggerGroup, StaggerItem } from "@/components/ui/FadeIn";
import { AnimatedCounter } from "@/components/ui/AnimatedCounter";
import { TrendChart } from "@/components/charts/TrendChart";
import { WorldPulse } from "@/components/illustrations/WorldPulse";
import consequences from "@/lib/data/consequences.json";
import type { ConsequenceStat } from "@/lib/types";

function parseLeadingNumber(value: string): { number: number; decimals: number } | null {
  const match = value.match(/[\d]+(?:[.,]\d+)?/);
  if (!match) return null;
  const normalized = match[0].replace(",", ".");
  const decimals = normalized.includes(".") ? normalized.split(".")[1].length : 0;
  return { number: parseFloat(normalized), decimals };
}

function StatValue({ value }: { value: string }) {
  const parsed = parseLeadingNumber(value);
  if (!parsed) return <>{value}</>;
  const prefix = value.slice(0, value.indexOf(parsed.number.toString().charAt(0)));
  const suffix = value.slice(prefix.length + parsed.number.toString().replace(".", ",").length);
  return (
    <AnimatedCounter
      value={parsed.number}
      decimals={parsed.decimals}
      prefix={prefix}
      suffix={suffix}
    />
  );
}

const CARD_ACCENTS = ["#E24B4A", "#791F1F", "#B23A3F", "#8C2A2A", "#A83232", "#791F1F"];

export function ConsequencesDashboard() {
  const stats = consequences.stats as ConsequenceStat[];
  const africaStats = stats.filter((s) => s.id.startsWith("africa"));
  const globalStats = stats.filter((s) => !s.id.startsWith("africa"));

  return (
    <section id="consequences" className="relative overflow-hidden bg-white py-20 sm:py-28">
      <div
        className="pointer-events-none absolute -left-24 top-10 -z-10 h-[360px] w-[360px] rounded-full blur-3xl"
        style={{ background: "radial-gradient(circle, rgba(240,166,164,0.22) 0%, rgba(240,166,164,0) 70%)" }}
      />
      <div className="container-page">
        <SectionHeading
          eyebrow="Section 4 — Enjeux & conséquences"
          title="Pourquoi cet audit compte : le coût réel de l'inaction"
          subtitle="Des données sourcées, à l'échelle mondiale et africaine, pour situer l'enjeu économique et opérationnel d'un agent IA mal sécurisé."
        />
        <FadeIn delay={0.05}>
          <p className="mt-4 text-xs italic text-neutral-400">
            Montants convertis en FCFA pour ce marché : parité fixe 1 € = 655,957 FCFA ; 1 $ ≈ 610
            FCFA (taux indicatif). Chiffres sources originaux en dollars/euros — voir source de
            chaque statistique.
          </p>
        </FadeIn>

        <StaggerGroup className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {globalStats.map((stat, i) => {
            const accent = CARD_ACCENTS[i % CARD_ACCENTS.length];
            return (
              <StaggerItem key={stat.id}>
                <div
                  className="card-surface card-surface-hover flex h-full flex-col border-t-4 p-6"
                  style={{ borderTopColor: accent }}
                >
                  <div className="flex items-start justify-between">
                    <span className="text-3xl font-bold tracking-tight" style={{ color: accent }}>
                      <StatValue value={stat.value} />
                    </span>
                    {stat.trend === "up" && (
                      <TrendingUp className="h-5 w-5 shrink-0 text-criticality-critical" />
                    )}
                    {stat.trend === "down" && (
                      <TrendingDown className="h-5 w-5 shrink-0 text-criticality-low" />
                    )}
                  </div>
                  <p className="mt-2 text-sm font-semibold text-neutral-700">{stat.label}</p>
                  <p className="mt-1.5 flex-1 text-xs leading-relaxed text-neutral-500">
                    {stat.description}
                  </p>
                  <p className="mt-4 border-t border-black/[0.06] pt-3 text-[11px] font-medium italic text-neutral-400">
                    Source : {stat.source}
                  </p>
                </div>
              </StaggerItem>
            );
          })}
        </StaggerGroup>

        {/* Africa spotlight */}
        <FadeIn delay={0.1} className="mt-6">
          <div
            className="relative overflow-hidden rounded-card p-6 shadow-card sm:p-8"
            style={{ background: "linear-gradient(120deg, #791F1F 0%, #B23A3F 55%, #8A1F1F 100%)" }}
          >
            <div className="absolute inset-x-0 top-0 h-44 opacity-80">
              <WorldPulse tone="dark" />
            </div>
            <div className="relative">
              <div className="inline-flex items-center gap-2 rounded-full border border-white/25 bg-white/10 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-white backdrop-blur">
                <Globe2 className="h-3.5 w-3.5" /> Échelle africaine
              </div>
              <div className="mt-6 grid gap-6 sm:grid-cols-2">
                {africaStats.map((stat) => (
                  <div key={stat.id}>
                    <span className="text-4xl font-bold tracking-tight text-white">
                      <StatValue value={stat.value} />
                    </span>
                    <p className="mt-1.5 text-sm font-semibold text-white/90">{stat.label}</p>
                    <p className="mt-1 max-w-sm text-xs leading-relaxed text-white/70">
                      {stat.description}
                    </p>
                    <p className="mt-3 text-[11px] font-medium italic text-white/60">
                      Source : {stat.source}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </FadeIn>

        {/* Trend */}
        <FadeIn delay={0.15} className="mt-6">
          <div className="card-surface p-6 sm:p-7">
            <h3 className="text-lg font-semibold text-brand-red-darker">
              Évolution 2023–2025 : coût des violations et part liée à l&apos;IA
            </h3>
            <p className="mt-1 max-w-2xl text-sm text-neutral-500">
              Le coût moyen d&apos;une violation reste élevé, tandis que la part des incidents
              impliquant l&apos;intelligence artificielle progresse fortement d&apos;année en
              année.
            </p>
            <div className="mt-6">
              <TrendChart />
            </div>
            <p className="mt-2 text-[11px] font-medium italic text-neutral-400">
              Source : IBM, Cost of a Data Breach Report (2023–2025)
            </p>
          </div>
        </FadeIn>
      </div>
    </section>
  );
}
