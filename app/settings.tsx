import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";
import { Alert, Platform, StyleSheet, Text } from "react-native";

import { ActionButton, AppScreen, FadeIn, InfoNotice, PageHeader, SectionHeading, Surface } from "@/components/native-ui";
import { palette } from "@/lib/design";
import { resetOnboarding } from "@/lib/onboarding";
import { useAuth } from "@/hooks/use-auth";

async function replayOnboarding(): Promise<void> {
  try {
    await resetOnboarding(AsyncStorage);
    router.replace("/onboarding");
  } catch {
    Alert.alert("Unavailable", "The local onboarding preference could not be changed. Nothing on the website or server was modified.");
  }
}

export default function SettingsScreen() {
  const auth = useAuth();
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
        <PageHeader eyebrow="PROFILE & SETTINGS" title={auth.user?.name ? `Welcome, ${auth.user.name}.` : "Your OKBOND account."} subtitle={auth.user?.email ?? "Authenticated session"} />
        <InfoNotice title="Session protected">
          Your session is stored with platform-appropriate secure storage on native devices. Signing out removes the local session and user cache.
        </InfoNotice>
        <SectionHeading title="On this device" detail="This preference is kept only in local app storage." />
        <Surface>
          <Text style={styles.title}>Onboarding</Text>
          <Text style={styles.body}>Replay the five-screen read-only scope and privacy introduction at any time.</Text>
          <ActionButton label="Replay Onboarding" onPress={resetIntro} icon="refresh-outline" kind="secondary" />
        </Surface>
        <Surface>
          <Text style={styles.title}>Account access</Text>
          <Text style={styles.body}>Sign out when you finish using this device. You can return through the OKBOND authentication screen.</Text>
          <ActionButton label="Sign Out" onPress={() => { void auth.logout().then(() => router.replace("/auth")); }} icon="log-out-outline" kind="secondary" />
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
