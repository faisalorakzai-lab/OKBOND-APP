import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useEffect, useState } from "react";
import { Image, Pressable, ScrollView, StyleSheet, Text, View, useColorScheme } from "react-native";
import { ScreenContainer } from "@/components/screen-container";
import { useAuth } from "@/hooks/use-auth";
import { useLiveSummary } from "@/hooks/use-live-summary";
import { VERIFIED_CONTRACTS } from "@/lib/contracts";

const GOLD = "#B38A27";
const INK = "#1D1D1F";
const MUTED = "#7A7A7D";
const LINE = "#E8E8EA";
const SOFT = "#F5F5F6";
const DARK = { bg: "#08090B", surface: "#111214", soft: "#17191D", text: "#F8F7F3", muted: "#A3A4A8", line: "#2A2C30", banner: "#43283B" };
const LIGHT = { bg: "#FFFFFF", surface: "#FFFFFF", soft: "#F5F5F6", text: INK, muted: MUTED, line: LINE, banner: "#5B3348" };

const BANNERS = [
  { title: "Your Edge in Web3", body: "Discover OKBOND assets, services and opportunities in one clear place.", icon: "sparkles-outline" as const, color: "#5B3348" },
  { title: "Connected Assets. Clear Moves.", body: "Explore digital assets, vaults and real-world services with confidence.", icon: "layers-outline" as const, color: "#34495E" },
  { title: "Built Around Your World", body: "From property to travel, discover the OKBOND ecosystem as it grows.", icon: "globe-outline" as const, color: "#315B52" },
  { title: "A Smarter Financial Home", body: "A calm, premium view of your wallet, services and activity.", icon: "shield-checkmark-outline" as const, color: "#6A4B2A" },
  { title: "Move With Clarity", body: "Verified reads, honest states and a better way to explore Web3.", icon: "arrow-forward-circle-outline" as const, color: "#3F405B" },
];

const ACTIONS = [
  { label: "Fund", icon: "arrow-down-outline" as const, primary: true, message: "Funding requires a configured wallet or payment provider." },
  { label: "Send", icon: "arrow-up-outline" as const, message: "Send requires a connected wallet and transaction signing." },
  { label: "Swap", icon: "swap-horizontal-outline" as const, message: "Swap requires a verified route and connected wallet." },
  { label: "Earn", icon: "layers-outline" as const, message: "Earn products are not enabled until verified integrations are configured." },
];

const SERVICES = [
  { label: "OKBOND Wallet", icon: "wallet-outline" as const },
  { label: "Vault", icon: "lock-closed-outline" as const },
  { label: "Scan to pay", icon: "qr-code-outline" as const },
  { label: "Property", icon: "business-outline" as const },
  { label: "Travel", icon: "airplane-outline" as const },
];

