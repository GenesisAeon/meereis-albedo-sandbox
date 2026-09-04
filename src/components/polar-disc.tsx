import { useId, useMemo } from "react";
import type { HemisphereState } from "@/lib/physics";

type Props = {
  state: HemisphereState;
};

function mulberry32(seed: number) {
  return () => {
    let t = (seed += 0x6d2b79f5);
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function iceRimPath(
  cx: number,
  cy: number,
  r: number,
  lobes: number,
  amp: number,
  seed: number,
): string {
  const rand = mulberry32(seed);
  const steps = 72;
  const pts: string[] = [];
  for (let i = 0; i <= steps; i++) {
    const t = (i / steps) * Math.PI * 2;
    const wobble = 1 + amp * Math.sin(lobes * t + rand() * 0.6) + amp * 0.45 * Math.sin(3 * t);
    const x = cx + Math.cos(t) * r * wobble;
    const y = cy + Math.sin(t) * r * wobble;
    pts.push(`${i === 0 ? "M" : "L"}${x.toFixed(2)},${y.toFixed(2)}`);
  }
  return `${pts.join(" ")} Z`;
}

function ringPath(
  cx: number,
  cy: number,
  rInner: number,
  rOuter: number,
  lobes: number,
  amp: number,
  seed: number,
): string {
  const rand = mulberry32(seed);
  const steps = 80;
  const outer: string[] = [];
  const inner: string[] = [];
  for (let i = 0; i <= steps; i++) {
    const t = (i / steps) * Math.PI * 2;
    const wobble = 1 + amp * Math.sin(lobes * t + rand() * 0.4);
    outer.push(
      `${i === 0 ? "M" : "L"}${(cx + Math.cos(t) * rOuter * wobble).toFixed(2)},${(cy + Math.sin(t) * rOuter * wobble).toFixed(2)}`,
    );
  }
  for (let i = steps; i >= 0; i--) {
    const t = (i / steps) * Math.PI * 2;
    inner.push(
      `${i === steps ? "L" : "L"}${(cx + Math.cos(t) * rInner).toFixed(2)},${(cy + Math.sin(t) * rInner).toFixed(2)}`,
    );
  }
  return `${outer.join(" ")} ${inner.join(" ")} Z`;
}

export function PolarDisc({ state }: Props) {
  const uid = useId();
  const isArctic = state.id === "arctic";
  const cx = 100;
  const cy = 100;
  const oceanR = 92;

  const iceR = Math.sqrt(state.iceFraction) * oceanR;
  const continentR = 46;
  const ringOuter = continentR + (oceanR - continentR - 4) * Math.min(1, state.iceMkm2 / 14.5);

  const heat = Math.min(1, Math.max(0, (state.absorbedWm2 - 55) / 70));
  const iceBright = 0.55 + state.iceAlbedo * 0.55;
  const pondCount = isArctic ? Math.round((1 - Math.min(1, state.iceRel1980)) * 28) : 0;

  const ponds = useMemo(() => {
    if (pondCount <= 0 || iceR < 12) return [];
    const rand = mulberry32(7);
    const out: { x: number; y: number; r: number }[] = [];
    let guard = 0;
    while (out.length < pondCount && guard < 200) {
      guard += 1;
      const a = rand() * Math.PI * 2;
      const rr = Math.sqrt(rand()) * iceR * 0.82;
      const x = cx + Math.cos(a) * rr;
      const y = cy + Math.sin(a) * rr;
      out.push({ x, y, r: 1.4 + rand() * 2.2 });
    }
    return out;
  }, [pondCount, iceR]);

  const leads = useMemo(() => {
    if (!isArctic || iceR < 20) return [];
    const rand = mulberry32(21);
    return Array.from({ length: 5 }, (_, i) => {
      const a = rand() * Math.PI * 2;
      const len = iceR * (0.45 + rand() * 0.4);
      return {
        x2: cx + Math.cos(a) * len,
        y2: cy + Math.sin(a) * len,
        w: 0.6 + rand() * 0.7,
        key: i,
      };
    });
  }, [isArctic, iceR]);

  const iceFill = `color-mix(in oklab, var(--color-ice) ${Math.round(iceBright * 100)}%, var(--color-pond))`;

  return (
    <svg
      viewBox="0 0 200 200"
      className="h-auto w-full"
      role="img"
      aria-label={
        isArctic
          ? `Arktis, Meereis ${state.iceMkm2.toFixed(1)} Millionen Quadratkilometer`
          : `Antarktis, Meereis ${state.iceMkm2.toFixed(1)} Millionen Quadratkilometer`
      }
    >
      <defs>
        <radialGradient id={`${uid}-ocean`} cx="50%" cy="42%" r="70%">
          <stop offset="0%" stopColor="var(--color-cool)" stopOpacity={0.1 + heat * 0.22} />
          <stop offset="58%" stopColor="var(--color-ocean)" stopOpacity="1" />
          <stop offset="100%" stopColor="var(--color-ocean-deep)" stopOpacity="1" />
        </radialGradient>
        <radialGradient id={`${uid}-ice`} cx="48%" cy="44%" r="70%">
          <stop offset="0%" stopColor="var(--color-fg)" stopOpacity={0.55 + state.iceAlbedo * 0.35} />
          <stop offset="70%" stopColor="var(--color-ice)" stopOpacity="0.95" />
          <stop offset="100%" stopColor="var(--color-cool)" stopOpacity="0.7" />
        </radialGradient>
        <clipPath id={`${uid}-ocean-clip`}>
          <circle cx={cx} cy={cy} r={oceanR} />
        </clipPath>
      </defs>

      <circle cx={cx} cy={cy} r={oceanR + 1.5} fill="none" stroke="var(--color-ring)" strokeWidth="1" />
      <circle cx={cx} cy={cy} r={oceanR} fill={`url(#${uid}-ocean)`} />

      {[0.35, 0.62, 0.88].map((f) => (
        <circle
          key={f}
          cx={cx}
          cy={cy}
          r={oceanR * f}
          fill="none"
          stroke="var(--color-ring)"
          strokeWidth="0.6"
        />
      ))}

      <g clipPath={`url(#${uid}-ocean-clip)`}>
        {isArctic ? (
          <>
            {iceR > 4 && (
              <path
                d={iceRimPath(cx, cy, iceR, 11, 0.045, 3)}
                fill={`url(#${uid}-ice)`}
                fillOpacity={0.92}
              />
            )}
            {leads.map((l) => (
              <line
                key={l.key}
                x1={cx}
                y1={cy}
                x2={l.x2}
                y2={l.y2}
                stroke="var(--color-lead)"
                strokeWidth={l.w}
                strokeLinecap="round"
                opacity="0.55"
              />
            ))}
            {ponds.map((p, i) => (
              <circle key={i} cx={p.x} cy={p.y} r={p.r} fill="var(--color-pond)" opacity="0.7" />
            ))}
          </>
        ) : (
          <>
            {ringOuter > continentR + 2 && (
              <path
                d={ringPath(cx, cy, continentR - 0.5, ringOuter, 14, 0.035, 9)}
                fill={iceFill}
                opacity="0.95"
              />
            )}
            <path
              d={iceRimPath(cx, cy, continentR, 7, 0.028, 1)}
              fill="var(--color-continent)"
            />
            <circle cx={cx} cy={cy} r={8} fill="none" stroke="var(--color-ring)" strokeWidth="0.7" />
          </>
        )}
      </g>

      <text
        x={cx}
        y={isArctic ? 22 : 188}
        textAnchor="middle"
        fill="var(--color-muted)"
        fontSize="8"
        fontFamily="IBM Plex Mono, ui-monospace, monospace"
        letterSpacing="0.18em"
      >
        {isArctic ? "NORDPOL" : "SÜDPOL"}
      </text>
    </svg>
  );
}
