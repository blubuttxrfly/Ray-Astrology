import type { AspectResult, CelestialPlacement } from "../types";
import { ZODIAC_SIGNS } from "./chartEngine";

export const ASPECT_DEFINITIONS = [
  { type: "conjunction" as const, exactAngle: 0, orb: 8 },
  { type: "trine" as const, exactAngle: 120, orb: 8 },
  { type: "square" as const, exactAngle: 90, orb: 8 },
  { type: "opposition" as const, exactAngle: 180, orb: 8 },
];

export function angularSeparation(lonA: number, lonB: number): number {
  const diff = Math.abs(lonA - lonB);
  return Math.min(diff, 360 - diff);
}

export function calculateAspectStrength(diffFromExact: number, orb: number): number {
  return Math.max(0, 1 - diffFromExact / orb);
}

export function detectAspect(
  lonA: number,
  lonB: number,
  customOrb?: number
): Pick<AspectResult, "aspectType" | "exactAngle" | "separation" | "orb" | "strength"> | null {
  const separation = angularSeparation(lonA, lonB);
  let bestMatch: (typeof ASPECT_DEFINITIONS)[number] | null = null;
  let bestDiff = Infinity;

  for (const def of ASPECT_DEFINITIONS) {
    const diffFromExact = Math.abs(separation - def.exactAngle);
    const effectiveOrb = customOrb ?? def.orb;
    if (diffFromExact <= effectiveOrb && diffFromExact < bestDiff) {
      bestDiff = diffFromExact;
      bestMatch = def;
    }
  }

  if (!bestMatch) return null;

  return {
    aspectType: bestMatch.type,
    exactAngle: bestMatch.exactAngle,
    separation,
    orb: customOrb ?? bestMatch.orb,
    strength: calculateAspectStrength(bestDiff, customOrb ?? bestMatch.orb),
  };
}

export function generateInterpretation(
  bodyA: string,
  signNameA: string,
  rayA: string,
  rayEssenceA: string,
  bodyB: string,
  signNameB: string,
  rayB: string,
  rayEssenceB: string,
  aspectType: string,
  strength: number
): string {
  let template = "";

  switch (aspectType) {
    case "conjunction":
      template = `${bodyA} in ${signNameA} merges with ${bodyB} in ${signNameB}. The ${rayA} and ${rayB} frequencies fuse into a single chord, amplifying both ${rayEssenceA} and ${rayEssenceB}.`;
      break;
    case "trine":
      template = `${bodyA} in ${signNameA} flows in harmony with ${bodyB} in ${signNameB}. The ${rayA} and ${rayB} sing in unison, gifting ${rayEssenceB} to ${rayEssenceA} with effortless grace.`;
      break;
    case "square":
      template = `${bodyA} in ${signNameA} presses against ${bodyB} in ${signNameB}. The ${rayA} and ${rayB} create a sacred friction that demands growth, where ${rayEssenceA} meets ${rayEssenceB} at the edge of transformation.`;
      break;
    case "opposition":
      template = `${bodyA} in ${signNameA} mirrors ${bodyB} in ${signNameB}. The ${rayA} and ${rayB} stand as polar complements, inviting the integration of ${rayEssenceA} with ${rayEssenceB}.`;
      break;
  }

  if (strength > 0.85) {
    template += " This is an exact and dominant theme.";
  } else if (strength < 0.3) {
    template += " This is a subtle influence, often felt only when activated by transits.";
  }

  return template;
}

export function calculateAspects(
  placementsA: CelestialPlacement[],
  placementsB: CelestialPlacement[],
  orb: number = 8,
  options: { luminariesExtraOrb?: boolean } = {}
): AspectResult[] {
  const aspects: AspectResult[] = [];
  const seen = new Set<string>();

  for (const a of placementsA) {
    for (const b of placementsB) {
      // Skip self-comparison when comparing a chart to itself
      if (a.body === b.body && placementsA === placementsB) continue;

      const pairId = [a.body, b.body].sort().join("-");
      if (seen.has(pairId) && placementsA === placementsB) continue;
      seen.add(pairId);

      let effectiveOrb = orb;
      if (options.luminariesExtraOrb) {
        const luminaries = ["Sun", "Moon"];
        if (luminaries.includes(a.body) || luminaries.includes(b.body)) {
          effectiveOrb += 2;
        }
      }

      const match = detectAspect(a.longitude, b.longitude, effectiveOrb);
      if (!match) continue;

      const signA = ZODIAC_SIGNS[a.signIndex];
      const signB = ZODIAC_SIGNS[b.signIndex];

      aspects.push({
        id: `${a.body}-${b.body}-${match.aspectType}`,
        bodyA: a.body,
        bodyB: b.body,
        symbolA: a.symbol,
        symbolB: b.symbol,
        signA: a.signIndex,
        signB: b.signIndex,
        signNameA: a.signName,
        signNameB: b.signName,
        longitudeA: a.longitude,
        longitudeB: b.longitude,
        aspectType: match.aspectType,
        separation: match.separation,
        exactAngle: match.exactAngle,
        orb: match.orb,
        strength: match.strength,
        rayA: signA.rayName,
        rayB: signB.rayName,
        rayColorA: signA.rayColor,
        rayColorB: signB.rayColor,
        interpretation: generateInterpretation(
          a.body,
          a.signName,
          signA.rayName,
          a.rayEssence,
          b.body,
          b.signName,
          signB.rayName,
          b.rayEssence,
          match.aspectType,
          match.strength
        ),
      });
    }
  }

  return aspects.sort((x, y) => y.strength - x.strength);
}

