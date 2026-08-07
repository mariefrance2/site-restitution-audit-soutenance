import { criticalities } from "@/lib/utils";

interface LegendItem {
  label: string;
  hex: string;
  value?: string | number;
}

export function Legend({
  items,
  className,
}: {
  items: LegendItem[];
  className?: string;
}) {
  return (
    <ul className={`flex flex-col gap-2.5 ${className ?? ""}`}>
      {items.map((item) => (
        <li key={item.label} className="flex items-center justify-between gap-4 text-sm">
          <span className="flex items-center gap-2.5">
            <span
              aria-hidden
              className="h-3 w-3 shrink-0 rounded-[4px]"
              style={{ backgroundColor: item.hex }}
            />
            <span className="font-medium text-neutral-700">{item.label}</span>
          </span>
          {item.value !== undefined && (
            <span className="font-semibold text-brand-red-darker tabular-nums">
              {item.value}
            </span>
          )}
        </li>
      ))}
    </ul>
  );
}

export function CriticalityLegend({
  counts,
  className,
}: {
  counts: Record<string, number>;
  className?: string;
}) {
  return (
    <Legend
      className={className}
      items={criticalities.map((c) => ({
        label: c.label,
        hex: c.hex,
        value: counts[c.id] ?? 0,
      }))}
    />
  );
}
