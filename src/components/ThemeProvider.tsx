import React, { createContext, useContext, useMemo } from "react";
import { useThemeStore, type RayHues } from "../store/themeStore";

interface ThemeContextValue {
  colors: {
    background: string;
    surface: string;
    surfaceAlt: string;
    text: string;
    textMuted: string;
    border: string;
    accent: string;
    ray: RayHues;
  };
  isAtlas: boolean;
}

const ThemeContext = createContext<ThemeContextValue | null>(null);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const theme = useThemeStore((s) => s.theme);
  const rayHues = useThemeStore((s) => s.rayHues);

  const value = useMemo<ThemeContextValue>(() => {
    if (theme === "atlas") {
      return {
        colors: {
          background: "#1a1410",
          surface: "#231a14",
          surfaceAlt: "#2d2118",
          text: "#f2ebe0",
          textMuted: "#a38a76",
          border: "#574136",
          accent: rayHues.elemental,
          ray: rayHues,
        },
        isAtlas: true,
      };
    }
    if (theme === "dark") {
      return {
        colors: {
          background: "#0f172a",
          surface: "#1e293b",
          surfaceAlt: "#334155",
          text: "#f8fafc",
          textMuted: "#94a3b8",
          border: "#475569",
          accent: rayHues.turquoise,
          ray: rayHues,
        },
        isAtlas: false,
      };
    }
    return {
      colors: {
        background: "#fbf7f0",
        surface: "#ffffff",
        surfaceAlt: "#f2ebe0",
        text: "#231a14",
        textMuted: "#7a5d4d",
        border: "#c7b39e",
        accent: rayHues.turquoise,
        ray: rayHues,
      },
      isAtlas: false,
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
