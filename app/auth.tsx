import { Ionicons } from "@expo/vector-icons";
import * as Linking from "expo-linking";
import { router } from "expo-router";
import { useEffect, useMemo, useState } from "react";
import { Image, KeyboardAvoidingView, Platform, Pressable, StyleSheet, Text, TextInput, View } from "react-native";

import { AppScreen, InfoNotice } from "@/components/native-ui";
import { OAUTH_PORTAL_URL, startOAuthLogin } from "@/constants/oauth";
import { palette } from "@/lib/design";
import { getReferralCode, normalizeReferralCode, setReferralCode } from "@/lib/referral";
import { isTestnetPreviewEnabled, TESTNET_PREVIEW_USER } from "@/lib/testnet";
import * as Auth from "@/lib/_core/auth";
import { supabase, toAuthUser } from "@/lib/supabase";
import { connectBrowserWallet } from "@/lib/wallet";
import { useMultichainWallet } from "@/lib/use-multichain-wallet";

type Mode = "login" | "signup";
type Method = "email" | "phone";

const LEGAL_URL = "https://orakzaibond.com/legal";
function isValidEmail(email: string) { return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim()); }

export default function AuthScreen() {
  const { open, address: connectedAccountAddress } = useMultichainWallet();
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
  const [walletAddress, setWalletAddress] = useState<string | null>(null);
  const [verificationPending, setVerificationPending] = useState(false);
  const [verificationCode, setVerificationCode] = useState("");

  useEffect(() => { void getReferralCode().then((value) => { if (value) setReferral(value); }); }, []);
  const connectedWalletAddress = connectedAccountAddress ?? walletAddress;
  const title = useMemo(() => mode === "login" ? "Welcome back" : "Create your account", [mode]);
  const switchMode = (next: Mode) => { setError(null); setMessage(null); setVerificationPending(false); setVerificationCode(""); setMode(next); };

  const verifySignupCode = async () => {
    setError(null); setMessage(null);
    const code = verificationCode.trim();
    if (!/^\d{6}$/.test(code)) { setError("Enter the 6-digit verification code from your email."); return; }
    setBusy(true);
    try {
      const result = await supabase.auth.verifyOtp({ email: email.trim().toLowerCase(), token: code, type: "signup" });
      if (result.error) throw result.error;
      if (!result.data.user) throw new Error("Verification succeeded but no user account was returned.");
      await Auth.setUserInfo(toAuthUser(result.data.user));
      router.replace("/(tabs)");
    } catch (err) {
      setError(err instanceof Error ? err.message : "The verification code is invalid or expired.");
    } finally { setBusy(false); }
  };

  const resendSignupCode = async () => {
    setError(null); setMessage(null); setBusy(true);
    try {
      const result = await supabase.auth.resend({ type: "signup", email: email.trim().toLowerCase() });
      if (result.error) throw result.error;
      setMessage("A new 6-digit verification code has been sent. Check Inbox, Spam, and Promotions.");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not resend the verification code.");
    } finally { setBusy(false); }
  };

  const submit = async () => {
    setError(null); setMessage(null);
    setBusy(true);
    if (method === "phone") { setMessage("Phone verification is not configured for this build. No OTP was sent."); setBusy(false); return; }
    if (!isValidEmail(email)) { setError("Enter a valid email address."); setBusy(false); return; }
    if (password.length < 8) { setError("Use at least 8 characters for your password."); setBusy(false); return; }
    try {
      const normalizedReferral = referral.trim() ? normalizeReferralCode(referral) : undefined;
      if (normalizedReferral) await setReferralCode(normalizedReferral);
      if (mode === "signup" && normalizedReferral) {
        const { data: referralIsValid, error: referralError } = await supabase.rpc("is_valid_account_referral", { input_code: normalizedReferral });
        if (referralError) throw referralError;
        if (!referralIsValid) throw new Error("That referral code is not valid. Check it and try again.");
      }
      const result = mode === "login"
        ? await supabase.auth.signInWithPassword({ email: email.trim().toLowerCase(), password })
        : await supabase.auth.signUp({
            email: email.trim().toLowerCase(),
            password,
            options: {
              emailRedirectTo: process.env.EXPO_PUBLIC_AUTH_REDIRECT_URL ?? "https://orakzaibond.com/auth",
              data: { name: email.trim().split("@")[0], referred_by_code: normalizedReferral ?? null },
            },
          });
      if (result.error) throw result.error;
      if (!result.data.user) throw new Error("Supabase did not return a user account.");
      if (!result.data.session) {
        setVerificationPending(true);
        setVerificationCode("");
        setMessage("Account created. Enter the 6-digit code sent to your email to activate it.");
        return;
      }
      await Auth.setUserInfo(toAuthUser(result.data.user));
      router.replace("/(tabs)");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Authentication failed. Please try again.");
    } finally { setBusy(false); }
  };

  const continueWithGoogle = async () => {
    setError(null); setMessage(null); setBusy(true);
    try {
      if (!OAUTH_PORTAL_URL) throw new Error("Google authentication is not configured for this build.");
      await startOAuthLogin();
    } catch (err) { setError(err instanceof Error ? err.message : "Google authentication is not configured."); }
    finally { setBusy(false); }
  };

  const continueWithWallet = async () => {
    setError(null); setMessage(null); setBusy(true);
    try {
      if (Platform.OS !== "web") {
        open({ view: "AllWallets" } as never);
        setMessage("Choose any supported wallet. If it is installed, OKBOND will connect; otherwise you can close this screen.");
      } else {
        try {
          const wallet = await connectBrowserWallet();
          setWalletAddress(wallet.address);
          setMessage(`Wallet connected on ${wallet.chainId}: ${wallet.address.slice(0, 6)}…${wallet.address.slice(-4)}. Wallet sign-in will be enabled after server-side signature verification is configured.`);
        } catch (browserError) {
          if (browserError instanceof Error && browserError.message.startsWith("No browser wallet")) {
            setError("Install MetaMask or open OKBOND inside Trust Wallet's in-app browser to connect a multichain wallet.");
          } else throw browserError;
        }
      }
    } catch (err) { setError(err instanceof Error ? err.message : "Could not connect the wallet."); }
    finally { setBusy(false); }
  };

  const startTestnetPreview = async () => {
    if (!isTestnetPreviewEnabled()) return;
    setBusy(true); setError(null);
    try {
      await Auth.setUserInfo(TESTNET_PREVIEW_USER);
      setMessage("Testnet Preview Account active. No production account, wallet, or transaction is connected.");
      router.replace("/(tabs)");
    } catch { setError("Could not start the local testnet preview session."); }
    finally { setBusy(false); }
  };

  return (
    <AppScreen contentStyle={styles.page}>
      <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : undefined}>
        <View style={styles.brandRow}>
          <Image source={require("../assets/images/icon.png")} style={styles.logo} accessibilityLabel="OKBOND logo" />
          <View style={styles.brandText}><Text style={styles.wordmark}>OKBOND</Text><Text style={styles.eyebrow}>SECURE ACCESS · POLYGON ECOSYSTEM</Text></View>
          <View style={styles.secureBadge}><Ionicons name="shield-checkmark-outline" size={15} color={palette.goldBright} /><Text style={styles.secureText}>SECURE</Text></View>
        </View>

        <View style={styles.intro}><Text style={styles.title}>{title}</Text><Text style={styles.subtitle}>{mode === "login" ? "Continue to your connected OKBOND world." : "Create a secure entry to your OKBOND world."}</Text></View>
        <View style={styles.card}>
          <View style={styles.modeSwitch} accessibilityRole="tablist">{(["login", "signup"] as const).map((item) => <Pressable key={item} accessibilityRole="tab" accessibilityState={{ selected: mode === item }} onPress={() => switchMode(item)} style={[styles.modeButton, mode === item ? styles.modeActive : null]}><Text style={[styles.modeText, mode === item ? styles.modeTextActive : null]}>{item === "login" ? "Log in" : "Create account"}</Text></Pressable>)}</View>

          <Pressable accessibilityRole="button" disabled={busy} onPress={() => { void continueWithGoogle(); }} style={({ pressed }) => [styles.googleButton, pressed ? styles.pressed : null, busy ? styles.disabled : null]}><View style={styles.googleMark}><Text style={styles.googleG}>G</Text></View><Text style={styles.googleText}>{busy ? "Opening secure sign-in…" : "Continue with Google"}</Text></Pressable>
          <View style={styles.divider}><View style={styles.rule} /><Text style={styles.or}>OR CONTINUE WITH</Text><View style={styles.rule} /></View>

          <View style={styles.methodSwitch}><Pressable onPress={() => { setMethod("email"); setError(null); setMessage(null); }} style={[styles.methodButton, method === "email" ? styles.methodActive : null]}><Ionicons name="mail-outline" size={14} color={method === "email" ? palette.goldBright : palette.subtle} /><Text style={[styles.methodText, method === "email" ? styles.methodTextActive : null]}>Email</Text></Pressable><Pressable onPress={() => { setMethod("phone"); setError(null); setMessage(null); }} style={[styles.methodButton, method === "phone" ? styles.methodActive : null]}><Ionicons name="phone-portrait-outline" size={14} color={method === "phone" ? palette.goldBright : palette.subtle} /><Text style={[styles.methodText, method === "phone" ? styles.methodTextActive : null]}>Phone OTP</Text></Pressable></View>
          {method === "email" ? <><View style={styles.field}><Ionicons name="mail-outline" size={17} color={palette.subtle} /><TextInput autoCapitalize="none" autoComplete="email" keyboardType="email-address" placeholder="Email address" placeholderTextColor={palette.subtle} value={email} onChangeText={setEmail} style={styles.input} accessibilityLabel="Email address" /></View><View style={styles.field}><Ionicons name="lock-closed-outline" size={17} color={palette.subtle} /><TextInput autoCapitalize="none" autoComplete="password" placeholder="Password" placeholderTextColor={palette.subtle} secureTextEntry={!showPassword} value={password} onChangeText={setPassword} style={styles.input} accessibilityLabel="Password" /><Pressable accessibilityRole="button" accessibilityLabel={showPassword ? "Hide password" : "Show password"} onPress={() => setShowPassword((value) => !value)} hitSlop={10}><Ionicons name={showPassword ? "eye-off-outline" : "eye-outline"} size={19} color={palette.subtle} /></Pressable></View></> : <View style={styles.field}><Text style={styles.countryText}>+92</Text><TextInput keyboardType="phone-pad" placeholder="Phone number" placeholderTextColor={palette.subtle} value={phone} onChangeText={setPhone} style={styles.input} accessibilityLabel="Phone number" /></View>}
          {mode === "signup" && !verificationPending ? <View style={styles.field}><Ionicons name="gift-outline" size={17} color={palette.subtle} /><TextInput autoCapitalize="characters" placeholder="Referral code (optional)" placeholderTextColor={palette.subtle} value={referral} onChangeText={setReferral} style={styles.input} accessibilityLabel="Optional referral code" /></View> : null}
          {mode === "login" && !verificationPending ? <Pressable onPress={() => setMessage("Password reset is waiting for the secure email provider. No reset request was sent.")}><Text style={styles.forgot}>Forgot password?</Text></Pressable> : null}
          {verificationPending ? <View style={styles.field}><Ionicons name="keypad-outline" size={17} color={palette.subtle} /><TextInput autoCapitalize="none" keyboardType="number-pad" maxLength={6} placeholder="6-digit verification code" placeholderTextColor={palette.subtle} value={verificationCode} onChangeText={setVerificationCode} style={styles.input} accessibilityLabel="6-digit verification code" /></View> : null}
          {verificationPending ? <Pressable accessibilityRole="button" disabled={busy} onPress={() => { void resendSignupCode(); }}><Text style={styles.resend}>Didn't receive it? Resend verification code</Text></Pressable> : null}
          {error ? <InfoNotice title="Check your details" tone="warning">{error}</InfoNotice> : null}
          {message ? <InfoNotice title="Preview status" tone="info">{message}</InfoNotice> : null}
          <Pressable accessibilityRole="button" disabled={busy} onPress={() => { void (verificationPending ? verifySignupCode() : submit()); }} style={({ pressed }) => [styles.submit, pressed ? styles.pressed : null, busy ? styles.disabled : null]}><Text style={styles.submitText}>{verificationPending ? "Verify email" : mode === "login" ? "Log in" : "Create account"}</Text><Ionicons name="arrow-forward-outline" size={18} color={palette.canvas} /></Pressable>
          <Pressable accessibilityRole="button" disabled={busy} onPress={() => { void continueWithWallet(); }} style={[styles.walletButton, busy ? styles.disabled : null]}><Ionicons name="wallet-outline" size={18} color={palette.gold} /><Text style={styles.walletText}>{connectedWalletAddress ? `${connectedWalletAddress.slice(0, 6)}…${connectedWalletAddress.slice(-4)}` : "Continue with wallet"}</Text></Pressable>
        </View>

        {isTestnetPreviewEnabled() ? <View style={styles.testnetCard}><View style={styles.testnetIcon}><Ionicons name="flask-outline" size={18} color={palette.goldBright} /></View><View style={styles.testnetCopy}><Text style={styles.testnetTitle}>Testnet Preview Account</Text><Text style={styles.testnetDetail}>{TESTNET_PREVIEW_USER.email} · Home Screen review only</Text></View><Pressable accessibilityRole="button" onPress={() => { void startTestnetPreview(); }} style={styles.testnetButton}><Text style={styles.testnetButtonText}>Open</Text></Pressable></View> : null}
        <Text style={styles.legal}>By continuing, you agree to the configured terms and acknowledge the <Text style={styles.link} onPress={() => { void Linking.openURL(LEGAL_URL); }}>Privacy Policy</Text> and Terms of Service.</Text>
        <Pressable onPress={() => router.replace("/onboarding")}><Text style={styles.back}>Review OKBOND introduction</Text></Pressable>
      </KeyboardAvoidingView>
    </AppScreen>
  );
}

