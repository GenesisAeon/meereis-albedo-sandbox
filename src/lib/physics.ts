/**
 * Sea-ice albedo sandbox, calibrated to published constants from
 * GenesisAeon arctic-climate-utac (P127) and antarctic-ice-shelf-utac (P120).
 *
 * Numbers are copied from those packages' constants.py — not invented.
 */

export const CITATIONS = {
  duspayev2024: {
    authors: "Duspayev, A., Flanner, M., Riihelä, A., et al.",
    year: 2024,
    title: "Earth's Sea Ice Radiative Effect From 1980 to 2023",
    journal: "Geophysical Research Letters",
    doi: "10.1029/2024GL109608",
  },
  zhang2025: {
    authors: "Zhang, H., Storto, A., Bai, X., Yang, C.",
    year: 2025,
    title:
      "Quantifying the interplay of sea ice meltwater and ice-albedo feedbacks in the Arctic ice-ocean system",
    journal: "The Cryosphere",
    volume: "19",
    doi: "10.5194/tc-19-6807-2025",
  },
  riihela2021: {
    authors: "Riihelä, A., Bright, R.M., Anttila, K.",
    year: 2021,
    title:
      "Recent strengthening of snow and ice albedo feedback driven by Antarctic sea-ice loss",
    journal: "Nature Geoscience",
    volume: "14",
    doi: "10.1038/s41561-021-00841-x",
  },
} as const;

/** Duspayev et al. 2024 — copied from arctic-climate-utac/constants.py */
export const ARCTIC_SIRE_RANGE = [-0.86, -0.64] as const;
export const ARCTIC_SIRE_WEAKENING_PCT = 25;
export const ANTARCTIC_SIRE_RANGE = [-0.98, -0.85] as const;
export const ANTARCTIC_FEEDBACK_BOOST_PCT = 40;
/** Cooling-power % loss is ~2× the area % loss in both hemispheres. */
export const COOLING_VS_AREA_RATIO = 2;

/** Zhang et al. 2025 — γ_IA = 0.41, albedo feedback ~2× competing meltwater feedback */
export const GAMMA_IA = 0.41;
export const ALBEDO_VS_MELTWATER_RATIO = 2;

/** Riihelä et al. 2021 — Antarctic sign flip */
export const ANTARCTIC_EXPANSION_FEEDBACK_W_M2_PER_DECADE = -0.06;
export const ANTARCTIC_EXPANSION_FEEDBACK_UNC = 0.02;
/** 2016–2018 combined Arctic+Antarctic 3-year mean, W/m² (not per decade). */
export const POST_REVERSAL_COMBINED_W_M2 = 0.26;
export const FEEDBACK_PCT_OF_CO2 = 10;

export const YEAR_MIN = 1980;
export const YEAR_MAX = 2024;

/**
 * Arctic annual-mean sea-ice extent (10⁶ km²), schematic reconstruction
 * calibrated so 1980 → 12.4 and 2023 → 10.85 (exactly 12.5 % area loss).
 * Duspayev: 25 % cooling-power loss at 2× the area loss ⇒ 12.5 % area loss.
 */
export const ARCTIC_ICE_1980 = 12.4;
export const ARCTIC_ICE_MIN = 0;
export const ARCTIC_ICE_MAX = 16;

/**
 * Antarctic annual-mean sea-ice extent (10⁶ km²). Expansion to a 2014 peak,
 * then the 2016 crash — the Riihelä sign-flip geometry.
 */
export const ANTARCTIC_ICE_1980 = 12.0;
export const ANTARCTIC_ICE_2014 = 12.85;
export const ANTARCTIC_ICE_2016 = 11.35;
export const ANTARCTIC_ICE_2023 = 10.4;
export const ANTARCTIC_ICE_MIN = 0;
export const ANTARCTIC_ICE_MAX = 15;

const ALPHA_OCEAN_ARCTIC = 0.07;
const ALPHA_OCEAN_ANTARCTIC = 0.08;
const ALPHA_ICE_ARCTIC_1980 = 0.65;
const ALPHA_ICE_ANTARCTIC_1980 = 0.78;
const ALPHA_ICE_DEGRADED_DELTA = 0.22;

/** Representative all-sky surface SW, polar ocean, annual mean (W/m²). */
const INCOMING_ARCTIC = 112;
const INCOMING_ANTARCTIC = 118;

/** Polar ocean used to convert extent → ice fraction of the disc. */
export const ARCTIC_OCEAN_MKM2 = 15.6;
export const ANTARCTIC_SEA_ICE_ZONE_MKM2 = 18.0;

