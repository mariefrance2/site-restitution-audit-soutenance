"use client";

import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import consequences from "@/lib/data/consequences.json";

interface TooltipPayload {
  active?: boolean;
  payload?: { payload: { year: string; globalCostM: number; aiShare: number } }[];
}

function ChartTooltip({ active, payload }: TooltipPayload) {
  if (!active || !payload || !payload.length) return null;
  const d = payload[0].payload;
  return (
    <div className="rounded-lg border border-black/10 bg-white px-3 py-2 text-sm shadow-card-hover">
      <p className="font-semibold text-brand-red-darker">{d.year}</p>
      <p className="mt-0.5 text-neutral-500">
        Coût moyen : <span className="font-medium text-neutral-700">{d.globalCostM} M$</span>
      </p>
      <p className="text-neutral-500">
        Part liée à l&apos;IA :{" "}
        <span className="font-medium text-neutral-700">{d.aiShare}%</span>
      </p>
    </div>
  );
}

export function TrendChart() {
  return (
    <div
      className="h-64 w-full"
      role="img"
      aria-label="Évolution 2023-2025 du coût mondial moyen d'une violation de données et de la part des violations impliquant l'IA"
    >
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={consequences.trend} margin={{ top: 8, right: 12, left: 0, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 6" vertical={false} stroke="#791F1F" strokeOpacity={0.08} />
          <XAxis
            dataKey="year"
            tick={{ fontSize: 12, fill: "#6b6262" }}
            axisLine={{ stroke: "#791F1F", strokeOpacity: 0.12 }}
            tickLine={false}
          />
          <YAxis tick={{ fontSize: 12, fill: "#6b6262" }} axisLine={false} tickLine={false} width={30} />
          <Tooltip content={<ChartTooltip />} />
          <Line
            type="monotone"
            dataKey="globalCostM"
            stroke="#E24B4A"
            strokeWidth={2.5}
            dot={{ r: 4, fill: "#E24B4A" }}
            activeDot={{ r: 6 }}
          />
          <Line
            type="monotone"
            dataKey="aiShare"
            stroke="#791F1F"
            strokeWidth={2.5}
            strokeDasharray="5 4"
            dot={{ r: 4, fill: "#791F1F" }}
            activeDot={{ r: 6 }}
          />
        </LineChart>
      </ResponsiveContainer>
      <div className="mt-2 flex items-center justify-center gap-6 text-xs font-medium text-neutral-600">
        <span className="flex items-center gap-2">
          <span className="h-0.5 w-4 rounded bg-brand-red" /> Coût moyen (M$)
        </span>
        <span className="flex items-center gap-2">
          <span className="h-0.5 w-4 rounded bg-brand-red-dark [background-image:repeating-linear-gradient(90deg,#791F1F_0_4px,transparent_4px_7px)]" />
          Part liée à l&apos;IA (%)
        </span>
      </div>
    </div>
  );
}
