"use client";

import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import {
  categories,
  countByCategory,
  dominantCriticalityForCategory,
  getCriticalityMeta,
} from "@/lib/utils";

interface TooltipPayload {
  active?: boolean;
  payload?: { payload: { label: string; count: number; criticalityLabel: string } }[];
}

function ChartTooltip({ active, payload }: TooltipPayload) {
  if (!active || !payload || !payload.length) return null;
  const d = payload[0].payload;
  return (
    <div className="rounded-lg border border-black/10 bg-white px-3 py-2 text-sm shadow-card-hover">
      <p className="font-semibold text-brand-red-darker">{d.label}</p>
      <p className="mt-0.5 text-neutral-500">
        {d.count} constat{d.count > 1 ? "s" : ""} · dominante{" "}
        <span className="font-medium">{d.criticalityLabel}</span>
      </p>
    </div>
  );
}

export function OwaspBarChart() {
  const data = categories.map((cat) => {
    const dominant = dominantCriticalityForCategory(cat.id);
    return {
      label: cat.shortLabel,
      count: countByCategory(cat.id),
      hex: getCriticalityMeta(dominant).hex,
      criticalityLabel: getCriticalityMeta(dominant).label,
    };
  });

  return (
    <div
      className="h-72 w-full"
      role="img"
      aria-label="Nombre de constats par catégorie OWASP, coloré selon la criticité dominante de chaque catégorie"
    >
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 6" vertical={false} stroke="#791F1F" strokeOpacity={0.08} />
          <XAxis
            dataKey="label"
            tick={{ fontSize: 12, fill: "#6b6262" }}
            axisLine={{ stroke: "#791F1F", strokeOpacity: 0.12 }}
            tickLine={false}
          />
          <YAxis
            allowDecimals={false}
            tick={{ fontSize: 12, fill: "#6b6262" }}
            axisLine={false}
            tickLine={false}
            width={28}
          />
          <Tooltip content={<ChartTooltip />} cursor={{ fill: "#791F1F", fillOpacity: 0.04 }} />
          <Bar dataKey="count" radius={[6, 6, 0, 0]} maxBarSize={44}>
            {data.map((entry, index) => (
              <Cell key={index} fill={entry.hex} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
