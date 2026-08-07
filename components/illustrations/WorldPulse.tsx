"use client";

import { motion } from "framer-motion";

const dots: { x: number; y: number; r: number; delay?: number; highlight?: boolean }[] = [
  { x: 40, y: 60, r: 2 }, { x: 60, y: 55, r: 2.4 }, { x: 80, y: 62, r: 2 },
  { x: 100, y: 58, r: 3 }, { x: 120, y: 66, r: 2 }, { x: 140, y: 60, r: 2.2 },
  { x: 160, y: 70, r: 2 }, { x: 180, y: 64, r: 2.6 }, { x: 200, y: 72, r: 2 },
  { x: 220, y: 68, r: 2.4, highlight: true, delay: 0.2 },
  { x: 240, y: 76, r: 2 }, { x: 260, y: 70, r: 2.2 }, { x: 280, y: 78, r: 2 },
  { x: 300, y: 74, r: 2.6 }, { x: 320, y: 80, r: 2 }, { x: 340, y: 76, r: 2.2 },
  { x: 360, y: 84, r: 2 },
  { x: 50, y: 90, r: 2.2 }, { x: 75, y: 96, r: 2 }, { x: 95, y: 100, r: 2.8, highlight: true, delay: 0.6 },
  { x: 115, y: 94, r: 2 }, { x: 135, y: 102, r: 2.4 }, { x: 155, y: 98, r: 2 },
  { x: 175, y: 106, r: 2.2 }, { x: 195, y: 100, r: 2 }, { x: 215, y: 108, r: 2.6 },
  { x: 235, y: 104, r: 2 }, { x: 255, y: 112, r: 2.2 }, { x: 275, y: 106, r: 2 },
  { x: 295, y: 114, r: 2.4, highlight: true, delay: 1 }, { x: 315, y: 108, r: 2 },
  { x: 335, y: 116, r: 2.2 },
  { x: 65, y: 128, r: 2 }, { x: 90, y: 134, r: 2.2 }, { x: 112, y: 130, r: 2 },
  { x: 135, y: 138, r: 2.6 }, { x: 158, y: 132, r: 2 }, { x: 180, y: 140, r: 2.2 },
  { x: 202, y: 134, r: 2 }, { x: 224, y: 142, r: 2.4 }, { x: 246, y: 136, r: 2 },
  { x: 268, y: 144, r: 2.2, highlight: true, delay: 1.4 },
];

export function WorldPulse({ tone = "light" }: { tone?: "light" | "dark" }) {
  const highlightColor = tone === "dark" ? "#FFFFFF" : "#E24B4A";
  const baseColor = tone === "dark" ? "#FFFFFF" : "#791F1F";
  const baseOpacity = tone === "dark" ? 0.35 : 0.22;

  return (
    <svg
      viewBox="0 0 400 190"
      className="h-full w-full"
      role="img"
      aria-label="Carte du monde stylisée représentant la répartition mondiale des incidents de sécurité"
    >
      {dots.map((d, i) => (
        <motion.circle
          key={i}
          cx={d.x}
          cy={d.y}
          r={d.r}
          fill={d.highlight ? highlightColor : baseColor}
          fillOpacity={d.highlight ? 0.95 : baseOpacity}
          initial={d.highlight ? { r: d.r } : undefined}
          animate={
            d.highlight
              ? { opacity: [0.5, 1, 0.5], r: [d.r, d.r * 1.8, d.r] }
              : undefined
          }
          transition={
            d.highlight
              ? { duration: 2.4, repeat: Infinity, delay: d.delay ?? 0 }
              : undefined
          }
        />
      ))}
    </svg>
  );
}
