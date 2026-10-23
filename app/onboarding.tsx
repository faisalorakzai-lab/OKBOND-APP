import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";
import { useRef, useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";

import { OnboardingArtwork } from "@/components/onboarding-artwork";
import { ActionButton, AppScreen, FadeIn, InfoNotice } from "@/components/native-ui";
import { palette } from "@/lib/design";
import { markOnboardingComplete } from "@/lib/onboarding";

const slides = [
  {
    label: "THE EMBLEM",
    title: "The OKBOND ecosystem, in clear view.",
    body: "A calm, read-only mobile companion for exploring OKBOND public information and Services.",
  },
  {
    label: "DIGITAL ASSETS",
    title: "Understand the asset landscape.",
    body: "Explore OKBOND context without connecting a wallet. This app does not show personal holdings or request a signature.",
  },
  {
    label: "CONNECTED ECOSYSTEM",
    title: "Portfolio, Property, and Services.",
    body: "Browse available ecosystem information in one place. Details appear only when a real public source is available.",
  },
  {
    label: "ON-CHAIN CONTEXT",
    title: "Facts before assumptions.",
    body: "Polygon values are informational reads only. The app does not hold assets, sign, or send transactions.",
  },
  {
    label: "OKBOND · PHASE 1",
    title: "Ready to explore?",
    body: "Your OKBOND overview starts here. Account access is available for the protected journey; wallet actions remain disabled.",
  },
] as const;

export default function OnboardingScreen() {
  const [current, setCurrent] = useState(0);
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState(false);
  const savingRef = useRef(false);
  const slide = slides[current];
  const isLast = current === slides.length - 1;

  const moveTo = (next: number) => {
    setSaveError(false);
    setCurrent(Math.max(0, Math.min(slides.length - 1, next)));
  };

  const finish = async () => {
    if (savingRef.current) return;
    savingRef.current = true;
    setSaving(true);
    setSaveError(false);
    try {
      await markOnboardingComplete(AsyncStorage);
      router.replace("/auth");
    } catch {
      setSaveError(true);
      savingRef.current = false;
      setSaving(false);
    }
  };

  const continueThisSession = () => router.replace("/auth");

  return (
    <AppScreen contentStyle={styles.page}>
      <View style={styles.topbar}>
        <Text style={styles.topLabel}>OKBOND · INTRODUCTION</Text>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Skip onboarding and open OKBOND sign in"
          accessibilityHint="Saves this introduction as complete on this device"
          disabled={saving}
          onPress={() => { void finish(); }}
          style={({ pressed }) => [styles.skipButton, pressed ? styles.pressed : null, saving ? styles.disabled : null]}
        >
          <Text style={styles.skipText}>{saving ? "Saving…" : "Skip"}</Text>
        </Pressable>
      </View>

      <View accessibilityLabel={`Screen ${current + 1} of ${slides.length}: ${slide.label}`}>
        <OnboardingArtwork key={`art-${current}`} index={current} />
      </View>

      <FadeIn key={`copy-${current}`}>
        <View style={styles.copy}>
          <Text style={styles.eyebrow}>{String(current + 1).padStart(2, "0")}  /  {slide.label}</Text>
          <Text accessibilityRole="header" style={styles.title}>{slide.title}</Text>
          <Text style={styles.body}>{slide.body}</Text>
        </View>
      </FadeIn>

      <View accessibilityLabel={`Onboarding progress, step ${current + 1} of ${slides.length}`} style={styles.progressRow}>
        {slides.map((item, index) => (
          <View key={item.label} style={[styles.progressTrack, index === current ? styles.progressActive : null]} />
        ))}
      </View>

      <Text style={styles.disclosure}>READ-ONLY DATA · ACCOUNT ACCESS · NO WALLET TRANSACTIONS</Text>

      {saveError ? (
        <View style={styles.errorBlock}>
          <InfoNotice title="Could not save onboarding">
            This device could not store the completion flag. Try again, or continue for this session; the introduction may appear again the next time the app opens.
          </InfoNotice>
          <ActionButton label="Continue for this session" onPress={continueThisSession} kind="secondary" icon="arrow-forward-outline" />
        </View>
      ) : null}

      <View style={styles.actions}>
        {current > 0 ? (
          <ActionButton label="Back" onPress={() => moveTo(current - 1)} kind="secondary" icon="arrow-back-outline" disabled={saving} />
        ) : null}
        <ActionButton
          label={saving ? "Saving…" : isLast ? "Get started" : "Next"}
          onPress={isLast ? () => { void finish(); } : () => moveTo(current + 1)}
          icon={isLast ? "checkmark-outline" : "arrow-forward-outline"}
          disabled={saving}
        />
      </View>
      <Text style={styles.footnote}>Your completion choice is stored locally on this device only.</Text>
    </AppScreen>
  );
}

const styles = StyleSheet.create({
  page: { flexGrow: 1, paddingTop: 8, paddingBottom: 24, gap: 8 },
  topbar: { minHeight: 44, flexDirection: "row", alignItems: "center", justifyContent: "space-between" },
  topLabel: { color: palette.subtle, fontSize: 9, fontWeight: "800", letterSpacing: 1.5 },
  skipButton: { minWidth: 64, minHeight: 44, alignItems: "center", justifyContent: "center", paddingHorizontal: 10, borderRadius: 12 },
  pressed: { backgroundColor: palette.raised },
  disabled: { opacity: 0.55 },
  skipText: { color: palette.goldBright, fontSize: 13, fontWeight: "700" },
  copy: { gap: 9, paddingTop: 1, paddingBottom: 6 },
  eyebrow: { color: palette.gold, fontSize: 10, fontWeight: "800", letterSpacing: 1.6 },
  title: { color: palette.text, fontSize: 27, lineHeight: 33, fontWeight: "800", letterSpacing: -0.55, maxWidth: 390 },
  body: { color: palette.subtle, fontSize: 14, lineHeight: 21, maxWidth: 410 },
  progressRow: { flexDirection: "row", alignItems: "center", gap: 7, marginTop: 3, marginBottom: 1 },
  progressTrack: { height: 3, flex: 1, borderRadius: 2, backgroundColor: palette.line },
  progressActive: { backgroundColor: palette.gold, height: 4 },
  disclosure: { color: palette.subtle, fontSize: 8, fontWeight: "800", letterSpacing: 0.8, marginTop: 2, marginBottom: 4 },
  errorBlock: { gap: 10, marginBottom: 4 },
  actions: { gap: 10, marginTop: 2 },
  footnote: { color: palette.subtle, fontSize: 10, lineHeight: 15, textAlign: "center", marginTop: 1 },
});
