import React, { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
} from "react-native";
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

  return (
    <ScrollView className="flex-1 px-5 py-6">
      <Text className="text-2xl font-bold text-ray-elemental mb-4">Synastry</Text>

      <View className="flex-row space-x-3 mb-4">
        <View className="flex-1">
          <Text className="text-island-300 text-sm mb-1">Being A</Text>
          <View className="border border-island-700 rounded-lg">
            {profiles.map((p) => (
              <TouchableOpacity
                key={p.id}
                onPress={() => setLeftId(p.id)}
                className={`px-3 py-2 ${leftId === p.id ? "bg-island-700" : ""}`}
              >
                <Text className={leftId === p.id ? "text-island-100 font-bold" : "text-island-300"}>
                  {p.name}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
        <View className="flex-1">
          <Text className="text-island-300 text-sm mb-1">Being B</Text>
          <View className="border border-island-700 rounded-lg">
            {profiles.map((p) => (
              <TouchableOpacity
                key={p.id}
                onPress={() => setRightId(p.id)}
                className={`px-3 py-2 ${rightId === p.id ? "bg-island-700" : ""}`}
              >
                <Text className={rightId === p.id ? "text-island-100 font-bold" : "text-island-300"}>
                  {p.name}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </View>

      {reading && (
        <View className="space-y-4">
          <View className="rounded-2xl p-4 border border-island-700">
            <Text className="text-island-300 text-sm uppercase tracking-wider mb-2">Summary</Text>
            <Text className="text-island-100 leading-relaxed">{reading.summary}</Text>
            <View className="flex-row justify-between mt-3">
              <Text className="text-island-400">Harmony: {reading.harmonyScore}%</Text>
              <Text className="text-island-400">Tension: {reading.tensionScore}%</Text>
            </View>
          </View>

          <View className="flex-row flex-wrap gap-2 mb-2">
            {(["all", "conjunction", "trine", "square", "opposition"] as const).map((f) => (
              <TouchableOpacity
                key={f}
                onPress={() => setFilter(f)}
                className={`px-3 py-1 rounded-full border ${
                  filter === f ? "bg-ray-elemental border-ray-elemental" : "border-island-600"
                }`}
              >
                <Text className={filter === f ? "text-island-950 font-bold" : "text-island-300"}>
                  {f === "all" ? "All" : ASPECT_LABELS[f]}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          <View className="space-y-3">
            {filteredAspects.map((aspect) => (
              <View key={aspect.id} className="rounded-xl p-4 border border-island-700">
                <View className="flex-row justify-between items-center mb-2">
                  <Text className="text-island-100 font-bold">
                    {aspect.symbolA} {aspect.bodyA} ↔ {aspect.symbolB} {aspect.bodyB}
                  </Text>
                  <Text className="text-island-400 text-sm capitalize">{aspect.aspectType}</Text>
                </View>
                <View className="flex-row justify-between text-sm mb-2">
                  <Text style={{ color: aspect.rayColorA }}>
                    {aspect.signNameA} ({aspect.rayA})
                  </Text>
                  <Text style={{ color: aspect.rayColorB }}>
                    {aspect.signNameB} ({aspect.rayB})
                  </Text>
                </View>
                <Text className="text-island-300 text-sm leading-relaxed">{aspect.interpretation}</Text>
                <View className="mt-2 h-1 bg-island-800 rounded-full overflow-hidden">
                  <View
                    className="h-full bg-ray-elemental"
                    style={{ width: `${aspect.strength * 100}%` }}
                  />
                </View>
              </View>
            ))}
          </View>
        </View>
      )}

      {!reading && profiles.length < 2 && (
        <Text className="text-island-400 text-center mt-8">Add at least two beings to explore synastry.</Text>
      )}
    </ScrollView>
  );
}
