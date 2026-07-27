# Aspect Algorithm — Detailed Specification 🌈

The mathematical heart of Ray Astrology. This document defines how aspects are calculated, scored, and interpreted.

---

## 1. The Core Problem

Given two sets of celestial placements (e.g., two natal charts, or one natal chart and current transits), find all pairs of bodies that form significant angular relationships according to the rules of astrology.

---

## 2. Aspect Definitions

An aspect is defined by its **exact angle** and its **allowable orb**.

| Aspect | Exact Angle | Orb (default) | Quality |
|--------|------------|---------------|---------|
| Conjunction | 0° | ±8° | Amplification |
| Sextile | 60° | ±6° | Opportunity |
| Square | 90° | ±8° | Tension |
| Trine | 120° | ±8° | Flow |
| Quincunx | 150° | ±4° | Adjustment |
| Opposition | 180° | ±8° | Mirror |

**Phase 1 major aspects:** Conjunction, Trine, Square, Opposition.

**Phase 2+ additions:** Sextile, Quincunx, Semi-sextile (30°).

---

## 3. Angular Separation Calculation

Given two longitudes `lonA` and `lonB` (both in degrees, 0–360):

```typescript
function angularSeparation(lonA: number, lonB: number): number {
  const diff = Math.abs(lonA - lonB);
  return Math.min(diff, 360 - diff);
}
```

This always returns the **shorter arc** between the two points, which is what matters for aspect detection.

---

## 4. Aspect Detection Algorithm

For each pair of bodies, calculate the angular separation and check if it falls within any aspect's orb.

```typescript
interface AspectDefinition {
  type: string;
  exactAngle: number;
  orb: number;
}

const ASPECT_DEFINITIONS: AspectDefinition[] = [
  { type: "conjunction", exactAngle: 0, orb: 8 },
  { type: "trine", exactAngle: 120, orb: 8 },
  { type: "square", exactAngle: 90, orb: 8 },
  { type: "opposition", exactAngle: 180, orb: 8 },
];

function detectAspect(
  lonA: number,
  lonB: number,
  definitions: AspectDefinition[] = ASPECT_DEFINITIONS
): AspectMatch | null {
  const separation = angularSeparation(lonA, lonB);

  for (const def of definitions) {
    const diffFromExact = Math.abs(separation - def.exactAngle);
    if (diffFromExact <= def.orb) {
      return {
        aspectType: def.type,
        exactAngle: def.exactAngle,
        separation,
        diffFromExact,
        orb: def.orb,
      };
    }
  }

  return null;
}
```

**Important:** A pair of bodies can match at most ONE aspect. If two aspects overlap in orb (rare but possible with generous orbs), the **closest to exact** wins.

---

## 5. Aspect Strength Calculation

The strength of an aspect measures how close it is to being exact. A perfect conjunction (0° from exact) is strength 1.0. A conjunction at 7.5° is barely active.

```typescript
function calculateAspectStrength(diffFromExact: number, orb: number): number {
  // Linear falloff from exact to orb edge
  return Math.max(0, 1 - diffFromExact / orb);
}
```

**Strength interpretation:**

| Strength | Meaning |
|----------|---------|
| 0.90 – 1.00 | Exact — the aspect is a dominant theme, impossible to ignore |
| 0.75 – 0.89 | Strong — a clear and persistent influence |
| 0.50 – 0.74 | Moderate — present and felt, but not overwhelming |
| 0.25 – 0.49 | Weak — subtle background influence, activated by transits |
| 0.00 – 0.24 | Fading — barely within orb, more potential than actuality |

---

## 6. Applying Orb Modifiers

The default orb can be adjusted based on:

- **Body importance:** Sun and Moon get larger orbs (+2°), outer planets get smaller (-2°)
- **Aspect type:** Conjunctions and oppositions get slightly larger orbs than trines and squares
- **User preference:** Some beings prefer tighter orbs (6°) for sharper readings

```typescript
function getEffectiveOrb(
  bodyA: string,
  bodyB: string,
  aspectType: string,
  baseOrb: number = 8
): number {
  let orb = baseOrb;

  // Luminaries get wider orbs
  const luminaries = ["Sun", "Moon"];
  if (luminaries.includes(bodyA) || luminaries.includes(bodyB)) {
    orb += 2;
  }

  // Conjunction and opposition are more significant
  if (aspectType === "conjunction" || aspectType === "opposition") {
    orb += 1;
  }

  return orb;
}
```

---

## 7. Synastry Calculation (Natal-to-Natal)

Given two Being Profiles, calculate all aspects between their natal charts.

**Bodies to compare:**

| Body | Symbol | Significance |
|------|--------|--------------|
| Sun | ☉ | Core identity, life force |
| Moon | ☾ | Emotional body, instincts |
| Mercury | ☿ | Mind, communication |
| Venus | ♀ | Love, values, beauty |
| Mars | ♂ | Action, desire, will |
| Jupiter | ♃ | Expansion, luck, growth |
| Saturn | ♄ | Structure, limits, karma |
| Uranus | ♅ | Innovation, disruption |
| Neptune | ♆ | Dreams, illusion, spirituality |
| Pluto | ♇ | Transformation, power |
| Ascendant | ASC | Mask, approach to life |
| Midheaven | MC | Career, public destiny |

