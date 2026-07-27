/// <reference types="nativewind" />
import { StatusBar } from "expo-status-bar";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { View, Text } from "react-native";

import { useThemeStore } from "./src/store/themeStore";
import { useProfileStore } from "./src/store/profileStore";
import { OnboardingScreen } from "./src/screens/OnboardingScreen";
import { ProfileScreen } from "./src/screens/ProfileScreen";
import { BeingsScreen } from "./src/screens/BeingsScreen";
import { SynastryScreen } from "./src/screens/SynastryScreen";
import { SettingsScreen } from "./src/screens/SettingsScreen";
import { ThemeProvider } from "./src/components/ThemeProvider";

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

function MainTabs() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarStyle: { backgroundColor: "#1a1410", borderTopColor: "#3d2d20" },
        tabBarActiveTintColor: "#a5f3fc",
        tabBarInactiveTintColor: "#7a5d4d",
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

  if (!themeReady) {
    return (
      <View className="flex-1 items-center justify-center bg-island-950">
        <Text className="text-ray-elemental text-lg">Ray Astrology is awakening...</Text>
      </View>
    );
  }

  return (
    <SafeAreaProvider>
      <ThemeProvider>
        <NavigationContainer>
          <Stack.Navigator screenOptions={{ headerShown: false }}>
            {!hasCompletedOnboarding ? (
              <Stack.Screen name="Onboarding" component={OnboardingScreen} />
            ) : (
              <Stack.Screen name="Main" component={MainTabs} />
            )}
          </Stack.Navigator>
        </NavigationContainer>
        <StatusBar style="light" />
      </ThemeProvider>
    </SafeAreaProvider>
  );
}
