# Data Model — Ray Astrology App 🌈

Complete TypeScript interfaces for the app data layer.

---

## Core Types

```typescript
// ── Zodiac ────────────────────────────────────────────────────────────────

export interface ZodiacSign {
  index: number;        // 0-11
  name: string;         // "Aries", "Taurus", etc.
  symbol: string;       // "♈︎", "♉︎", etc.
  rayName: string;      // "Red Ray", "Orange Ray", etc.
  rayColor: string;     // hex color
  rayEssence: string;   // brief description
}

// ── Celestial Placements ──────────────────────────────────────────────────

export interface CelestialPlacement {
  body: string;         // "Sun", "Moon", "Mercury", etc.
  symbol: string;       // "☉", "☾", "☿", etc.
  longitude: number;    // 0-360 ecliptic longitude
  latitude: number;     // ecliptic latitude
  signIndex: number;    // 0-11
  signName: string;
  signSymbol: string;
  degrees: number;      // 0-29
  minutes: number;      // 0-59
  rayName: string;
  rayColor: string;
  rayEssence: string;
  houseNumber?: number; // 1-12, if houses calculated
  retrograde?: boolean; // true if apparent retrograde motion
}

// ── Chart ─────────────────────────────────────────────────────────────────

export interface ChartData {
  ascendant: CelestialPlacement;
  descendant: CelestialPlacement;
  midheaven: CelestialPlacement;
  ic: CelestialPlacement;
  sun: CelestialPlacement;
  moon: CelestialPlacement;
  mercury: CelestialPlacement;
  venus: CelestialPlacement;
  mars: CelestialPlacement;
  jupiter: CelestialPlacement;
  saturn: CelestialPlacement;
  uranus: CelestialPlacement;
  neptune: CelestialPlacement;
  pluto: CelestialPlacement;
  houses: House[];
  calculatedAt: string; // ISO timestamp
}

export interface House {
  houseNumber: number;  // 1-12
  theme: string;        // e.g., "Identity, Appearance"
  cusp: CelestialPlacement;
  rayName: string;
  rayColor: string;
  rayEssence: string;
}

// ── Being Profile ─────────────────────────────────────────────────────────

export interface BeingProfile {
  id: string;                    // local UUID v4
  syncId: string;                // server-side unique ID (empty until synced)
  name: string;
  birthDate: string;             // "YYYY-MM-DD"
  birthTime: string;             // "HH:MM" in 24h format
  birthTimezoneOffset: number;   // minutes from UTC (e.g., -300 for EST)
  birthTimezoneOffsetStandard: number; // standard-time offset
  birthTimeAccurateDST: boolean; // default true
  birthTimezoneLabel?: string;   // "Indianapolis (UTC-5, standard)"
  birthLat: number;
  birthLon: number;
  birthPlaceLabel: string;
  photoUri?: string;             // local file path or remote URL
  notes: string;
  privacyLevel: PrivacyLevel;
  createdAt: string;             // ISO timestamp
  updatedAt: string;             // ISO timestamp
  version: number;             // for sync conflict resolution
  natalChart?: ChartData;        // cached after first calculation
}

export type PrivacyLevel = "private" | "shared" | "public";

// ── Interconnection ───────────────────────────────────────────────────────

export interface Interconnection {
  id: string;
  initiatorSyncId: string;
  recipientSyncId: string;
  status: InterconnectionStatus;
  initiatedAt: string;
  acceptedAt?: string;
  revokedAt?: string;
  sharedNotes: SharedNote[];
  initiatorVisibility: boolean;  // soft-hide without revoking
  recipientVisibility: boolean;
}

export type InterconnectionStatus = "pending" | "accepted" | "declined" | "revoked";

export interface SharedNote {
  id: string;
  authorSyncId: string;
  content: string;
  createdAt: string;
  updatedAt: string;
}

// ── Aspect ────────────────────────────────────────────────────────────────

export interface AspectResult {
  id: string;              // unique for this aspect pair
  bodyA: string;
  bodyB: string;
  symbolA: string;
  symbolB: string;
  signA: number;           // 0-11
  signB: number;
  signNameA: string;
  signNameB: string;
  longitudeA: number;
  longitudeB: number;
  aspectType: AspectType;
  separation: number;      // actual angular distance
  exactAngle: number;      // 0, 90, 120, 180
  orb: number;
  strength: number;      // 0.0 - 1.0
  rayA: string;
  rayB: string;
  rayColorA: string;
  rayColorB: string;
  interpretation: string;
}

export type AspectType = "conjunction" | "trine" | "square" | "opposition" | "sextile" | "quincunx";

// ── Synastry Reading ──────────────────────────────────────────────────────

export interface SynastryReading {
  id: string;
  profileAId: string;
  profileBId: string;
  calculatedAt: string;
  aspects: AspectResult[];
  dominantRay: string;
  dominantRayColor: string;
  summary: string;
  harmonyScore: number;    // 0-100, based on trine/conjunction ratio
  tensionScore: number;    // 0-100, based on square/opposition ratio
  compositeRay: string;    // the Ray that emerges from their union
}

// ── Transit Reading ───────────────────────────────────────────────────────

export interface TransitReading {
  id: string;
  profileId: string;
  date: string;            // the date this reading applies to
  calculatedAt: string;
  activeAspects: AspectResult[];  // current-to-natal aspects
  dominantTheme: string;
  dailyGuidance: string;
  rayOfTheDay: string;
  rayColorOfTheDay: string;
}

// ── App Settings ──────────────────────────────────────────────────────────

export interface AppSettings {
  defaultOrb: number;              // 6, 8, or 10
  luminariesExtraOrb: boolean;     // Sun/Moon get +2°
  showMinorAspects: boolean;       // sextile, quincunx
  theme: "dark" | "light" | "atlas";
  notificationsEnabled: boolean;
  dailyTransitAlert: boolean;
  dailyTransitAlertTime: string;    // "08:00"
  language: string;               // "en", etc.
  anonymousUserId?: string;        // Firebase anonymous auth
  hasCompletedOnboarding: boolean;
  syncProvider: "none" | "firebase" | "icloud";
}

// ── Sync Queue (Offline Support) ──────────────────────────────────────────

export interface SyncQueueItem {
  id: string;
  operation: "create" | "update" | "delete";
  entityType: "profile" | "interconnection" | "sharedNote";
  entityId: string;
  payload: unknown;
  timestamp: string;
  retryCount: number;
  lastError?: string;
}
```

