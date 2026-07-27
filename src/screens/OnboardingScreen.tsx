import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  Button,
  ScrollView,
  TouchableOpacity,
  Alert,
} from "react-native";
import { useProfileStore } from "../store/profileStore";

export function OnboardingScreen() {
  const [name, setName] = useState("");
  const [birthDate, setBirthDate] = useState("2001-08-22");
  const [birthTime, setBirthTime] = useState("06:38");
  const [birthPlace, setBirthPlace] = useState("Indianapolis, Indiana, USA");
  const [lat, setLat] = useState("39.7684");
  const [lon, setLon] = useState("-86.1581");
  const [timezoneOffset, setTimezoneOffset] = useState("-300");
  const addProfile = useProfileStore((s) => s.addProfile);
  const completeOnboarding = useProfileStore((s) => s.completeOnboarding);

  const handleCreateProfile = () => {
    if (!name.trim()) {
      Alert.alert("Please enter your name");
      return;
    }
    const latNum = parseFloat(lat);
    const lonNum = parseFloat(lon);
    const offsetNum = parseInt(timezoneOffset, 10);
    if (Number.isNaN(latNum) || Number.isNaN(lonNum) || Number.isNaN(offsetNum)) {
      Alert.alert("Please enter valid coordinates and timezone offset");
      return;
    }

    addProfile({
      name: name.trim(),
      birthDate,
      birthTime,
      birthTimezoneOffset: offsetNum,
      birthTimezoneOffsetStandard: offsetNum,
      birthTimeAccurateDST: true,
      birthTimezoneLabel: `${birthPlace} (${timezoneOffset} min)`,
      birthLat: latNum,
      birthLon: lonNum,
      birthPlaceLabel: birthPlace,
      notes: "",
      privacyLevel: "private",
    });

    completeOnboarding();
  };

  return (
    <ScrollView className="flex-1 bg-island-950 px-6 py-12">
      <View className="mb-8">
        <Text className="text-3xl font-bold text-ray-elemental mb-2">Ray Astrology</Text>
        <Text className="text-island-300 text-base">
          Enter your birth data to remember your Heartlight from within.
        </Text>
      </View>

      <View className="space-y-5">
        <View>
          <Text className="text-island-200 mb-1 text-sm">Your Name</Text>
          <TextInput
            value={name}
            onChangeText={setName}
            placeholder="e.g., Zaria"
            placeholderTextColor="#7a5d4d"
            className="border border-island-700 rounded-lg px-4 py-3 text-island-100 bg-island-900"
          />
        </View>

        <View>
          <Text className="text-island-200 mb-1 text-sm">Birth Date (YYYY-MM-DD)</Text>
          <TextInput
            value={birthDate}
            onChangeText={setBirthDate}
            placeholder="YYYY-MM-DD"
            placeholderTextColor="#7a5d4d"
            className="border border-island-700 rounded-lg px-4 py-3 text-island-100 bg-island-900"
          />
        </View>

        <View>
          <Text className="text-island-200 mb-1 text-sm">Birth Time (24h HH:MM)</Text>
          <TextInput
            value={birthTime}
            onChangeText={setBirthTime}
            placeholder="HH:MM"
            placeholderTextColor="#7a5d4d"
            className="border border-island-700 rounded-lg px-4 py-3 text-island-100 bg-island-900"
          />
        </View>

        <View>
          <Text className="text-island-200 mb-1 text-sm">Birth Location</Text>
          <TextInput
            value={birthPlace}
            onChangeText={setBirthPlace}
            placeholder="City, Country"
            placeholderTextColor="#7a5d4d"
            className="border border-island-700 rounded-lg px-4 py-3 text-island-100 bg-island-900"
          />
        </View>

        <View className="flex-row space-x-3">
          <View className="flex-1">
            <Text className="text-island-200 mb-1 text-sm">Latitude</Text>
            <TextInput
              value={lat}
              onChangeText={setLat}
              keyboardType="decimal-pad"
              className="border border-island-700 rounded-lg px-4 py-3 text-island-100 bg-island-900"
            />
          </View>
          <View className="flex-1">
            <Text className="text-island-200 mb-1 text-sm">Longitude</Text>
            <TextInput
              value={lon}
              onChangeText={setLon}
              keyboardType="decimal-pad"
              className="border border-island-700 rounded-lg px-4 py-3 text-island-100 bg-island-900"
            />
          </View>
        </View>

        <View>
          <Text className="text-island-200 mb-1 text-sm">Timezone Offset (minutes from UTC)</Text>
          <TextInput
            value={timezoneOffset}
            onChangeText={setTimezoneOffset}
            keyboardType="number-pad"
            placeholder="e.g., -300 for EST"
            placeholderTextColor="#7a5d4d"
            className="border border-island-700 rounded-lg px-4 py-3 text-island-100 bg-island-900"
          />
        </View>

        <TouchableOpacity
          onPress={handleCreateProfile}
          className="bg-ray-elemental rounded-lg py-4 mt-4"
        >
          <Text className="text-island-950 text-center font-bold text-base">
            Remember My Heartlight
          </Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}
