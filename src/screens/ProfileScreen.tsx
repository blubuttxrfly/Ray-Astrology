import React from "react";
import { View, Text, ScrollView } from "react-native";
import { useTheme } from "../components/ThemeProvider";
import { useProfileStore } from "../store/profileStore";
import { ZODIAC_SIGNS } from "../lib/chartEngine";

function formatPlacement(p: { signName: string; signSymbol: string; degrees: number; minutes: number }) {
  return `${p.signSymbol} ${p.signName} ${p.degrees}°${p.minutes.toString().padStart(2, "0")}′`;
}

export function ProfileScreen() {
  const { colors } = useTheme();
  const profile = useProfileStore((s) => s.getActiveProfile());

  if (!profile) {
    return (
      <View className="flex-1 items-center justify-center px-6">
        <Text className="text-island-300 text-base">No Being Profile found.</Text>
      </View>
    );
  }

  const chart = profile.natalChart;
  const sun = chart?.bodies.find((b) => b.body === "Sun");
  const moon = chart?.bodies.find((b) => b.body === "Moon");
  const ascendant = chart?.ascendant;

  return (
    <ScrollView className="flex-1 px-5 py-6">
      <View className="mb-6">
        <Text className="text-3xl font-bold text-ray-elemental">{profile.name}</Text>
        <Text className="text-island-400 mt-1">{profile.birthPlaceLabel}</Text>
        <Text className="text-island-400">
          {profile.birthDate} • {profile.birthTime}
        </Text>
      </View>

      {chart ? (
        <View className="space-y-4">
          <View className="rounded-2xl p-5 border border-island-700">
            <Text className="text-island-300 text-sm uppercase tracking-wider mb-3">Core Signature</Text>
            <View className="flex-row flex-wrap gap-3">
              {sun && (
                <View className="rounded-lg px-3 py-2">
                  <Text className="text-island-400 text-xs">Sun ☉</Text>
                  <Text className="font-bold text-base" style={{ color: sun.rayColor }}>
                    {formatPlacement(sun)}
                  </Text>
                </View>
              )}
              {moon && (
                <View className="rounded-lg px-3 py-2">
                  <Text className="text-island-400 text-xs">Moon ☾</Text>
                  <Text className="font-bold text-base" style={{ color: moon.rayColor }}>
                    {formatPlacement(moon)}
                  </Text>
                </View>
              )}
              {ascendant && (
                <View className="rounded-lg px-3 py-2">
                  <Text className="text-island-400 text-xs">Rising ASC</Text>
                  <Text className="font-bold text-base" style={{ color: ascendant.rayColor }}>
                    {formatPlacement(ascendant)}
                  </Text>
                </View>
              )}
            </View>
          </View>

          <View className="rounded-2xl p-5 border border-island-700">
            <Text className="text-island-300 text-sm uppercase tracking-wider mb-3">Natal Planets</Text>
            <View className="space-y-2">
              {chart.bodies.map((body) => (
                <View key={body.body} className="flex-row justify-between items-center py-1">
                  <Text className="text-island-200">{body.symbol} {body.body}</Text>
                  <Text className="font-medium" style={{ color: body.rayColor }}>
                    {formatPlacement(body)} {body.houseNumber ? `H${body.houseNumber}` : ""}
                  </Text>
                </View>
              ))}
            </View>
          </View>

          <View className="rounded-2xl p-5 border border-island-700">
            <Text className="text-island-300 text-sm uppercase tracking-wider mb-3">House Wheel</Text>
            <View className="space-y-1">
              {chart.houses.map((house) => {
                const sign = ZODIAC_SIGNS[house.cusp.signIndex];
                return (
                  <View key={house.houseNumber} className="flex-row justify-between items-center py-1">
                    <Text className="text-island-400 w-24">House {house.houseNumber}</Text>
                    <Text className="text-island-300 flex-1">{house.theme}</Text>
                    <Text className="font-medium" style={{ color: sign.rayColor }}>
                      {sign.symbol} {sign.name}
                    </Text>
                  </View>
                );
              })}
            </View>
          </View>
        </View>
      ) : (
        <Text className="text-island-400">Calculating your chart...</Text>
      )}
    </ScrollView>
  );
}