---

## Database Schema (SQLite)

```sql
-- Being Profiles
CREATE TABLE profiles (
  id TEXT PRIMARY KEY,
  syncId TEXT UNIQUE,
  name TEXT NOT NULL,
  birthDate TEXT NOT NULL,
  birthTime TEXT NOT NULL,
  birthTimezoneOffset INTEGER NOT NULL,
  birthTimezoneOffsetStandard INTEGER,
  birthTimeAccurateDST INTEGER DEFAULT 1,
  birthTimezoneLabel TEXT,
  birthLat REAL NOT NULL,
  birthLon REAL NOT NULL,
  birthPlaceLabel TEXT NOT NULL,
  photoUri TEXT,
  notes TEXT DEFAULT '',
  privacyLevel TEXT DEFAULT 'private',
  createdAt TEXT NOT NULL,
  updatedAt TEXT NOT NULL,
  version INTEGER DEFAULT 1,
  natalChartJson TEXT  -- serialized ChartData
);

-- Interconnections
CREATE TABLE interconnections (
  id TEXT PRIMARY KEY,
  initiatorSyncId TEXT NOT NULL,
  recipientSyncId TEXT NOT NULL,
  status TEXT NOT NULL,
  initiatedAt TEXT NOT NULL,
  acceptedAt TEXT,
  revokedAt TEXT,
  initiatorVisibility INTEGER DEFAULT 1,
  recipientVisibility INTEGER DEFAULT 1,
  UNIQUE(initiatorSyncId, recipientSyncId)
);

-- Shared Notes
CREATE TABLE shared_notes (
  id TEXT PRIMARY KEY,
  interconnectionId TEXT NOT NULL REFERENCES interconnections(id) ON DELETE CASCADE,
  authorSyncId TEXT NOT NULL,
  content TEXT NOT NULL,
  createdAt TEXT NOT NULL,
  updatedAt TEXT NOT NULL
);

-- Cached Synastry Readings
CREATE TABLE synastry_cache (
  id TEXT PRIMARY KEY,
  profileAId TEXT NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  profileBId TEXT NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  calculatedAt TEXT NOT NULL,
  aspectsJson TEXT NOT NULL,
  dominantRay TEXT,
  dominantRayColor TEXT,
  summary TEXT,
  harmonyScore INTEGER,
  tensionScore INTEGER,
  compositeRay TEXT,
  UNIQUE(profileAId, profileBId)
);

-- Cached Transit Readings
CREATE TABLE transit_cache (
  id TEXT PRIMARY KEY,
  profileId TEXT NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  date TEXT NOT NULL,
  calculatedAt TEXT NOT NULL,
  aspectsJson TEXT NOT NULL,
  dominantTheme TEXT,
  dailyGuidance TEXT,
  rayOfTheDay TEXT,
  rayColorOfTheDay TEXT,
  UNIQUE(profileId, date)
);

-- App Settings (single row)
CREATE TABLE app_settings (
  id INTEGER PRIMARY KEY CHECK (id = 1),
  defaultOrb INTEGER DEFAULT 8,
  luminariesExtraOrb INTEGER DEFAULT 1,
  showMinorAspects INTEGER DEFAULT 0,
  theme TEXT DEFAULT 'dark',
  notificationsEnabled INTEGER DEFAULT 1,
  dailyTransitAlert INTEGER DEFAULT 1,
  dailyTransitAlertTime TEXT DEFAULT '08:00',
  language TEXT DEFAULT 'en',
  anonymousUserId TEXT,
  hasCompletedOnboarding INTEGER DEFAULT 0,
  syncProvider TEXT DEFAULT 'none'
);

-- Sync Queue
CREATE TABLE sync_queue (
  id TEXT PRIMARY KEY,
  operation TEXT NOT NULL,
  entityType TEXT NOT NULL,
  entityId TEXT NOT NULL,
  payload TEXT NOT NULL,
  timestamp TEXT NOT NULL,
  retryCount INTEGER DEFAULT 0,
  lastError TEXT
);
```

