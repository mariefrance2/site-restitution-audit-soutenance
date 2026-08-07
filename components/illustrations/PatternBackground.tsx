export function GridBackdrop({ className }: { className?: string }) {
  return (
    <div
      aria-hidden
      className={`pointer-events-none absolute inset-0 -z-10 bg-grid-pattern bg-[size:56px_56px] [mask-image:radial-gradient(ellipse_60%_60%_at_50%_0%,black_10%,transparent_70%)] ${className ?? ""}`}
    />
  );
}

export function GlowOrb({ className }: { className?: string }) {
  return (
    <div
      aria-hidden
      className={`pointer-events-none absolute -z-10 rounded-full blur-3xl ${className ?? ""}`}
      style={{
        background:
          "radial-gradient(circle, rgba(226,75,74,0.14) 0%, rgba(226,75,74,0) 70%)",
      }}
    />
  );
}
