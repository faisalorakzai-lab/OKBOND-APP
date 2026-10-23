import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useState } from "react";
import { Image, Pressable, StyleSheet, Text, View } from "react-native";

import { AppScreen, FadeIn, InfoNotice, LiveReadStatus } from "@/components/native-ui";
import { useAuth } from "@/hooks/use-auth";
import { useLiveSummary } from "@/hooks/use-live-summary";
import { palette } from "@/lib/design";
import { VERIFIED_CONTRACTS } from "@/lib/contracts";

const ACTIONS = [
  { label: "Send", icon: "arrow-up-outline" as const, message: "Send requires a connected wallet and transaction signing." },
  { label: "Receive", icon: "arrow-down-outline" as const, message: "Receive requires a connected wallet address." },
  { label: "Buy", icon: "card-outline" as const, message: "Buy Crypto requires a verified payment provider." },
  { label: "Swap", icon: "swap-horizontal-outline" as const, message: "Swap requires a verified route and connected wallet." },
];

const ECOSYSTEM = [
  { title: "Digital Assets", detail: "Wallet, assets, markets", icon: "wallet-outline" as const, route: "/portfolio" as const },
  { title: "Wealth & Vault", detail: "Vault, staking, rewards", icon: "lock-closed-outline" as const, route: "/vault" as const },
  { title: "Real Estate", detail: "Property services", icon: "business-outline" as const, route: "/services" as const },
  { title: "Travel & Transport", detail: "Bookings and mobility", icon: "airplane-outline" as const, route: "/services" as const },
  { title: "Payments & Utilities", detail: "Bills and merchants", icon: "receipt-outline" as const, route: "/services" as const },
  { title: "Governance & Rewards", detail: "Community features", icon: "people-outline" as const, route: "/services" as const },
];

