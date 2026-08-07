"use client";

import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend as RLegend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import attackRates from "@/lib/data/attack-rates.json";
import { getCategoryMeta } from "@/lib/utils";
import type { CategoryAttackRate } from "@/lib/types";

interface TooltipPayload {
  active?: boolean;
  payload?: { value: number; dataKey: string; payload: { label: string } }[];
}

function ChartTooltip({ active, payload }: TooltipPayload) {
  if (!active || !payload || !payload.length) return null;
  const label = payload[0]?.payload.label;
  return (
    <div className="rounded-lg border border-black/10 bg-white px-3 py-2 text-sm shadow-card-hover">
      <p className="font-semibold text-brand-red-darker">{label}</p>
      {payload.map((p) => (
        <p key={p.dataKey} className="mt-0.5 flex items-center gap-2 text-neutral-500">
          <span
            className="h-2 w-2 rounded-full"
            style={{ backgroundColor: p.dataKey === "before" ? "#E24B4A" : "#639922" }}
          />
          {p.dataKey === "before" ? "Avant remédiation" : "Après remédiation"} :{" "}
          <span className="font-medium text-neutral-700">{p.value}%</span>
        </p>
      ))}
    </div>
  );
}

export function BeforeAfterChart() {
  const data = (attackRates as CategoryAttackRate[]).map((r) => ({
    label: getCategoryMeta(r.category).shortLabel,
    before: r.before,
    after: r.after,
  }));

  return (
    <div
      className="h-80 w-full"
      role="img"
      aria-label="Taux de réussite des attaques par catégorie, avant et après remédiation, en pourcentage"
    >
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 8, right: 8, left: 0, bottom: 0 }} barGap={4}>
          <CartesianGrid strokeDasharray="3 6" vertical={false} stroke="#791F1F" strokeOpacity={0.08} />
          <XAxis
            dataKey="label"
            tick={{ fontSize: 12, fill: "#6b6262" }}
            axisLine={{ stroke: "#791F1F", strokeOpacity: 0.12 }}
            tickLine={false}
          />
          <YAxis
            tick={{ fontSize: 12, fill: "#6b6262" }}
            axisLine={false}
            tickLine={false}
            width={42}
            tickFormatter={(value) => `${value}%`}
          />
          <Tooltip content={<ChartTooltip />} cursor={{ fill: "#791F1F", fillOpacity: 0.04 }} />
          <RLegend
            formatter={(value) => (
              <span className="text-xs font-medium text-neutral-600">
                {value === "before" ? "Avant remédiation" : "Après remédiation"}
              </span>
            )}
          />
          <Bar dataKey="before" name="before" fill="#E24B4A" radius={[6, 6, 0, 0]} maxBarSize={26} />
          <Bar dataKey="after" name="after" fill="#639922" radius={[6, 6, 0, 0]} maxBarSize={26} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
