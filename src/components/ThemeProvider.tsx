import React, { createContext, useContext, useMemo } from "react";
import { useThemeStore, type RayHues } from "../store/themeStore";

export interface ThemeColors {
  background: string;
  surface: string;
  surfaceAlt: string;
  card: string;
  text: string;
  textMuted: string;
  textInverse: string;
  border: string;
  accent: string;
  accentText: string;
  ray: RayHues;
}

interface ThemeContextValue {
  colors: ThemeColors;
  theme: "dark" | "light" | "atlas";
  isDark: boolean;
  fontFamily: string;
}

const ThemeContext = createContext<ThemeContextValue | null>(null);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const theme = useThemeStore((s) => s.theme);
  const rayHues = useThemeStore((s) => s.rayHues);

  const value = useMemo<ThemeContextValue>(() => {
    const base = {
      fontFamily: "Alice",
      ray: rayHues,
      theme,
    };

    if (theme === "atlas") {
      return {
        ...base,
        colors: {
          background: "#1a1410",
          surface: "#231a14",
          surfaceAlt: "#2d2118",
          card: "#2d2118",
          text: "#f2ebe0",
          textMuted: "#a38a76",
          textInverse: "#1a1410",
          border: "#574136",
          accent: rayHues.elemental,
          accentText: "#1a1410",
          ray: rayHues,
        },
        isDark: true,
      };
    }
    if (theme === "dark") {
      return {
        ...base,
        colors: {
          background: "#0f172a",
          surface: "#1e293b",
          surfaceAlt: "#334155",
          card: "#1e293b",
          text: "#f8fafc",
          textMuted: "#94a3b8",
          textInverse: "#0f172a",
          border: "#475569",
          accent: rayHues.turquoise,
          accentText: "#0f172a",
          ray: rayHues,
        },
        isDark: true,
      };
    }
    return {
      ...base,
      colors: {
        background: "#fbf7f0",
        surface: "#ffffff",
        surfaceAlt: "#f2ebe0",
        card: "#ffffff",
        text: "#231a14",
        textMuted: "#7a5d4d",
        textInverse: "#fbf7f0",
        border: "#c7b39e",
        accent: rayHues.turquoise,
        accentText: "#231a14",
        ray: rayHues,
      },
      isDark: false,
    };
  }, [theme, rayHues]);

  return (
    <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within ThemeProvider");
  }
  return context;
}
