import { useEffect, useMemo, useState } from "react";
import { Pause, Play } from "lucide-react";
import { HemispherePanel } from "@/components/hemisphere-panel";
import { Comparison } from "@/components/comparison";
import { IceTimeline } from "@/components/timeline";
import { Sources } from "@/components/sources";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import {
  PRESETS,
  YEAR_MAX,
  YEAR_MIN,
  arcticIceAt,
  antarcticIceAt,
  evaluateAntarctic,
  evaluateArctic,
  thesisFor,
} from "@/lib/physics";

const DEFAULT_YEAR = 2014;

export function Sandbox() {
  const [year, setYear] = useState(DEFAULT_YEAR);
  const [arcticLinked, setArcticLinked] = useState(true);
  const [antarcticLinked, setAntarcticLinked] = useState(true);
  const [arcticIce, setArcticIce] = useState(() => arcticIceAt(DEFAULT_YEAR));
  const [antarcticIce, setAntarcticIce] = useState(() => antarcticIceAt(DEFAULT_YEAR));
  const [playing, setPlaying] = useState(false);

  useEffect(() => {
    if (arcticLinked) setArcticIce(arcticIceAt(year));
  }, [year, arcticLinked]);

  useEffect(() => {
    if (antarcticLinked) setAntarcticIce(antarcticIceAt(year));
  }, [year, antarcticLinked]);

  useEffect(() => {
    if (!playing) return;
    const id = window.setInterval(() => {
      setYear((current) => {
        if (current >= YEAR_MAX) {
          setPlaying(false);
          return YEAR_MAX;
        }
        return current + 1;
      });
    }, 160);
    return () => window.clearInterval(id);
  }, [playing]);

  function applyYear(next: number, relink = false) {
    setPlaying(false);
    if (relink) {
      setArcticLinked(true);
      setAntarcticLinked(true);
    }
    setYear(next);
  }

  const arctic = useMemo(() => evaluateArctic(arcticIce), [arcticIce]);
  const antarctic = useMemo(() => evaluateAntarctic(antarcticIce), [antarcticIce]);
  const thesis = thesisFor(year, arctic, antarctic);

  return (
    <div className="min-h-dvh bg-bg text-fg">
      <div className="mx-auto max-w-6xl px-4 pt-8 pb-16 sm:px-6 sm:pt-12">
        <header className="max-w-3xl">
          <p className="text-2xs font-medium uppercase tracking-[0.18em] text-subtle">
            Meereis-Albedo-Sandbox · Arktis / Antarktis
          </p>
          <h1 className="mt-3 font-heading text-4xl leading-[1.05] tracking-tight sm:text-5xl">
            Zwei Polkappen.
            <span className="italic text-accent"> Zwei Vorzeichen.</span>
          </h1>
          <p className="mt-4 max-w-2xl text-base leading-relaxed text-muted sm:text-lg">
            Die Arktis verliert Kühlleistung — rund 25&nbsp;% seit 1980, doppelt so
            schnell wie der Flächenverlust. Die Antarktis hat 2016 das Vorzeichen
            gewechselt: von kühlend auf wärmend.
          </p>
        </header>

        <section className="mt-8 rounded-xl bg-surface p-4 shadow-border sm:p-5">
          <div className="flex flex-wrap items-end justify-between gap-3">
            <div>
              <p className="text-2xs font-medium uppercase tracking-[0.14em] text-subtle">
                Jahr
              </p>
              <p className="mt-1 font-mono text-3xl tabular-nums leading-none">{year}</p>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <Button
                type="button"
                variant="outline"
                size="icon"
                aria-label={playing ? "Wiedergabe anhalten" : "Jahre abspielen"}
                onClick={() => {
                  if (year >= YEAR_MAX && !playing) applyYear(YEAR_MIN, true);
                  setPlaying((p) => !p);
                }}
              >
                {playing ? (
                  <Pause className="size-4" />
                ) : (
                  <Play className="ml-0.5 size-4" />
                )}
              </Button>
              {PRESETS.map((p) => (
                <Button
                  key={p.year}
                  type="button"
                  variant="chip"
                  size="sm"
                  data-active={year === p.year && arcticLinked && antarcticLinked}
                  onClick={() => applyYear(p.year, true)}
                >
                  {p.label}
                  <span className="hidden opacity-70 sm:inline">{p.hint}</span>
                </Button>
              ))}
            </div>
          </div>
          <Slider
            className="mt-2"
            min={YEAR_MIN}
            max={YEAR_MAX}
            step={1}
            value={[year]}
            onValueChange={(v) => applyYear(v[0] ?? year)}
            aria-label="Jahr"
          />
          <div className="flex justify-between font-mono text-2xs tabular-nums text-subtle">
            <span>1980</span>
            <span>1992 Expansion</span>
            <span>2016 Umschlag</span>
            <span>2024</span>
          </div>
        </section>

        <div className="mt-6 rounded-lg bg-elevated px-4 py-3 sm:px-5">
          <p className="text-2xs font-medium uppercase tracking-[0.14em] text-subtle">
            {thesis.headline}
          </p>
          <p className="mt-1 text-sm leading-relaxed text-fg sm:text-base">{thesis.body}</p>
        </div>

        <div className="mt-6 grid grid-cols-1 gap-4 lg:grid-cols-2 lg:gap-5">
          <HemispherePanel
            state={arctic}
            linked={arcticLinked}
            onIce={(v) => {
              setPlaying(false);
              setArcticLinked(false);
              setArcticIce(v);
            }}
            onRelink={() => {
              setArcticLinked(true);
              setArcticIce(arcticIceAt(year));
            }}
          />
          <HemispherePanel
            state={antarctic}
            linked={antarcticLinked}
            onIce={(v) => {
              setPlaying(false);
              setAntarcticLinked(false);
              setAntarcticIce(v);
            }}
            onRelink={() => {
              setAntarcticLinked(true);
              setAntarcticIce(antarcticIceAt(year));
            }}
          />
        </div>

        <div className="mt-4 space-y-4">
          <Comparison arctic={arctic} antarctic={antarctic} />
          <IceTimeline year={year} arcticIce={arcticIce} antarcticIce={antarcticIce} />
          <Sources />
        </div>
      </div>
    </div>
  );
}
