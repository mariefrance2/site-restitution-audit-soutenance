"use client";

import { motion } from "framer-motion";

export function HeroIllustration() {
  return (
    <div className="relative mx-auto aspect-square w-full max-w-lg">
      <motion.svg
        viewBox="0 0 480 480"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="h-full w-full"
        initial="hidden"
        animate="show"
      >
        <defs>
          <linearGradient id="shieldGrad" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#E24B4A" />
            <stop offset="100%" stopColor="#791F1F" />
          </linearGradient>
          <linearGradient id="cardGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#FFFFFF" />
            <stop offset="100%" stopColor="#F9F8F6" />
          </linearGradient>
          <radialGradient id="glow" cx="50%" cy="35%" r="65%">
            <stop offset="0%" stopColor="#E24B4A" stopOpacity="0.16" />
            <stop offset="100%" stopColor="#E24B4A" stopOpacity="0" />
          </radialGradient>
        </defs>

        <circle cx="240" cy="220" r="220" fill="url(#glow)" />

        {/* orbit rings */}
        <circle cx="240" cy="220" r="176" stroke="#791F1F" strokeOpacity="0.08" strokeWidth="1" />
        <circle cx="240" cy="220" r="140" stroke="#791F1F" strokeOpacity="0.1" strokeWidth="1" strokeDasharray="4 6" />

        {/* floating nodes */}
        {[
          { cx: 88, cy: 150, r: 5 },
          { cx: 400, cy: 120, r: 4 },
          { cx: 420, cy: 300, r: 6 },
          { cx: 70, cy: 320, r: 4 },
          { cx: 240, cy: 40, r: 4 },
        ].map((n, i) => (
          <motion.circle
            key={i}
            cx={n.cx}
            cy={n.cy}
            r={n.r}
            fill="#E24B4A"
            animate={{ opacity: [0.35, 1, 0.35] }}
            transition={{ duration: 3, repeat: Infinity, delay: i * 0.4 }}
          />
        ))}

        {/* connecting lines */}
        <path d="M88 150 L200 190" stroke="#791F1F" strokeOpacity="0.15" strokeWidth="1.5" />
        <path d="M400 120 L290 175" stroke="#791F1F" strokeOpacity="0.15" strokeWidth="1.5" />
        <path d="M420 300 L310 260" stroke="#791F1F" strokeOpacity="0.15" strokeWidth="1.5" />
        <path d="M70 320 L190 270" stroke="#791F1F" strokeOpacity="0.15" strokeWidth="1.5" />

        {/* central shield */}
        <g transform="translate(150, 90)">
          <path
            d="M90 0 L172 30 V96 C172 148 138 186 90 202 C42 186 8 148 8 96 V30 Z"
            fill="url(#shieldGrad)"
          />
          <path
            d="M90 14 L158 40 V96 C158 141 128 174 90 188 C52 174 22 141 22 96 V40 Z"
            fill="none"
            stroke="#FFFFFF"
            strokeOpacity="0.25"
            strokeWidth="1.5"
          />
          <motion.path
            d="M62 96 L82 116 L120 72"
            stroke="#FFFFFF"
            strokeWidth="9"
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="none"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 1, delay: 0.6, ease: "easeOut" }}
          />
        </g>

        {/* dashboard card bottom-left */}
        <g transform="translate(40, 300)">
          <rect width="150" height="92" rx="12" fill="url(#cardGrad)" stroke="#791F1F" strokeOpacity="0.08" />
          <rect x="16" y="18" width="60" height="8" rx="4" fill="#791F1F" fillOpacity="0.25" />
          <rect x="16" y="34" width="90" height="6" rx="3" fill="#791F1F" fillOpacity="0.12" />
          {[18, 30, 12, 26].map((h, i) => (
            <motion.rect
              key={i}
              x={16 + i * 18}
              width="10"
              rx="2"
              fill={i % 2 === 0 ? "#E24B4A" : "#EF9F27"}
              initial={{ height: 0, y: 76 }}
              animate={{ height: h, y: 76 - h }}
              transition={{ duration: 0.8, delay: 0.9 + i * 0.1, ease: "easeOut" }}
            />
          ))}
        </g>

        {/* percentage card top-right */}
        <g transform="translate(300, 40)">
          <rect width="132" height="80" rx="12" fill="url(#cardGrad)" stroke="#791F1F" strokeOpacity="0.08" />
          <circle cx="40" cy="40" r="24" stroke="#791F1F" strokeOpacity="0.08" strokeWidth="8" fill="none" />
          <motion.circle
            cx="40"
            cy="40"
            r="24"
            stroke="#639922"
            strokeWidth="8"
            strokeLinecap="round"
            fill="none"
            strokeDasharray={2 * Math.PI * 24}
            initial={{ strokeDashoffset: 2 * Math.PI * 24 }}
            animate={{ strokeDashoffset: 2 * Math.PI * 24 * 0.05 }}
            transform="rotate(-90 40 40)"
            transition={{ duration: 1.2, delay: 1, ease: "easeOut" }}
          />
          <text x="40" y="45" textAnchor="middle" fontSize="14" fontWeight="700" fill="#501313">
            100%
          </text>
          <rect x="80" y="20" width="40" height="7" rx="3.5" fill="#791F1F" fillOpacity="0.2" />
          <rect x="80" y="34" width="34" height="6" rx="3" fill="#791F1F" fillOpacity="0.1" />
          <rect x="80" y="50" width="44" height="6" rx="3" fill="#791F1F" fillOpacity="0.1" />
        </g>
      </motion.svg>
    </div>
  );
}
