import { Ionicons } from "@expo/vector-icons";
import * as Linking from "expo-linking";
import { router } from "expo-router";
import { useEffect, useMemo, useState } from "react";
import { ActivityIndicator, Image, KeyboardAvoidingView, Platform, Pressable, StyleSheet, Text, TextInput, View } from "react-native";
import { AppScreen, InfoNotice } from "@/components/native-ui";
import { OAUTH_PORTAL_URL, startOAuthLogin } from "@/constants/oauth";
import { palette } from "@/lib/design";
import { getReferralCode, normalizeReferralCode, setReferralCode } from "@/lib/referral";

type Mode = "login" | "signup";
type Method = "email" | "phone";

const LEGAL_URL = "https://orakzaibond.com/legal";

function isValidEmail(email: string) { return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim()); }

export default function AuthScreen() {
  const [mode, setMode] = useState<Mode>("login");
  const [method, setMethod] = useState<Method>("email");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phone, setPhone] = useState("");
  const [referral, setReferral] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => { void getReferralCode().then((value) => { if (value) setReferral(value); }); }, []);
  const title = useMemo(() => mode === "login" ? "Welcome back" : "Create your account", [mode]);

  const switchMode = (next: Mode) => { setError(null); setMessage(null); setMode(next); };
  const submit = async () => {
    setError(null); setMessage(null);
    if (method === "phone") { setMessage("Phone OTP is not enabled yet. A verified SMS provider and server-side OTP configuration are required before this can be used."); return; }
    if (!isValidEmail(email)) { setError("Enter a valid email address."); return; }
    if (password.length < 8) { setError("Password must be at least 8 characters."); return; }
    if (mode === "signup" && !referral.trim()) { /* referral is optional; intentionally no validation */ }
    if (referral.trim()) await setReferralCode(normalizeReferralCode(referral));
    setMessage("Email authentication is pending backend configuration. No account was created and no password was sent.");
  };
  const continueWithGoogle = async () => {
    setError(null); setMessage(null); setBusy(true);
    try {
      if (!OAUTH_PORTAL_URL) throw new Error("Google authentication is not configured for this build.");
      await startOAuthLogin();
    } catch (err) { setError(err instanceof Error ? err.message : "Google authentication is not configured."); }
    finally { setBusy(false); }
  };
  const openLegal = async () => { await Linking.openURL(LEGAL_URL); };

  return (
    <AppScreen contentStyle={styles.page}>
      <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : undefined}>
        <View style={styles.header}>
          <Image source={require("../assets/images/icon.png")} style={styles.logo} accessibilityLabel="OKBOND logo" />
          <Text style={styles.wordmark}>OKBOND</Text>
          <Text style={styles.eyebrow}>SECURE ACCESS · POLYGON ECOSYSTEM</Text>
        </View>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.subtitle}>Your gateway to a connected digital ecosystem.</Text>
        <View style={styles.modeSwitch} accessibilityRole="tablist">
          {(["login", "signup"] as const).map((item) => (
            <Pressable key={item} accessibilityRole="tab" accessibilityState={{ selected: mode === item }} onPress={() => switchMode(item)} style={[styles.modeButton, mode === item ? styles.modeActive : null]}>
              <Text style={[styles.modeText, mode === item ? styles.modeTextActive : null]}>{item === "login" ? "Log In" : "Create Account"}</Text>
            </Pressable>
          ))}
        </View>
        <Pressable accessibilityRole="button" disabled={busy} onPress={() => { void continueWithGoogle(); }} style={({ pressed }) => [styles.googleButton, pressed ? styles.pressed : null, busy ? styles.disabled : null]}>
          {busy ? <ActivityIndicator color={palette.gold} /> : <Ionicons name="logo-google" size={18} color={palette.goldBright} />}
          <Text style={styles.googleText}>{busy ? "Opening secure sign-in…" : "Continue with Google"}</Text>
        </Pressable>
        <View style={styles.divider}><View style={styles.rule} /><Text style={styles.or}>OR</Text><View style={styles.rule} /></View>
        <View style={styles.methodSwitch}>
          <Pressable onPress={() => { setMethod("email"); setError(null); setMessage(null); }} style={[styles.methodButton, method === "email" ? styles.methodActive : null]}><Text style={[styles.methodText, method === "email" ? styles.methodTextActive : null]}>Email</Text></Pressable>
          <Pressable onPress={() => { setMethod("phone"); setError(null); setMessage(null); }} style={[styles.methodButton, method === "phone" ? styles.methodActive : null]}><Text style={[styles.methodText, method === "phone" ? styles.methodTextActive : null]}>Phone OTP</Text></Pressable>
        </View>
        {method === "email" ? <>
          <TextInput autoCapitalize="none" autoComplete="email" keyboardType="email-address" placeholder="Email address" placeholderTextColor={palette.subtle} value={email} onChangeText={setEmail} style={styles.input} accessibilityLabel="Email address" />
          <View style={styles.passwordWrap}><TextInput autoCapitalize="none" autoComplete="password" placeholder="Password" placeholderTextColor={palette.subtle} secureTextEntry={!showPassword} value={password} onChangeText={setPassword} style={styles.passwordInput} accessibilityLabel="Password" /><Pressable accessibilityRole="button" accessibilityLabel={showPassword ? "Hide password" : "Show password"} onPress={() => setShowPassword((value) => !value)} hitSlop={10}><Ionicons name={showPassword ? "eye-off-outline" : "eye-outline"} size={20} color={palette.subtle} /></Pressable></View>
        </> : <View style={styles.phoneRow}><View style={styles.country}><Text style={styles.countryText}>+92</Text></View><TextInput keyboardType="phone-pad" placeholder="Phone number" placeholderTextColor={palette.subtle} value={phone} onChangeText={setPhone} style={styles.phoneInput} accessibilityLabel="Phone number" /></View>}
        {mode === "signup" ? <TextInput autoCapitalize="characters" placeholder="Referral code (optional)" placeholderTextColor={palette.subtle} value={referral} onChangeText={setReferral} style={styles.input} accessibilityLabel="Optional referral code" /> : <Pressable onPress={() => setMessage("Password reset is pending the same secure email provider configuration; no reset request was sent.")}><Text style={styles.forgot}>Forgot password?</Text></Pressable>}
        {error ? <InfoNotice title="Check your details" tone="warning">{error}</InfoNotice> : null}
        {message ? <InfoNotice title="Not completed" tone="info">{message}</InfoNotice> : null}
        <Pressable accessibilityRole="button" onPress={() => { void submit(); }} style={({ pressed }) => [styles.submit, pressed ? styles.pressed : null]}><Text style={styles.submitText}>{mode === "login" ? "Log In" : "Create Account"}</Text><Ionicons name="arrow-forward-outline" size={18} color={palette.canvas} /></Pressable>
        <Pressable accessibilityRole="button" onPress={() => setMessage("Web3 wallet sign-in is pending WalletConnect plus server-verified SIWE nonce configuration. Connecting a wallet alone will never authenticate an account.")} style={styles.walletButton}><Ionicons name="wallet-outline" size={18} color={palette.gold} /><Text style={styles.walletText}>Connect Web3 Wallet</Text></Pressable>
        <Text style={styles.legal}>By continuing, you agree to the configured terms and acknowledge the <Text style={styles.link} onPress={() => { void openLegal(); }}>Privacy Policy</Text> and Terms of Service.</Text>
        <Pressable onPress={() => router.replace("/onboarding")}><Text style={styles.back}>Review OKBOND introduction</Text></Pressable>
      </KeyboardAvoidingView>
    </AppScreen>
  );
}

