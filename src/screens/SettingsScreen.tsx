import React from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Alert,
} from "react-native";
import { useTheme } from "../components/ThemeProvider";
import { useProfileStore } from "../store/profileStore";
import { useThemeStore } from "../store/themeStore";

export function SettingsScreen() {
  const { colors, fontFamily } = useTheme();
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

  const cardStyle = {
    backgroundColor: colors.card,
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: colors.border,
  };

  return (
    <ScrollView style={{ flex: 1, backgroundColor: colors.background }} contentContainerStyle={{ padding: 20 }}>
      <Text style={{ fontSize: 24, fontWeight: "bold", color: colors.text, marginBottom: 24, fontFamily }}>Settings</Text>

      <View style={[cardStyle, { marginBottom: 16 }]}>
        <Text style={{ color: colors.textMuted, fontSize: 12, textTransform: "uppercase", letterSpacing: 1, marginBottom: 12, fontFamily }}>Theme</Text>
        <View style={{ flexDirection: "row", gap: 8 }}>
          {(["atlas", "dark", "light"] as const).map((t) => (
            <TouchableOpacity
              key={t}
              onPress={() => setTheme(t)}
              style={{
                flex: 1,
                paddingVertical: 10,
                borderRadius: 12,
                borderWidth: 1,
                borderColor: theme === t ? colors.accent : colors.border,
                backgroundColor: theme === t ? colors.accent : colors.surface,
              }}
            >
              <Text
                style={{
                  textAlign: "center",
                  fontWeight: "600",
                  textTransform: "capitalize",
                  color: theme === t ? colors.accentText : colors.text,
                  fontFamily,
                }}
              >
                {t}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <View style={[cardStyle, { marginBottom: 16 }]}>
        <Text style={{ color: colors.textMuted, fontSize: 12, textTransform: "uppercase", letterSpacing: 1, marginBottom: 12, fontFamily }}>Aspect Settings</Text>
        <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", paddingVertical: 8 }}>
          <Text style={{ color: colors.text, fontFamily }}>Default Orb</Text>
          <View style={{ flexDirection: "row", gap: 8 }}>
            {[6, 8, 10].map((orb) => (
              <TouchableOpacity
                key={orb}
                onPress={() => setSettings({ defaultOrb: orb })}
                style={{
                  paddingHorizontal: 12,
                  paddingVertical: 6,
                  borderRadius: 8,
                  borderWidth: 1,
                  borderColor: settings.defaultOrb === orb ? colors.accent : colors.border,
                  backgroundColor: settings.defaultOrb === orb ? colors.accent : colors.surface,
                }}
              >
                <Text
                  style={{
                    color: settings.defaultOrb === orb ? colors.accentText : colors.text,
                    fontWeight: settings.defaultOrb === orb ? "bold" : "normal",
                    fontFamily,
                  }}
                >
                  {orb}°
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <TouchableOpacity
          onPress={() => setSettings({ luminariesExtraOrb: !settings.luminariesExtraOrb })}
          style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", paddingVertical: 12, marginTop: 8 }}
        >
          <Text style={{ color: colors.text, fontFamily }}>Wider orbs for Sun and Moon</Text>
          <Text style={{ color: colors.accent, fontWeight: "bold", fontFamily }}>{settings.luminariesExtraOrb ? "ON" : "OFF"}</Text>
        </TouchableOpacity>
      </View>

      <View style={[cardStyle, { marginBottom: 16 }]}>
        <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
          <Text style={{ color: colors.textMuted, fontSize: 12, textTransform: "uppercase", letterSpacing: 1, fontFamily }}>Ray Hues</Text>
          <TouchableOpacity onPress={handleReset}>
            <Text style={{ color: colors.accent, fontSize: 14, fontFamily }}>Reset</Text>
          </TouchableOpacity>
        </View>

        <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 12 }}>
          {(Object.keys(rayHues) as Array<keyof typeof rayHues>).map((ray) => (
            <View key={ray} style={{ flexDirection: "row", alignItems: "center", gap: 8, width: "45%" }}>
              <View
                style={{
                  width: 32,
                  height: 32,
                  borderRadius: 999,
                  borderWidth: 1,
                  borderColor: colors.border,
                  backgroundColor: rayHues[ray],
                }}
              />
              <Text style={{ color: colors.text, fontSize: 14, textTransform: "capitalize", fontFamily }}>{ray}</Text>
            </View>
          ))}
        </View>
      </View>

      <View style={{ marginTop: 32 }}>
        <Text style={{ color: colors.textMuted, textAlign: "center", fontSize: 12, fontFamily }}>Ray Astrology v1.0.0 — Heartlight Exchange</Text>
      </View>
    </ScrollView>
  );
}
