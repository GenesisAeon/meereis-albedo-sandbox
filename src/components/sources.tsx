import { CITATIONS, COOLING_VS_AREA_RATIO, GAMMA_IA, ALBEDO_VS_MELTWATER_RATIO } from "@/lib/physics";
import { formatDe } from "@/lib/utils";

function doiHref(doi: string) {
  return `https://doi.org/${doi}`;
}

export function Sources() {
  return (
    <section className="rounded-xl bg-surface p-4 shadow-border sm:p-5">
      <h2 className="font-heading text-2xl tracking-tight">Quellen</h2>
      <p className="mt-2 max-w-3xl text-sm leading-relaxed text-muted">
        Die Zahlen in dieser Sandbox stammen aus zwei GenesisAeon-Geschwisterpaketen
        und den dort zitierten Primärquellen. Kühlleistungsverlust ≈ {COOLING_VS_AREA_RATIO}×
        Flächenverlust in beiden Hemisphären; γ_IA = {formatDe(GAMMA_IA, 2)}, rund{" "}
        {formatDe(ALBEDO_VS_MELTWATER_RATIO, 0)}:1 gegen die gegenläufige Schmelzwasser-Rückkopplung.
      </p>

      <ul className="mt-5 space-y-4 text-sm">
        <SourceItem
          cite={CITATIONS.duspayev2024}
          note="Arktische SIRE −0,64 bis −0,86 W/m² (1980–2023), Kühlleistung rund 25 % schwächer seit 1980. Antarktische SIRE −0,85 bis −0,98 W/m²; wärmende Rückkopplung seit 2016 um 40 % verstärkt."
        />
        <SourceItem
          cite={CITATIONS.zhang2025}
          note="Eis-Albedo-Rückkopplungsfaktor γ_IA = 0,41. Die positive Albedo-Rückkopplung gewinnt gegen die negative Schmelzwasser-Rückkopplung etwa 2:1."
        />
        <SourceItem
          cite={CITATIONS.riihela2021}
          note="Antarktis: −0,06 ± 0,02 W/m²/Dekade (1992–2015, Expansion) kippte auf +0,26 W/m² (2016–2018, kombiniertes 3-Jahresmittel Arktis+Antarktis)."
        />
      </ul>

      <div className="mt-6 flex flex-wrap gap-x-5 gap-y-2 text-sm">
        <a
          className="text-accent underline-offset-4 hover:underline"
          href="https://github.com/GenesisAeon/arctic-climate-utac"
          target="_blank"
          rel="noreferrer"
        >
          arctic-climate-utac
        </a>
        <a
          className="text-accent underline-offset-4 hover:underline"
          href="https://github.com/GenesisAeon/antarctic-ice-shelf-utac"
          target="_blank"
          rel="noreferrer"
        >
          antarctic-ice-shelf-utac
        </a>
      </div>

      <p className="mt-5 text-xs leading-relaxed text-subtle">
        Keine UTAC/CREP/AFET-Verknüpfung. Die Kryosphärenforschung steht für sich. Die
        Jahreskurven der Meereisfläche sind schematisch an die publizierten Eckwerte
        kalibriert, keine Satelliten-Rohdaten. SIRE folgt der 2×-Flächenregel aus
        Duspayev et al. 2024 und ist an die dortigen 1980- und 2023-Werte angebunden.
      </p>
    </section>
  );
}

function SourceItem({
  cite,
  note,
}: {
  cite: (typeof CITATIONS)[keyof typeof CITATIONS];
  note: string;
}) {
  return (
    <li className="border-t border-ring pt-4">
      <p className="text-fg">
        {cite.authors} ({cite.year}).{" "}
        <span className="italic">{cite.title}.</span> {cite.journal}.
      </p>
      <p className="mt-1 text-muted">{note}</p>
      <a
        className="mt-1 inline-block font-mono text-xs text-accent underline-offset-4 hover:underline"
        href={doiHref(cite.doi)}
        target="_blank"
        rel="noreferrer"
      >
        doi:{cite.doi}
      </a>
    </li>
  );
}
