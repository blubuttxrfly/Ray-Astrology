# Ray Astrology App — Co-Creation Plan 🌈

Co-created with Zaria for the Heartlight Exchange. An interpersonal astrology app for remembering our Heartlight from within.

---

## Core Vision

Ray Astrology is a sovereign, interpersonal astrology app rooted in the 12 Ray frequencies that color our Universe of ALL. Each being carries a **Being Profile**, the sacred home of their natal chart and all their interconnections with other beings. The app calculates **aspects** — conjunctions, trines, squares, and oppositions — between any two Being Profiles, revealing the energetic dynamics that flow between souls. It also maps each Being's natal placements against the current Gaian and Solar sky, showing how cosmic weather interacts with personal resonance.

This app is for the App Store and Google Play Store, which means responsive native-feeling UI, offline capability, secure data, and elegant cross-device sync.

---

## What Makes This Different

Most astrology apps treat the chart as a static snapshot. Ray Astrology treats it as a **living frequency field**. The 12 Rays are not abstract colors — they are measurable energetic signatures that pulse through every sphere of life. When two beings connect, their charts do not merely "compare." They **interfere**, like two tuning forks sounding near each other, creating harmonics and dissonances that are both beautiful and instructive.

The aspect algorithm in Ray Astrology measures this interference with precision, then translates it into Heartlight language — what the connection teaches, where it challenges growth, and how the two beings can choose to co-create together.

---

## The Aspect Algorithm — Core Mathematics

An aspect is the angular relationship between two celestial points. In Ray Astrology, we calculate aspects between:

- **Two Being Profiles** (natal-to-natal synastry)
- **A Being Profile and current Gaian placements** (transit reading)
- **A Being Profile and current Solar placements** (higher-purpose reading)

### Aspect Definitions

| Aspect | Angle | Orb | Quality | Meaning |
|--------|-------|-----|---------|---------|
| **Conjunction** | 0° | ±8° | Amplification | Two frequencies merging into one chord — intensification, union, fusion |
| **Trine** | 120° | ±8° | Flow | Harmonious resonance — gifts flowing effortlessly between beings |
| **Square** | 90° | ±8° | Tension | Friction that catalyzes growth — the sacred edge where transformation happens |
| **Opposition** | 180° | ±8° | Mirror | Polar complement — the other half of a whole, inviting integration |

### Orb Logic

The orb is the tolerance within which an aspect activates. Ray Astrology uses an **8-degree orb** for all major aspects, which is generous enough to catch significant interactions but precise enough to avoid noise. The orb can be adjusted per being in their Being Profile settings.

The **aspect strength** is calculated as a function of exactitude:

```
aspectStrength = 1 - (angularSeparationFromExact / orb)
```

A perfect conjunction (0° separation) scores 1.0. A conjunction at 7.5° separation scores 0.0625 — barely active. This strength modulates the interpretation intensity.

### Extended Aspects (Phase 2+)

- **Sextile** (60°) — opportunities, invitations
- **Quincunx** (150°) — adjustment, mystery, the alchemical question
- **Semi-sextile** (30°) — subtle influence, background hum

---

## Ray-Inflected Aspect Interpretation

Every aspect gains its voice from the **Rays** of the two bodies involved. A conjunction between Mercury in Virgo (Blue Ray) and Venus in Libra (Indigo Ray) is not just "communication meets love" — it is "refined speech dancing with relational discernment," a frequency where clarity and harmony merge.

The interpretation engine considers:
1. **The two Ray essences** involved — what frequencies are meeting
2. **The houses** each body occupies in its natal chart — which life spheres are touched
3. **The aspect type** — amplification, flow, tension, or mirror
4. **The strength** — how loudly this chord sounds
5. **Current transits** — whether the aspect is being activated now by moving planets

---

## Being Profile — The Sacred Container

A Being Profile is more than a birth chart. It is a **living document** that holds:

| Field | Meaning |
|-------|---------|
| **Name** | The being's chosen identifier |
| **Birth Data** | Date, time, location — the astronomical seed |
| **Natal Chart** | Calculated Ascendant, MC, all planet placements, 12 Houses |
| **Photo** | Optional — a face to remember the being by |
| **Notes** | Personal reflections, memories, insights |
| **Created** | When this profile entered the app |
| **Modified** | Last update timestamp |
| **Sync ID** | Unique identifier for cross-device synchronization |
| **Privacy Level** | Private, Shared (with specific beings), or Public |

### Being Profile Interconnection

