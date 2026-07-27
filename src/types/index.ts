export interface ZodiacSign {
  index: number;
  name: string;
  symbol: string;
  rayName: string;
  rayColor: string;
  rayEssence: string;
}

export interface CelestialBody {
  body: string;
  symbol: string;
}

export interface CelestialPlacement {
  body: string;
  symbol: string;
  longitude: number;
  latitude: number;
  signIndex: number;
  signName: string;
  signSymbol: string;
  degrees: number;
  minutes: number;
  rayName: string;
  rayColor: string;
  rayEssence: string;
  houseNumber?: number;
  retrograde?: boolean;
}

export interface House {
  houseNumber: number;
  theme: string;
  cusp: CelestialPlacement;
  rayName: string;
  rayColor: string;
  rayEssence: string;
}

export interface ChartData {
  ascendant: CelestialPlacement;
  descendant: CelestialPlacement;
  midheaven: CelestialPlacement;
  ic: CelestialPlacement;
  bodies: CelestialPlacement[];
  houses: House[];
  calculatedAt: string;
}

export interface AspectResult {
  id: string;
  bodyA: string;
  bodyB: string;
  symbolA: string;
  symbolB: string;
  signA: number;
  signB: number;
  signNameA: string;
  signNameB: string;
  longitudeA: number;
  longitudeB: number;
  aspectType: AspectType;
  separation: number;
  exactAngle: number;
  orb: number;
  strength: number;
  rayA: string;
  rayB: string;
  rayColorA: string;
  rayColorB: string;
  interpretation: string;
}

export type AspectType = "conjunction" | "trine" | "square" | "opposition";

export interface BeingProfile {
  id: string;
  syncId: string;
  name: string;
  birthDate: string;
  birthTime: string;
  birthTimezoneOffset: number;
  birthTimezoneOffsetStandard: number;
  birthTimeAccurateDST: boolean;
  birthTimezoneLabel?: string;
  birthLat: number;
  birthLon: number;
  birthPlaceLabel: string;
  photoUri?: string;
  notes: string;
  privacyLevel: "private" | "shared" | "public";
  createdAt: string;
  updatedAt: string;
  version: number;
  natalChart?: ChartData;
}

export interface SynastryReading {
  id: string;
  profileAId: string;
  profileBId: string;
  calculatedAt: string;
  aspects: AspectResult[];
  dominantRay: string;
  dominantRayColor: string;
  summary: string;
  harmonyScore: number;
  tensionScore: number;
  compositeRay: string;
}

export interface AppSettings {
  defaultOrb: number;
  luminariesExtraOrb: boolean;
  theme: "dark" | "light" | "atlas";
  hasCompletedOnboarding: boolean;
}
