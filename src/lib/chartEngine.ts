import * as Astronomy from "astronomy-engine";
import type { CelestialPlacement, ChartData, House, ZodiacSign } from "../types";

export const ZODIAC_SIGNS: ZodiacSign[] = [
  { index: 0, name: "Aries", symbol: "♈︎", rayName: "Red Ray", rayColor: "#ef4444", rayEssence: "Initiation, courage, first-breath action" },
  { index: 1, name: "Taurus", symbol: "♉︎", rayName: "Orange Ray", rayColor: "#f97316", rayEssence: "Sensory stability, value, embodiment" },
  { index: 2, name: "Gemini", symbol: "♊︎", rayName: "Yellow Ray", rayColor: "#facc15", rayEssence: "Curiosity, cognition, language, connection" },
  { index: 3, name: "Cancer", symbol: "♋︎", rayName: "Green Ray", rayColor: "#22c55e", rayEssence: "Nurture, belonging, home-field devotion" },
  { index: 4, name: "Leo", symbol: "♌︎", rayName: "Turquoise Ray", rayColor: "#2dd4bf", rayEssence: "Radiance, heart-expression, creative fire" },
  { index: 5, name: "Virgo", symbol: "♍︎", rayName: "Blue Ray", rayColor: "#3b82f6", rayEssence: "Refinement, sacred craft, healing precision" },
  { index: 6, name: "Libra", symbol: "♎︎", rayName: "Indigo Ray", rayColor: "#6366f1", rayEssence: "Discernment, harmony, relational truth" },
  { index: 7, name: "Scorpio", symbol: "♏︎", rayName: "Violet Ray", rayColor: "#8b5cf6", rayEssence: "Depth, transmutation, shadow alchemy" },
  { index: 8, name: "Sagittarius", symbol: "♐︎", rayName: "Magenta Ray", rayColor: "#d946ef", rayEssence: "Expansion, meaning, horizon-seeking" },
  { index: 9, name: "Capricorn", symbol: "♑︎", rayName: "Omni / Carbon Ray", rayColor: "#0f0a0a", rayEssence: "Structure, legacy, sovereign discipline" },
  { index: 10, name: "Aquarius", symbol: "♒︎", rayName: "Elemental Ray", rayColor: "#a5f3fc", rayEssence: "Future codes, networks, innovation" },
  { index: 11, name: "Pisces", symbol: "♓︎", rayName: "Infinite of ALL Ray", rayColor: "#7dd3fc", rayEssence: "Mysticism, compassion, unity consciousness" },
];

const BODY_DEFINITIONS: { body: string; symbol: string; astronomyBody: Astronomy.Body }[] = [
  { body: "Sun", symbol: "☉", astronomyBody: Astronomy.Body.Sun },
  { body: "Moon", symbol: "☾", astronomyBody: Astronomy.Body.Moon },
  { body: "Mercury", symbol: "☿", astronomyBody: Astronomy.Body.Mercury },
  { body: "Venus", symbol: "♀", astronomyBody: Astronomy.Body.Venus },
  { body: "Mars", symbol: "♂", astronomyBody: Astronomy.Body.Mars },
  { body: "Jupiter", symbol: "♃", astronomyBody: Astronomy.Body.Jupiter },
  { body: "Saturn", symbol: "♄", astronomyBody: Astronomy.Body.Saturn },
  { body: "Uranus", symbol: "♅", astronomyBody: Astronomy.Body.Uranus },
  { body: "Neptune", symbol: "♆", astronomyBody: Astronomy.Body.Neptune },
  { body: "Pluto", symbol: "♇", astronomyBody: Astronomy.Body.Pluto },
];

const HOUSE_THEMES = [
  "Identity, Appearance",
  "Resources, Value",
  "Communication, Siblings",
  "Home, Roots, Lineage",
  "Creativity, Children, Joy",
  "Health, Routines, Service",
  "Partnerships, Marriage",
  "Transformation, Shared Resources",
  "Higher Learning, Travel, Faith",
  "Career, Public Standing",
  "Community, Hopes, Friends",
  "Retreat, Unconscious, Release",
];

export function normalizeDegrees(value: number): number {
  return ((value % 360) + 360) % 360;
}

export function zodiacFromLongitude(lon: number): CelestialPlacement {
  const normalized = normalizeDegrees(lon);
  let signIndex = Math.floor(normalized / 30) % 12;
  let degrees = normalized - signIndex * 30;
  let minutes = Math.round((degrees - Math.floor(degrees)) * 60);
  let degInt = Math.floor(degrees);

  if (minutes === 60) {
    minutes = 0;
    degInt += 1;
    if (degInt === 30) {
      degInt = 0;
      signIndex = (signIndex + 1) % 12;
    }
  }

  const sign = ZODIAC_SIGNS[signIndex];
  return {
    body: "",
    symbol: "",
    longitude: normalized,
    latitude: 0,
    signIndex,
    signName: sign.name,
    signSymbol: sign.symbol,
    degrees: degInt,
    minutes,
    rayName: sign.rayName,
    rayColor: sign.rayColor,
    rayEssence: sign.rayEssence,
  };
}