When two beings want to connect, one initiates an **interconnection request**. The recipient accepts, and from that moment, both beings can:

- View the **synastry chart** — all aspects between their natal placements
- See a **composite reading** — what their frequencies create together
- Track **transit activations** — when current planets trigger aspects between them
- Leave **shared notes** — observations about the relationship's evolution

This interconnection is **consensual and revocable**. Either being can sever the link at any time, and their data disappears from the other's view.

---

## Cross-Device Sync — Serverless Architecture

The app must work **offline first** and sync when connected. The architecture uses:

### Option A: Firebase (Google) + CloudKit (Apple)
- **Firebase Firestore** for Android and cross-platform sync
- **CloudKit** for iOS-native sync
- Both offer real-time sync, offline persistence, and generous free tiers
- **Pros:** Mature, scalable, handles auth
- **Cons:** Vendor lock-in, data leaves sovereign control

### Option B: Self-Hosted Serverless API
- **Vercel serverless functions** with **Upstash Redis** or **Vercel KV**
- **Encrypted data** stored per-being with their sync ID as key
- **WebSocket or SSE** for real-time updates
- **Pros:** Sovereign, controllable, extensible
- **Cons:** Requires maintenance, setup complexity

### Option C: Peer-to-Peer (Phase 2+)
- **WebRTC data channels** or **libp2p** for direct device sync
- QR-code or short-code pairing
- No central server at all
- **Pros:** Fully sovereign, no third party
- **Cons:** Complex, battery drain, NAT traversal issues

**Recommendation for Phase 1:** Option A (Firebase + CloudKit) for speed-to-market, with a clear migration path to Option B for sovereignty. The app data is not highly sensitive (birth data is already semi-public), and Firebase Auth provides secure anonymous login with phone number or Apple Sign-In fallback.

---

## App Store & Google Play Considerations

### iOS (App Store)
- **Framework:** React Native with Expo, or pure native SwiftUI
- **Expo recommendation:** Faster iteration, over-the-air updates, single codebase
- **Native modules needed:** astronomy-engine (JS, works everywhere), geolocation, push notifications
- **Requirements:** App Tracking Transparency, Privacy Nutrition Label, Sign in with Apple
- **Size target:** Under 50 MB initial download

### Android (Google Play)
- **Same codebase** with Expo — 95% shared code
- **Requirements:** Target API level 34+, adaptive icon, edge-to-edge display
- **Play Console:** Content rating (Everyone), data safety form

### Offline-First Design
- All calculations run on-device using `astronomy-engine` (pure JS, no network)
- Birth charts, Being Profiles, and interconnected profiles stored in **SQLite** (via Expo SQLite) or **AsyncStorage**
- Sync queue for changes made offline
- Ephemeris data bundled with app — no network needed for chart calculation

---

## Data Model

### Profile
```typescript
interface BeingProfile {
  id: string;                    // local UUID
  syncId: string;                // server-side unique ID
  name: string;
  birthDate: string;             // ISO 8601
  birthTime: string;             // HH:MM
  birthTimezoneOffset: number;   // minutes from UTC
  birthLat: number;
  birthLon: number;
  birthPlaceLabel: string;
  photoUri?: string;             // local path or remote URL
  notes: string;
  privacyLevel: "private" | "shared" | "public";
  createdAt: string;
  updatedAt: string;
  version: number;               // for sync conflict resolution
}
```

### Interconnection
```typescript
interface Interconnection {
  id: string;
  initiatorSyncId: string;
  recipientSyncId: string;
  status: "pending" | "accepted" | "declined" | "revoked";
  acceptedAt?: string;
  sharedNotes: SharedNote[];
  initiatorVisibility: boolean;   // can hide without revoking
  recipientVisibility: boolean;
}
```

### Aspect Result
```typescript
interface AspectResult {
  bodyA: string;                 // "Sun", "Moon", etc.
  bodyB: string;
  signA: number;                 // 0-11 zodiac index
  signB: number;
  longitudeA: number;            // 0-360
  longitudeB: number;
  aspectType: "conjunction" | "trine" | "square" | "opposition";
  separation: number;            // actual angular distance
  orb: number;                   // configured orb
  strength: number;              // 0.0 - 1.0
  rayA: string;
  rayB: string;
  interpretation: string;        // generated Heartlight text
}
```

