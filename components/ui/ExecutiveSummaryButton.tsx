"use client";

import { FileDown } from "lucide-react";
import { generateExecutiveSummaryPdf } from "@/lib/exportSummary";

export function ExecutiveSummaryButton() {
  return (
    <button
      onClick={() => generateExecutiveSummaryPdf()}
      className="focus-ring inline-flex items-center gap-2 rounded-xl border border-brand-red/25 bg-white px-5 py-2.5 text-sm font-semibold text-brand-red-dark shadow-card transition-all hover:-translate-y-0.5 hover:border-brand-red/40 hover:shadow-card-hover"
    >
      <FileDown className="h-4 w-4" />
      Télécharger le résumé exécutif
    </button>
  );
}
