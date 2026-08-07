import { ShieldCheck } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t border-black/[0.06] bg-white">
      <div className="container-page flex flex-col gap-6 py-10 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-2.5">
          <span className="flex h-8 w-8 items-center justify-center rounded-[9px] bg-gradient-to-br from-brand-red to-brand-red-dark">
            <ShieldCheck className="h-4 w-4 text-white" strokeWidth={2} />
          </span>
          <div className="leading-tight">
            <p className="text-sm font-semibold text-brand-red-darker">
              Audit de sécurité — Agent IA GLPI
            </p>
            <p className="text-xs text-neutral-400">
              Mémoire de fin d&apos;études · Third SARL, Douala, Cameroun
            </p>
          </div>
        </div>
        <p className="text-xs text-neutral-400">
          Site de restitution académique — données figées au {" "}
          <time dateTime="2026-08-07">7 août 2026</time>. Constats et remédiations issus de la campagne d&apos;audit et de Red Teaming.
        </p>
      </div>
    </footer>
  );
}
