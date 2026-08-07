import { FadeIn } from "./FadeIn";

export function SectionHeading({
  eyebrow,
  title,
  subtitle,
  align = "left",
}: {
  eyebrow: string;
  title: string;
  subtitle?: string;
  align?: "left" | "center";
}) {
  return (
    <FadeIn className={align === "center" ? "text-center" : ""}>
      <span className="eyebrow">{eyebrow}</span>
      <h2 className={`section-title mt-4 ${align === "center" ? "mx-auto" : ""}`}>{title}</h2>
      {subtitle && (
        <p className={`section-subtitle ${align === "center" ? "mx-auto" : ""}`}>{subtitle}</p>
      )}
    </FadeIn>
  );
}