export default function HomeScreen() {
  const auth = useAuth();
  const live = useLiveSummary();
  const snapshot = live.data;
  const [balanceVisible, setBalanceVisible] = useState(false);
  const [notice, setNotice] = useState<string | null>(null);
  const displayName = auth.user?.name?.trim() || "OKBOND member";
  const avatarLetter = displayName.slice(0, 1).toUpperCase();

  return (
    <AppScreen contentStyle={styles.page}>
      <FadeIn>
        <View style={styles.header}>
          <View style={styles.brand}><Image source={require("../../assets/images/icon.png")} style={styles.logo} accessibilityLabel="OKBOND logo" /><View><Text style={styles.wordmark}>OKBOND</Text><View style={styles.network}><View style={styles.networkDot} /><Text style={styles.networkText}>POLYGON · 137</Text></View></View></View>
          <View style={styles.headerTools}><Pressable accessibilityRole="button" accessibilityLabel="Notifications" onPress={() => setNotice("Notifications are not connected yet.")} style={styles.iconButton}><Ionicons name="notifications-outline" size={20} color={palette.text} /></Pressable><Pressable accessibilityRole="button" accessibilityLabel="Open profile" onPress={() => router.push("/settings")} style={styles.avatar}><Text style={styles.avatarText}>{avatarLetter}</Text></Pressable></View>
        </View>

        <View style={styles.greeting}><Text style={styles.eyebrow}>WELCOME TO OKBOND</Text><Text style={styles.greetingTitle}>Good to see you, {displayName}.</Text><Text style={styles.greetingSub}>Luxury digital finance, connected assets and everyday services.</Text></View>

        <View style={styles.portfolio}>
          <View style={styles.portfolioHeader}><View><Text style={styles.sectionLabel}>TOTAL PORTFOLIO BALANCE</Text><Text style={styles.muted}>Personal valuation</Text></View><View style={styles.balanceTools}><Pressable accessibilityRole="button" accessibilityLabel={balanceVisible ? "Hide balance" : "Show balance"} onPress={() => setBalanceVisible((value) => !value)}><Ionicons name={balanceVisible ? "eye-outline" : "eye-off-outline"} size={20} color={palette.gold} /></Pressable><Pressable accessibilityRole="button" accessibilityLabel="Refresh portfolio" onPress={() => { void live.refetch(); }}><Ionicons name="refresh-outline" size={20} color={palette.gold} /></Pressable></View></View>
          <Text style={styles.balance}>{balanceVisible ? "Unavailable" : "••••••"}<Text style={styles.currency}> USD</Text></Text>
          <View style={styles.statusPill}><Ionicons name="wallet-outline" size={15} color={palette.subtle} /><Text style={styles.statusText}>No wallet connected</Text></View>
          <View style={styles.metrics}><View><Text style={styles.metricLabel}>Available</Text><Text style={styles.metricValue}>Not connected</Text></View><View><Text style={styles.metricLabel}>Staked</Text><Text style={styles.metricValue}>Not configured</Text></View><View><Text style={styles.metricLabel}>24h</Text><Text style={styles.metricValue}>Unavailable</Text></View></View>
          <View style={styles.portfolioFooter}><Text style={styles.footerHint}>Your financial world starts here</Text><Pressable accessibilityRole="button" onPress={() => setNotice("Connect Wallet requires a verified wallet provider configuration.")} style={styles.connectButton}><Ionicons name="wallet-outline" size={16} color={palette.canvas} /><Text style={styles.connectText}>Connect Wallet</Text></Pressable></View>
        </View>

        <View style={styles.sectionBlock}><View style={styles.sectionHeading}><Text style={styles.sectionTitle}>Quick actions</Text><Text style={styles.sectionLink}>Wallet tools</Text></View><View style={styles.actionRow}>{ACTIONS.map((action) => <Pressable key={action.label} accessibilityRole="button" onPress={() => setNotice(action.message)} style={({ pressed }) => [styles.action, pressed ? styles.pressed : null]}><View style={styles.actionIcon}><Ionicons name={action.icon} size={19} color={palette.gold} /></View><Text style={styles.actionLabel}>{action.label}</Text></Pressable>)}</View></View>

        <View style={styles.sectionBlock}><View style={styles.sectionHeading}><View><Text style={styles.sectionTitle}>Your OKBOND Ecosystem</Text><Text style={styles.sectionSub}>A focused view of what is available</Text></View><Pressable accessibilityRole="button" onPress={() => router.push("/services")}><Text style={styles.sectionLink}>View all</Text></Pressable></View><View style={styles.ecosystemList}>{ECOSYSTEM.slice(0, 4).map((item) => <Pressable key={item.title} accessibilityRole="button" onPress={() => router.push(item.route)} style={({ pressed }) => [styles.ecosystemRow, pressed ? styles.pressed : null]}><View style={styles.ecosystemIcon}><Ionicons name={item.icon} size={18} color={palette.gold} /></View><View style={styles.ecosystemCopy}><Text style={styles.ecosystemTitle}>{item.title}</Text><Text style={styles.ecosystemDetail}>{item.detail}</Text></View><Ionicons name="chevron-forward-outline" size={17} color={palette.subtle} /></Pressable>)}</View></View>

        <View style={styles.sectionBlock}><View style={styles.sectionHeading}><View><Text style={styles.sectionTitle}>My assets</Text><Text style={styles.sectionSub}>Verified public Polygon data</Text></View><Pressable accessibilityRole="button" onPress={() => router.push("/portfolio")}><Text style={styles.sectionLink}>View all</Text></Pressable></View><Pressable accessibilityRole="button" onPress={() => router.push("/portfolio")} style={styles.assetRow}><View style={styles.assetIcon}><Text style={styles.assetMark}>OB</Text></View><View style={styles.assetCopy}><Text style={styles.assetName}>OKBOND</Text><Text style={styles.assetDetail}>Polygon · {VERIFIED_CONTRACTS.token.address.slice(0, 8)}…</Text></View><View style={styles.assetValue}><Text style={styles.assetQuantity}>{snapshot?.tokenSupply.value ?? (live.isPending ? "Reading…" : "Unavailable")}</Text><Text style={styles.assetDetail}>Public supply</Text></View><Ionicons name="chevron-forward-outline" size={16} color={palette.subtle} /></Pressable></View>

        <View style={styles.sectionBlock}><View style={styles.sectionHeading}><View><Text style={styles.sectionTitle}>Recent activity</Text><Text style={styles.sectionSub}>Only confirmed activity appears here</Text></View><Pressable accessibilityRole="button" onPress={() => router.push("/activity")}><Text style={styles.sectionLink}>View all</Text></Pressable></View><View style={styles.emptyActivity}><View style={styles.emptyIcon}><Ionicons name="time-outline" size={19} color={palette.gold} /></View><View><Text style={styles.emptyTitle}>Nothing here yet</Text><Text style={styles.emptyBody}>Connect a wallet to see real transactions.</Text></View></View></View>

        <LiveReadStatus loading={live.isPending} error={live.isError} readErrorCount={snapshot?.readErrors.length ?? 0} refreshing={live.isFetching && Boolean(snapshot)} onRetry={() => { void live.refetch(); }} blockNumber={snapshot?.blockNumber} checkedAt={snapshot?.checkedAt} />
        {notice ? <InfoNotice title="Setup required" tone="warning">{notice}</InfoNotice> : null}
      </FadeIn>
    </AppScreen>
  );
}

