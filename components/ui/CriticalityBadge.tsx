import { getCriticalityMeta } from "@/lib/utils";
import type { CriticalityLevel } from "@/lib/types";
import { cx } from "@/lib/utils";
import { CriticalityIcon } from "./CriticalityIcon";

export function CriticalityBadge({
  level,
  className,
  size = "md",
}: {
  level: CriticalityLevel;
  className?: string;
  size?: "sm" | "md";
}) {
  const meta = getCriticalityMeta(level);
  return (
    <span
      className={cx(
        "inline-flex items-center gap-1.5 rounded-full font-semibold",
        size === "sm" ? "px-2 py-0.5 text-[11px]" : "px-3 py-1 text-xs",
        className
      )}
      style={{
        backgroundColor: `${meta.hex}1A`,
        color: meta.hex,
        border: `1px solid ${meta.hex}33`,
      }}
    >
      <CriticalityIcon
        level={level}
        className={size === "sm" ? "h-3 w-3 shrink-0" : "h-3.5 w-3.5 shrink-0"}
        strokeWidth={2.25}
      />
      {meta.label}
    </span>
  );
}