/**
 * 1980 SIRE chosen so the 1980–2023 average sits in Duspayev's published
 * range once cooling has weakened 25 % by 2023.
 * Linear mean of SIRE_1980 and 0.75·SIRE_1980 is 0.875·SIRE_1980.
 * 0.875 · −0.857 ≈ −0.75, midpoint of (−0.86, −0.64).
 */
const ARCTIC_SIRE_1980 = -0.857;
const ANTARCTIC_SIRE_1980 = -0.95;

export type Sign = "cooling" | "warming" | "transitional";

export type HemisphereId = "arctic" | "antarctic";

export type HemisphereState = {
  id: HemisphereId;
  iceMkm2: number;
  iceRel1980: number;
  iceFraction: number;
  iceAlbedo: number;
  packAlbedo: number;
  absorbedWm2: number;
  sireWm2: number;
  coolingLossPct: number;
  gammaEffective: number;
  sign: Sign;
  /** Live feedback forcing vs the hemisphere's strongest-cooling reference. */
  deltaFWm2: number;
};

export function clamp(n: number, lo: number, hi: number): number {
  return Math.min(hi, Math.max(lo, n));
}

export function arcticIceAt(year: number): number {
  const y = clamp(year, YEAR_MIN, YEAR_MAX);
  const t = (y - 1980) / 43;
  return ARCTIC_ICE_1980 * (1 - 0.125 * t);
}

export function antarcticIceAt(year: number): number {
  const y = clamp(year, YEAR_MIN, YEAR_MAX);
  if (y <= 2014) {
    return ANTARCTIC_ICE_1980 + ((ANTARCTIC_ICE_2014 - ANTARCTIC_ICE_1980) * (y - 1980)) / 34;
  }
  if (y <= 2016) {
    return ANTARCTIC_ICE_2014 + ((ANTARCTIC_ICE_2016 - ANTARCTIC_ICE_2014) * (y - 2014)) / 2;
  }
  return ANTARCTIC_ICE_2016 + ((ANTARCTIC_ICE_2023 - ANTARCTIC_ICE_2016) * (y - 2016)) / 7;
}

function iceAlbedo(alpha0: number, iceRel: number): number {
  const health = clamp(iceRel, 0, 1);
  return alpha0 - ALPHA_ICE_DEGRADED_DELTA * (1 - health);
}

/**
 * SIRE scales as area × remaining-ice contrast. Near the observed range
 * that product is ~iceRel², i.e. cooling-power % loss ≈ 2 × area % loss
 * (Duspayev et al. 2024, both hemispheres).
 *
 * Equivalent linear form: 2·iceRel − 1, clamped to [0, 2].
 * At iceRel = 0.875 → 0.75, i.e. exactly the published 25 % weakening.
 */
function sireFromIceRel(sire1980: number, iceRel: number): number {
  const factor = clamp(2 * iceRel - 1, 0, 2);
  return sire1980 * factor;
}

function arcticSign(ice: number): Sign {
  if (ice > ARCTIC_ICE_1980 + 0.15) return "cooling";
  if (ice < ARCTIC_ICE_1980 - 0.15) return "warming";
  return "transitional";
}

function antarcticSign(ice: number): Sign {
  if (ice >= 12.6) return "cooling";
  if (ice <= 11.8) return "warming";
  return "transitional";
}

export function evaluateArctic(iceMkm2: number): HemisphereState {
  const ice = clamp(iceMkm2, ARCTIC_ICE_MIN, ARCTIC_ICE_MAX);
  const iceRel = ice / ARCTIC_ICE_1980;
  const iceFraction = clamp(ice / ARCTIC_OCEAN_MKM2, 0, 1);
  const aIce = iceAlbedo(ALPHA_ICE_ARCTIC_1980, iceRel);
  const packAlbedo = iceFraction * aIce + (1 - iceFraction) * ALPHA_OCEAN_ARCTIC;
  const sireWm2 = sireFromIceRel(ARCTIC_SIRE_1980, iceRel);
  const coolingLossPct = (1 - sireWm2 / ARCTIC_SIRE_1980) * 100;
  const gammaEffective = GAMMA_IA * clamp(iceRel, 0, 1);

  return {
    id: "arctic",
    iceMkm2: ice,
    iceRel1980: iceRel,
    iceFraction,
    iceAlbedo: aIce,
    packAlbedo,
    absorbedWm2: INCOMING_ARCTIC * (1 - packAlbedo),
    sireWm2,
    coolingLossPct,
    gammaEffective,
    sign: arcticSign(ice),
    deltaFWm2: sireWm2 - ARCTIC_SIRE_1980,
  };
}