export default function HomeScreen() {
  const scheme = useColorScheme();
  const C = scheme === "dark" ? DARK : LIGHT;
  const auth = useAuth();
  const live = useLiveSummary();
  const snapshot = live.data;
  const [bannerIndex, setBannerIndex] = useState(0);
  const [balanceVisible, setBalanceVisible] = useState(false);
  const [notice, setNotice] = useState<string | null>(null);
  const displayName = auth.user?.name?.trim() || "OKBOND member";
  const avatarLetter = displayName.slice(0, 1).toUpperCase();
  const banner = BANNERS[bannerIndex];

  useEffect(() => { const timer = setInterval(() => setBannerIndex((value) => (value + 1) % BANNERS.length), 3000); return () => clearInterval(timer); }, []);

  return (
    <ScreenContainer containerClassName={scheme === "dark" ? "bg-black" : "bg-white"} safeAreaClassName={scheme === "dark" ? "bg-black" : "bg-white"} edges={["top", "left", "right"]}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={[styles.page, { backgroundColor: C.bg }]}>
        <View style={styles.header}><View style={styles.brand}><Image source={require("../../assets/images/icon.png")} style={styles.logo} accessibilityLabel="OKBOND logo" /><View><Text style={[styles.wordmark, { color: C.text }]}>OKBOND</Text><View style={styles.network}><View style={styles.dot} /><Text style={[styles.networkText, { color: C.muted }]}>POLYGON · 137</Text></View></View></View><View style={styles.headerActions}><Pressable accessibilityRole="button" accessibilityLabel="Notifications" onPress={() => setNotice("Notifications are not connected yet.")}><Ionicons name="notifications-outline" size={25} color={C.text} /></Pressable><Pressable accessibilityRole="button" accessibilityLabel="Open profile" onPress={() => router.push("/settings")} style={[styles.avatar, { backgroundColor: C.soft }]}><Text style={[styles.avatarText, { color: C.text }]}>{avatarLetter}</Text></Pressable></View></View>

        <Pressable accessibilityRole="button" accessibilityLabel={`OKBOND banner ${bannerIndex + 1} of ${BANNERS.length}`} onPress={() => setNotice("OKBOND services are being connected one verified integration at a time.")} style={[styles.banner, { backgroundColor: scheme === "dark" ? C.banner : banner.color }]}><View style={styles.bannerIcon}><Ionicons name={banner.icon} size={31} color="#F3D58A" /></View><View style={styles.bannerCopy}><Text style={styles.bannerTitle}>{banner.title}</Text><Text style={styles.bannerBody}>{banner.body}</Text></View><Ionicons name="chevron-forward-outline" size={21} color="#FFF" /></Pressable>
        <View style={styles.dots}>{BANNERS.map((item, index) => <Pressable key={item.title} accessibilityRole="button" accessibilityLabel={`Show banner ${index + 1}`} onPress={() => setBannerIndex(index)} style={[styles.dotBanner, index === bannerIndex ? styles.dotBannerActive : null]} />)}</View>

        <View style={styles.profileRow}><View style={[styles.profileAvatar, { backgroundColor: C.soft }]}><Text style={[styles.profileAvatarText, { color: C.text }]}>{avatarLetter}</Text></View><View style={styles.profileCopy}><Text style={[styles.profileName, { color: C.muted }]}>{displayName}</Text><Text style={[styles.profileBalance, { color: C.text }]}>{balanceVisible ? "Unavailable" : "0.00"}<Text style={styles.currency}> USD</Text></Text></View><View style={styles.profileTools}><Pressable accessibilityRole="button" accessibilityLabel={balanceVisible ? "Hide balance" : "Show balance"} onPress={() => setBalanceVisible((value) => !value)}><Ionicons name={balanceVisible ? "eye-outline" : "eye-off-outline"} size={23} color={C.text} /></Pressable><Pressable accessibilityRole="button" accessibilityLabel="Scan to pay" onPress={() => setNotice("Scan to pay is coming soon and is not connected to a provider.")}><Ionicons name="qr-code-outline" size={24} color={C.text} /></Pressable><Pressable accessibilityRole="button" accessibilityLabel="Open activity" onPress={() => router.push("/activity")}><Ionicons name="time-outline" size={26} color={C.text} /></Pressable></View></View>

        <View style={styles.actions}>{ACTIONS.map((action) => <Pressable key={action.label} accessibilityRole="button" onPress={() => setNotice(action.message)} style={({ pressed }) => [styles.action, { backgroundColor: action.primary ? C.text : C.soft }, pressed ? styles.pressed : null]}><Ionicons name={action.icon} size={24} color={action.primary ? C.bg : C.text} /><Text style={[styles.actionLabel, { color: action.primary ? C.bg : C.text }]}>{action.label}</Text></Pressable>)}</View>

        <View style={styles.sectionHeader}><View style={styles.tabs}><Text style={[styles.tabActive, { color: C.text }]}>Services</Text><Text style={[styles.tab, { color: C.muted }]}>Assets</Text><Text style={[styles.tab, { color: C.muted }]}>NFT</Text></View><Pressable onPress={() => router.push("/services")}><Text style={[styles.viewAll, { color: C.text }]}>View all</Text></Pressable></View>
        <View style={styles.services}>{SERVICES.map((service) => <Pressable key={service.label} accessibilityRole="button" onPress={() => setNotice(`${service.label} is coming soon or requires setup.`)} style={({ pressed }) => [styles.service, pressed ? styles.pressed : null]}><View style={[styles.serviceIcon, { backgroundColor: C.soft }]}><Ionicons name={service.icon} size={29} color={GOLD} /></View><Text style={[styles.serviceLabel, { color: C.text }]}>{service.label}</Text></Pressable>)}</View>

        <Pressable accessibilityRole="button" onPress={() => setNotice("Only verified OKBOND integrations will appear here.")} style={[styles.feature, { backgroundColor: C.surface, borderColor: C.line }]}><View style={[styles.featureIcon, { backgroundColor: C.soft }]}><Ionicons name="shield-checkmark-outline" size={32} color={GOLD} /></View><View style={styles.featureCopy}><Text style={[styles.featureTitle, { color: C.text }]}>OKBOND verified ecosystem</Text><Text style={[styles.featureBody, { color: C.muted }]}>Digital assets, vaults and services—presented clearly as they go live.</Text></View><Ionicons name="close-outline" size={20} color={C.muted} /></Pressable>

        <View style={[styles.spend, { backgroundColor: C.soft }]}><View style={styles.spendCopy}><Text style={styles.spendKicker}>CONNECTED ASSETS</Text><Text style={[styles.spendTitle, { color: C.text }]}>Your financial world, beautifully organised.</Text><Text style={[styles.spendBody, { color: C.muted }]}>Personal balances appear after a verified wallet connection.</Text></View><View style={[styles.spendShape, { backgroundColor: C.text }]}><Ionicons name="wallet-outline" size={46} color={GOLD} /></View></View>

        <View style={styles.assetSection}><View style={styles.sectionHeader}><View><Text style={[styles.sectionTitle, { color: C.text }]}>My assets</Text><Text style={[styles.sectionSub, { color: C.muted }]}>Verified Polygon data</Text></View><Pressable onPress={() => router.push("/portfolio")}><Text style={[styles.viewAll, { color: C.text }]}>View all</Text></Pressable></View><Pressable onPress={() => router.push("/portfolio")} style={[styles.assetRow, { borderColor: C.line }]}><View style={[styles.assetIcon, { backgroundColor: C.soft }]}><Text style={styles.assetMark}>OB</Text></View><View style={styles.assetCopy}><Text style={[styles.assetName, { color: C.text }]}>OKBOND</Text><Text style={[styles.assetDetail, { color: C.muted }]}>Polygon · {VERIFIED_CONTRACTS.token.address.slice(0, 8)}…</Text></View><View style={styles.assetRight}><Text style={[styles.assetValue, { color: C.text }]}>{snapshot?.tokenSupply.value ?? (live.isPending ? "Reading…" : "Unavailable")}</Text><Text style={[styles.assetDetail, { color: C.muted }]}>Public supply</Text></View></Pressable></View>
        {notice ? <View style={[styles.notice, scheme === "dark" ? styles.noticeDark : null]}><Text style={styles.noticeTitle}>Setup required</Text><Text style={styles.noticeText}>{notice}</Text></View> : null}
      </ScrollView>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  page: { padding: 20, paddingBottom: 28, gap: 19, backgroundColor: "#FFF" }, header: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" }, brand: { flexDirection: "row", alignItems: "center", gap: 9 }, logo: { width: 42, height: 42, borderRadius: 13 }, wordmark: { color: INK, fontSize: 16, fontWeight: "900", letterSpacing: 2.5 }, network: { flexDirection: "row", alignItems: "center", gap: 5, marginTop: 2 }, dot: { width: 6, height: 6, borderRadius: 3, backgroundColor: "#37B78A" }, networkText: { color: MUTED, fontSize: 8, fontWeight: "900", letterSpacing: 1 }, headerActions: { flexDirection: "row", alignItems: "center", gap: 18 }, avatar: { width: 43, height: 43, borderRadius: 14, backgroundColor: "#F0EEE9", alignItems: "center", justifyContent: "center" }, avatarText: { color: INK, fontSize: 16, fontWeight: "900" }, banner: { minHeight: 146, borderRadius: 25, padding: 17, flexDirection: "row", alignItems: "center", gap: 13 }, bannerIcon: { width: 82, height: 108, borderRadius: 19, backgroundColor: "rgba(0,0,0,.18)", alignItems: "center", justifyContent: "center" }, bannerCopy: { flex: 1, gap: 8 }, bannerTitle: { color: "#FFF", fontSize: 21, lineHeight: 25, fontWeight: "900", letterSpacing: -0.5 }, bannerBody: { color: "rgba(255,255,255,.82)", fontSize: 12, lineHeight: 17 }, dots: { flexDirection: "row", justifyContent: "center", gap: 6, marginTop: -10 }, dotBanner: { width: 6, height: 6, borderRadius: 3, backgroundColor: "#D8D8DA" }, dotBannerActive: { width: 20, backgroundColor: GOLD }, profileRow: { flexDirection: "row", alignItems: "center", gap: 12 }, profileAvatar: { width: 62, height: 62, borderRadius: 20, backgroundColor: "#EDEDED", alignItems: "center", justifyContent: "center" }, profileAvatarText: { color: INK, fontSize: 24, fontWeight: "900" }, profileCopy: { flex: 1, gap: 2 }, profileName: { color: "#66666A", fontSize: 16, fontWeight: "700" }, profileBalance: { color: INK, fontSize: 29, lineHeight: 32, fontWeight: "900" }, currency: { color: MUTED, fontSize: 12, fontWeight: "800" }, profileTools: { flexDirection: "row", alignItems: "center", gap: 17 }, actions: { flexDirection: "row", justifyContent: "space-between", gap: 10 }, action: { flex: 1, height: 108, borderRadius: 25, backgroundColor: SOFT, alignItems: "center", justifyContent: "center", gap: 12 }, actionPrimary: { backgroundColor: INK }, actionLabel: { color: INK, fontSize: 15, fontWeight: "900" }, actionLabelPrimary: { color: "#FFF" }, sectionHeader: { flexDirection: "row", alignItems: "center", justifyContent: "space-between" }, tabs: { flexDirection: "row", alignItems: "center", gap: 25 }, tabActive: { color: INK, fontSize: 18, fontWeight: "900" }, tab: { color: "#A4A4A7", fontSize: 18, fontWeight: "700" }, viewAll: { color: "#55555A", fontSize: 13, fontWeight: "700", textDecorationLine: "underline" }, services: { flexDirection: "row", gap: 14 }, service: { width: 78, alignItems: "center", gap: 8 }, serviceIcon: { width: 72, height: 72, borderRadius: 22, backgroundColor: SOFT, alignItems: "center", justifyContent: "center" }, serviceLabel: { color: INK, fontSize: 10, lineHeight: 13, fontWeight: "700", textAlign: "center" }, feature: { minHeight: 100, borderRadius: 20, borderWidth: 1, borderColor: LINE, padding: 14, flexDirection: "row", alignItems: "center", gap: 12 }, featureIcon: { width: 68, height: 70, borderRadius: 17, backgroundColor: "#F2EEE4", alignItems: "center", justifyContent: "center" }, featureCopy: { flex: 1, gap: 6 }, featureTitle: { color: INK, fontSize: 14, fontWeight: "900" }, featureBody: { color: MUTED, fontSize: 11, lineHeight: 16 }, spend: { minHeight: 178, borderRadius: 22, backgroundColor: "#F6F6F5", padding: 20, overflow: "hidden", flexDirection: "row", alignItems: "center" }, spendCopy: { flex: 1, gap: 7, zIndex: 2 }, spendKicker: { color: GOLD, fontSize: 9, fontWeight: "900", letterSpacing: 1.4 }, spendTitle: { color: INK, fontSize: 21, lineHeight: 25, fontWeight: "900" }, spendBody: { color: MUTED, fontSize: 11, lineHeight: 16 }, spendShape: { width: 116, height: 165, borderRadius: 25, backgroundColor: INK, alignItems: "center", justifyContent: "center", transform: [{ rotate: "-14deg" }], marginRight: -28 }, assetSection: { gap: 11 }, sectionTitle: { color: INK, fontSize: 18, fontWeight: "900" }, sectionSub: { color: MUTED, fontSize: 10, marginTop: 3 }, assetRow: { minHeight: 68, borderTopWidth: 1, borderBottomWidth: 1, borderColor: LINE, flexDirection: "row", alignItems: "center", gap: 11 }, assetIcon: { width: 42, height: 42, borderRadius: 14, backgroundColor: "#F2EEE4", alignItems: "center", justifyContent: "center" }, assetMark: { color: GOLD, fontSize: 11, fontWeight: "900" }, assetCopy: { flex: 1, gap: 3 }, assetName: { color: INK, fontSize: 13, fontWeight: "900" }, assetDetail: { color: MUTED, fontSize: 10 }, assetRight: { alignItems: "flex-end", gap: 3 }, assetValue: { color: INK, fontSize: 11, fontWeight: "800" }, notice: { padding: 13, borderRadius: 14, backgroundColor: "#FFF8E8", borderWidth: 1, borderColor: "#E6C975", gap: 4 }, noticeTitle: { color: "#765A1B", fontSize: 12, fontWeight: "900" }, noticeText: { color: "#806F4A", fontSize: 11, lineHeight: 16 }, noticeDark: { backgroundColor: "#211B10", borderColor: "#6C5420" }, pressed: { opacity: 0.68 },
});
