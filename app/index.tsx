import AsyncStorage from "@react-native-async-storage/async-storage";
import { Redirect } from "expo-router";
import { useEffect, useState } from "react";
import { Image, StyleSheet, Text, View } from "react-native";

import { AppScreen } from "@/components/native-ui";
import { palette } from "@/lib/design";
import { ONBOARDING_STORAGE_KEY } from "@/lib/onboarding";

export default function IndexRoute() {
  const [destination, setDestination] = useState<"loading" | "onboarding" | "app">("loading");

  useEffect(() => {
    let active = true;
    AsyncStorage.getItem(ONBOARDING_STORAGE_KEY)
      .then((value) => { if (active) setDestination(value === "seen" ? "app" : "onboarding"); })
      .catch(() => { if (active) setDestination("onboarding"); });
    return () => { active = false; };
  }, []);

  if (destination === "app") return <Redirect href="/(tabs)" />;
  if (destination === "onboarding") return <Redirect href="/onboarding" />;

  return (
    <AppScreen contentStyle={styles.center}>
      <View style={styles.brandBlock}>
        <Image source={require("../assets/images/icon.png")} style={styles.logo} accessibilityLabel="OKBOND logo" />
        <Text style={styles.wordmark}>OKBOND</Text>
        <Text style={styles.caption}>POLYGON · READ ONLY</Text>
      </View>
    </AppScreen>
  );
}

const styles = StyleSheet.create({
  center: { flexGrow: 1, justifyContent: "center", alignItems: "center" },
  brandBlock: { alignItems: "center", gap: 9 },
  logo: { width: 112, height: 112, borderRadius: 28, marginBottom: 9 },
  wordmark: { color: palette.text, fontSize: 23, fontWeight: "800", letterSpacing: 4 },
  caption: { color: palette.gold, fontSize: 10, fontWeight: "800", letterSpacing: 2.2 },
});
