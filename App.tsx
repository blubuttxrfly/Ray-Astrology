/// <reference types="nativewind" />
import { StatusBar } from "expo-status-bar";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { View, Text } from "react-native";

import { useTheme, ThemeProvider } from "./src/components/ThemeProvider";
import { useProfileStore } from "./src/store/profileStore";
import { useThemeStore } from "./src/store/themeStore";
import { useFonts } from "./src/hooks/useFonts";
import { OnboardingScreen } from "./src/screens/OnboardingScreen";
import { ProfileScreen } from "./src/screens/ProfileScreen";
import { BeingsScreen } from "./src/screens/BeingsScreen";
import { SynastryScreen } from "./src/screens/SynastryScreen";
import { SettingsScreen } from "./src/screens/SettingsScreen";

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

function MainTabs() {
  const { colors, isDark } = useTheme();
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: colors.background,
          borderTopColor: colors.border,
          borderTopWidth: 1,
        },
        tabBarActiveTintColor: colors.accent,
        tabBarInactiveTintColor: colors.textMuted,
      }}
    >
      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          tabBarIcon: ({ color }: { color: string }) => (
            <Text style={{ color, fontSize: 18 }}>☉</Text>
          ),
        }}
      />
      <Tab.Screen
        name="Beings"
        component={BeingsScreen}
        options={{
          tabBarIcon: ({ color }: { color: string }) => (
            <Text style={{ color, fontSize: 18 }}>✦</Text>
          ),
        }}
      />
      <Tab.Screen
        name="Synastry"
        component={SynastryScreen}
        options={{
          tabBarIcon: ({ color }: { color: string }) => (
            <Text style={{ color, fontSize: 18 }}>∞</Text>
          ),
        }}
      />
      <Tab.Screen
        name="Settings"
        component={SettingsScreen}
        options={{
          tabBarIcon: ({ color }: { color: string }) => (
            <Text style={{ color, fontSize: 18 }}>⚙</Text>
          ),
        }}
      />
    </Tab.Navigator>
  );
}

export default function App() {
  const hasCompletedOnboarding = useProfileStore((s) => s.hasCompletedOnboarding);
  const themeReady = useThemeStore((s) => s.ready);
  const fontsLoaded = useFonts();

  if (!themeReady || !fontsLoaded) {
    return (
      <View style={{ flex: 1, alignItems: "center", justifyContent: "center", backgroundColor: "#1a1410" }}>
        <Text style={{ color: "#a5f3fc", fontSize: 18, fontFamily: "Alice" }}>Ray Astrology is awakening...</Text>
      </View>
    );
  }

  return (
    <SafeAreaProvider>
      <ThemeProvider>
        <AppContent hasCompletedOnboarding={hasCompletedOnboarding} />
      </ThemeProvider>
    </SafeAreaProvider>
  );
}

function AppContent({ hasCompletedOnboarding }: { hasCompletedOnboarding: boolean }) {
  const { isDark } = useTheme();

  return (
    <>
      <NavigationContainer>
        <Stack.Navigator screenOptions={{ headerShown: false }}>
          {!hasCompletedOnboarding ? (
            <Stack.Screen name="Onboarding" component={OnboardingScreen} />
          ) : (
            <Stack.Screen name="Main" component={MainTabs} />
          )}
        </Stack.Navigator>
      </NavigationContainer>
      <StatusBar style={isDark ? "light" : "dark"} />
    </>
  );
}
