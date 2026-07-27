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

export function BeingsScreen() {
  const { colors, fontFamily } = useTheme();
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
    <ScrollView style={{ flex: 1, backgroundColor: colors.background }} contentContainerStyle={{ padding: 20 }}>
      <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginBottom: 24 }}>
        <Text style={{ fontSize: 24, fontWeight: "bold", color: colors.text, fontFamily }}>Beings</Text>
        <TouchableOpacity
          onPress={() => setShowAdd(!showAdd)}
          style={{ backgroundColor: colors.surfaceAlt, paddingHorizontal: 16, paddingVertical: 8, borderRadius: 8 }}
        >
          <Text style={{ color: colors.text, fontWeight: "600", fontFamily }}>{showAdd ? "Cancel" : "+ Add"}</Text>
        </TouchableOpacity>
      </View>

      {showAdd && (
        <View style={{ backgroundColor: colors.card, borderRadius: 16, padding: 16, borderWidth: 1, borderColor: colors.border, marginBottom: 24, gap: 12 }}>
          <Text style={{ color: colors.text, fontWeight: "600", fontFamily }}>Add a Being</Text>
          <TextInput value={name} onChangeText={setName} placeholder="Name" placeholderTextColor={colors.textMuted} style={inputStyle} />
          <TextInput value={birthDate} onChangeText={setBirthDate} placeholder="YYYY-MM-DD" placeholderTextColor={colors.textMuted} style={inputStyle} />
          <TextInput value={birthTime} onChangeText={setBirthTime} placeholder="HH:MM" placeholderTextColor={colors.textMuted} style={inputStyle} />
          <TextInput value={birthPlace} onChangeText={setBirthPlace} placeholder="Birth location" placeholderTextColor={colors.textMuted} style={inputStyle} />
          <View style={{ flexDirection: "row", gap: 12 }}>
            <TextInput value={lat} onChangeText={setLat} keyboardType="decimal-pad" placeholder="Lat" placeholderTextColor={colors.textMuted} style={[inputStyle, { flex: 1 }]} />
            <TextInput value={lon} onChangeText={setLon} keyboardType="decimal-pad" placeholder="Lon" placeholderTextColor={colors.textMuted} style={[inputStyle, { flex: 1 }]} />
          </View>
          <TextInput value={timezoneOffset} onChangeText={setTimezoneOffset} keyboardType="number-pad" placeholder="Offset minutes from UTC" placeholderTextColor={colors.textMuted} style={inputStyle} />
          <TouchableOpacity onPress={handleAdd} style={{ backgroundColor: colors.accent, borderRadius: 12, paddingVertical: 12 }}>
            <Text style={{ color: colors.accentText, textAlign: "center", fontWeight: "bold", fontFamily }}>Add Being</Text>
          </TouchableOpacity>
        </View>
      )}

      <View style={{ gap: 12 }}>
        {profiles.map((profile) => {
          const sun = profile.natalChart?.bodies.find((b) => b.body === "Sun");
          const moon = profile.natalChart?.bodies.find((b) => b.body === "Moon");
          const asc = profile.natalChart?.ascendant;
          return (
            <View key={profile.id} style={{ backgroundColor: colors.card, borderRadius: 16, padding: 16, borderWidth: 1, borderColor: colors.border }}>
              <Text style={{ fontSize: 20, fontWeight: "bold", color: colors.text, fontFamily }}>{profile.name}</Text>
              <Text style={{ color: colors.textMuted, fontSize: 14, fontFamily }}>{profile.birthPlaceLabel}</Text>
              <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 8, marginTop: 8 }}>
                {sun && (
                  <Text style={{ fontSize: 14, color: sun.rayColor, fontFamily }}>☉ {sun.signSymbol} {sun.signName}</Text>
                )}
                {moon && (
                  <Text style={{ fontSize: 14, color: moon.rayColor, fontFamily }}>☾ {moon.signSymbol} {moon.signName}</Text>
                )}
                {asc && (
                  <Text style={{ fontSize: 14, color: asc.rayColor, fontFamily }}>ASC {asc.signSymbol} {asc.signName}</Text>
                )}
              </View>
            </View>
          );
        })}
      </View>
    </ScrollView>
  );
}
