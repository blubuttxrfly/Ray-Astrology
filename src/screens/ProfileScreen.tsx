import React from "react";
import {
  View,
  Text,
  ScrollView,
} from "react-native";
import { useTheme } from "../components/ThemeProvider";
import { useProfileStore } from "../store/profileStore";

function formatPlacement(p: { signName: string; signSymbol: string; degrees: number; minutes: number }) {
  return `${p.signSymbol} ${p.signName} ${p.degrees}°${p.minutes.toString().padStart(2, "0")}′`;
}

export function ProfileScreen() {
  const { colors, fontFamily } = useTheme();
  const profile = useProfileStore((s) => s.getActiveProfile());

  if (!profile) {
    return (
      <View style={{ flex: 1, backgroundColor: colors.background, alignItems: "center", justifyContent: "center", paddingHorizontal: 24 }}>
        <Text style={{ color: colors.textMuted, fontSize: 16, fontFamily }}>No Being Profile found.</Text>
      </View>
    );
  }

  const chart = profile.natalChart;
  const sun = chart?.bodies.find((b) => b.body === "Sun");
  const moon = chart?.bodies.find((b) => b.body === "Moon");
  const ascendant = chart?.ascendant;

  const cardStyle = {
    backgroundColor: colors.card,
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: colors.border,
  };

  const sectionTitleStyle = {
    color: colors.textMuted,
    fontSize: 12,
    textTransform: "uppercase" as const,
    letterSpacing: 1,
    marginBottom: 12,
    fontFamily,
  };

  return (
    <ScrollView style={{ flex: 1, backgroundColor: colors.background }} contentContainerStyle={{ padding: 20 }}>
      <View style={{ marginBottom: 24 }}>
        <Text style={{ fontSize: 28, fontWeight: "bold", color: colors.text, fontFamily }}>{profile.name}</Text>
        <Text style={{ color: colors.textMuted, marginTop: 4, fontFamily }}>{profile.birthPlaceLabel}</Text>
        <Text style={{ color: colors.textMuted, fontFamily }}>{profile.birthDate} • {profile.birthTime}</Text>
      </View>

      {chart ? (
        <View style={{ gap: 16 }}>
          <View style={cardStyle}>
            <Text style={sectionTitleStyle}>Core Signature</Text>
            <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 12 }}>
              {sun && (
                <View style={{ backgroundColor: colors.surfaceAlt, borderRadius: 8, paddingHorizontal: 12, paddingVertical: 8 }}>
                  <Text style={{ color: colors.textMuted, fontSize: 12, fontFamily }}>Sun ☉</Text>
                  <Text style={{ fontWeight: "bold", fontSize: 16, color: sun.rayColor, fontFamily }}>{formatPlacement(sun)}</Text>
                </View>
              )}
              {moon && (
                <View style={{ backgroundColor: colors.surfaceAlt, borderRadius: 8, paddingHorizontal: 12, paddingVertical: 8 }}>
                  <Text style={{ color: colors.textMuted, fontSize: 12, fontFamily }}>Moon ☾</Text>
                  <Text style={{ fontWeight: "bold", fontSize: 16, color: moon.rayColor, fontFamily }}>{formatPlacement(moon)}</Text>
                </View>
              )}
              {ascendant && (
                <View style={{ backgroundColor: colors.surfaceAlt, borderRadius: 8, paddingHorizontal: 12, paddingVertical: 8 }}>
                  <Text style={{ color: colors.textMuted, fontSize: 12, fontFamily }}>Rising ASC</Text>
                  <Text style={{ fontWeight: "bold", fontSize: 16, color: ascendant.rayColor, fontFamily }}>{formatPlacement(ascendant)}</Text>
                </View>
              )}
            </View>
          </View>

          <View style={cardStyle}>
            <Text style={sectionTitleStyle}>Natal Planets</Text>
            <View style={{ gap: 8 }}>
              {chart.bodies.map((body) => (
                <View key={body.body} style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", paddingVertical: 4 }}>
                  <Text style={{ color: colors.text, fontFamily }}>{body.symbol} {body.body}</Text>
                  <Text style={{ fontWeight: "500", color: body.rayColor, fontFamily }}>
                    {formatPlacement(body)} {body.houseNumber ? `H${body.houseNumber}` : ""}
                  </Text>
                </View>
              ))}
            </View>
          </View>

          <View style={cardStyle}>
            <Text style={sectionTitleStyle}>House Wheel</Text>
            <View style={{ gap: 4 }}>
              {chart.houses.map((house) => (
                <View key={house.houseNumber} style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", paddingVertical: 4 }}>
                  <Text style={{ color: colors.textMuted, width: 90, fontFamily }}>House {house.houseNumber}</Text>
                  <Text style={{ color: colors.text, flex: 1, fontFamily }}>{house.theme}</Text>
                  <Text style={{ fontWeight: "500", color: house.cusp.rayColor, fontFamily }}>
                    {house.cusp.signSymbol} {house.cusp.signName}
                  </Text>
                </View>
              ))}
            </View>
          </View>
        </View>
      ) : (
        <Text style={{ color: colors.textMuted, fontFamily }}>Calculating your chart...</Text>
      )}
    </ScrollView>
  );
}
