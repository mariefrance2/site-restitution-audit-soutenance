"use client";

import { useCallback, useEffect, useState } from "react";
import {
  Binoculars,
  CalendarClock,
  CheckCircle2,
  GraduationCap,
  KeyRound,
  RadarIcon,
  ShieldCheck,
  Target,
} from "lucide-react";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { FadeIn, StaggerGroup, StaggerItem } from "@/components/ui/FadeIn";
import { ReportUpload, type UploadedFile } from "@/components/upload/ReportUpload";
import { ReportList } from "@/components/upload/ReportList";

const RECOMMENDATIONS = [
  {
    icon: CalendarClock,
    title: "Retest périodique",
    text: "Reconduire une campagne de Red Teaming au minimum tous les 6 mois et après toute évolution majeure du modèle ou du prompt système.",
  },
  {
    icon: Binoculars,
    title: "Veille sur les nouvelles techniques d'attaque",
    text: "Suivre les publications OWASP GenAI Security Project et les CVE relatives aux frameworks LLM utilisés en production.",
  },
  {
    icon: KeyRound,
    title: "Revue régulière des permissions",
    text: "Auditer trimestriellement les droits du compte de service de l'agent pour garantir le respect du principe du moindre privilège.",
  },
  {
    icon: RadarIcon,
    title: "Supervision continue",
    text: "Maintenir une journalisation détaillée des actions de l'agent et des alertes automatiques sur les comportements anormaux.",
  },
  {
    icon: GraduationCap,
    title: "Sensibilisation des équipes",
    text: "Former les techniciens support à reconnaître les tentatives de manipulation de l'agent et à escalader les cas suspects.",
  },
  {
    icon: Target,
    title: "Gouvernance du périmètre d'autonomie",
    text: "Revalider périodiquement la liste des actions autorisées en autonomie complète face à celles nécessitant une validation humaine.",
  },
];

export function ValueAndReports() {
  const [files, setFiles] = useState<UploadedFile[]>([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    let cancelled = false;
    fetch("/api/reports")
      .then((res) => res.json())
      .then((data) => {
        if (!cancelled) setFiles(data.files ?? []);
      })
      .catch(() => {})
      .finally(() => {
        if (!cancelled) setLoaded(true);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const handleUploaded = useCallback((file: UploadedFile) => {
    setFiles((prev) => [file, ...prev]);
  }, []);

  return (
    <section id="valeur" className="relative py-20 sm:py-28">
      <div className="container-page">
        <SectionHeading
          eyebrow="Section 5 — Valeur ajoutée & pièces justificatives"
          title="Ce que cette démarche apporte à Third SARL"
          subtitle="Une contribution alignée sur les référentiels de gouvernance IT, des recommandations pour la durée, et l'accès aux rapports complets."
        />

        <div className="mt-12 grid gap-6 lg:grid-cols-5">
          <div className="flex flex-col gap-6 lg:col-span-3">
            <FadeIn>
              <div className="card-surface p-6 sm:p-8">
                <div className="flex items-center gap-3">
                  <span className="flex h-10 w-10 items-center justify-center rounded-[10px] bg-brand-red/10">
                    <ShieldCheck className="h-5 w-5 text-brand-red" strokeWidth={1.75} />
                  </span>
                  <h3 className="text-lg font-semibold text-brand-red-darker">
                    Valeur ajoutée pour Third SARL
                  </h3>
                </div>
                <div className="mt-5 space-y-4 text-sm leading-relaxed text-neutral-600">
                  <p>
                    Cette démarche s&apos;inscrit dans les domaines{" "}
                    <strong className="text-brand-red-darker">EDM (Evaluate, Direct, Monitor)</strong>{" "}
                    du référentiel <strong className="text-brand-red-darker">COBIT 2019</strong> :
                    elle fournit à la direction les éléments pour évaluer objectivement le niveau
                    de risque de l&apos;agent IA, orienter les investissements de sécurisation
                    nécessaires, et instaurer un suivi durable de la performance de la fonction
                    sécurité.
                  </p>
                  <p>
                    Elle nourrit également le domaine{" "}
                    <strong className="text-brand-red-darker">MEA (Managed Evaluated Assessed)</strong>
                    , en instaurant un processus reproductible d&apos;évaluation de la conformité et
                    des performances du système d&apos;IA, condition préalable à toute amélioration
                    continue.
                  </p>
                  <p>
                    Du point de vue <strong className="text-brand-red-darker">ITIL</strong>, l&apos;audit
                    renforce directement la dimension{" "}
                    <strong className="text-brand-red-darker">garantie (warranty)</strong> du Système
                    de Valeur des Services : au-delà de l&apos;utilité fonctionnelle de l&apos;agent
                    (affectation automatique des tickets), la démarche garantit sa disponibilité,
                    sa sécurité et sa capacité à fonctionner de façon fiable et prévisible, condition
                    indispensable à la confiance des utilisateurs et des clients de Third SARL.
                  </p>
                </div>
              </div>
            </FadeIn>

            <FadeIn delay={0.1}>
              <div className="card-surface p-6 sm:p-8">
                <h3 className="text-lg font-semibold text-brand-red-darker">
                  Recommandations pour maintenir le niveau de sécurité
                </h3>
                <StaggerGroup className="mt-5 grid gap-4 sm:grid-cols-2">
                  {RECOMMENDATIONS.map((rec) => (
                    <StaggerItem key={rec.title}>
                      <div className="flex h-full items-start gap-3 rounded-xl border border-black/[0.06] bg-surface-card p-4">
                        <rec.icon className="mt-0.5 h-4.5 w-4.5 shrink-0 text-brand-red" strokeWidth={1.75} />
                        <div>
                          <p className="text-sm font-semibold text-brand-red-darker">{rec.title}</p>
                          <p className="mt-1 text-xs leading-relaxed text-neutral-500">{rec.text}</p>
                        </div>
                      </div>
                    </StaggerItem>
                  ))}
                </StaggerGroup>
              </div>
            </FadeIn>
          </div>

          <FadeIn delay={0.15} className="lg:col-span-2">
            <div className="card-surface sticky top-24 p-6 sm:p-7">
              <div className="flex items-center gap-3">
                <span className="flex h-10 w-10 items-center justify-center rounded-[10px] bg-brand-red/10">
                  <CheckCircle2 className="h-5 w-5 text-brand-red" strokeWidth={1.75} />
                </span>
                <div>
                  <h3 className="text-lg font-semibold text-brand-red-darker">
                    Rapports &amp; pièces justificatives
                  </h3>
                  <p className="text-xs text-neutral-500">
                    Audit sécurité · Red Teaming · Remédiation
                  </p>
                </div>
              </div>

              <div className="mt-6">
                <ReportUpload onUploaded={handleUploaded} />
              </div>

              <div className="mt-6">
                <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-neutral-400">
                  {files.length > 0
                    ? `${files.length} rapport${files.length > 1 ? "s" : ""} déposé${files.length > 1 ? "s" : ""}`
                    : "Rapports déposés"}
                </p>
                {loaded && <ReportList files={files} />}
              </div>
            </div>
          </FadeIn>
        </div>
      </div>
    </section>
  );
}
