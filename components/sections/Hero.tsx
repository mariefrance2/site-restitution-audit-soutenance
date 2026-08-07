"use client";

import { motion } from "framer-motion";
import { ArrowRight, FileText, ShieldCheck, TrendingDown } from "lucide-react";
import { HeroIllustration } from "@/components/illustrations/HeroIllustration";
import { GlowOrb, GridBackdrop } from "@/components/illustrations/PatternBackground";
import { findings, remediationRate } from "@/lib/utils";

export function Hero() {
  return (
    <section id="top" className="relative overflow-hidden pt-14 sm:pt-20">
      <GridBackdrop />
      <GlowOrb className="left-1/2 top-0 h-[560px] w-[560px] -translate-x-1/2" />

      <div className="container-page grid items-center gap-14 pb-20 lg:grid-cols-[1.05fr_0.95fr] lg:gap-8 lg:pb-28">
        <div>
          <motion.span
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="eyebrow"
          >
            <ShieldCheck className="h-3.5 w-3.5" />
            Mémoire de fin d&apos;études · Third SARL
          </motion.span>

          <motion.h1
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="mt-5 text-4xl font-bold leading-[1.08] tracking-tight text-brand-red-darker sm:text-5xl lg:text-[3.2rem]"
          >
            Audit de sécurité, Red Teaming et remédiation d&apos;un
            <span className="text-brand-red"> agent IA autonome</span> GLPI
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mt-6 max-w-xl text-lg leading-relaxed text-neutral-600"
          >
            Restitution de la démarche complète menée au sein de Third SARL : de l&apos;audit
            infrastructure au Red Teaming applicatif, jusqu&apos;à la remédiation intégrale des
            {" "}{findings.length} constats identifiés sur l&apos;agent d&apos;affectation
            automatique des tickets GLPI.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="mt-9 flex flex-wrap items-center gap-4"
          >
            <a
              href="#apercu"
              className="focus-ring inline-flex items-center gap-2 rounded-xl bg-brand-red px-6 py-3.5 text-sm font-semibold text-white shadow-card transition-all hover:-translate-y-0.5 hover:bg-brand-red-dark hover:shadow-card-hover"
            >
              Explorer les résultats <ArrowRight className="h-4 w-4" />
            </a>
            <a
              href="#valeur"
              className="focus-ring inline-flex items-center gap-2 rounded-xl border border-black/10 bg-white px-6 py-3.5 text-sm font-semibold text-brand-red-darker transition-all hover:-translate-y-0.5 hover:border-brand-red/30 hover:shadow-card"
            >
              <FileText className="h-4 w-4" /> Voir les rapports PDF
            </a>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="mt-12 grid grid-cols-3 gap-5 border-t border-black/[0.06] pt-8 sm:max-w-md"
          >
            <div>
              <p className="text-2xl font-bold text-brand-red-darker">{findings.length}</p>
              <p className="mt-0.5 text-xs font-medium text-neutral-500">constats identifiés</p>
            </div>
            <div>
              <p className="flex items-center gap-1 text-2xl font-bold text-criticality-low">
                {remediationRate}%
              </p>
              <p className="mt-0.5 text-xs font-medium text-neutral-500">taux de remédiation</p>
            </div>
            <div>
              <p className="flex items-center gap-1 text-2xl font-bold text-brand-red-darker">
                5 <TrendingDown className="h-4 w-4 text-criticality-low" />
              </p>
              <p className="mt-0.5 text-xs font-medium text-neutral-500">outils d&apos;audit mobilisés</p>
            </div>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, scale: 0.92 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.7, delay: 0.2 }}
        >
          <HeroIllustration />
        </motion.div>
      </div>
    </section>
  );
}
