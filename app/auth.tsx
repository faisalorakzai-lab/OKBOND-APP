import { Ionicons } from "@expo/vector-icons";
import * as Linking from "expo-linking";
import * as WebBrowser from "expo-web-browser";
import { router, useLocalSearchParams } from "expo-router";
import { useEffect, useMemo, useState } from "react";
import { Image, KeyboardAvoidingView, Platform, Pressable, StyleSheet, Text, TextInput, View } from "react-native";

import { AppScreen, InfoNotice } from "@/components/native-ui";
import { palette } from "@/lib/design";
import { getReferralCode, normalizeReferralCode, setReferralCode } from "@/lib/referral";
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
  const oauthParams = useLocalSearchParams<{ code?: string }>();
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
  useEffect(() => {
    if (Platform.OS === "web" || !oauthParams.code) return;
    let active = true;
    void supabase.auth.exchangeCodeForSession(oauthParams.code).then(async ({ data, error: exchangeError }) => {
      if (!active) return;
      if (exchangeError) { setError(exchangeError.message); return; }
      if (data.user) { await Auth.setUserInfo(toAuthUser(data.user)); router.replace("/(tabs)"); }
    });
    return () => { active = false; };
  }, [oauthParams.code]);
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
      const redirectTo = Platform.OS === "web" && typeof window !== "undefined"
        ? `${window.location.origin}/auth`
        : Linking.createURL("/auth");
      const { data, error: oauthError } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: { redirectTo, skipBrowserRedirect: Platform.OS !== "web" },
      });
      if (oauthError) throw oauthError;
      if (Platform.OS !== "web" && data.url) {
        const result = await WebBrowser.openAuthSessionAsync(data.url, redirectTo);
        if (result.type === "success") {
          const callbackUrl = new URL(result.url);
          const code = callbackUrl.searchParams.get("code");
          if (code) {
            const { data: sessionData, error: exchangeError } = await supabase.auth.exchangeCodeForSession(code);
            if (exchangeError) throw exchangeError;
            if (sessionData.user) { await Auth.setUserInfo(toAuthUser(sessionData.user)); router.replace("/(tabs)"); }
          }
        }
      }
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

  return (
    <AppScreen contentStyle={styles.page}>
      <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : undefined}>
        <View style={styles.brandRow}>
          <Image source={require("../assets/images/icon.png")} style={styles.logo} accessibilityLabel="OKBOND logo" />
          <Text style={styles.wordmark}>OKBOND</Text>
        </View>

        <View style={styles.intro}><Text style={styles.title}>{title}</Text><Text style={styles.subtitle}>{mode === "login" ? "Sign in to your account." : "Create your account."}</Text></View>
        <View style={styles.form}>
          <View style={styles.modeSwitch} accessibilityRole="tablist">{(["login", "signup"] as const).map((item) => <Pressable key={item} accessibilityRole="tab" accessibilityState={{ selected: mode === item }} onPress={() => switchMode(item)} style={[styles.modeButton, mode === item ? styles.modeActive : null]}><Text style={[styles.modeText, mode === item ? styles.modeTextActive : null]}>{item === "login" ? "Log in" : "Create account"}</Text></Pressable>)}</View>

          <Pressable accessibilityRole="button" disabled={busy} onPress={() => { void continueWithGoogle(); }} style={({ pressed }) => [styles.googleButton, pressed ? styles.pressed : null, busy ? styles.disabled : null]}><Ionicons name="logo-google" size={18} color={palette.text} /><Text style={styles.googleText}>{busy ? "Opening Google…" : "Continue with Google"}</Text></Pressable>
          <View style={styles.divider}><View style={styles.rule} /><Text style={styles.or}>OR</Text><View style={styles.rule} /></View>

          <View style={styles.methodSwitch}><Pressable onPress={() => { setMethod("email"); setError(null); setMessage(null); }} style={[styles.methodButton, method === "email" ? styles.methodActive : null]}><Ionicons name="mail-outline" size={14} color={method === "email" ? palette.goldBright : palette.subtle} /><Text style={[styles.methodText, method === "email" ? styles.methodTextActive : null]}>Email</Text></Pressable><Pressable onPress={() => { setMethod("phone"); setError(null); setMessage(null); }} style={[styles.methodButton, method === "phone" ? styles.methodActive : null]}><Ionicons name="phone-portrait-outline" size={14} color={method === "phone" ? palette.goldBright : palette.subtle} /><Text style={[styles.methodText, method === "phone" ? styles.methodTextActive : null]}>Phone</Text></Pressable></View>
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

        <Text style={styles.legal}>By continuing, you agree to our <Text style={styles.link} onPress={() => { void Linking.openURL(LEGAL_URL); }}>Terms and Privacy Policy</Text>.</Text>
      </KeyboardAvoidingView>
    </AppScreen>
  );
}

