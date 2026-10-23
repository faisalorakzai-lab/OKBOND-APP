import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";
import { Image, StyleSheet, Text, View } from "react-native";

import { ActionButton, AppScreen, FadeIn, InfoNotice } from "@/components/native-ui";
import { palette } from "@/lib/design";
import { ONBOARDING_STORAGE_KEY } from "@/lib/onboarding";

export default function OnboardingScreen() {
  const continueToApp = async () => {
    try {
      await AsyncStorage.setItem(ONBOARDING_STORAGE_KEY, "seen");
    } catch {
      // If storage is unavailable, the app can still be explored without saving personal data.
    }
    router.replace("/(tabs)");
  };

  return (
    <AppScreen contentStyle={styles.content}>
      <FadeIn>
        <View style={styles.hero}>
          <Image source={require("../assets/images/icon.png")} style={styles.logo} accessibilityLabel="OKBOND logo" />
          <Text style={styles.eyebrow}>OKBOND · PHASE 1</Text>
          <Text style={styles.title}>The ecosystem, in clear view.</Text>
          <Text style={styles.body}>Explore OKBOND Services, public Polygon contract information, and ecosystem updates in a native mobile experience.</Text>
        </View>
        <View style={styles.points}>
          <Text style={styles.point}><Text style={styles.pointMark}>01  </Text>Public chain reads only</Text>
          <Text style={styles.point}><Text style={styles.pointMark}>02  </Text>No wallet, login, or personal profile</Text>
          <Text style={styles.point}><Text style={styles.pointMark}>03  </Text>No purchases, deposits, or claims in app</Text>
        </View>
        <InfoNotice title="Informational only">
          Live values appear only when a verified contract read succeeds. Provider or network errors are shown as unavailable, never as a made-up zero.
        </InfoNotice>
        <ActionButton label="Continue to OKBOND" onPress={() => { void continueToApp(); }} icon="arrow-forward-outline" />
        <Text style={styles.footnote}>This introduction flag is stored locally on this device only.</Text>
      </FadeIn>
    </AppScreen>
  );
}

const styles = StyleSheet.create({
  content: { flexGrow: 1, justifyContent: "center", paddingTop: 28, paddingBottom: 34 },
  hero: { alignItems: "center", gap: 12, marginBottom: 27 },
  logo: { width: 114, height: 114, borderRadius: 28, marginBottom: 8 },
  eyebrow: { color: palette.gold, fontSize: 10, fontWeight: "800", letterSpacing: 2.1 },
  title: { color: palette.text, fontSize: 31, lineHeight: 37, textAlign: "center", fontWeight: "800", letterSpacing: -0.8, maxWidth: 360 },
  body: { color: palette.subtle, fontSize: 14, lineHeight: 22, textAlign: "center", maxWidth: 350 },
  points: { gap: 14, padding: 18, backgroundColor: palette.card, borderWidth: 1, borderColor: palette.line, borderRadius: 18, marginBottom: 16 },
  point: { color: palette.text, fontSize: 13, fontWeight: "600" },
  pointMark: { color: palette.gold, fontFamily: "monospace", fontWeight: "800" },
  footnote: { color: palette.subtle, fontSize: 10, lineHeight: 15, textAlign: "center", marginTop: 12 },
});
