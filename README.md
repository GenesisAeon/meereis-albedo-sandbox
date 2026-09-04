# meereis-albedo-sandbox

Interactive Arctic vs Antarctic sea-ice albedo sandbox. Sibling UI to
[`arctic-climate-utac`](https://github.com/GenesisAeon/arctic-climate-utac)
(P127) and
[`antarctic-ice-shelf-utac`](https://github.com/GenesisAeon/antarctic-ice-shelf-utac)
(P120), built from the same published constants. **Deliberately has no
UTAC/CREP/AFET bridge** — see [DISCLAIMER.md](DISCLAIMER.md).

The interface is German. Numbers and citations stay in their original units.

## What's real here

* **Arctic sea-ice radiative effect** — Duspayev et al. (2024, *GRL*):
  Arctic SIRE averaged −0.64 to −0.86 W/m² (1980–2023), weakening ~25%
  since 1980. Cooling-power % loss is about **twice** the % loss in ice
  area in both hemispheres — remaining ice is itself becoming less
  reflective, not just shrinking.
* **Ice-albedo vs meltwater feedback** — Zhang et al. (2025, *The
  Cryosphere*): γ_IA = 0.41. The positive albedo feedback wins out
  roughly 2:1 over the competing negative meltwater feedback.
* **Antarctic sign flip** — Riihelä et al. (2021, *Nat. Geosci.*):
  −0.06 ± 0.02 W/m²/decade (1992–2015 expansion era) reversed to
  +0.26 W/m² (2016–2018 combined 3-year mean, Arctic + Antarctic).
  Explicitly **not** exposed-continental-rock albedo.

The sandbox places both poles side by side so the Antarctic can still
carry the opposite sign — which is the documented 1992–2015 case, not a
modelling choice.

## What the sliders do

Year (1980–2024) drives both ice extents from schematic curves
calibrated to those published anchors. Each hemisphere can be uncoupled
and dragged on its own. Live outputs: pack albedo, absorbed solar
(W/m²), SIRE (W/m²), and feedback strength (γ_IA in the Arctic; signed
Riihelä forcing in the Antarctic).

SIRE follows Duspayev's 2× rule: at 12.5% area loss, cooling power is
down 25% — the 2023 Arctic state in the UI.

## License

Code: MIT. Documentation/data notes: see [DISCLAIMER.md](DISCLAIMER.md).

## Citation

See [CITATION.cff](CITATION.cff).
