import { PolarDisc } from "@/components/polar-disc";
import { Metric, albedoLabel } from "@/components/metric";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import { formatDe, formatSignedDe } from "@/lib/utils";
import type { HemisphereState } from "@/lib/physics";
import {
  ARCTIC_ICE_1980,
  ARCTIC_ICE_MAX,
  ARCTIC_ICE_MIN,
  ANTARCTIC_ICE_1980,
  ANTARCTIC_ICE_MAX,
  ANTARCTIC_ICE_MIN,
  ANTARCTIC_EXPANSION_FEEDBACK_W_M2_PER_DECADE,
  POST_REVERSAL_COMBINED_W_M2,
  GAMMA_IA,
  ARCTIC_SIRE_WEAKENING_PCT,
  ANTARCTIC_FEEDBACK_BOOST_PCT,
} from "@/lib/physics";

type Props = {
  state: HemisphereState;
  linked: boolean;
  onIce: (value: number) => void;
  onRelink: () => void;
};

function signCopy(state: HemisphereState): { label: string; tone: "cool" | "warm" | "default" } {
  if (state.sign === "cooling") return { label: "kühlend", tone: "cool" };
  if (state.sign === "warming") return { label: "wärmend", tone: "warm" };
  return { label: "Übergang", tone: "default" };
}

export function HemispherePanel({ state, linked, onIce, onRelink }: Props) {
  const isArctic = state.id === "arctic";
  const sign = signCopy(state);
  const min = isArctic ? ARCTIC_ICE_MIN : ANTARCTIC_ICE_MIN;
  const max = isArctic ? ARCTIC_ICE_MAX : ANTARCTIC_ICE_MAX;
  const ref = isArctic ? ARCTIC_ICE_1980 : ANTARCTIC_ICE_1980;

  const feedbackValue = isArctic
    ? formatDe(state.gammaEffective, 2)
    : state.sign === "cooling"
      ? `${formatSignedDe(ANTARCTIC_EXPANSION_FEEDBACK_W_M2_PER_DECADE, 2)}`
      : state.sign === "warming"
        ? `${formatSignedDe(POST_REVERSAL_COMBINED_W_M2, 2)}`
        : "Kipp";

  const feedbackHint = isArctic
    ? `γ_IA = ${formatDe(GAMMA_IA, 2)} · wirksam bei vorhandenem Eis`
    : state.sign === "cooling"
      ? "W/m² pro Dekade · Expansion 1992–2015 · Riihelä et al. 2021"
      : state.sign === "warming"
        ? "W/m² · 2016–2018, beide Hemisphären · Riihelä et al. 2021"
        : "Zwischen Expansion und Einbruch";

  const sireHint = isArctic
    ? state.coolingLossPct >= 20
      ? `Kühlleistung ${formatDe(state.coolingLossPct, 0)} % unter 1980 (publiziert: ~${ARCTIC_SIRE_WEAKENING_PCT} %)`
      : `Δ gegen 1980: ${formatSignedDe(state.deltaFWm2, 2)} W/m²`
    : state.sign === "warming"
      ? `Wärmende Rückkopplung seit 2016 (+${ANTARCTIC_FEEDBACK_BOOST_PCT} %)`
      : `Δ gegen 1980: ${formatSignedDe(state.deltaFWm2, 2)} W/m²`;

  return (
    <section
      className="flex min-w-0 flex-col rounded-xl bg-surface p-4 shadow-border sm:p-5"
      aria-labelledby={isArctic ? "arctic-title" : "antarctic-title"}
    >
      <header className="flex items-baseline justify-between gap-3">
        <div>
          <p className="text-2xs font-medium uppercase tracking-[0.16em] text-subtle">
            {isArctic ? "GenesisAeon P127" : "GenesisAeon P120"}
          </p>
          <h2
            id={isArctic ? "arctic-title" : "antarctic-title"}
            className="mt-1 font-heading text-3xl leading-none tracking-tight text-fg sm:text-4xl"
          >
            {isArctic ? "Arktis" : "Antarktis"}
          </h2>
        </div>
        <span
          className={
            sign.tone === "cool"
              ? "rounded-sm bg-cool/15 px-2.5 py-1 text-xs font-medium text-cool"
              : sign.tone === "warm"
                ? "rounded-sm bg-warm/15 px-2.5 py-1 text-xs font-medium text-warm"
                : "rounded-sm bg-elevated px-2.5 py-1 text-xs font-medium text-muted"
          }
        >
          {sign.label}
        </span>
      </header>

      <div className="mx-auto mt-4 w-full max-w-[280px] sm:max-w-[320px]">
        <PolarDisc state={state} />
      </div>

      <p className="mt-1 text-center font-mono text-sm tabular-nums text-muted">
        {formatDe(state.iceMkm2, 2)} · 10⁶ km²
        <span className="text-subtle"> · {formatDe(state.iceRel1980 * 100, 0)} % von 1980</span>
      </p>

      <div className="mt-5 grid grid-cols-2 gap-x-4 gap-y-5">
        <Metric
          label="Albedo"
          value={albedoLabel(state.packAlbedo)}
          hint={`Eis ${albedoLabel(state.iceAlbedo)} · Ozean ${isArctic ? "0,07" : "0,08"}`}
        />
        <Metric
          label="Absorbiert"
          value={`${formatDe(state.absorbedWm2, 0)} W/m²`}
          hint="Sonnenenergie, polar, Jahresmittel"
        />
        <Metric
          label="SIRE"
          value={`${formatSignedDe(state.sireWm2, 2)} W/m²`}
          hint={sireHint}
          tone={state.sireWm2 < -0.7 ? "cool" : state.sireWm2 > -0.5 ? "warm" : "default"}
        />
        <Metric
          label={isArctic ? "Rückkopplung γ" : "Rückkopplung"}
          value={feedbackValue}
          hint={feedbackHint}
          tone={sign.tone === "default" ? "default" : sign.tone}
        />
      </div>

      <div className="mt-6">
        <div className="flex items-center justify-between gap-2">
          <label
            className="text-2xs font-medium uppercase tracking-[0.14em] text-subtle"
            htmlFor={isArctic ? "arctic-ice" : "antarctic-ice"}
          >
            Meereisfläche
          </label>
          {!linked ? (
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="h-8 px-2 text-xs"
              onClick={onRelink}
            >
              An Jahr koppeln
            </Button>
          ) : (
            <span className="text-xs text-subtle">an Jahr gekoppelt</span>
          )}
        </div>
        <Slider
          id={isArctic ? "arctic-ice" : "antarctic-ice"}
          min={min}
          max={max}
          step={0.05}
          value={[state.iceMkm2]}
          onValueChange={(v) => onIce(v[0] ?? state.iceMkm2)}
          aria-label={isArctic ? "Arktische Meereisfläche" : "Antarktische Meereisfläche"}
        />
        <div className="flex justify-between font-mono text-2xs tabular-nums text-subtle">
          <span>{formatDe(min, 0)}</span>
          <span>1980 = {formatDe(ref, 1)}</span>
          <span>{formatDe(max, 0)}</span>
        </div>
      </div>
    </section>
  );
}
