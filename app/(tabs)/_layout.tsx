import { Ionicons } from "@expo/vector-icons";
import { Redirect, Tabs } from "expo-router";
import { Platform, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { HapticTab } from "@/components/haptic-tab";
import { palette } from "@/lib/design";
import { useAuth } from "@/hooks/use-auth";

export default function TabLayout() {
  const insets = useSafeAreaInsets();
  const auth = useAuth();
  const bottomPadding = Platform.OS === "web" ? 10 : Math.max(insets.bottom, 8);

  if (auth.loading) return <View style={{ flex: 1, backgroundColor: palette.canvas }} />;
  if (!auth.isAuthenticated) return <Redirect href="/auth" />;

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
      <Tabs.Screen name="portfolio" options={{ title: "Markets", tabBarIcon: ({ color, size }) => <Ionicons name="pie-chart-outline" color={color} size={size} /> }} />
      <Tabs.Screen name="activity" options={{ title: "Activity", tabBarIcon: ({ color, size }) => <Ionicons name="time-outline" color={color} size={size} /> }} />
      <Tabs.Screen name="services" options={{ title: "Services", tabBarIcon: ({ color, size }) => <Ionicons name="grid-outline" color={color} size={size} /> }} />
      <Tabs.Screen name="more" options={{ title: "Profile", tabBarIcon: ({ color, size }) => <Ionicons name="person-circle-outline" color={color} size={size} /> }} />
      <Tabs.Screen name="staking" options={{ href: null }} />
    </Tabs>
  );
}
