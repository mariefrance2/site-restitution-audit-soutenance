"use client";

import { motion } from "framer-motion";
import { criticalities } from "@/lib/utils";
import { CriticalityIcon } from "@/components/ui/CriticalityIcon";

const ZONES = [
  { from: 0, to: 25, hex: "#639922", label: "Faible" },
  { from: 25, to: 50, hex: "#EF9F27", label: "Moyen" },
  { from: 50, to: 75, hex: "#E24B4A", label: "Élevé" },
  { from: 75, to: 100, hex: "#791F1F", label: "Critique" },
];

const CX = 100;
const CY = 100;
const R = 78;

function point(t: number, r: number) {
  const rad = (t * Math.PI) / 180;
  return { x: CX - r * Math.cos(rad), y: CY - r * Math.sin(rad) };
}

function zonePath(t0: number, t1: number, r: number) {
  const steps = 20;
  const pts = Array.from({ length: steps + 1 }, (_, i) => {
    const t = t0 + ((t1 - t0) * i) / steps;
    return point(t, r);
  });
  return pts.map((p, i) => `${i === 0 ? "M" : "L"} ${p.x.toFixed(2)} ${p.y.toFixed(2)}`).join(" ");
}

function scoreLabel(score: number) {
  if (score >= 75) return ZONES[3];
  if (score >= 50) return ZONES[2];
  if (score >= 25) return ZONES[1];
  return ZONES[0];
}

function Gauge({
  score,
  label,
  delay = 0,
}: {
  score: number;
  label: string;
  delay?: number;
}) {
  const angle = (score / 100) * 180;
  const needle = point(angle, R - 14);
  const zone = scoreLabel(score);

  return (
    <div className="flex flex-col items-center">
      <svg
        viewBox="0 0 200 118"
        className="w-full max-w-[240px]"
        role="img"
        aria-label={`Jauge de risque ${label} : score ${score} sur 100, niveau ${zone.label}`}
      >
        {ZONES.map((z) => (
          <path
            key={z.label}
            d={zonePath((z.from / 100) * 180, (z.to / 100) * 180, R)}
            stroke={z.hex}
            strokeWidth={14}
            strokeLinecap="butt"
            fill="none"
          />
        ))}
        <motion.line
          x1={CX}
          y1={CY}
          x2={needle.x}
          y2={needle.y}
          stroke="#501313"
          strokeWidth={3}
          strokeLinecap="round"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: delay + 0.4, ease: "easeOut" }}
        />
        <circle cx={CX} cy={CY} r={6} fill="#501313" />
      </svg>
      <div className="-mt-2 flex flex-col items-center">
        <span className="text-2xl font-bold text-brand-red-darker">{score}/100</span>
        <span className="text-sm font-medium" style={{ color: zone.hex }}>
          Niveau {zone.label}
        </span>
        <span className="mt-1 text-xs font-medium uppercase tracking-wide text-neutral-400">
          {label}
        </span>
      </div>
    </div>
  );
}

export function RiskGauge({
  before,
  after,
}: {
  before: number;
  after: number;
}) {
  return (
    <div>
      <div className="grid grid-cols-2 gap-4">
        <Gauge score={before} label="Avant remédiation" delay={0} />
        <Gauge score={after} label="Après remédiation" delay={0.3} />
      </div>
      <ul className="mt-6 flex flex-wrap items-center justify-center gap-x-5 gap-y-2 border-t border-black/[0.06] pt-5">
        {criticalities
          .slice()
          .reverse()
          .map((c) => (
            <li key={c.id} className="flex items-center gap-1.5 text-xs font-medium text-neutral-600">
              <span style={{ color: c.hex }}>
                <CriticalityIcon level={c.id} className="h-3.5 w-3.5 shrink-0" strokeWidth={2.25} />
              </span>
              {c.label}
            </li>
          ))}
      </ul>
    </div>
  );
}
