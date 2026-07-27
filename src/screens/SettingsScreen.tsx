import React from "react";
import { View, Text, ScrollView, TouchableOpacity, Alert } from "react-native";
import { useThemeStore } from "../store/themeStore";
import { useProfileStore } from "../store/profileStore";

export function SettingsScreen() {
  const theme = useThemeStore((s) => s.theme);
  const rayHues = useThemeStore((s) => s.rayHues);
  const setTheme = useThemeStore((s) => s.setTheme);
  const setRayHue = useThemeStore((s) => s.setRayHue);
  const resetRayHues = useThemeStore((s) => s.resetRayHues);
  const settings = useProfileStore((s) => s.settings);
  const setSettings = useProfileStore((s) => s.setSettings);

  const handleReset = () => {
    Alert.alert(
      "Reset Ray Hues",
      "Restore the sacred default palette?",
      [
        { text: "Cancel", style: "cancel" },
        { text: "Restore", style: "default", onPress: resetRayHues },
      ]
    );
  };

  return (
    <ScrollView className="flex-1 px-5 py-6">
      <Text className="text-2xl font-bold text-ray-elemental mb-6">Settings</Text>

      <View className="rounded-2xl p-4 border border-island-700 mb-6">
        <Text className="text-island-300 text-sm uppercase tracking-wider mb-3">Theme</Text>
        <View className="flex-row space-x-2">
          {(["atlas", "dark", "light"] as const).map((t) => (
            <TouchableOpacity
              key={t}
              onPress={() => setTheme(t)}
              className={`flex-1 py-2 rounded-lg border ${
                theme === t
                  ? "bg-ray-elemental border-ray-elemental"
                  : "border-island-600"
              }`}
            >
              <Text
                className={`text-center font-semibold capitalize ${
                  theme === t ? "text-island-950" : "text-island-300"
                }`}
              >
                {t}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <View className="rounded-2xl p-4 border border-island-700 mb-6">
        <Text className="text-island-300 text-sm uppercase tracking-wider mb-3">Aspect Settings</Text>
        <View className="flex-row justify-between items-center py-2">
          <Text className="text-island-200">Default Orb</Text>
          <View className="flex-row space-x-2">
            {[6, 8, 10].map((orb) => (
              <TouchableOpacity
                key={orb}
                onPress={() => setSettings({ defaultOrb: orb })}
                className={`px-3 py-1 rounded-lg border ${
                  settings.defaultOrb === orb
                    ? "bg-ray-elemental border-ray-elemental"
                    : "border-island-600"
                }`}
              >
                <Text
                  className={
                    settings.defaultOrb === orb ? "text-island-950 font-bold" : "text-island-300"
                  }
                >
                  {orb}°
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <TouchableOpacity
          onPress={() => setSettings({ luminariesExtraOrb: !settings.luminariesExtraOrb })}
          className="flex-row justify-between items-center py-3 mt-2"
        >
          <Text className="text-island-200">Wider orbs for Sun and Moon</Text>
          <Text className="text-ray-elemental font-bold">{settings.luminariesExtraOrb ? "ON" : "OFF"}</Text>
        </TouchableOpacity>
      </View>

      <View className="rounded-2xl p-4 border border-island-700 mb-6">
        <View className="flex-row justify-between items-center mb-3">
          <Text className="text-island-300 text-sm uppercase tracking-wider">Ray Hues</Text>
          <TouchableOpacity onPress={handleReset}>
            <Text className="text-ray-elemental text-sm">Reset</Text>
          </TouchableOpacity>
        </View>

        <View className="flex-row flex-wrap gap-3">
          {(Object.keys(rayHues) as Array<keyof typeof rayHues>).map((ray) => (
            <View key={ray} className="flex-row items-center space-x-2 w-[45%]">
              <View
                className="w-8 h-8 rounded-full border border-island-600"
                style={{ backgroundColor: rayHues[ray] }}
              />
              <Text className="text-island-300 text-sm capitalize">{ray}</Text>
            </View>
          ))}
        </View>
      </View>

      <View className="mt-8">
        <Text className="text-island-500 text-center text-xs">Ray Astrology v1.0.0 — Heartlight Exchange</Text>
      </View>
    </ScrollView>
  );
}
