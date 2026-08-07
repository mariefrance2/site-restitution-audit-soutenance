"use client";

import { motion } from "framer-motion";

const CORNER_ICONS = [
  { cx: 220, cy: 160, path: "M0 -14 h20 a6 6 0 0 1 6 6 v22 a6 6 0 0 1 -6 6 h-20 a6 6 0 0 1 -6 -6 v-22 a6 6 0 0 1 6 -6 Z M-2 -14 v-10 a12 12 0 0 1 24 0 v10", kind: "lock" },
  { cx: 980, cy: 150, kind: "key" },
  { cx: 200, cy: 560, kind: "doc" },
  { cx: 990, cy: 570, kind: "laptop" },
];

export function SecurityHeroBackdrop() {
  return (
    <div className="absolute inset-0 -z-10 overflow-hidden">
      <svg
        viewBox="0 0 1200 700"
        preserveAspectRatio="xMidYMid slice"
        className="h-full w-full"
        aria-hidden
      >
        <defs>
          <linearGradient id="bgGrad" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#8A1F1F" />
            <stop offset="55%" stopColor="#B23A3F" />
            <stop offset="100%" stopColor="#7A1B1B" />
          </linearGradient>
          <radialGradient id="centerGlow" cx="50%" cy="46%" r="55%">
            <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.14" />
            <stop offset="100%" stopColor="#FFFFFF" stopOpacity="0" />
          </radialGradient>
        </defs>

        <rect width="1200" height="700" fill="url(#bgGrad)" />
        <rect width="1200" height="700" fill="url(#centerGlow)" />

        {/* circuit grid lines */}
        <g stroke="#FFFFFF" strokeOpacity="0.08" strokeWidth="1">
          {Array.from({ length: 13 }).map((_, i) => (
            <line key={`v${i}`} x1={i * 100} y1="0" x2={i * 100} y2="700" />
          ))}
          {Array.from({ length: 8 }).map((_, i) => (
            <line key={`h${i}`} x1="0" y1={i * 100} x2="1200" y2={i * 100} />
          ))}
        </g>

        {/* scattered chevrons */}
        <g fill="#FFFFFF" fillOpacity="0.14">
          {[
            [70, 60], [140, 60], [210, 60], [1000, 90], [1060, 90], [1120, 90],
            [60, 640], [120, 640], [180, 640], [1020, 620], [1080, 620],
          ].map(([x, y], i) => (
            <path key={i} d={`M${x} ${y} l8 8 l-8 8 M${x + 12} ${y} l8 8 l-8 8`} stroke="#FFFFFF" strokeOpacity="0.18" strokeWidth="2" fill="none" strokeLinecap="round" />
          ))}
        </g>

        {/* bar chart squiggle top-left */}
        <g transform="translate(40,120)" stroke="#FFFFFF" strokeOpacity="0.22" strokeWidth="2" fill="none">
          <polyline points="0,40 20,25 40,32 60,10 80,18 100,2" />
          {[0, 1, 2, 3, 4].map((i) => (
            <rect key={i} x={i * 14} y={60 - i * 6} width="8" height={10 + i * 6} fill="#FFFFFF" fillOpacity="0.12" stroke="none" />
          ))}
        </g>

        {/* radar dots bottom-right */}
        <g transform="translate(1000,480)">
          {[0, 1, 2, 3].map((i) => (
            <circle key={i} cx={i * 24} cy="0" r="6" fill="none" stroke="#FFFFFF" strokeOpacity="0.25" strokeWidth="2" />
          ))}
        </g>

        {/* connecting lines from center to corner icons */}
        <g stroke="#FFFFFF" strokeOpacity="0.28" strokeWidth="1.5">
          <line x1="600" y1="350" x2="260" y2="200" />
          <line x1="600" y1="350" x2="940" y2="190" />
          <line x1="600" y1="350" x2="250" y2="520" />
          <line x1="600" y1="350" x2="950" y2="530" />
        </g>

        {/* corner roundel: lock (top-left) */}
        <g transform="translate(260,200)">
          <circle r="52" fill="none" stroke="#FFFFFF" strokeOpacity="0.55" strokeWidth="2.5" strokeDasharray="6 5" />
          <circle r="40" fill="#FFFFFF" fillOpacity="0.08" />
          <g transform="translate(-13,-16)" fill="none" stroke="#FFFFFF" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round">
            <rect x="0" y="10" width="26" height="20" rx="4" />
            <path d="M5 10 V6 a8 8 0 0 1 16 0 v4" />
          </g>
        </g>

        {/* corner roundel: key (top-right) */}
        <g transform="translate(940,190)">
          <circle r="52" fill="none" stroke="#FFFFFF" strokeOpacity="0.55" strokeWidth="2.5" strokeDasharray="6 5" />
          <circle r="40" fill="#FFFFFF" fillOpacity="0.08" />
          <g transform="translate(-15,-8)" fill="none" stroke="#FFFFFF" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="9" cy="9" r="9" />
            <path d="M15 15 L30 30 M24 24 L29 19 M28 28 L33 23" />
          </g>
        </g>

        {/* corner roundel: locked document (bottom-left) */}
        <g transform="translate(250,520)">
          <circle r="52" fill="none" stroke="#FFFFFF" strokeOpacity="0.55" strokeWidth="2.5" strokeDasharray="6 5" />
          <circle r="40" fill="#FFFFFF" fillOpacity="0.08" />
          <g transform="translate(-14,-17)" fill="none" stroke="#FFFFFF" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
            <path d="M2 0 h16 l6 6 v26 a2 2 0 0 1 -2 2 h-20 a2 2 0 0 1 -2 -2 v-30 a2 2 0 0 1 2 -2 Z" />
            <line x1="6" y1="12" x2="22" y2="12" />
            <line x1="6" y1="18" x2="16" y2="18" />
            <circle cx="21" cy="24" r="5" />
          </g>
        </g>

        {/* corner roundel: secured laptop (bottom-right) */}
        <g transform="translate(950,530)">
          <circle r="52" fill="none" stroke="#FFFFFF" strokeOpacity="0.55" strokeWidth="2.5" strokeDasharray="6 5" />
          <circle r="40" fill="#FFFFFF" fillOpacity="0.08" />
          <g transform="translate(-17,-12)" fill="none" stroke="#FFFFFF" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
            <rect x="2" y="0" width="30" height="20" rx="2" />
            <path d="M-2 24 h38 l-4 6 h-30 Z" />
            <rect x="12" y="6" width="10" height="9" rx="1.5" />
          </g>
        </g>

        {/* central shield with keyhole + password bars */}
        <g transform="translate(600,300)">
          <motion.circle
            r="98"
            fill="none"
            stroke="#FFFFFF"
            strokeOpacity="0.35"
            strokeWidth="2"
            initial={{ rotate: 0 }}
            animate={{ rotate: 360 }}
            transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
            strokeDasharray="2 10"
            style={{ transformOrigin: "center" }}
          />
          <circle r="76" fill="#FFFFFF" fillOpacity="0.07" />
          <g transform="translate(-40,-58)">
            <path
              d="M40 0 L78 14 V46 C78 68 62 84 40 92 C18 84 2 68 2 46 V14 Z"
              fill="#FFFFFF"
              fillOpacity="0.95"
            />
            <circle cx="40" cy="42" r="9" fill="#8A1F1F" />
            <path d="M40 49 L40 62" stroke="#8A1F1F" strokeWidth="7" strokeLinecap="round" />
          </g>
        </g>
      </svg>
    </div>
  );
}