function wrapAngle(deg: number): number {
  let a = deg % 360;
  if (a < 0) a += 360;
  return a;
}

function apparentLST(date: Date, lonDeg: number): number {
  const time = Astronomy.MakeTime(date);
  const d = time.tt;
  const gmst = wrapAngle(280.46061837 + 360.98564736629 * d);
  return wrapAngle(gmst + lonDeg);
}

function obliquity(date: Date): number {
  const time = Astronomy.MakeTime(date);
  const T = time.tt / 36525.0;
  return (
    23.439291111 -
    0.013004167 * T -
    1.63889e-7 * T * T +
    5.03611e-7 * T * T * T
  );
}

function ascendantLon(latDeg: number, lstDeg: number, oblDeg: number): number {
  const lst = (lstDeg * Math.PI) / 180;
  const lat = (latDeg * Math.PI) / 180;
  const obl = (oblDeg * Math.PI) / 180;
  const y = Math.cos(lst);
  const x = -(Math.sin(lst) * Math.cos(obl) + Math.tan(lat) * Math.sin(obl));
  return wrapAngle((Math.atan2(y, x) * 180) / Math.PI);
}

function midheavenLon(lstDeg: number, oblDeg: number): number {
  const lst = (lstDeg * Math.PI) / 180;
  const obl = (oblDeg * Math.PI) / 180;
  const y = Math.tan(lst);
  const x = Math.cos(obl);
  return wrapAngle((Math.atan2(y, x) * 180) / Math.PI);
}

function calculateBodyPlacement(
  body: string,
  symbol: string,
  date: Date,
  lat: number,
  lon: number
): CelestialPlacement {
  const observer = new Astronomy.Observer(lat, lon, 0);
  const eq = Astronomy.Equator(
    BODY_DEFINITIONS.find((b) => b.body === body)?.astronomyBody ?? Astronomy.Body.Sun,
    Astronomy.MakeTime(date),
    observer,
    true,
    true
  );
  const ecl = Astronomy.Ecliptic(eq.vec);
  const zod = zodiacFromLongitude(ecl.elon);
  return {
    ...zod,
    body,
    symbol,
    latitude: ecl.elat,
    retrograde: false,
  };
}

export function buildChart(date: Date, lat: number, lon: number): ChartData {
  const lst = apparentLST(date, lon);
  const obl = obliquity(date);

  const asc = ascendantLon(lat, lst, obl);
  const desc = wrapAngle(asc + 180);
  const mc = midheavenLon(lst, obl);
  const ic = wrapAngle(mc + 180);

  const bodies = BODY_DEFINITIONS.map((def) =>
    calculateBodyPlacement(def.body, def.symbol, date, lat, lon)
  );

  // Whole Sign Houses
  const h1Sign = zodiacFromLongitude(asc).signIndex;
  const houses: House[] = Array.from({ length: 12 }, (_, i) => {
    const signIdx = (h1Sign + i) % 12;
    const sign = ZODIAC_SIGNS[signIdx];
    const cusp = zodiacFromLongitude(signIdx * 30);
    return {
      houseNumber: i + 1,
      theme: HOUSE_THEMES[i],
      cusp,
      rayName: sign.rayName,
      rayColor: sign.rayColor,
      rayEssence: sign.rayEssence,
    };
  });

  const ascZod = zodiacFromLongitude(asc);
  houses[0] = { ...houses[0], cusp: ascZod };

  return {
    ascendant: { ...zodiacFromLongitude(asc), body: "Ascendant", symbol: "ASC" },
    descendant: { ...zodiacFromLongitude(desc), body: "Descendant", symbol: "DSC" },
    midheaven: { ...zodiacFromLongitude(mc), body: "Midheaven", symbol: "MC" },
    ic: { ...zodiacFromLongitude(ic), body: "IC", symbol: "IC" },
    bodies,
    houses,
    calculatedAt: new Date().toISOString(),
  };
}

export function makeBirthDateUTC(
  year: number,
  month: number,
  day: number,
  hour: number,
  minute: number,
  timezoneOffset: number = 0
): Date {
  const localMinutes = hour * 60 + minute;
  const utcMinutes = localMinutes - timezoneOffset;
  const utcHour = Math.floor(utcMinutes / 60);
  const utcMinute = utcMinutes % 60;
  return new Date(Date.UTC(year, month, day, utcHour, utcMinute, 0));
}

export function buildNatalChart(
  year: number,
  month: number,
  day: number,
  hour: number,
  minute: number,
  timezoneOffset: number,
  lat: number,
  lon: number
): ChartData {
  const date = makeBirthDateUTC(year, month, day, hour, minute, timezoneOffset);
  return buildChart(date, lat, lon);
}

export function buildLiveChart(lat: number, lon: number): ChartData {
  return buildChart(new Date(), lat, lon);
}