---

## Relationships

```
BeingProfile 1───* SynastryReading
BeingProfile 1───* TransitReading
BeingProfile 1───* Interconnection (as initiator or recipient)
Interconnection 1───* SharedNote
BeingProfile 1───1 AppSettings (per-device)
```

---

## Sync Conflict Resolution

When two devices modify the same profile, the **highest version number wins**. If versions are equal, the **most recent updatedAt timestamp wins**.

```typescript
function resolveConflict(local: BeingProfile, remote: BeingProfile): BeingProfile {
  if (remote.version > local.version) return remote;
  if (local.version > remote.version) return local;
  // Versions equal — compare timestamps
  return new Date(remote.updatedAt) > new Date(local.updatedAt) ? remote : local;
}
```

---

## Data Lifecycle

1. **Creation:** Profile created on-device → assigned local UUID → added to SQLite → queued for sync
2. **Sync:** Sync queue processed → Firebase/CloudKit assigns syncId → local record updated
3. **Interconnection:** Initiator creates pending record → recipient accepts → both records updated
4. **Reading:** Synastry calculated on-demand → cached in SQLite → invalidated when either profile changes
5. **Deletion:** Profile soft-deleted locally → sync queue sends delete → remote purged

---

*This data model supports offline-first operation, cross-device sync, and efficient aspect caching while respecting being privacy and consent.* 🌈
