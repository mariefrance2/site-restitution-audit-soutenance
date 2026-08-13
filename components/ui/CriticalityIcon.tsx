import { CircleCheck, Info, OctagonAlert, TriangleAlert, type LucideIcon } from "lucide-react";
import type { CriticalityLevel } from "@/lib/types";

// Icône distincte par niveau de criticité, en complément systématique de la
// couleur (accessibilité daltonisme) : jamais la couleur seule pour porter
// l'information.
export const CRITICALITY_ICONS: Record<CriticalityLevel, LucideIcon> = {
  critique: OctagonAlert,
  eleve: TriangleAlert,
  moyen: Info,
  faible: CircleCheck,
};

export function CriticalityIcon({
  level,
  className,
  strokeWidth = 2,
}: {
  level: CriticalityLevel;
  className?: string;
  strokeWidth?: number;
}) {
  const Icon = CRITICALITY_ICONS[level];
  return <Icon className={className} strokeWidth={strokeWidth} aria-hidden />;
}
