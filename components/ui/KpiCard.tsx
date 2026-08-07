"use client";

import type { ReactNode } from "react";
import { AnimatedCounter } from "./AnimatedCounter";
import { cx } from "@/lib/utils";

interface KpiCardProps {
  icon: ReactNode;
  label: string;
  value: number;
  suffix?: string;
  accentHex?: string;
  description?: string;
}

export function KpiCard({
  icon,
  label,
  value,
  suffix = "",
  accentHex = "#E24B4A",
  description,
}: KpiCardProps) {
  return (
    <div className="card-surface card-surface-hover group p-6">
      <div className="flex items-start justify-between">
        <div
          className="flex h-11 w-11 items-center justify-center rounded-[10px] transition-transform duration-300 group-hover:scale-105"
          style={{ backgroundColor: `${accentHex}14` }}
        >
          {icon}
        </div>
      </div>
      <div className="mt-5">
        <div className="text-3xl font-bold tracking-tight text-brand-red-darker">
          <AnimatedCounter value={value} suffix={suffix} />
        </div>
        <p className="mt-1.5 text-sm font-medium text-neutral-600">{label}</p>
        {description && (
          <p className="mt-1 text-xs leading-relaxed text-neutral-400">{description}</p>
        )}
      </div>
    </div>
  );
}

export function StatPill({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div className={cx("card-surface px-5 py-4", className)}>{children}</div>
  );
}
