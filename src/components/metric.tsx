import { formatDe, formatSignedDe } from "@/lib/utils";

type Props = {
  label: string;
  value: string;
  hint?: string;
  tone?: "default" | "cool" | "warm";
};

export function Metric({ label, value, hint, tone = "default" }: Props) {
  const toneClass =
    tone === "cool" ? "text-cool" : tone === "warm" ? "text-warm" : "text-fg";

  return (
    <div className="min-w-0">
      <div className="text-2xs font-medium uppercase tracking-[0.14em] text-subtle">
        {label}
      </div>
      <div
        className={`mt-1 font-mono text-xl font-medium tabular-nums leading-none sm:text-2xl ${toneClass}`}
      >
        {value}
      </div>
      {hint ? <div className="mt-1.5 text-xs leading-snug text-muted">{hint}</div> : null}
    </div>
  );
}

export function albedoLabel(albedo: number): string {
  return formatDe(albedo, 2);
}

export function wm2Label(value: number, signed = false): string {
  const n = signed ? formatSignedDe(value, 2) : formatDe(value, 0);
  return `${n} W/m²`;
}