const styles = StyleSheet.create({
  page: { flexGrow: 1, justifyContent: "center", paddingTop: 28, paddingBottom: 42, gap: 16 },
  header: { alignItems: "center", gap: 7, marginBottom: 8 }, logo: { width: 72, height: 72, borderRadius: 22 }, wordmark: { color: palette.text, fontSize: 18, fontWeight: "900", letterSpacing: 4 }, eyebrow: { color: palette.gold, fontSize: 9, fontWeight: "800", letterSpacing: 1.4 },
  title: { color: palette.text, fontSize: 30, lineHeight: 36, fontWeight: "800", letterSpacing: -0.8 }, subtitle: { color: palette.subtle, fontSize: 14, lineHeight: 21, marginTop: -8 },
  modeSwitch: { flexDirection: "row", backgroundColor: palette.raised, borderRadius: 14, padding: 4, borderWidth: 1, borderColor: palette.line }, modeButton: { flex: 1, minHeight: 43, alignItems: "center", justifyContent: "center", borderRadius: 10 }, modeActive: { backgroundColor: palette.gold }, modeText: { color: palette.subtle, fontSize: 13, fontWeight: "800" }, modeTextActive: { color: palette.canvas },
  googleButton: { minHeight: 50, borderWidth: 1, borderColor: palette.gold, borderRadius: 14, flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 10 }, googleText: { color: palette.text, fontSize: 13, fontWeight: "800" }, pressed: { opacity: 0.78 }, disabled: { opacity: 0.55 }, divider: { flexDirection: "row", alignItems: "center", gap: 10 }, rule: { flex: 1, height: 1, backgroundColor: palette.line }, or: { color: palette.subtle, fontSize: 10, fontWeight: "800", letterSpacing: 1 },
  methodSwitch: { flexDirection: "row", gap: 8 }, methodButton: { paddingVertical: 8, paddingHorizontal: 13, borderRadius: 20, borderWidth: 1, borderColor: palette.line }, methodActive: { borderColor: palette.gold, backgroundColor: palette.goldSoft }, methodText: { color: palette.subtle, fontSize: 11, fontWeight: "700" }, methodTextActive: { color: palette.goldBright },
  input: { minHeight: 50, backgroundColor: palette.raised, borderWidth: 1, borderColor: palette.line, borderRadius: 14, paddingHorizontal: 15, color: palette.text, fontSize: 14 }, passwordWrap: { minHeight: 50, backgroundColor: palette.raised, borderWidth: 1, borderColor: palette.line, borderRadius: 14, paddingLeft: 15, paddingRight: 14, flexDirection: "row", alignItems: "center" }, passwordInput: { flex: 1, color: palette.text, fontSize: 14 }, phoneRow: { flexDirection: "row", gap: 8 }, country: { minHeight: 50, paddingHorizontal: 14, borderRadius: 14, borderWidth: 1, borderColor: palette.line, backgroundColor: palette.raised, justifyContent: "center" }, countryText: { color: palette.goldBright, fontWeight: "800" }, phoneInput: { flex: 1, minHeight: 50, backgroundColor: palette.raised, borderWidth: 1, borderColor: palette.line, borderRadius: 14, paddingHorizontal: 15, color: palette.text, fontSize: 14 },
  forgot: { alignSelf: "flex-end", color: palette.goldBright, fontSize: 12, fontWeight: "700", marginTop: -6 }, submit: { minHeight: 50, borderRadius: 14, backgroundColor: palette.gold, flexDirection: "row", alignItems: "center", justifyContent: "space-between", paddingHorizontal: 17 }, submitText: { color: palette.canvas, fontSize: 14, fontWeight: "900" }, walletButton: { minHeight: 48, borderRadius: 14, backgroundColor: palette.raised, borderWidth: 1, borderColor: palette.line, flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 9 }, walletText: { color: palette.text, fontSize: 13, fontWeight: "800" }, legal: { color: palette.subtle, textAlign: "center", fontSize: 10, lineHeight: 16 }, link: { color: palette.goldBright, fontWeight: "800" }, back: { color: palette.subtle, textAlign: "center", fontSize: 11, fontWeight: "700" },
});
