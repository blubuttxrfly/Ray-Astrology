import React, { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import { useTheme } from "../components/ThemeProvider";
import { useProfileStore } from "../store/profileStore";
import { calculateSynastry } from "../lib/aspectEngine";
import type { AspectResult } from "../types";

const ASPECT_LABELS: Record<AspectResult["aspectType"], string> = {
  conjunction: "Conjunctions",
  trine: "Trines",
  square: "Squares",
  opposition: "Oppositions",
};

export function SynastryScreen() {
  const { colors, fontFamily } = useTheme();
  const profiles = useProfileStore((s) => s.profiles);
  const settings = useProfileStore((s) => s.settings);
  const [leftId, setLeftId] = useState<string | null>(null);
  const [rightId, setRightId] = useState<string | null>(null);
  const [filter, setFilter] = useState<AspectResult["aspectType"] | "all">("all");

  const leftProfile = profiles.find((p) => p.id === leftId);
  const rightProfile = profiles.find((p) => p.id === rightId);

  const reading =
    leftProfile?.natalChart && rightProfile?.natalChart
      ? calculateSynastry(
          leftProfile.natalChart.bodies,
          rightProfile.natalChart.bodies,
          settings.defaultOrb,
          { luminariesExtraOrb: settings.luminariesExtraOrb }
        )
      : null;

  const filteredAspects =
    reading?.aspects.filter((a) => (filter === "all" ? true : a.aspectType === filter)) ?? [];

  const cardStyle = {
    backgroundColor: colors.card,
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: colors.border,
  };

  return (
    <ScrollView style={{ flex: 1, backgroundColor: colors.background }} contentContainerStyle={{ padding: 20 }}>
      <Text style={{ fontSize: 24, fontWeight: "bold", color: colors.text, marginBottom: 16, fontFamily }}>Synastry</Text>

      <View style={{ flexDirection: "row", gap: 12, marginBottom: 16 }}>
        <View style={{ flex: 1 }}>
          <Text style={{ color: colors.textMuted, fontSize: 12, marginBottom: 6, fontFamily }}>Being A</Text>
          <View style={{ borderWidth: 1, borderColor: colors.border, borderRadius: 12, overflow: "hidden" }}>
            {profiles.map((p) => (
              <TouchableOpacity
                key={p.id}
                onPress={() => setLeftId(p.id)}
                style={{ paddingHorizontal: 12, paddingVertical: 10, backgroundColor: leftId === p.id ? colors.surfaceAlt : colors.surface }}
              >
                <Text style={{ color: leftId === p.id ? colors.text : colors.textMuted, fontWeight: leftId === p.id ? "bold" : "normal", fontFamily }}>
                  {p.name}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
        <View style={{ flex: 1 }}>
          <Text style={{ color: colors.textMuted, fontSize: 12, marginBottom: 6, fontFamily }}>Being B</Text>
          <View style={{ borderWidth: 1, borderColor: colors.border, borderRadius: 12, overflow: "hidden" }}>
            {profiles.map((p) => (
              <TouchableOpacity
                key={p.id}
                onPress={() => setRightId(p.id)}
                style={{ paddingHorizontal: 12, paddingVertical: 10, backgroundColor: rightId === p.id ? colors.surfaceAlt : colors.surface }}
              >
                <Text style={{ color: rightId === p.id ? colors.text : colors.textMuted, fontWeight: rightId === p.id ? "bold" : "normal", fontFamily }}>
                  {p.name}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </View>

      {reading && (
        <View style={{ gap: 16 }}>
          <View style={cardStyle}>
            <Text style={{ color: colors.textMuted, fontSize: 12, textTransform: "uppercase", letterSpacing: 1, marginBottom: 8, fontFamily }}>Summary</Text>
            <Text style={{ color: colors.text, lineHeight: 22, fontFamily }}>{reading.summary}</Text>
            <View style={{ flexDirection: "row", justifyContent: "space-between", marginTop: 12 }}>
              <Text style={{ color: colors.textMuted, fontFamily }}>Harmony: {reading.harmonyScore}%</Text>
              <Text style={{ color: colors.textMuted, fontFamily }}>Tension: {reading.tensionScore}%</Text>
            </View>
          </View>

          <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 8, marginBottom: 8 }}>
            {(["all", "conjunction", "trine", "square", "opposition"] as const).map((f) => (
              <TouchableOpacity
                key={f}
                onPress={() => setFilter(f)}
                style={{
                  paddingHorizontal: 12,
                  paddingVertical: 6,
                  borderRadius: 999,
                  borderWidth: 1,
                  borderColor: f === filter ? colors.accent : colors.border,
                  backgroundColor: f === filter ? colors.accent : colors.surface,
                }}
              >
                <Text style={{ color: f === filter ? colors.accentText : colors.textMuted, fontWeight: f === filter ? "bold" : "normal", fontFamily }}>
                  {f === "all" ? "All" : ASPECT_LABELS[f]}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          <View style={{ gap: 12 }}>
            {filteredAspects.map((aspect) => (
              <View key={aspect.id} style={cardStyle}>
                <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
                  <Text style={{ color: colors.text, fontWeight: "bold", fontFamily }}>
                    {aspect.symbolA} {aspect.bodyA} ↔ {aspect.symbolB} {aspect.bodyB}
                  </Text>
                  <Text style={{ color: colors.textMuted, fontSize: 14, textTransform: "capitalize", fontFamily }}>{aspect.aspectType}</Text>
                </View>
                <View style={{ flexDirection: "row", justifyContent: "space-between", marginBottom: 8 }}>
                  <Text style={{ color: aspect.rayColorA, fontFamily }}>
                    {aspect.signNameA} ({aspect.rayA})
                  </Text>
                  <Text style={{ color: aspect.rayColorB, fontFamily }}>
                    {aspect.signNameB} ({aspect.rayB})
                  </Text>
                </View>
                <Text style={{ color: colors.textMuted, fontSize: 14, lineHeight: 20, fontFamily }}>{aspect.interpretation}</Text>
                <View style={{ marginTop: 10, height: 6, backgroundColor: colors.surfaceAlt, borderRadius: 999, overflow: "hidden" }}>
                  <View style={{ height: "100%", backgroundColor: colors.accent, width: `${aspect.strength * 100}%` }} />
                </View>
              </View>
            ))}
          </View>
        </View>
      )}

      {!reading && profiles.length < 2 && (
        <Text style={{ color: colors.textMuted, textAlign: "center", marginTop: 32, fontFamily }}>Add at least two beings to explore synastry.</Text>
      )}
    </ScrollView>
  );
}
