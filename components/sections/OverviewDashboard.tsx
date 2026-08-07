import { AlertTriangle, ListChecks, ShieldAlert, Sparkles } from "lucide-react";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { KpiCard } from "@/components/ui/KpiCard";
import { FadeIn } from "@/components/ui/FadeIn";
import { OwaspBarChart } from "@/components/charts/OwaspBarChart";
import { CriticalityDonut } from "@/components/charts/CriticalityDonut";
import { RiskGauge } from "@/components/charts/RiskGauge";
import { countByCriticality, findings, remediationRate } from "@/lib/utils";

export function OverviewDashboard() {
  const critiques = countByCriticality("critique");
  const eleves = countByCriticality("eleve");

  return (
    <section id="apercu" className="relative overflow-hidden py-20 sm:py-28">
      <div
        className="pointer-events-none absolute -right-28 top-0 -z-10 h-[380px] w-[380px] rounded-full blur-3xl"
        style={{ background: "radial-gradient(circle, rgba(240,166,164,0.24) 0%, rgba(240,166,164,0) 70%)" }}
      />
      <div className="container-page">
        <SectionHeading
          eyebrow="Section 1 — Vue d'ensemble"
          title="Dashboard général de l'audit"
          subtitle="Une synthèse chiffrée de l'ensemble des constats identifiés lors de la campagne d'audit et de Red Teaming de l'agent IA."
        />

        <div className="mt-12 grid grid-cols-2 gap-5 lg:grid-cols-4">
          <FadeIn delay={0}>
            <KpiCard
              icon={<ListChecks className="h-5 w-5" style={{ color: "#791F1F" }} strokeWidth={1.75} />}
              label="Constats au total"
              value={findings.length}
              accentHex="#791F1F"
              description="Toutes catégories confondues"
            />
          </FadeIn>
          <FadeIn delay={0.05}>
            <KpiCard
              icon={<ShieldAlert className="h-5 w-5" style={{ color: "#791F1F" }} strokeWidth={1.75} />}
              label="Constats critiques"
              value={critiques}
              accentHex="#791F1F"
              description="Nécessitant une action immédiate"
            />
          </FadeIn>
          <FadeIn delay={0.1}>
            <KpiCard
              icon={<AlertTriangle className="h-5 w-5" style={{ color: "#E24B4A" }} strokeWidth={1.75} />}
              label="Constats élevés"
              value={eleves}
              accentHex="#E24B4A"
              description="Impact fonctionnel ou métier significatif"
            />
          </FadeIn>
          <FadeIn delay={0.15}>
            <KpiCard
              icon={<Sparkles className="h-5 w-5" style={{ color: "#639922" }} strokeWidth={1.75} />}
              label="Taux de remédiation"
              value={remediationRate}
              suffix="%"
              accentHex="#639922"
              description="Constats corrigés et validés en retest"
            />
          </FadeIn>
        </div>

        <div className="mt-6 grid gap-5 lg:grid-cols-5">
          <FadeIn delay={0.1} className="lg:col-span-3">
            <div className="card-surface h-full p-6 sm:p-7">
              <h3 className="text-lg font-semibold text-brand-red-darker">
                Constats par catégorie OWASP
              </h3>
              <p className="mt-1 text-sm text-neutral-500">
                Nombre de constats par catégorie, coloré selon le niveau de criticité dominant.
              </p>
              <div className="mt-6">
                <OwaspBarChart />
              </div>
            </div>
          </FadeIn>

          <FadeIn delay={0.2} className="lg:col-span-2">
            <div className="card-surface h-full p-6 sm:p-7">
              <h3 className="text-lg font-semibold text-brand-red-darker">
                Répartition par criticité
              </h3>
              <p className="mt-1 text-sm text-neutral-500">
                Les {findings.length} constats de l&apos;audit, classés selon la grille probabilité × impact.
              </p>
              <div className="mt-6">
                <CriticalityDonut />
              </div>
            </div>
          </FadeIn>
        </div>

        <FadeIn delay={0.15} className="mt-5">
          <div className="card-surface p-6 sm:p-7">
            <h3 className="text-lg font-semibold text-brand-red-darker">
              Niveau de risque résiduel — avant / après remédiation
            </h3>
            <p className="mt-1 max-w-2xl text-sm text-neutral-500">
              Score de risque agrégé de l&apos;agent IA, calculé à partir de la criticité et du taux
              de réussite des scénarios offensifs, avant intervention puis après application des
              correctifs.
            </p>
            <div className="mx-auto mt-6 max-w-md">
              <RiskGauge before={82} after={16} />
            </div>
          </div>
        </FadeIn>
      </div>
    </section>
  );
}
