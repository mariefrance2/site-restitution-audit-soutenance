"use client";

import { useCallback, useEffect, useState } from "react";
import {
  Binoculars,
  Building2,
  CalendarClock,
  CheckCircle2,
  Gavel,
  GraduationCap,
  Handshake,
  KeyRound,
  Landmark,
  RadarIcon,
  ShieldCheck,
  Sparkles,
  Target,
} from "lucide-react";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { FadeIn, StaggerGroup, StaggerItem } from "@/components/ui/FadeIn";
import { ReportUpload, type UploadedFile } from "@/components/upload/ReportUpload";
import { ReportList } from "@/components/upload/ReportList";

const BICEC_VALUE = [
  {
    icon: Gavel,
    color: "#791F1F",
    title: "Conformité réglementaire et légale",
    text: "En tant qu'établissement bancaire, la BICEC est soumise aux exigences prudentielles de la COBAC, au secret bancaire et à la réglementation sur la protection des données personnelles. La remédiation des constats LLM02 (fuite d'informations) et LLM06 (excès d'autonomie) supprime des vecteurs concrets de non-conformité.",
  },
  {
    icon: Landmark,
    color: "#E24B4A",
    title: "Gouvernance IT — COBIT 2019 (EDM / MEA)",
    text: "La démarche outille la gouvernance IT de la BICEC : le domaine EDM (Evaluate, Direct, Monitor) lui permet d'évaluer objectivement le risque introduit par l'agent IA dans son système d'information et d'arbitrer les investissements de sécurisation ; le domaine MEA installe un processus reproductible d'évaluation continue de la conformité.",
  },
  {
    icon: ShieldCheck,
    color: "#B23A3F",
    title: "Continuité de service — ITIL (garantie)",
    text: "Le service d'affectation automatique des tickets, opéré pour le compte de la BICEC, gagne en garantie (warranty) : disponibilité, sécurité et fiabilité du service sont désormais démontrées et mesurables, condition indispensable à la continuité des opérations bancaires.",
  },
  {
    icon: Handshake,
    color: "#501313",
    title: "Confiance et réputation",
    text: "Pour une banque, un incident impliquant l'IA (fuite de données, action non autorisée) représente un risque réputationnel et financier majeur. Cette campagne démontre à la BICEC une maîtrise proactive du risque IA, renforçant la confiance dans la solution et dans son prestataire.",
  },
];

