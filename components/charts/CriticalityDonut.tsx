"use client";

import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";
import { criticalities, countByCriticality, findings } from "@/lib/utils";
import { Legend } from "@/components/ui/Legend";

interface TooltipPayload {
  active?: boolean;
  payload?: { payload: { label: string; value: number; hex: string } }[];
}

function ChartTooltip({ active, payload }: TooltipPayload) {
  if (!active || !payload || !payload.length) return null;
  const d = payload[0].payload;
  const pct = Math.round((d.value / findings.length) * 100);
  return (
    <div className="rounded-lg border border-black/10 bg-white px-3 py-2 text-sm shadow-card-hover">
      <p className="font-semibold" style={{ color: d.hex }}>
        {d.label}
      </p>
      <p className="mt-0.5 text-neutral-500">
        {d.value} constat{d.value > 1 ? "s" : ""} ({pct}%)
      </p>
    </div>
  );
}

export function CriticalityDonut() {
  const data = criticalities.map((c) => ({
    label: c.label,
    value: countByCriticality(c.id),
    hex: c.hex,
  }));

  return (
    <div className="flex flex-col items-center gap-6 sm:flex-row sm:items-center sm:justify-between">
      <div
        className="relative h-64 w-64 shrink-0"
        role="img"
        aria-label="Répartition des 16 constats par niveau de criticité : critique, élevé, moyen, faible"
      >
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              dataKey="value"
              nameKey="label"
              innerRadius={72}
              outerRadius={116}
              paddingAngle={3}
              stroke="none"
              startAngle={90}
              endAngle={-270}
            >
              {data.map((entry, index) => (
                <Cell key={index} fill={entry.hex} />
              ))}
            </Pie>
            <Tooltip content={<ChartTooltip />} />
          </PieChart>
        </ResponsiveContainer>
        <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-3xl font-bold text-brand-red-darker">{findings.length}</span>
          <span className="text-xs font-medium text-neutral-500">constats</span>
        </div>
      </div>
      <Legend
        className="w-full sm:w-auto sm:min-w-[220px]"
        items={data.map((d) => ({
          label: d.label,
          hex: d.hex,
          value: `${d.value} · ${Math.round((d.value / findings.length) * 100)}%`,
        }))}
      />
    </div>
  );
}
