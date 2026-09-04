import { useMemo } from "react";
import {
  Line,
  LineChart,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import {
  YEAR_MAX,
  YEAR_MIN,
  arcticIceAt,
  antarcticIceAt,
} from "@/lib/physics";
import { formatDe } from "@/lib/utils";

type Props = {
  year: number;
  arcticIce: number;
  antarcticIce: number;
};

export function IceTimeline({ year, arcticIce, antarcticIce }: Props) {
  const data = useMemo(() => {
    const rows = [];
    for (let y = YEAR_MIN; y <= YEAR_MAX; y++) {
      rows.push({
        year: y,
        arctic: arcticIceAt(y),
        antarctic: antarcticIceAt(y),
      });
    }
    return rows;
  }, []);

  return (
    <section className="rounded-xl bg-surface p-4 shadow-border sm:p-5">
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <h2 className="font-heading text-2xl tracking-tight">Meereis 1980–2024</h2>
        <p className="text-sm text-muted">
          Arktis stetig abwärts. Antarktis erst auf, dann der Einbruch 2016.
        </p>
      </div>
      <div className="mt-4 h-52 w-full sm:h-60">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
            <XAxis
              dataKey="year"
              type="number"
              domain={[YEAR_MIN, YEAR_MAX]}
              ticks={[1980, 1992, 2014, 2016, 2023]}
              stroke="var(--color-subtle)"
              tick={{ fill: "var(--color-muted)", fontSize: 11, fontFamily: "IBM Plex Mono, ui-monospace" }}
              axisLine={{ stroke: "var(--color-ring)" }}
              tickLine={false}
            />
            <YAxis
              domain={[9, 14]}
              width={36}
              stroke="var(--color-subtle)"
              tick={{ fill: "var(--color-muted)", fontSize: 11, fontFamily: "IBM Plex Mono, ui-monospace" }}
              axisLine={false}
              tickLine={false}
              tickFormatter={(v: number) => formatDe(v, 0)}
            />
            <Tooltip
              contentStyle={{
                background: "var(--color-elevated)",
                border: "1px solid color-mix(in oklab, var(--color-fg) 12%, transparent)",
                borderRadius: 8,
                fontSize: 12,
                color: "var(--color-fg)",
              }}
              formatter={(value, name) => [
                `${formatDe(Number(value), 2)} · 10⁶ km²`,
                name === "arctic" ? "Arktis" : "Antarktis",
              ]}
              labelFormatter={(label) => String(label)}
            />
            <ReferenceLine
              x={2016}
              stroke="var(--color-warm)"
              strokeDasharray="3 3"
              label={{
                value: "2016",
                fill: "var(--color-warm)",
                fontSize: 10,
                position: "insideTopRight",
              }}
            />
            <ReferenceLine x={year} stroke="var(--color-fg)" strokeOpacity={0.35} />
            <Line
              type="monotone"
              dataKey="arctic"
              stroke="var(--color-fg)"
              strokeWidth={1.75}
              dot={false}
              name="arctic"
            />
            <Line
              type="monotone"
              dataKey="antarctic"
              stroke="var(--color-accent)"
              strokeWidth={1.75}
              dot={false}
              name="antarctic"
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
      <div className="mt-3 flex flex-wrap gap-4 text-xs text-muted">
        <span>
          <span className="mr-1.5 inline-block h-px w-4 align-middle bg-fg" />
          Arktis {formatDe(arcticIce, 2)}
        </span>
        <span>
          <span className="mr-1.5 inline-block h-px w-4 align-middle bg-accent" />
          Antarktis {formatDe(antarcticIce, 2)}
        </span>
        <span className="text-subtle">10⁶ km² Jahresmittel, schematisch an Duspayev / Riihelä kalibriert</span>
      </div>
    </section>
  );
}