const RECOMMENDATIONS = [
  {
    icon: CalendarClock,
    color: "#791F1F",
    title: "Retest périodique",
    text: "Reconduire une campagne de Red Teaming au minimum tous les 6 mois et après toute évolution majeure du modèle ou du prompt système.",
  },
  {
    icon: Binoculars,
    color: "#E24B4A",
    title: "Veille sur les nouvelles techniques d'attaque",
    text: "Suivre les publications OWASP GenAI Security Project et les CVE relatives aux frameworks LLM utilisés en production.",
  },
  {
    icon: KeyRound,
    color: "#B23A3F",
    title: "Revue régulière des permissions",
    text: "Auditer trimestriellement les droits du compte de service de l'agent pour garantir le respect du principe du moindre privilège.",
  },
  {
    icon: RadarIcon,
    color: "#8C2A2A",
    title: "Supervision continue",
    text: "Maintenir une journalisation détaillée des actions de l'agent et des alertes automatiques sur les comportements anormaux.",
  },
  {
    icon: GraduationCap,
    color: "#A83232",
    title: "Sensibilisation des équipes",
    text: "Former les techniciens support à reconnaître les tentatives de manipulation de l'agent et à escalader les cas suspects.",
  },
  {
    icon: Target,
    color: "#791F1F",
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
    <section id="valeur" className="relative overflow-hidden py-20 sm:py-28">
      <div
        className="absolute inset-x-0 top-0 -z-10 h-[380px]"
        style={{ background: "linear-gradient(to bottom, #F7D9D8 0%, rgba(247,217,216,0) 100%)" }}
      />
      <div className="container-page">
        <SectionHeading
          eyebrow="Section 5 — Valeur ajoutée & pièces justificatives"
          title="Ce que cette démarche apporte à la BICEC"
          subtitle="Third SARL est le prestataire au sein duquel ce stage a été réalisé ; la solution d'agent IA — et donc sa sécurisation — est développée pour le compte de son client, la BICEC. C'est sur cette valeur cliente que se concentre la démarche."
        />

        <div className="mt-12 grid gap-6 lg:grid-cols-5">
          <div className="flex flex-col gap-6 lg:col-span-3">
            <FadeIn>
              <div className="overflow-hidden rounded-card border border-black/[0.06] shadow-card">
                <div
                  className="flex items-center gap-3 px-6 py-5 sm:px-8"
                  style={{ background: "linear-gradient(120deg, #791F1F 0%, #B23A3F 100%)" }}
                >
                  <span className="flex h-10 w-10 items-center justify-center rounded-[10px] bg-white/15">
                    <Landmark className="h-5 w-5 text-white" strokeWidth={1.75} />
                  </span>
                  <div>
                    <h3 className="text-lg font-semibold text-white">Valeur ajoutée pour la BICEC</h3>
                    <p className="text-xs text-white/70">Le client final de la solution d&apos;agent IA</p>
                  </div>
                </div>
                <StaggerGroup className="grid gap-4 bg-surface-card p-6 sm:grid-cols-2 sm:p-8">
                  {BICEC_VALUE.map((item) => (
                    <StaggerItem key={item.title}>
                      <div className="h-full rounded-xl border border-black/[0.06] bg-white p-4 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-card-hover">
                        <span
                          className="flex h-9 w-9 items-center justify-center rounded-[9px]"
                          style={{ backgroundColor: `${item.color}14` }}
                        >
                          <item.icon className="h-4.5 w-4.5" style={{ color: item.color }} strokeWidth={1.75} />
                        </span>
                        <p className="mt-3 text-sm font-semibold text-brand-red-darker">{item.title}</p>
                        <p className="mt-1.5 text-xs leading-relaxed text-neutral-500">{item.text}</p>
                      </div>
                    </StaggerItem>
                  ))}
                </StaggerGroup>
              </div>
            </FadeIn>

            <FadeIn delay={0.08}>
              <div className="card-surface flex items-start gap-3 border-l-4 border-l-brand-rose p-5 sm:p-6">
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-[9px] bg-brand-rose-soft">
                  <Building2 className="h-4.5 w-4.5 text-brand-red-dark" strokeWidth={1.75} />
                </span>
                <div>
                  <h3 className="text-sm font-bold text-brand-red-darker">
                    Et pour Third SARL, le prestataire
                  </h3>
                  <p className="mt-1.5 text-sm leading-relaxed text-neutral-600">
                    Third SARL, la SSII au sein de laquelle ce stage a été réalisé, tire aussi
                    bénéfice de la démarche : elle renforce son expertise en sécurité des agents
                    IA, dispose d&apos;un cas de référence démontrable, et consolide la confiance de
                    la BICEC envers ses prestations — un atout commercial pour la suite de la
                    relation.
                  </p>
                </div>
              </div>
            </FadeIn>

            <FadeIn delay={0.14}>
              <div className="card-surface p-6 sm:p-8">
                <h3 className="text-lg font-semibold text-brand-red-darker">
                  Recommandations pour maintenir le niveau de sécurité
                </h3>
                <StaggerGroup className="mt-5 grid gap-4 sm:grid-cols-2">
                  {RECOMMENDATIONS.map((rec) => (
                    <StaggerItem key={rec.title}>
                      <div className="flex h-full items-start gap-3 rounded-xl border border-black/[0.06] bg-surface-card p-4 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-card-hover">
                        <span
                          className="flex h-8 w-8 shrink-0 items-center justify-center rounded-[8px]"
                          style={{ backgroundColor: `${rec.color}14` }}
                        >
                          <rec.icon className="h-4 w-4" style={{ color: rec.color }} strokeWidth={1.75} />
                        </span>
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
                <p className="mb-3 flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-neutral-400">
                  {files.length > 0 ? (
                    <>
                      <Sparkles className="h-3.5 w-3.5 text-brand-red" />
                      {files.length} rapport{files.length > 1 ? "s" : ""} déposé
                      {files.length > 1 ? "s" : ""}
                    </>
                  ) : (
                    "Rapports déposés"
                  )}
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