const styles = StyleSheet.create({
  page: { flexGrow: 1, justifyContent: "center", paddingTop: 20, paddingBottom: 28, gap: 22 }, brandRow: { flexDirection: "row", alignItems: "center", gap: 10 }, logo: { width: 38, height: 38, borderRadius: 11 }, brandText: { flex: 1, gap: 3 }, wordmark: { color: palette.text, fontSize: 16, fontWeight: "900", letterSpacing: 2.8 }, intro: { gap: 5, marginTop: 6 }, title: { color: palette.text, fontSize: 27, lineHeight: 32, fontWeight: "800", letterSpacing: -0.5 }, subtitle: { color: palette.subtle, fontSize: 13, lineHeight: 18 }, form: { gap: 15 }, modeSwitch: { flexDirection: "row", borderBottomWidth: 1, borderBottomColor: palette.line, gap: 24 }, modeButton: { minHeight: 40, alignItems: "center", justifyContent: "center", paddingHorizontal: 2, borderBottomWidth: 2, borderBottomColor: "transparent" }, modeActive: { borderBottomColor: palette.gold }, modeText: { color: palette.subtle, fontSize: 12, fontWeight: "700" }, modeTextActive: { color: palette.text }, googleButton: { minHeight: 48, borderWidth: 1, borderColor: palette.line, borderRadius: 12, flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 9, backgroundColor: palette.raised }, googleText: { color: palette.text, fontSize: 13, fontWeight: "800" }, divider: { flexDirection: "row", alignItems: "center", gap: 8 }, rule: { flex: 1, height: 1, backgroundColor: palette.line }, or: { color: palette.subtle, fontSize: 9, fontWeight: "800", letterSpacing: 0.8 }, methodSwitch: { flexDirection: "row", gap: 8 }, methodButton: { flexDirection: "row", alignItems: "center", gap: 6, paddingVertical: 7, paddingHorizontal: 10, borderRadius: 16 }, methodActive: { backgroundColor: palette.goldSoft }, methodText: { color: palette.subtle, fontSize: 11, fontWeight: "700" }, methodTextActive: { color: palette.goldBright }, field: { minHeight: 50, backgroundColor: palette.raised, borderWidth: 1, borderColor: palette.line, borderRadius: 11, paddingHorizontal: 13, flexDirection: "row", alignItems: "center", gap: 10 }, input: { flex: 1, color: palette.text, fontSize: 14, paddingVertical: 0 }, countryText: { color: palette.goldBright, fontSize: 13, fontWeight: "900" }, forgot: { alignSelf: "flex-end", color: palette.goldBright, fontSize: 11, fontWeight: "800", marginTop: -5 }, resend: { alignSelf: "center", color: palette.goldBright, fontSize: 11, fontWeight: "800", marginTop: -5 }, submit: { minHeight: 49, borderRadius: 12, backgroundColor: palette.gold, flexDirection: "row", alignItems: "center", justifyContent: "space-between", paddingHorizontal: 16 }, submitText: { color: palette.canvas, fontSize: 14, fontWeight: "900" }, walletButton: { minHeight: 47, borderRadius: 12, backgroundColor: "transparent", borderWidth: 1, borderColor: palette.line, flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 8 }, walletText: { color: palette.text, fontSize: 13, fontWeight: "800" }, legal: { color: palette.subtle, textAlign: "center", fontSize: 9, lineHeight: 15 }, link: { color: palette.goldBright, fontWeight: "800" }, pressed: { opacity: 0.76 }, disabled: { opacity: 0.55 },
});
