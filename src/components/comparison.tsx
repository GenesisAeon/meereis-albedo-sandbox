import { formatSignedDe } from "@/lib/utils";
import type { HemisphereState } from "@/lib/physics";
import { sameSign } from "@/lib/physics";

type Props = {
  arctic: HemisphereState;
  antarctic: HemisphereState;
};

function axisPos(deltaF: number): number {
  const t = (deltaF + 0.6) / 1.2;
  return Math.min(96, Math.max(4, t * 100));
}

export function Comparison({ arctic, antarctic }: Props) {
  const shared = sameSign(arctic.sign, antarctic.sign);
  const aPos = axisPos(arctic.deltaFWm2);
  const bPos = axisPos(antarctic.deltaFWm2);

  return (
    <section className="rounded-xl bg-surface p-4 shadow-border sm:p-5">
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <h2 className="font-heading text-2xl tracking-tight">Nebeneinander</h2>
        <p className="text-sm text-muted">
          {shared
            ? "Gleiches Vorzeichen — die Antarktis folgt der Arktis nicht immer."
            : "Unterschiedliches Vorzeichen — genau der dokumentierte Fall vor 2016."}
        </p>
      </div>

      <div className="relative mt-8 mb-2 h-16">
        <div className="absolute top-7 right-0 left-0 h-px bg-ring" />
        <div className="absolute top-7 left-1/2 h-2 w-px -translate-x-1/2 bg-ring-strong" />
        <span className="absolute top-0 left-0 text-2xs uppercase tracking-[0.12em] text-cool">
          kühlend
        </span>
        <span className="absolute top-0 right-0 text-2xs uppercase tracking-[0.12em] text-warm">
          wärmend
        </span>
        <span className="absolute top-9 left-1/2 -translate-x-1/2 font-mono text-3xs text-subtle">
          ΔF = 0
        </span>

        <Marker left={aPos} label="Arktis" value={arctic.deltaFWm2} tone="arctic" />
        <Marker left={bPos} label="Antarktis" value={antarctic.deltaFWm2} tone="antarctic" />
      </div>

      <p className="mt-6 max-w-3xl text-sm leading-relaxed text-muted">
        Die Achse zeigt die Änderung der Meereis-Strahlungsbilanz gegen 1980.
        Positive Werte bedeuten weniger Reflexion, mehr absorbierte Sonnenenergie.
        Vor 2016 sitzt die Antarktis links (kühlend), die Arktis rechts (wärmend).
      </p>
    </section>
  );
}

function Marker({
  left,
  label,
  value,
  tone,
}: {
  left: number;
  label: string;
  value: number;
  tone: "arctic" | "antarctic";
}) {
  const offset = tone === "arctic" ? "-top-1" : "top-9";
  return (
    <div
      className={`absolute ${offset} -translate-x-1/2`}
      style={{ left: `${left}%` }}
    >
      <div className="flex flex-col items-center">
        {tone === "arctic" ? (
          <>
            <span className="font-mono text-3xs tabular-nums text-fg">
              {label} {formatSignedDe(value, 2)}
            </span>
            <span className="mt-0.5 size-2.5 rounded-full bg-fg" />
          </>
        ) : (
          <>
            <span className="size-2.5 rounded-full bg-accent" />
            <span className="mt-0.5 font-mono text-3xs tabular-nums text-accent">
              {label} {formatSignedDe(value, 2)}
            </span>
          </>
        )}
      </div>
    </div>
  );
}
