import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import AsyncStorage from "@react-native-async-storage/async-storage";

export type AppTheme = "dark" | "light" | "atlas";

export interface RayHues {
  red: string;
  orange: string;
  yellow: string;
  green: string;
  turquoise: string;
  blue: string;
  indigo: string;
  violet: string;
  magenta: string;
  carbon: string;
  elemental: string;
  infinite: string;
}

const DEFAULT_RAY_HUES: RayHues = {
  red: "#ef4444",
  orange: "#f97316",
  yellow: "#facc15",
  green: "#22c55e",
  turquoise: "#2dd4bf",
  blue: "#3b82f6",
  indigo: "#6366f1",
  violet: "#8b5cf6",
  magenta: "#d946ef",
  carbon: "#0f0a0a",
  elemental: "#a5f3fc",
  infinite: "#7dd3fc",
};

interface ThemeState {
  theme: AppTheme;
  rayHues: RayHues;
  ready: boolean;
  setTheme: (theme: AppTheme) => void;
  setRayHue: (ray: keyof RayHues, color: string) => void;
  resetRayHues: () => void;
  setReady: (ready: boolean) => void;
}

export const useThemeStore = create<ThemeState>()(
  persist(
    (set) => ({
      theme: "atlas",
      rayHues: DEFAULT_RAY_HUES,
      ready: true,
      setTheme: (theme) => set({ theme }),
      setRayHue: (ray, color) =>
        set((state) => ({
          rayHues: { ...state.rayHues, [ray]: color },
        })),
      resetRayHues: () => set({ rayHues: DEFAULT_RAY_HUES }),
      setReady: (ready) => set({ ready }),
    }),
    {
      name: "ray-astrology-theme",
      storage: createJSONStorage(() => AsyncStorage),
      onRehydrateStorage: () => (state) => {
        state?.setReady(true);
      },
    }
  )
);