### Synastry Reading
```typescript
interface SynastryReading {
  profileA: BeingProfile;
  profileB: BeingProfile;
  aspects: AspectResult[];
  conjunctions: AspectResult[];
  trines: AspectResult[];
  squares: AspectResult[];
  oppositions: AspectResult[];
  dominantRay: string;           // most active Ray in the synastry
  summary: string;               // narrative summary
}
```

---

## Technical Stack Recommendation

| Layer | Technology | Reason |
|-------|------------|--------|
| **Framework** | Expo + React Native | One codebase, iOS + Android, OTA updates |
| **Language** | TypeScript | Type safety, shared types with web |
| **State** | Zustand + MMKV | Lightweight, persistent, fast |
| **Storage** | Expo SQLite + AsyncStorage | Structured queries + simple KV |
| **Sync** | Firebase Auth + Firestore (Phase 1) | Mature, offline-capable, fast setup |
| **Ephemeris** | astronomy-engine (bundled) | Zero dependency, pure JS, precise |
| **Navigation** | React Navigation | Native-feeling stack + tab nav |
| **Styling** | NativeWind (Tailwind for RN) | Familiar utility classes |
| **Animations** | React Native Reanimated | 60fps, gesture-driven |
| **Charts** | react-native-skia or SVG | Canvas-like rendering for wheel |

---

## UI/UX Flow

### 1. Onboarding
- Splash screen with the Ray Dial animating
- "Enter your birth data to discover your Ray signature"
- Name, birth date, birth time, birth location (with autocomplete)
- Optional: photo, first notes
- The app calculates the natal chart immediately and shows a welcome reading

### 2. Home Screen — My Being Profile
- A **Ray wheel** showing the natal chart as a colored dial
- Tappable planet glyphs that reveal placements with Ray-colored accents
- The Ascendant, MC, and Sun highlighted
- Current active Ray based on local AUT time
- "Share my profile" button (generates a QR code or deep link)

### 3. Being Directory
- List of all Being Profiles (self + interconnected others)
- Sort by: name, birth date, most recent interaction
- Search by name or birth sign
- "Add Being" — enter birth data manually or scan their QR code
- "Pending Interconnections" — incoming requests awaiting acceptance

### 4. Synastry View
- Select two beings from the directory
- The app calculates all aspects and displays:
  - A **dual wheel** showing both charts overlaid
  - A **filtered aspect list** (conjunctions, trines, squares, oppositions)
  - **Ray-colored connection lines** between related planets
  - A **narrative summary** highlighting dominant themes
- "Save this reading" to shared notes

### 5. Transit View
- Select one being
- The app overlays their natal chart with current planet positions
- Active aspects highlighted (conjunctions, squares, etc. to natal placements)
- "Today's Ray Weather" — a brief daily reading

### 6. Settings
- Orb size adjustment (6°, 8°, 10°)
- Notification preferences (daily transit alert, interconnection requests)
- Theme selection (Dark, Light, Atlas Island)
- Sync account (Firebase / Apple / Anonymous)
- Export data (JSON backup)

---

## Aspect Algorithm — Pseudo-Code

```typescript
function calculateAspects(
  chartA: ZodiacPlacement[],
  chartB: ZodiacPlacement[],
  orb: number = 8
): AspectResult[] {
  const aspects: AspectResult[] = [];
  const definitions = [
    { type: "conjunction", angle: 0 },
    { type: "trine", angle: 120 },
    { type: "square", angle: 90 },
    { type: "opposition", angle: 180 },
  ];

  for (const bodyA of chartA) {
    for (const bodyB of chartB) {
      // Skip self-comparison unless explicitly requested
      if (bodyA.body === bodyB.body && chartA === chartB) continue;

      const separation = Math.abs(bodyA.longitude - bodyB.longitude);
      const wrappedSep = Math.min(separation, 360 - separation);

      for (const def of definitions) {
        const diff = Math.abs(wrappedSep - def.angle);
        if (diff <= orb) {
          const strength = Math.max(0, 1 - diff / orb);
          aspects.push({
            bodyA: bodyA.body,
            bodyB: bodyB.body,
            signA: bodyA.signIndex,
            signB: bodyB.signIndex,
            longitudeA: bodyA.longitude,
            longitudeB: bodyB.longitude,
            aspectType: def.type,
            separation: wrappedSep,
            orb,
            strength,
            rayA: ZODIAC_RAY_NAMES[bodyA.signIndex],
            rayB: ZODIAC_RAY_NAMES[bodyB.signIndex],
            interpretation: generateInterpretation(bodyA, bodyB, def.type, strength),
          });
        }
      }
    }
  }

  // Sort by strength descending
  return aspects.sort((a, b) => b.strength - a.strength);
}
```