export function evaluateAntarctic(iceMkm2: number): HemisphereState {
  const ice = clamp(iceMkm2, ANTARCTIC_ICE_MIN, ANTARCTIC_ICE_MAX);
  const iceRel = ice / ANTARCTIC_ICE_1980;
  const iceFraction = clamp(ice / ANTARCTIC_SEA_ICE_ZONE_MKM2, 0, 1);
  const aIce = iceAlbedo(ALPHA_ICE_ANTARCTIC_1980, iceRel);
  const packAlbedo = iceFraction * aIce + (1 - iceFraction) * ALPHA_OCEAN_ANTARCTIC;
  const sireWm2 = sireFromIceRel(ANTARCTIC_SIRE_1980, iceRel);
  const coolingLossPct = (1 - sireWm2 / ANTARCTIC_SIRE_1980) * 100;

  return {
    id: "antarctic",
    iceMkm2: ice,
    iceRel1980: iceRel,
    iceFraction,
    iceAlbedo: aIce,
    packAlbedo,
    absorbedWm2: INCOMING_ANTARCTIC * (1 - packAlbedo),
    sireWm2,
    coolingLossPct,
    gammaEffective: 0,
    sign: antarcticSign(ice),
    deltaFWm2: sireWm2 - ANTARCTIC_SIRE_1980,
  };
}

export function sameSign(a: Sign, b: Sign): boolean {
  if (a === "transitional" || b === "transitional") return false;
  return a === b;
}

export type Thesis = {
  headline: string;
  body: string;
};

export function thesisFor(
  year: number,
  arctic: HemisphereState,
  antarctic: HemisphereState,
): Thesis {
  const shared = sameSign(arctic.sign, antarctic.sign);

  if (antarctic.sign === "cooling" && arctic.sign === "warming") {
    return {
      headline: "Gegensätzliche Vorzeichen",
      body: "Die Arktis nimmt bereits Wärme auf. Die Antarktis kühlt noch — Meereis expandiert, die Albedo-Rückkopplung trägt ein negatives Vorzeichen.",
    };
  }
  if (antarctic.sign === "transitional") {
    return {
      headline: "Kipppunkt",
      body: "Die antarktische Meereisdecke verlässt die Expansionsphase. Das Vorzeichen der Albedo-Rückkopplung kippt — 2016 ist der dokumentierte Umschlag.",
    };
  }
  if (antarctic.sign === "warming" && arctic.sign === "warming") {
    const loss = Math.round(arctic.coolingLossPct);
    return {
      headline: "Gleiches Vorzeichen — nach dem Umschlag",
      body:
        loss >= 20
          ? `Beide Polkappen wärmen. Arktische Kühlleistung rund ${loss} % unter 1980. Die Antarktis hat 2016 das Vorzeichen gewechselt.`
          : "Beide Polkappen wärmen. Die Antarktis hat das Vorzeichen gewechselt; sie verhält sich nicht mehr gegenläufig.",
    };
  }
  if (arctic.sign === "cooling" && antarctic.sign === "cooling") {
    return {
      headline: "Beide kühlen",
      body: "Mehr Meereis als 1980 in beiden Hemisphären. Historisch ist das für die Arktis ein Gedankenexperiment — für die Antarktis war es 1992–2015 die gemessene Realität.",
    };
  }
  return {
    headline: year >= 2016 ? "Nach 2016" : `Jahr ${year}`,
    body: shared
      ? "Beide Hemisphären tragen dasselbe Vorzeichen."
      : "Die Antarktis kann sich in die andere Richtung verhalten. Genau das ist der Punkt dieses Vergleichs.",
  };
}

export const YEAR_MARKERS: { year: number; label: string }[] = [
  { year: 1980, label: "1980" },
  { year: 1992, label: "1992" },
  { year: 2014, label: "2014" },
  { year: 2016, label: "2016" },
  { year: 2023, label: "2023" },
];

export const PRESETS: {
  year: number;
  label: string;
  hint: string;
}[] = [
  { year: 1980, label: "1980", hint: "Referenz" },
  { year: 2014, label: "2014", hint: "Expansion" },
  { year: 2016, label: "2016", hint: "Umschlag" },
  { year: 2023, label: "2023", hint: "Heute" },
];
