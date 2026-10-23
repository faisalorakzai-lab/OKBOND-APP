import { Ionicons } from "@expo/vector-icons";
import { Tabs } from "expo-router";
import { Platform } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { HapticTab } from "@/components/haptic-tab";
import { palette } from "@/lib/design";

export default function TabLayout() {
  const insets = useSafeAreaInsets();
  const bottomPadding = Platform.OS === "web" ? 10 : Math.max(insets.bottom, 8);

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarButton: HapticTab,
        tabBarActiveTintColor: palette.gold,
        tabBarInactiveTintColor: palette.subtle,
        tabBarLabelStyle: { fontSize: 10, fontWeight: "700", letterSpacing: 0.2, marginTop: 1 },
        tabBarStyle: {
          height: 58 + bottomPadding,
          paddingTop: 7,
          paddingBottom: bottomPadding,
          backgroundColor: palette.canvas,
          borderTopColor: palette.line,
          borderTopWidth: 1,
        },
      }}
    >
      <Tabs.Screen name="index" options={{ title: "Home", tabBarIcon: ({ color, size }) => <Ionicons name="home-outline" color={color} size={size} /> }} />
      <Tabs.Screen name="portfolio" options={{ title: "Portfolio", tabBarIcon: ({ color, size }) => <Ionicons name="pie-chart-outline" color={color} size={size} /> }} />
      <Tabs.Screen name="services" options={{ title: "Services", tabBarIcon: ({ color, size }) => <Ionicons name="grid-outline" color={color} size={size} /> }} />
      <Tabs.Screen name="staking" options={{ title: "Staking", tabBarIcon: ({ color, size }) => <Ionicons name="lock-closed-outline" color={color} size={size} /> }} />
      <Tabs.Screen name="more" options={{ title: "More", tabBarIcon: ({ color, size }) => <Ionicons name="ellipsis-horizontal-circle-outline" color={color} size={size} /> }} />
    </Tabs>
  );
}
