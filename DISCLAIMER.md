# Disclaimer

This repository is an interactive sandbox for published sea-ice albedo
numbers. It is **not** a climate model, a forecast, or a reanalysis.

## No UTAC / CREP / AFET bridge

Like its sibling packages `arctic-climate-utac` (P127) and
`antarctic-ice-shelf-utac` (P120), this sandbox deliberately contains
**no** UTAC, CREP, or AFET coupling. The cryosphere literature stands on
its own.

## What is measured vs. what is schematic

Copied from the sibling packages' `constants.py` (independently verified
there, 2026-09-03):

| Quantity | Value | Source |
| --- | --- | --- |
| Arctic SIRE, 1980–2023 | −0.64 to −0.86 W/m² | Duspayev et al. 2024, *GRL* |
| Arctic cooling-power weakening since 1980 | ~25% | Duspayev et al. 2024 |
| Cooling-power % loss vs area % loss | ~2×, both hemispheres | Duspayev et al. 2024 |
| Ice-albedo feedback factor γ_IA | 0.41 | Zhang et al. 2025, *The Cryosphere* |
| Albedo vs meltwater feedback ratio | ~2:1 | Zhang et al. 2025 |
| Antarctic expansion-era feedback | −0.06 ± 0.02 W/m²/decade (1992–2015) | Riihelä et al. 2021, *Nat. Geosci.* |
| Post-reversal combined feedback | +0.26 W/m² (2016–2018, both poles) | Riihelä et al. 2021 |

Ice-extent *time series* in the year slider are schematic reconstructions
calibrated to those anchors (Arctic 12.5% area loss by 2023; Antarctic
2014 peak then 2016 crash). They are **not** NSIDC or OSI-SAF satellite
extents.

SIRE as a function of the ice slider uses the 2× area-loss rule
(`SIRE / SIRE_1980 = clamp(2 · iceRel − 1, 0, 2)`), pinned to Duspayev's
1980 and 2023 Arctic values. It is a sandbox identity, not a radiative
transfer calculation.

Pack albedo uses representative ice/ocean albedos and polar-ocean
incoming SW to show direction and contrast, not a grid-cell energy
budget.

The +0.26 W/m² figure is a combined Arctic+Antarctic 3-year mean. The
−0.06 W/m²/decade figure is an Antarctic expansion-era trend. They are
different quantities; the UI keeps the units.

## What we do not claim

- That dragging a slider produces a physically complete polar climate.
- That exposed-continental-rock albedo is a quantified Antarctic
  mechanism (searched for in P120; not found).
- Any UTAC / CREP / AFET implication.