export function generateSynastrySummary(aspects: AspectResult[]): {
  dominantRay: string;
  dominantRayColor: string;
  compositeRay: string;
  summary: string;
  harmonyScore: number;
  tensionScore: number;
} {
  if (aspects.length === 0) {
    return {
      dominantRay: "Infinite of ALL Ray",
      dominantRayColor: "#7dd3fc",
      compositeRay: "Infinite of ALL Ray",
      summary:
        "These two beings move in parallel frequencies without strong angular resonance. Their connection invites patience, presence, and the discovery of subtler harmonies over time.",
      harmonyScore: 50,
      tensionScore: 50,
    };
  }

  const counts = { conjunction: 0, trine: 0, square: 0, opposition: 0 };
  const rayStrengths: Record<string, number> = {};

  for (const aspect of aspects) {
    counts[aspect.aspectType] = (counts[aspect.aspectType] || 0) + 1;
    rayStrengths[aspect.rayA] = (rayStrengths[aspect.rayA] || 0) + aspect.strength;
    rayStrengths[aspect.rayB] = (rayStrengths[aspect.rayB] || 0) + aspect.strength;
  }

  const sortedRays = Object.entries(rayStrengths).sort((a, b) => b[1] - a[1]);
  const dominantRay = sortedRays[0]?.[0] ?? "Infinite of ALL Ray";
  const dominantRayColor = ZODIAC_SIGNS.find((z) => z.rayName === dominantRay)?.rayColor ?? "#7dd3fc";
  const compositeRay = dominantRay;

  const strongest = aspects[0];
  let summary = `This synastry holds ${counts.conjunction} conjunction${counts.conjunction !== 1 ? "s" : ""}, ${counts.trine} trine${counts.trine !== 1 ? "s" : ""}, ${counts.square} square${counts.square !== 1 ? "s" : ""}, and ${counts.opposition} opposition${counts.opposition !== 1 ? "s" : ""}. `;

  summary += `The most potent connection is a ${strongest.aspectType} between ${strongest.bodyA} and ${strongest.bodyB}, carrying the ${dominantRay} frequency. `;

  if (counts.trine > counts.square) {
    summary += `Harmony flows more naturally than tension between these beings, suggesting an ease of connection that invites deep trust.`;
  } else if (counts.square > counts.trine) {
    summary += `Growth arises through challenge more than ease, suggesting a relationship that catalyzes transformation for both beings.`;
  } else {
    summary += `Balance prevails between harmony and tension, offering both comfort and growth in equal measure.`;
  }

  const totalWeighted = aspects.reduce((sum, a) => sum + a.strength, 0);
  const harmonyWeighted = aspects
    .filter((a) => a.aspectType === "trine" || a.aspectType === "conjunction")
    .reduce((sum, a) => sum + a.strength, 0);
  const tensionWeighted = aspects
    .filter((a) => a.aspectType === "square" || a.aspectType === "opposition")
    .reduce((sum, a) => sum + a.strength, 0);

  const harmonyScore = totalWeighted > 0 ? Math.round((harmonyWeighted / totalWeighted) * 100) : 50;
  const tensionScore = totalWeighted > 0 ? Math.round((tensionWeighted / totalWeighted) * 100) : 50;

  return {
    dominantRay,
    dominantRayColor,
    compositeRay,
    summary,
    harmonyScore,
    tensionScore,
  };
}

export function calculateSynastry(
  chartA: CelestialPlacement[],
  chartB: CelestialPlacement[],
  orb: number = 8,
  options?: { luminariesExtraOrb?: boolean }
) {
  const aspects = calculateAspects(chartA, chartB, orb, options);
  const summary = generateSynastrySummary(aspects);
  return { aspects, ...summary };
}
