import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";
import { Alert, Platform, StyleSheet, Text } from "react-native";

import { ActionButton, AppScreen, FadeIn, InfoNotice, PageHeader, SectionHeading, Surface } from "@/components/native-ui";
import { palette } from "@/lib/design";
import { ONBOARDING_STORAGE_KEY } from "@/lib/onboarding";

async function replayIntroduction(): Promise<void> {
  try {
    await AsyncStorage.removeItem(ONBOARDING_STORAGE_KEY);
    router.replace("/onboarding");
  } catch {
    Alert.alert("Unavailable", "The local device preference could not be changed.");
  }
}

export default function SettingsScreen() {
  const resetIntro = () => {
    if (Platform.OS === "web") {
      if (typeof window !== "undefined" && window.confirm("Replay the introduction? This only removes the local intro-completed flag. It does not clear anything from the website or server.")) {
        void replayIntroduction();
      }
      return;
    }

    Alert.alert(
      "Replay introduction?",
      "This only removes the local intro-completed flag. It does not clear anything from the website or server.",
      [
        { text: "Cancel", style: "cancel" },
        { text: "Replay", onPress: () => { void replayIntroduction(); } },
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
          <Text style={styles.title}>App introduction</Text>
          <Text style={styles.body}>You can replay the read-only scope and privacy introduction at any time.</Text>
          <ActionButton label="Replay introduction" onPress={resetIntro} icon="refresh-outline" kind="secondary" />
        </Surface>
        <InfoNotice title="Reduced motion" tone="success">
          Subtle entrance motion follows the operating system accessibility setting. Enable Reduce Motion on your device to disable the entrance animation.
        </InfoNotice>
      </FadeIn>
    </AppScreen>
  );
}

const styles = StyleSheet.create({
  title: { color: palette.text, fontSize: 14, fontWeight: "700" },
  body: { color: palette.subtle, fontSize: 12, lineHeight: 19 },
});