**Algorithm:**
1. Calculate natal chart for Being A → placements array
2. Calculate natal chart for Being B → placements array
3. For each body in A, compare to each body in B
4. Detect aspects using `detectAspect()`
5. Calculate strength using `calculateAspectStrength()`
6. Sort all results by strength descending
7. Group by aspect type for presentation

---

## 8. Transit Calculation (Current Sky to Natal)

Given a Being Profile and a date, calculate all aspects between current planet positions and natal positions.

**Current bodies to track:** Sun, Moon, Mercury, Venus, Mars, Jupiter, Saturn, Uranus, Neptune, Pluto.

**Algorithm:**
1. Calculate natal chart (static)
2. Calculate current chart for the given date
3. Compare each current body to each natal body
4. Detect aspects using the same algorithm
5. Filter by meaningful strength threshold (e.g., > 0.3)
6. Sort by activation date for timeline view

---

## 9. Ray-Inflected Interpretation Generation

Every aspect gains meaning from the Rays of the two signs involved.

```typescript
function generateInterpretation(
  bodyA: string,
  signA: ZodiacSign,
  bodyB: string,
  signB: ZodiacSign,
  aspectType: string,
  strength: number
): string {
  const rayA = ZODIAC_RAY_NAMES[signA.index];
  const rayB = ZODIAC_RAY_NAMES[signB.index];
  const essenceA = ZODIAC_RAY_ESSENCE[signA.index];
  const essenceB = ZODIAC_RAY_ESSENCE[signB.index];

  let template = "";

  switch (aspectType) {
    case "conjunction":
      template = `${bodyA} in ${signA.name} merges with ${bodyB} in ${signB.name}. The ${rayA} and ${rayB} frequencies fuse into a single chord, amplifying both ${essenceA} and ${essenceB}.`;
      break;
    case "trine":
      template = `${bodyA} in ${signA.name} flows in harmony with ${bodyB} in ${signB.name}. The ${rayA} and ${rayB} sing in unison, gifting ${essenceB} to ${essenceA} with effortless grace.`;
      break;
    case "square":
      template = `${bodyA} in ${signA.name} presses against ${bodyB} in ${signB.name}. The ${rayA} and ${rayB} create a sacred friction that demands growth, where ${essenceA} meets ${essenceB} at the edge of transformation.`;
      break;
    case "opposition":
      template = `${bodyA} in ${signA.name} mirrors ${bodyB} in ${signB.name}. The ${rayA} and ${rayB} stand as polar complements, inviting the integration of ${essenceA} with ${essenceB}.`;
      break;
  }

  if (strength > 0.85) {
    template += " This is an exact and dominant theme.";
  } else if (strength < 0.3) {
    template += " This is a subtle influence, often felt only when activated by transits.";
  }

  return template;
}
```

---

## 10. Composite Summary Generation

After all aspects are calculated, generate an overall narrative:

```typescript
function generateSynastrySummary(aspects: AspectResult[]): string {
  const conjunctions = aspects.filter(a => a.aspectType === "conjunction");
  const trines = aspects.filter(a => a.aspectType === "trine");
  const squares = aspects.filter(a => a.aspectType === "square");
  const oppositions = aspects.filter(a => a.aspectType === "opposition");

  const strongest = aspects[0]; // already sorted by strength
  const dominantRay = calculateDominantRay(aspects);

  let summary = `This synastry holds ${conjunctions.length} conjunction${conjunctions.length !== 1 ? 's' : ''}, ${trines.length} trine${trines.length !== 1 ? 's' : ''}, ${squares.length} square${squares.length !== 1 ? 's' : ''}, and ${oppositions.length} opposition${oppositions.length !== 1 ? 's' : ''}. `;

  summary += `The most potent connection is a ${strongest.aspectType} between ${strongest.bodyA} and ${strongest.bodyB}, carrying the ${dominantRay} frequency. `;

  if (trines.length > squares.length) {
    summary += `Harmony flows more naturally than tension between these beings, suggesting an ease of connection that invites deep trust.`;
  } else if (squares.length > trines.length) {
    summary += `Growth arises through challenge more than ease, suggesting a relationship that catalyzes transformation for both beings.`;
  } else {
    summary += `Balance prevails between harmony and tension, offering both comfort and growth in equal measure.`;
  }

  return summary;
}
```

---

## 11. Performance Considerations

- **Comparison count:** For two full charts (12 bodies each), the naive algorithm does 144 comparisons.
- **Optimization:** Pre-filter by sign — bodies in signs more than 3 signs apart (90°+) cannot form conjunctions or trines, reducing comparisons.
- **Caching:** Natal charts never change — cache all aspect calculations for quick re-access.
- **Incremental:** Transit calculations only need to update for the current date, not recompute natal charts.

---

## 12. Mathematical Verification

The aspect algorithm is deterministic and testable. Key test cases:

| lonA | lonB | Expected Separation | Expected Aspect |
|------|------|-------------------|----------------|
| 15° | 20° | 5° | Conjunction (strength 0.375) |
| 15° | 135° | 120° | Trine (exact, strength 1.0) |
| 15° | 105° | 90° | Square (exact, strength 1.0) |
| 15° | 195° | 180° | Opposition (exact, strength 1.0) |
| 15° | 100° | 85° | No aspect (85° > 8° orb for any) |
| 350° | 10° | 20° | 20° — no aspect |

---

*This algorithm is the beating heart of Ray Astrology. Every connection between beings passes through these calculations before it is translated into Heartlight language.* 🌈
