import AsyncStorage from "@react-native-async-storage/async-storage";
import { Redirect, router } from "expo-router";
import { useEffect, useState } from "react";
import { Image, StyleSheet, Text, View } from "react-native";

import { ActionButton, AppScreen, InfoNotice } from "@/components/native-ui";
import { palette } from "@/lib/design";
import { resolveLaunchDestination, type LaunchDestination } from "@/lib/onboarding";
import { useAuth } from "@/hooks/use-auth";

type LaunchState = "loading" | LaunchDestination | "error";

export default function IndexRoute() {
  const [destination, setDestination] = useState<LaunchState>("loading");
  const [retryCount, setRetryCount] = useState(0);
  const auth = useAuth();

  useEffect(() => {
    let active = true;
    resolveLaunchDestination(AsyncStorage)
      .then((next) => { if (active) setDestination(next); })
      .catch(() => { if (active) setDestination("error"); });
    return () => { active = false; };
  }, [retryCount]);

  if (destination === "auth" && !auth.loading && auth.isAuthenticated) return <Redirect href="/(tabs)" />;
  if (destination === "auth" && !auth.loading) return <Redirect href="/auth" />;
  if (destination === "onboarding") return <Redirect href="/onboarding" />;

  return (
    <AppScreen contentStyle={styles.center}>
      <View style={styles.brandBlock}>
        <Image source={require("../assets/images/onboarding-emblem.jpg")} style={styles.logo} accessible={false} />
        <Text style={styles.wordmark}>OKBOND</Text>
        <Text style={styles.caption}>POLYGON · READ ONLY</Text>
      </View>
      {destination === "error" ? (
        <View style={styles.recovery}>
          <InfoNotice title="Could not check this device’s saved intro">
            Your saved onboarding choice could not be read, so the app has not shown the introduction or changed your stored preference. Retry, or open Home for this session only.
          </InfoNotice>
          <ActionButton label="Retry local check" onPress={() => { setDestination("loading"); setRetryCount((count) => count + 1); }} icon="refresh-outline" />
          <ActionButton label="Open Login for this session" onPress={() => router.replace("/auth")} kind="secondary" icon="arrow-forward-outline" />
        </View>
      ) : null}
    </AppScreen>
  );
}

const styles = StyleSheet.create({
  center: { flexGrow: 1, justifyContent: "center", alignItems: "center" },
  brandBlock: { alignItems: "center", gap: 9 },
  logo: { width: 112, height: 112, borderRadius: 56, marginBottom: 9 },
  wordmark: { color: palette.text, fontSize: 23, fontWeight: "800", letterSpacing: 4 },
  caption: { color: palette.gold, fontSize: 10, fontWeight: "800", letterSpacing: 2.2 },
  recovery: { width: "100%", maxWidth: 430, gap: 12, marginTop: 30 },
});
