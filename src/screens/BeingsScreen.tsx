import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  ScrollView,
  TouchableOpacity,
  Alert,
} from "react-native";
import { useProfileStore } from "../store/profileStore";

export function BeingsScreen() {
  const profiles = useProfileStore((s) => s.profiles);
  const addProfile = useProfileStore((s) => s.addProfile);
  const [showAdd, setShowAdd] = useState(false);
  const [name, setName] = useState("");
  const [birthDate, setBirthDate] = useState("2001-08-22");
  const [birthTime, setBirthTime] = useState("06:38");
  const [birthPlace, setBirthPlace] = useState("Indianapolis, Indiana, USA");
  const [lat, setLat] = useState("39.7684");
  const [lon, setLon] = useState("-86.1581");
  const [timezoneOffset, setTimezoneOffset] = useState("-300");

  const handleAdd = () => {
    if (!name.trim()) return;
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
    setShowAdd(false);
    setName("");
  };

  return (
    <ScrollView className="flex-1 px-5 py-6">
      <View className="flex-row items-center justify-between mb-6">
        <Text className="text-2xl font-bold text-ray-elemental">Beings</Text>
        <TouchableOpacity
          onPress={() => setShowAdd(!showAdd)}
          className="bg-island-700 px-4 py-2 rounded-lg"
        >
          <Text className="text-island-100 font-semibold">{showAdd ? "Cancel" : "+ Add"}</Text>
        </TouchableOpacity>
      </View>

      {showAdd && (
        <View className="rounded-2xl p-4 border border-island-700 mb-6 space-y-3">
          <Text className="text-island-200 font-semibold">Add a Being</Text>
          <TextInput
            value={name}
            onChangeText={setName}
            placeholder="Name"
            placeholderTextColor="#7a5d4d"
            className="border border-island-700 rounded-lg px-4 py-3 text-island-100 bg-island-900"
          />
          <TextInput
            value={birthDate}
            onChangeText={setBirthDate}
            placeholder="YYYY-MM-DD"
            placeholderTextColor="#7a5d4d"
            className="border border-island-700 rounded-lg px-4 py-3 text-island-100 bg-island-900"
          />
          <TextInput
            value={birthTime}
            onChangeText={setBirthTime}
            placeholder="HH:MM"
            placeholderTextColor="#7a5d4d"
            className="border border-island-700 rounded-lg px-4 py-3 text-island-100 bg-island-900"
          />
          <TextInput
            value={birthPlace}
            onChangeText={setBirthPlace}
            placeholder="Birth location"
            placeholderTextColor="#7a5d4d"
            className="border border-island-700 rounded-lg px-4 py-3 text-island-100 bg-island-900"
          />
          <View className="flex-row space-x-2">
            <TextInput
              value={lat}
              onChangeText={setLat}
              keyboardType="decimal-pad"
              placeholder="Lat"
              placeholderTextColor="#7a5d4d"
              className="flex-1 border border-island-700 rounded-lg px-4 py-3 text-island-100 bg-island-900"
            />
            <TextInput
              value={lon}
              onChangeText={setLon}
              keyboardType="decimal-pad"
              placeholder="Lon"
              placeholderTextColor="#7a5d4d"
              className="flex-1 border border-island-700 rounded-lg px-4 py-3 text-island-100 bg-island-900"
            />
          </View>
          <TextInput
            value={timezoneOffset}
            onChangeText={setTimezoneOffset}
            keyboardType="number-pad"
            placeholder="Offset minutes from UTC"
            placeholderTextColor="#7a5d4d"
            className="border border-island-700 rounded-lg px-4 py-3 text-island-100 bg-island-900"
          />
          <TouchableOpacity onPress={handleAdd} className="bg-ray-elemental rounded-lg py-3">
            <Text className="text-island-950 text-center font-bold">Add Being</Text>
          </TouchableOpacity>
        </View>
      )}

      <View className="space-y-3">
        {profiles.map((profile) => {
          const sun = profile.natalChart?.bodies.find((b) => b.body === "Sun");
          const moon = profile.natalChart?.bodies.find((b) => b.body === "Moon");
          const asc = profile.natalChart?.ascendant;
          return (
            <View key={profile.id} className="rounded-2xl p-4 border border-island-700">
              <Text className="text-xl font-bold text-island-100">{profile.name}</Text>
              <Text className="text-island-400 text-sm">{profile.birthPlaceLabel}</Text>
              <View className="flex-row flex-wrap gap-2 mt-2">
                {sun && (
                  <Text className="text-sm" style={{ color: sun.rayColor }}>
                    ☉ {sun.signSymbol} {sun.signName}
                  </Text>
                )}
                {moon && (
                  <Text className="text-sm" style={{ color: moon.rayColor }}>
                    ☾ {moon.signSymbol} {moon.signName}
                  </Text>
                )}
                {asc && (
                  <Text className="text-sm" style={{ color: asc.rayColor }}>
                    ASC {asc.signSymbol} {asc.signName}
                  </Text>
                )}
              </View>
            </View>
          );
        })}
      </View>
    </ScrollView>
  );
}
