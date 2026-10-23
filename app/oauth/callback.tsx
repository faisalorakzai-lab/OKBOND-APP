import { router, useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import { ActivityIndicator, StyleSheet, Text, View } from "react-native";
import { AppScreen, ActionButton, InfoNotice } from "@/components/native-ui";
import * as Api from "@/lib/_core/api";
import * as Auth from "@/lib/_core/auth";
import { palette } from "@/lib/design";

export default function OAuthCallbackScreen() {
  const params = useLocalSearchParams<{ code?: string; state?: string }>();
  const [error, setError] = useState<string | null>(null);
  useEffect(() => {
    let active = true;
    const finish = async () => {
      if (!params.code || !params.state) { if (active) setError("The sign-in callback was incomplete. Please try again."); return; }
      try {
        const result = await Api.exchangeOAuthCode(params.code, params.state);
        await Auth.setSessionToken(result.sessionToken);
        await Auth.setUserInfo({ id: result.user.id, openId: result.user.openId, name: result.user.name, email: result.user.email, loginMethod: result.user.loginMethod, lastSignedIn: new Date(result.user.lastSignedIn) });
        if (active) router.replace("/(tabs)");
      } catch { if (active) setError("Secure sign-in could not be completed. Verify the OAuth portal, redirect URI, and backend configuration."); }
    };
    void finish();
    return () => { active = false; };
  }, [params.code, params.state]);
  return <AppScreen contentStyle={styles.page}><View style={styles.center}><Text style={styles.eyebrow}>OKBOND · SECURE CALLBACK</Text>{error ? <><InfoNotice title="Sign-in not completed" tone="warning">{error}</InfoNotice><ActionButton label="Return to login" onPress={() => router.replace("/auth")} icon="arrow-back-outline" /></> : <><ActivityIndicator color={palette.gold} size="large" /><Text style={styles.title}>Finishing secure sign-in…</Text><Text style={styles.body}>Your session is being exchanged without exposing provider secrets in the app.</Text></>}</View></AppScreen>;
}
const styles = StyleSheet.create({ page: { flexGrow: 1, justifyContent: "center" }, center: { gap: 16 }, eyebrow: { color: palette.gold, fontSize: 10, fontWeight: "800", letterSpacing: 1.6 }, title: { color: palette.text, fontSize: 22, fontWeight: "800" }, body: { color: palette.subtle, fontSize: 13, lineHeight: 20 }, });
