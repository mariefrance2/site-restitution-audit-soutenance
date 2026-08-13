import { jsPDF } from "jspdf";
import {
  countByCriticality,
  criticalities,
  findings,
  getCategoryMeta,
  remediationRate,
} from "@/lib/utils";

const RED_DARK = "#791F1F";
const RED_DARKER = "#501313";
const RED = "#E24B4A";
const GREY = "#4B4444";

function hexToRgb(hex: string): [number, number, number] {
  const v = hex.replace("#", "");
  return [parseInt(v.slice(0, 2), 16), parseInt(v.slice(2, 4), 16), parseInt(v.slice(4, 6), 16)];
}

// Génère un résumé exécutif d'une page, entièrement côté client (jsPDF),
// sans aucun stockage externe.
export function generateExecutiveSummaryPdf() {
  const doc = new jsPDF({ unit: "mm", format: "a4" });
  const pageWidth = doc.internal.pageSize.getWidth();
  const marginX = 18;
  let y = 20;

  // Header band
  doc.setFillColor(...hexToRgb(RED_DARK));
  doc.rect(0, 0, pageWidth, 32, "F");
  doc.setTextColor(255, 255, 255);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(16);
  doc.text("Résumé exécutif — Audit de sécurité Agent IA GLPI", marginX, 15);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(9.5);
  doc.text("Third SARL, pour le compte de la BICEC — campagne juin-août 2026", marginX, 22);
  doc.text(`Généré le ${new Date().toLocaleDateString("fr-FR")}`, marginX, 27.5);

  y = 42;

  // KPIs
  const critiques = countByCriticality("critique");
  const eleves = countByCriticality("eleve");
  const kpis: [string, string][] = [
    [String(findings.length), "Constats identifiés"],
    [String(critiques), "Critiques"],
    [String(eleves), "Élevés"],
    [`${remediationRate}%`, "Taux de remédiation"],
  ];
  const kpiWidth = (pageWidth - marginX * 2) / kpis.length;
  kpis.forEach(([value, label], i) => {
    const x = marginX + i * kpiWidth;
    doc.setTextColor(...hexToRgb(RED_DARKER));
    doc.setFont("helvetica", "bold");
    doc.setFontSize(20);
    doc.text(value, x, y);
    doc.setTextColor(...hexToRgb(GREY));
    doc.setFont("helvetica", "normal");
    doc.setFontSize(8.5);
    doc.text(label, x, y + 5, { maxWidth: kpiWidth - 4 });
  });

  y += 14;
  doc.setDrawColor(...hexToRgb(RED));
  doc.setLineWidth(0.4);
  doc.line(marginX, y, pageWidth - marginX, y);
  y += 8;

  // Répartition par criticité
  doc.setTextColor(...hexToRgb(RED_DARKER));
  doc.setFont("helvetica", "bold");
  doc.setFontSize(11.5);
  doc.text("Répartition par criticité", marginX, y);
  y += 6;

  const total = findings.length;
  criticalities.forEach((c) => {
    const count = countByCriticality(c.id);
    const pct = total > 0 ? Math.round((count / total) * 100) : 0;
    doc.setFillColor(...hexToRgb(c.hex));
    doc.rect(marginX, y - 3, 3.2, 3.2, "F");
    doc.setTextColor(...hexToRgb(GREY));
    doc.setFont("helvetica", "normal");
    doc.setFontSize(9.5);
    doc.text(`${c.label} — ${count} (${pct}%)`, marginX + 6, y);

    const barMaxWidth = 60;
    const barX = pageWidth - marginX - barMaxWidth;
    doc.setFillColor(230, 224, 224);
    doc.rect(barX, y - 3, barMaxWidth, 3.2, "F");
    doc.setFillColor(...hexToRgb(c.hex));
    doc.rect(barX, y - 3, (barMaxWidth * pct) / 100, 3.2, "F");
    y += 7;
  });

  y += 4;
  doc.setDrawColor(...hexToRgb(RED));
  doc.line(marginX, y, pageWidth - marginX, y);
  y += 8;

  // Vulnérabilités critiques principales
  doc.setTextColor(...hexToRgb(RED_DARKER));
  doc.setFont("helvetica", "bold");
  doc.setFontSize(11.5);
  doc.text("Vulnérabilités critiques principales", marginX, y);
  y += 6;

  const criticalFindings = findings.filter((f) => f.criticality === "critique").slice(0, 4);
  doc.setFontSize(9);
  criticalFindings.forEach((f) => {
    doc.setFont("helvetica", "bold");
    doc.setTextColor(...hexToRgb(RED_DARK));
    const catLabel = getCategoryMeta(f.category).shortLabel;
    doc.text(`• [${catLabel}] ${f.title}`, marginX, y, { maxWidth: pageWidth - marginX * 2 });
    y += 4.6;
    doc.setFont("helvetica", "normal");
    doc.setTextColor(...hexToRgb(GREY));
    const statusLine = `Statut : corrigé et validé en retest — ${f.statusAfter}`;
    const wrapped = doc.splitTextToSize(statusLine, pageWidth - marginX * 2 - 4);
    doc.text(wrapped, marginX + 4, y);
    y += wrapped.length * 4.2 + 2.5;
  });

  y += 3;
  doc.setDrawColor(...hexToRgb(RED));
  doc.line(marginX, y, pageWidth - marginX, y);
  y += 8;

  // Valeur ajoutée BICEC
  doc.setTextColor(...hexToRgb(RED_DARKER));
  doc.setFont("helvetica", "bold");
  doc.setFontSize(11.5);
  doc.text("Valeur ajoutée pour la BICEC", marginX, y);
  y += 6;

  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  doc.setTextColor(...hexToRgb(GREY));
  const bicecText =
    "La remédiation des 16 constats réduit directement le risque réglementaire (COBAC, protection " +
    "des données, secret bancaire) et opérationnel de l'agent IA déployé pour la BICEC. Elle outille " +
    "la gouvernance IT (COBIT 2019 EDM/MEA) et renforce la garantie de service (ITIL), condition de " +
    "confiance pour un usage bancaire.";
  const wrappedBicec = doc.splitTextToSize(bicecText, pageWidth - marginX * 2);
  doc.text(wrappedBicec, marginX, y);
  y += wrappedBicec.length * 4.2 + 8;

  // Footer
  const pageHeight = doc.internal.pageSize.getHeight();
  doc.setDrawColor(230, 224, 224);
  doc.line(marginX, pageHeight - 14, pageWidth - marginX, pageHeight - 14);
  doc.setFont("helvetica", "italic");
  doc.setFontSize(7.5);
  doc.setTextColor(150, 140, 140);
  doc.text(
    "Site de restitution académique — mémoire de fin d'études, Third SARL, Douala, Cameroun.",
    marginX,
    pageHeight - 9
  );

  doc.save("resume-executif-audit-agent-ia-glpi.pdf");
}
