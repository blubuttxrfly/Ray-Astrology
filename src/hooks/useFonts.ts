import { useCallback } from "react";
import { useFonts as useExpoFonts } from "expo-font";

export function useFonts(): boolean {
  const [fontsLoaded] = useExpoFonts({
    Alice: require("../../assets/Alice-Regular.ttf"),
  });

  return fontsLoaded;
}
