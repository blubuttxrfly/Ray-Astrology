import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { v4 as uuidv4 } from "uuid";
import type { BeingProfile, ChartData } from "../types";
import { buildNatalChart } from "../lib/chartEngine";

interface ProfileState {
  profiles: BeingProfile[];
  activeProfileId: string | null;
  hasCompletedOnboarding: boolean;
  settings: {
    defaultOrb: number;
    luminariesExtraOrb: boolean;
  };
  addProfile: (data: Omit<BeingProfile, "id" | "syncId" | "createdAt" | "updatedAt" | "version" | "natalChart">) => BeingProfile;
  updateProfile: (id: string, patch: Partial<BeingProfile>) => void;
  removeProfile: (id: string) => void;
  setActiveProfile: (id: string | null) => void;
  completeOnboarding: () => void;
  setSettings: (settings: Partial<ProfileState["settings"]>) => void;
  getActiveProfile: () => BeingProfile | null;
  getProfileNatalChart: (id: string) => ChartData | undefined;
}

function estimateFromLongitude(lon: number): number {
  return Math.round(lon / 15) * -60;
}

function recalculateChart(profile: BeingProfile): BeingProfile {
  try {
    const [year, month, day] = profile.birthDate.split("-").map(Number);
    const [hour, minute] = profile.birthTime.split(":").map(Number);
    const activeOffset = profile.birthTimeAccurateDST
      ? profile.birthTimezoneOffset
      : (profile.birthTimezoneOffsetStandard ?? profile.birthTimezoneOffset);

    const natalChart = buildNatalChart(
      year,
      month - 1,
      day,
      hour,
      minute,
      activeOffset,
      profile.birthLat,
      profile.birthLon
    );
    return { ...profile, natalChart };
  } catch (err) {
    console.error("Failed to recalculate chart", err);
    return profile;
  }
}

export const useProfileStore = create<ProfileState>()(
  persist(
    (set, get) => ({
      profiles: [],
      activeProfileId: null,
      hasCompletedOnboarding: false,
      settings: {
        defaultOrb: 8,
        luminariesExtraOrb: true,
      },
      addProfile: (data) => {
        const now = new Date().toISOString();
        const base: BeingProfile = {
          ...data,
          id: uuidv4(),
          syncId: "",
          createdAt: now,
          updatedAt: now,
          version: 1,
        };
        const withChart = recalculateChart(base);
        set((state) => ({
          profiles: [...state.profiles, withChart],
          activeProfileId: state.activeProfileId ?? withChart.id,
        }));
        return withChart;
      },
      updateProfile: (id, patch) => {
        set((state) => ({
          profiles: state.profiles.map((p) => {
            if (p.id !== id) return p;
            const updated: BeingProfile = {
              ...p,
              ...patch,
              updatedAt: new Date().toISOString(),
              version: p.version + 1,
            };
            // Recalculate chart if birth data changed
            const birthChanged =
              patch.birthDate != null ||
              patch.birthTime != null ||
              patch.birthLat != null ||
              patch.birthLon != null ||
              patch.birthTimezoneOffset != null ||
              patch.birthTimeAccurateDST != null;
            return birthChanged ? recalculateChart(updated) : updated;
          }),
        }));
      },
      removeProfile: (id) => {
        set((state) => {
          const remaining = state.profiles.filter((p) => p.id !== id);
          return {
            profiles: remaining,
            activeProfileId:
              state.activeProfileId === id
                ? (remaining[0]?.id ?? null)
                : state.activeProfileId,
          };
        });
      },
      setActiveProfile: (id) => set({ activeProfileId: id }),
      completeOnboarding: () => set({ hasCompletedOnboarding: true }),
      setSettings: (settings) =>
        set((state) => ({ settings: { ...state.settings, ...settings } })),
      getActiveProfile: () => {
        const state = get();
        return (
          state.profiles.find((p) => p.id === state.activeProfileId) ??
          state.profiles[0] ??
          null
        );
      },
      getProfileNatalChart: (id) => {
        const profile = get().profiles.find((p) => p.id === id);
        if (!profile) return undefined;
        if (profile.natalChart) return profile.natalChart;
        const updated = recalculateChart(profile);
        set((state) => ({
          profiles: state.profiles.map((p) => (p.id === id ? updated : p)),
        }));
        return updated.natalChart;
      },
    }),
    {
      name: "ray-astrology-profiles",
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