const styles = StyleSheet.create({
  page: { gap: 22, paddingTop: 8, paddingBottom: 30 }, header: { flexDirection: "row", alignItems: "center", justifyContent: "space-between" }, brand: { flexDirection: "row", alignItems: "center", gap: 10 }, logo: { width: 40, height: 40, borderRadius: 13 }, wordmark: { color: palette.text, fontSize: 16, fontWeight: "900", letterSpacing: 2.4 }, network: { flexDirection: "row", alignItems: "center", gap: 5, marginTop: 3 }, networkDot: { width: 6, height: 6, borderRadius: 3, backgroundColor: "#4AC6A0" }, networkText: { color: palette.subtle, fontSize: 9, fontWeight: "800", letterSpacing: 1 }, headerTools: { flexDirection: "row", alignItems: "center", gap: 9 }, iconButton: { width: 39, height: 39, borderRadius: 13, backgroundColor: palette.raised, alignItems: "center", justifyContent: "center" }, avatar: { width: 39, height: 39, borderRadius: 13, borderWidth: 1, borderColor: palette.gold, alignItems: "center", justifyContent: "center", backgroundColor: "#1B1913" }, avatarText: { color: palette.gold, fontWeight: "900", fontSize: 15 }, greeting: { gap: 5, paddingTop: 4 }, eyebrow: { color: palette.gold, fontSize: 10, fontWeight: "900", letterSpacing: 1.7 }, greetingTitle: { color: palette.text, fontSize: 25, lineHeight: 30, fontWeight: "900", letterSpacing: -0.6 }, greetingSub: { color: palette.subtle, fontSize: 12, lineHeight: 18, maxWidth: 320 }, portfolio: { gap: 15, padding: 17, borderRadius: 20, backgroundColor: "#111214", borderWidth: 1, borderColor: "#302C22" }, portfolioHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "flex-start" }, sectionLabel: { color: palette.gold, fontSize: 10, fontWeight: "900", letterSpacing: 1.3 }, muted: { color: palette.subtle, fontSize: 10, marginTop: 4 }, balanceTools: { flexDirection: "row", gap: 15 }, balance: { color: palette.text, fontSize: 38, lineHeight: 42, fontWeight: "900", letterSpacing: -1.3 }, currency: { color: palette.subtle, fontSize: 12, fontWeight: "800", letterSpacing: 1 }, statusPill: { alignSelf: "flex-start", flexDirection: "row", alignItems: "center", gap: 7, paddingVertical: 7, paddingHorizontal: 10, borderRadius: 16, backgroundColor: palette.raised }, statusText: { color: palette.subtle, fontSize: 11, fontWeight: "700" }, metrics: { flexDirection: "row", justifyContent: "space-between", borderTopWidth: 1, borderTopColor: palette.line, paddingTop: 13 }, metricLabel: { color: palette.subtle, fontSize: 10, marginBottom: 4 }, metricValue: { color: palette.text, fontSize: 11, fontWeight: "800" }, portfolioFooter: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", gap: 10 }, footerHint: { flex: 1, color: palette.subtle, fontSize: 10, lineHeight: 15 }, connectButton: { minHeight: 40, paddingHorizontal: 13, borderRadius: 12, backgroundColor: palette.gold, flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 6 }, connectText: { color: palette.canvas, fontSize: 11, fontWeight: "900" }, sectionBlock: { gap: 11 }, sectionHeading: { flexDirection: "row", alignItems: "flex-end", justifyContent: "space-between" }, sectionTitle: { color: palette.text, fontSize: 17, fontWeight: "900", letterSpacing: -0.2 }, sectionSub: { color: palette.subtle, fontSize: 10, marginTop: 4 }, sectionLink: { color: palette.gold, fontSize: 11, fontWeight: "800" }, actionRow: { flexDirection: "row", justifyContent: "space-between", paddingVertical: 3 }, action: { width: "23%", alignItems: "center", gap: 8 }, actionIcon: { width: 47, height: 47, borderRadius: 16, backgroundColor: palette.raised, alignItems: "center", justifyContent: "center", borderWidth: 1, borderColor: palette.line }, actionLabel: { color: palette.text, fontSize: 11, fontWeight: "800" }, ecosystemList: { borderTopWidth: 1, borderTopColor: palette.line }, ecosystemRow: { minHeight: 63, flexDirection: "row", alignItems: "center", gap: 11, borderBottomWidth: 1, borderBottomColor: palette.line }, ecosystemIcon: { width: 35, height: 35, borderRadius: 11, backgroundColor: palette.goldSoft, alignItems: "center", justifyContent: "center" }, ecosystemCopy: { flex: 1, gap: 3 }, ecosystemTitle: { color: palette.text, fontSize: 13, fontWeight: "800" }, ecosystemDetail: { color: palette.subtle, fontSize: 10 }, assetRow: { minHeight: 68, paddingVertical: 10, flexDirection: "row", alignItems: "center", gap: 11, borderTopWidth: 1, borderBottomWidth: 1, borderColor: palette.line }, assetIcon: { width: 39, height: 39, borderRadius: 13, backgroundColor: palette.goldSoft, alignItems: "center", justifyContent: "center" }, assetMark: { color: palette.gold, fontSize: 11, fontWeight: "900" }, assetCopy: { flex: 1, gap: 3 }, assetName: { color: palette.text, fontSize: 13, fontWeight: "800" }, assetDetail: { color: palette.subtle, fontSize: 10 }, assetValue: { alignItems: "flex-end", gap: 3 }, assetQuantity: { color: palette.text, fontSize: 11, fontWeight: "800" }, emptyActivity: { minHeight: 67, flexDirection: "row", alignItems: "center", gap: 11, borderTopWidth: 1, borderBottomWidth: 1, borderColor: palette.line }, emptyIcon: { width: 38, height: 38, borderRadius: 12, backgroundColor: palette.goldSoft, alignItems: "center", justifyContent: "center" }, emptyTitle: { color: palette.text, fontSize: 12, fontWeight: "800" }, emptyBody: { color: palette.subtle, fontSize: 10, marginTop: 3 }, pressed: { opacity: 0.68 },
});