const styles = StyleSheet.create({
  page: { flexGrow: 1, justifyContent: "center", paddingTop: 22, paddingBottom: 38, gap: 16 }, brandRow: { flexDirection: "row", alignItems: "center", gap: 10 }, logo: { width: 48, height: 48, borderRadius: 15 }, brandText: { flex: 1, gap: 3 }, wordmark: { color: palette.text, fontSize: 17, fontWeight: "900", letterSpacing: 3.2 }, eyebrow: { color: palette.gold, fontSize: 8, fontWeight: "800", letterSpacing: 1.05 }, secureBadge: { flexDirection: "row", alignItems: "center", gap: 4, paddingHorizontal: 9, paddingVertical: 7, borderRadius: 10, backgroundColor: palette.goldSoft, borderWidth: 1, borderColor: palette.gold }, secureText: { color: palette.goldBright, fontSize: 8, fontWeight: "900", letterSpacing: 0.8 }, intro: { gap: 6, marginTop: 13 }, title: { color: palette.text, fontSize: 30, lineHeight: 35, fontWeight: "900", letterSpacing: -0.8 }, subtitle: { color: palette.subtle, fontSize: 13, lineHeight: 19 }, card: { padding: 15, borderRadius: 22, backgroundColor: palette.card, borderWidth: 1, borderColor: palette.line, gap: 13 }, modeSwitch: { flexDirection: "row", backgroundColor: palette.raised, borderRadius: 12, padding: 4 }, modeButton: { flex: 1, minHeight: 42, alignItems: "center", justifyContent: "center", borderRadius: 9 }, modeActive: { backgroundColor: palette.gold }, modeText: { color: palette.subtle, fontSize: 12, fontWeight: "800" }, modeTextActive: { color: palette.canvas }, googleButton: { minHeight: 48, borderWidth: 1, borderColor: palette.line, borderRadius: 13, flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 9, backgroundColor: palette.raised }, googleMark: { width: 22, height: 22, borderRadius: 7, backgroundColor: palette.text, alignItems: "center", justifyContent: "center" }, googleG: { color: palette.canvas, fontSize: 14, fontWeight: "900" }, googleText: { color: palette.text, fontSize: 13, fontWeight: "800" }, divider: { flexDirection: "row", alignItems: "center", gap: 8 }, rule: { flex: 1, height: 1, backgroundColor: palette.line }, or: { color: palette.subtle, fontSize: 8, fontWeight: "900", letterSpacing: 0.8 }, methodSwitch: { flexDirection: "row", gap: 8 }, methodButton: { flexDirection: "row", alignItems: "center", gap: 6, paddingVertical: 8, paddingHorizontal: 12, borderRadius: 20, borderWidth: 1, borderColor: palette.line }, methodActive: { borderColor: palette.gold, backgroundColor: palette.goldSoft }, methodText: { color: palette.subtle, fontSize: 11, fontWeight: "700" }, methodTextActive: { color: palette.goldBright }, field: { minHeight: 50, backgroundColor: palette.raised, borderWidth: 1, borderColor: palette.line, borderRadius: 13, paddingHorizontal: 14, flexDirection: "row", alignItems: "center", gap: 10 }, input: { flex: 1, color: palette.text, fontSize: 14, paddingVertical: 0 }, countryText: { color: palette.goldBright, fontSize: 13, fontWeight: "900" }, forgot: { alignSelf: "flex-end", color: palette.goldBright, fontSize: 11, fontWeight: "800", marginTop: -3 }, resend: { alignSelf: "center", color: palette.goldBright, fontSize: 11, fontWeight: "800", marginTop: -3 }, submit: { minHeight: 49, borderRadius: 13, backgroundColor: palette.gold, flexDirection: "row", alignItems: "center", justifyContent: "space-between", paddingHorizontal: 16 }, submitText: { color: palette.canvas, fontSize: 14, fontWeight: "900" }, walletButton: { minHeight: 47, borderRadius: 13, backgroundColor: palette.raised, borderWidth: 1, borderColor: palette.line, flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 8 }, walletText: { color: palette.text, fontSize: 13, fontWeight: "800" }, testnetCard: { flexDirection: "row", alignItems: "center", gap: 10, padding: 12, borderRadius: 16, backgroundColor: "#16140D", borderWidth: 1, borderColor: "#80621F" }, testnetIcon: { width: 34, height: 34, borderRadius: 11, alignItems: "center", justifyContent: "center", backgroundColor: palette.goldSoft }, testnetCopy: { flex: 1, gap: 3 }, testnetTitle: { color: palette.goldBright, fontSize: 12, fontWeight: "900" }, testnetDetail: { color: palette.subtle, fontSize: 9, lineHeight: 14 }, testnetButton: { paddingHorizontal: 12, paddingVertical: 9, borderRadius: 10, backgroundColor: palette.gold }, testnetButtonText: { color: palette.canvas, fontSize: 11, fontWeight: "900" }, legal: { color: palette.subtle, textAlign: "center", fontSize: 9, lineHeight: 15 }, link: { color: palette.goldBright, fontWeight: "800" }, back: { color: palette.subtle, textAlign: "center", fontSize: 11, fontWeight: "700" }, pressed: { opacity: 0.76 }, disabled: { opacity: 0.55 },
});
