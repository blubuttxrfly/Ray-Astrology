import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  ScrollView,
  TouchableOpacity,
  Alert,
} from "react-native";
import { useTheme } from "../components/ThemeProvider";
import { useProfileStore } from "../store/profileStore";

export function OnboardingScreen() {
  const { colors, fontFamily } = useTheme();
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

  const inputStyle = {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    color: colors.text,
    backgroundColor: colors.surface,
    fontFamily,
  };

  return (
    <ScrollView style={{ flex: 1, backgroundColor: colors.background }} contentContainerStyle={{ padding: 24, paddingTop: 48 }}>
      <View style={{ marginBottom: 32 }}>
        <Text style={{ fontSize: 32, fontWeight: "bold", color: colors.accent, marginBottom: 8, fontFamily }}>Ray Astrology</Text>
        <Text style={{ color: colors.textMuted, fontSize: 16, fontFamily }}>
          Enter your birth data to remember your Heartlight from within.
        </Text>
      </View>

      <View style={{ gap: 20 }}>
        {[
          { label: "Your Name", value: name, onChange: setName, placeholder: "e.g., Zaria" },
          { label: "Birth Date (YYYY-MM-DD)", value: birthDate, onChange: setBirthDate, placeholder: "YYYY-MM-DD" },
          { label: "Birth Time (24h HH:MM)", value: birthTime, onChange: setBirthTime, placeholder: "HH:MM" },
          { label: "Birth Location", value: birthPlace, onChange: setBirthPlace, placeholder: "City, Country" },
        ].map((field) => (
          <View key={field.label}>
            <Text style={{ color: colors.text, marginBottom: 6, fontSize: 14, fontFamily }}>{field.label}</Text>
            <TextInput
              value={field.value}
              onChangeText={field.onChange}
              placeholder={field.placeholder}
              placeholderTextColor={colors.textMuted}
              style={inputStyle}
            />
          </View>
        ))}

        <View style={{ flexDirection: "row", gap: 12 }}>
          <View style={{ flex: 1 }}>
            <Text style={{ color: colors.text, marginBottom: 6, fontSize: 14, fontFamily }}>Latitude</Text>
            <TextInput value={lat} onChangeText={setLat} keyboardType="decimal-pad" style={inputStyle} />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={{ color: colors.text, marginBottom: 6, fontSize: 14, fontFamily }}>Longitude</Text>
            <TextInput value={lon} onChangeText={setLon} keyboardType="decimal-pad" style={inputStyle} />
          </View>
        </View>

        <View>
          <Text style={{ color: colors.text, marginBottom: 6, fontSize: 14, fontFamily }}>Timezone Offset (minutes from UTC)</Text>
          <TextInput
            value={timezoneOffset}
            onChangeText={setTimezoneOffset}
            keyboardType="number-pad"
            placeholder="e.g., -300 for EST"
            placeholderTextColor={colors.textMuted}
            style={inputStyle}
          />
        </View>

        <TouchableOpacity
          onPress={handleCreateProfile}
          style={{ backgroundColor: colors.accent, borderRadius: 12, paddingVertical: 16, marginTop: 8 }}
        >
          <Text style={{ color: colors.accentText, textAlign: "center", fontWeight: "bold", fontSize: 16, fontFamily }}>
            Remember My Heartlight
          </Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}