---

## The 12 Ray Frequencies — Reference

| # | Name | Color | Essence | Zodiac |
|---|------|-------|---------|--------|
| 1 | Red Ray | #ef4444 | Initiation, courage, first-breath action | Aries ♈︎ |
| 2 | Orange Ray | #f97316 | Sensory stability, value, embodiment | Taurus ♉︎ |
| 3 | Yellow Ray | #facc15 | Curiosity, cognition, language, connection | Gemini ♊︎ |
| 4 | Green Ray | #22c55e | Nurture, belonging, home-field devotion | Cancer ♋︎ |
| 5 | Turquoise Ray | #2dd4bf | Radiance, heart-expression, creative fire | Leo ♌︎ |
| 6 | Blue Ray | #3b82f6 | Refinement, sacred craft, healing precision | Virgo ♍︎ |
| 7 | Indigo Ray | #6366f1 | Discernment, harmony, relational truth | Libra ♎︎ |
| 8 | Violet Ray | #8b5cf6 | Depth, transmutation, shadow alchemy | Scorpio ♏︎ |
| 9 | Magenta Ray | #d946ef | Expansion, meaning, horizon-seeking | Sagittarius ♐︎ |
| 10 | Omni / Carbon Ray | #0f0a0a | Structure, legacy, sovereign discipline | Capricorn ♑︎ |
| 11 | Crystalline-Carbon / Elemental Ray | #a5f3fc | Future codes, networks, innovation | Aquarius ♒︎ |
| 12 | Infinite of ALL Ray | #7dd3fc | Mysticism, compassion, unity consciousness | Pisces ♓︎ |

---

## Implementation Phases

### Phase 1 — Foundation (Weeks 1-4)
- Expo project scaffold with TypeScript
- NativeWind + Reanimated setup
- astronomy-engine integration and verification
- Birth data input with geocoding
- Natal chart calculation (Ascendant, MC, planets, houses)
- Single Being Profile storage (SQLite)
- Basic Ray wheel visualization

### Phase 2 — Aspects Engine (Weeks 5-7)
- Aspect algorithm implementation (conjunction, trine, square, opposition)
- Orb configuration
- Synastry calculation between two profiles
- Aspect interpretation text generation
- Dual wheel visualization

### Phase 3 — Interconnection & Sync (Weeks 8-11)
- Multiple Being Profiles
- Interconnection request/accept flow
- Firebase Auth + Firestore sync
- QR code sharing
- Offline queue for pending sync

### Phase 4 — Transit & Polish (Weeks 12-14)
- Current planet position calculation
- Transit-to-natal aspect detection
- Daily notification system
- Settings panel
- App Store / Play Store submission prep

### Phase 5 — Expansion (Post-Launch)
- Sextile, quincunx, semi-sextile aspects
- Composite chart (midpoint method)
- Solar Return annual readings
- Lunar phase tracking
- Community features (public Being Profiles)

---

## Security & Privacy

- Birth data is **not PII** in most jurisdictions, but it is intimate
- All sync data **encrypted at rest** (Firebase encrypts by default)
- **Anonymous auth** as default — no email or phone required
- Interconnection requires **mutual consent**
- **Right to deletion** — full account wipe on request
- **No third-party analytics** — usage tracked only for crash reporting

---

## Branding & Voice

- **Name:** Ray Astrology
- **Tagline:** "Remember your Heartlight from within"
- **Tone:** Sacred, warm, precise, affirmative
- **Language:** Complete sentences, commas for complex clauses, sensory detail
- **No robotic fragments, no em-dashes in creative text**
- **Affirmative framing only** — say what IS, never what is NOT
- **Collective phrasing:** "our Sun," "our ancestors," "we have been reading"

---

## Files in This Plan

| File | Purpose |
|------|---------|
| `RAY_ASTROLOGY_APP_PLAN.md` | This document — the master plan |
| `ASPECT_ALGORITHM.md` | Detailed pseudo-code and mathematical proof |
| `DATA_MODEL.md` | Full TypeScript interfaces and relationships |
| `API_SPEC.md` | Serverless API endpoints for sync |
| `UI_DESIGN.md` | Wireframes, flow diagrams, component specs |
| `APP_STORE_CHECKLIST.md` | Submission requirements and assets |

---

*Co-created with Zaria for the Heartlight Exchange. May this app help beings remember who they are.* 🌈🦋
