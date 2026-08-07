"use client";

import { motion } from "framer-motion";
import { ArrowRight, FileText, ShieldCheck, TrendingDown } from "lucide-react";
import { HeroIllustration } from "@/components/illustrations/HeroIllustration";
import { SecurityHeroBackdrop } from "@/components/illustrations/SecurityHeroBackdrop";
import { findings, remediationRate } from "@/lib/utils";

export function Hero() {
  return (
    <section id="top" className="relative overflow-hidden pt-14 sm:pt-20">
      <SecurityHeroBackdrop />
      {/* readability overlay: darker + more opaque behind the text column, lighter toward the illustration */}
      <div
        className="absolute inset-0 -z-10"
        style={{
          background:
            "linear-gradient(105deg, rgba(74,15,15,0.82) 0%, rgba(80,19,19,0.62) 42%, rgba(80,19,19,0.28) 68%, rgba(80,19,19,0.12) 100%)",
        }}
      />
      <div
        className="absolute inset-x-0 bottom-0 -z-10 h-40"
        style={{
          background: "linear-gradient(to bottom, rgba(80,19,19,0) 0%, #FCFCFB 100%)",
        }}
      />

      <div className="container-page grid items-center gap-14 pb-20 lg:grid-cols-[1.05fr_0.95fr] lg:gap-8 lg:pb-28">
        <div>
          <motion.span
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 rounded-full border border-white/25 bg-white/10 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-white backdrop-blur-sm"
          >
            <ShieldCheck className="h-3.5 w-3.5" />
            Mémoire de fin d&apos;études · Third SARL
          </motion.span>

          <motion.h1
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="mt-5 text-4xl font-bold leading-[1.08] tracking-tight text-white sm:text-5xl lg:text-[3.2rem]"
            style={{ textShadow: "0 2px 24px rgba(0,0,0,0.25)" }}
          >
            Audit de sécurité, Red Teaming et remédiation d&apos;un
            <span className="text-brand-rose"> agent IA autonome</span> GLPI
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mt-6 max-w-xl text-lg leading-relaxed text-white/85"
          >
            Restitution de la démarche complète menée au sein de Third SARL pour le compte de la{" "}
            <strong className="font-semibold text-white">BICEC</strong> : de l&apos;audit
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
              className="focus-ring inline-flex items-center gap-2 rounded-xl bg-white px-6 py-3.5 text-sm font-semibold text-brand-red-darker shadow-card transition-all hover:-translate-y-0.5 hover:bg-brand-rose-soft hover:shadow-card-hover"
            >
              Explorer les résultats <ArrowRight className="h-4 w-4" />
            </a>
            <a
              href="#valeur"
              className="focus-ring inline-flex items-center gap-2 rounded-xl border border-white/35 bg-white/10 px-6 py-3.5 text-sm font-semibold text-white backdrop-blur-sm transition-all hover:-translate-y-0.5 hover:bg-white/20"
            >
              <FileText className="h-4 w-4" /> Voir les rapports PDF
            </a>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="mt-12 grid grid-cols-3 gap-5 border-t border-white/20 pt-8 sm:max-w-md"
          >
            <div>
              <p className="text-2xl font-bold text-white">{findings.length}</p>
              <p className="mt-0.5 text-xs font-medium text-white/60">constats identifiés</p>
            </div>
            <div>
              <p className="flex items-center gap-1 text-2xl font-bold text-white">
                {remediationRate}%
              </p>
              <p className="mt-0.5 text-xs font-medium text-white/60">taux de remédiation</p>
            </div>
            <div>
              <p className="flex items-center gap-1 text-2xl font-bold text-white">
                5 <TrendingDown className="h-4 w-4 text-brand-rose" />
              </p>
              <p className="mt-0.5 text-xs font-medium text-white/60">outils d&apos;audit mobilisés</p>
            </div>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, scale: 0.92 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="relative rounded-3xl border border-white/15 bg-white/[0.06] p-4 shadow-[0_20px_60px_-15px_rgba(0,0,0,0.4)] backdrop-blur-sm sm:p-6"
        >
          <HeroIllustration />
        </motion.div>
      </div>
    </section>
  );
}
