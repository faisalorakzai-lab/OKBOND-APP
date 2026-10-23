import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";
import { Alert, Platform, StyleSheet, Text } from "react-native";

import { ActionButton, AppScreen, FadeIn, InfoNotice, PageHeader, SectionHeading, Surface } from "@/components/native-ui";
import { palette } from "@/lib/design";
import { resetOnboarding } from "@/lib/onboarding";

async function replayOnboarding(): Promise<void> {
  try {
    await resetOnboarding(AsyncStorage);
    router.replace("/onboarding");
  } catch {
    Alert.alert("Unavailable", "The local onboarding preference could not be changed. Nothing on the website or server was modified.");
  }
}

export default function SettingsScreen() {
  const resetIntro = () => {
    if (Platform.OS === "web") {
      if (typeof window !== "undefined" && window.confirm("Replay onboarding? This only removes the local onboarding-completed flag on this device.")) {
        void replayOnboarding();
      }
      return;
    }

    Alert.alert(
      "Replay onboarding?",
      "This only removes the local onboarding-completed flag on this device. It does not clear anything from the website or server.",
      [
        { text: "Cancel", style: "cancel" },
        { text: "Replay", onPress: () => { void replayOnboarding(); } },
      ],
    );
  };

  return (
    <AppScreen>
      <FadeIn>
        <PageHeader eyebrow="PROFILE & SETTINGS" title="Your app, without an account." subtitle="There is no cloud profile or wallet connection in this version." />
        <InfoNotice title="No personal profile data stored">
          This app stores only an onboarding-completed flag locally on this device. Polygon read requests go to the configured public RPC endpoint.
        </InfoNotice>
        <SectionHeading title="On this device" detail="This preference is kept only in local app storage." />
        <Surface>
          <Text style={styles.title}>Onboarding</Text>
          <Text style={styles.body}>Replay the five-screen read-only scope and privacy introduction at any time.</Text>
          <ActionButton label="Replay Onboarding" onPress={resetIntro} icon="refresh-outline" kind="secondary" />
        </Surface>
        <InfoNotice title="Reduced motion" tone="success">
          Onboarding animations and screen transitions respect the operating system’s reduced-motion setting.
        </InfoNotice>
      </FadeIn>
    </AppScreen>
  );
}

const styles = StyleSheet.create({
  title: { color: palette.text, fontSize: 14, fontWeight: "700" },
  body: { color: palette.subtle, fontSize: 12, lineHeight: 19 },
});
