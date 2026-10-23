import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useState } from "react";
import { Image, Pressable, StyleSheet, Text, View } from "react-native";

import { ActionButton, AppScreen, FadeIn, InfoNotice, LiveReadStatus, SectionHeading, StatusTag, Surface } from "@/components/native-ui";
import { useAuth } from "@/hooks/use-auth";
import { useLiveSummary } from "@/hooks/use-live-summary";
import { palette } from "@/lib/design";
import { VERIFIED_CONTRACTS } from "@/lib/contracts";

const QUICK_ACTIONS = [
  { id: "send", label: "Send", icon: "arrow-up-outline" as const, detail: "Wallet setup pending" },
  { id: "receive", label: "Receive", icon: "arrow-down-outline" as const, detail: "Wallet setup pending" },
  { id: "buy", label: "Buy Crypto", icon: "cart-outline" as const, detail: "Not enabled" },
  { id: "swap", label: "Swap", icon: "swap-horizontal-outline" as const, detail: "Not enabled" },
];

const ECOSYSTEM = [
  { title: "OKBOND Vault", detail: "Public vault read", icon: "business-outline" as const, route: "/vault" as const, state: "Live" },
  { title: "Staking", detail: "Verified data pending", icon: "lock-closed-outline" as const, route: "/staking" as const, state: "Coming soon" },
  { title: "Governance", detail: "No verified deployment", icon: "people-outline" as const, route: "/governance" as const, state: "Coming soon" },
  { title: "Services", detail: "Travel, property & utilities", icon: "grid-outline" as const, route: "/services" as const, state: "Explore" },
];

function formatPublicValue(value: string | null | undefined, suffix = " OKBOND") {
  if (!value) return "Unavailable";
  return `${value}${suffix}`;
}

export default function HomeScreen() {
  const auth = useAuth();
  const live = useLiveSummary();
  const snapshot = live.data;
  const loading = live.isPending;
  const error = live.isError;
  const readErrorCount = snapshot?.readErrors.length ?? 0;
  const [balanceVisible, setBalanceVisible] = useState(false);
  const [pendingAction, setPendingAction] = useState<string | null>(null);
  const displayName = auth.user?.name?.trim() || "OKBOND member";

  return (
    <AppScreen>
      <FadeIn>
        <View style={styles.topbar}>
          <View style={styles.brandRow}>
            <Image source={require("../../assets/images/icon.png")} style={styles.logo} accessibilityLabel="OKBOND logo" />
            <View style={styles.brandCopy}>
              <Text style={styles.wordmark}>OKBOND</Text>
              <View style={styles.networkRow}><View style={styles.liveDot} /><Text style={styles.networkText}>POLYGON · 137</Text></View>
            </View>
          </View>
          <View style={styles.topActions}>
            <Pressable accessibilityRole="button" accessibilityLabel="Notifications" onPress={() => setPendingAction("Notifications are not connected yet.")} style={styles.iconButton}><Ionicons name="notifications-outline" size={19} color={palette.text} /></Pressable>
            <Pressable accessibilityRole="button" accessibilityLabel="Open profile settings" onPress={() => router.push("/settings")} style={styles.avatar}><Text style={styles.avatarText}>{displayName.slice(0, 1).toUpperCase()}</Text></Pressable>
          </View>
        </View>

        <View style={styles.welcomeBlock}>
          <Text style={styles.eyebrow}>WELCOME TO OKBOND</Text>
          <Text style={styles.welcomeTitle}>{auth.user?.name ? `Good to see you, ${auth.user.name}.` : "Your Digital Assets.\nYour Connected World."}</Text>
          <Text style={styles.welcomeBody}>A clear, trusted view of your OKBOND ecosystem.</Text>
        </View>

        <Surface style={styles.balanceCard}>
          <View style={styles.balanceHeader}>
            <View><Text style={styles.cardEyebrow}>TOTAL PORTFOLIO BALANCE</Text><Text style={styles.balanceHint}>Personal valuation is not connected</Text></View>
            <View style={styles.balanceControls}><Pressable accessibilityRole="button" accessibilityLabel={balanceVisible ? "Hide balance" : "Show balance"} onPress={() => setBalanceVisible((value) => !value)} hitSlop={10}><Ionicons name={balanceVisible ? "eye-outline" : "eye-off-outline"} size={20} color={palette.goldBright} /></Pressable><Pressable accessibilityRole="button" accessibilityLabel="Refresh portfolio data" onPress={() => { void live.refetch(); }} hitSlop={10}><Ionicons name="refresh-outline" size={19} color={palette.goldBright} /></Pressable></View>
          </View>
          <Text style={styles.balanceValue}>{balanceVisible ? "Unavailable" : "••••••"}</Text>
          <View style={styles.balanceMeta}><StatusTag label="No wallet connected" icon="wallet-outline" /><Text style={styles.balanceCurrency}>USD</Text></View>
          <View style={styles.balanceDivider} />
          <View style={styles.balanceBreakdown}><View><Text style={styles.breakdownLabel}>Available</Text><Text style={styles.breakdownValue}>Not connected</Text></View><View><Text style={styles.breakdownLabel}>Staked</Text><Text style={styles.breakdownValue}>Not configured</Text></View><View><Text style={styles.breakdownLabel}>Pending</Text><Text style={styles.breakdownValue}>None reported</Text></View></View>
          <Pressable accessibilityRole="button" onPress={() => setPendingAction("Wallet connection requires a mobile WalletConnect and server-verified SIWE setup. No wallet was connected.")} style={styles.connectButton}><Ionicons name="wallet-outline" size={17} color={palette.canvas} /><Text style={styles.connectText}>Connect Wallet</Text></Pressable>
        </Surface>

        <View style={styles.sectionTop}><SectionHeading title="Quick actions" detail="Every action is clearly marked until its real integration is enabled." /></View>
        <View style={styles.quickGrid}>
          {QUICK_ACTIONS.map((action, index) => <Pressable key={action.id} accessibilityRole="button" onPress={() => setPendingAction(`${action.label} is not enabled yet. ${action.detail}.`)} style={({ pressed }) => [styles.quickCard, index === 0 ? styles.quickPrimary : null, pressed ? styles.pressed : null]}><View style={[styles.quickIcon, index === 0 ? styles.quickIconPrimary : null]}><Ionicons name={action.icon} size={21} color={index === 0 ? palette.canvas : palette.gold} /></View><Text style={[styles.quickLabel, index === 0 ? styles.quickLabelPrimary : null]}>{action.label}</Text><Text style={[styles.quickDetail, index === 0 ? styles.quickDetailPrimary : null]}>{action.detail}</Text></Pressable>)}
        </View>

        <View style={styles.sectionTop}><SectionHeading title="My assets" detail="Personal assets appear only after a verified wallet connection." /></View>
        <Surface style={styles.assetSurface}>
          <View style={styles.assetRow}><View style={styles.assetIcon}><Text style={styles.assetMark}>OB</Text></View><View style={styles.assetCopy}><Text style={styles.assetName}>OKBOND</Text><Text style={styles.assetSub}>Polygon · {VERIFIED_CONTRACTS.token.address.slice(0, 6)}…</Text></View><View style={styles.assetValue}><Text style={styles.assetAmount}>{loading ? "Reading…" : formatPublicValue(snapshot?.tokenSupply.value)}</Text><Text style={styles.assetSub}>Public supply</Text></View></View>
          <View style={styles.assetNotice}><Ionicons name="information-circle-outline" size={16} color={palette.gold} /><Text style={styles.assetNoticeText}>This is verified public contract data, not your personal wallet balance.</Text></View>
          <ActionButton label="View all assets" onPress={() => router.push("/portfolio")} kind="secondary" icon="arrow-forward-outline" />
        </Surface>

        <View style={styles.sectionTop}><SectionHeading title="Explore OKBOND" detail="Open a real module or see why it is not configured yet." /></View>
        <View style={styles.ecosystemGrid}>{ECOSYSTEM.map((item) => <Pressable key={item.title} accessibilityRole="button" onPress={() => router.push(item.route)} style={({ pressed }) => [styles.ecoCard, pressed ? styles.pressed : null]}><View style={styles.ecoIcon}><Ionicons name={item.icon} size={19} color={palette.gold} /></View><View style={styles.ecoCopy}><Text style={styles.ecoTitle}>{item.title}</Text><Text style={styles.ecoDetail}>{item.detail}</Text></View><Text style={[styles.ecoState, item.state === "Live" ? styles.ecoLive : null]}>{item.state}</Text></Pressable>)}</View>

        <View style={styles.sectionTop}><SectionHeading title="Recent activity" detail="Only confirmed activity from a connected integration appears here." /></View>
        <Surface style={styles.emptyActivity}><View style={styles.activityIcon}><Ionicons name="time-outline" size={22} color={palette.gold} /></View><Text style={styles.emptyTitle}>Your recent activity will appear here.</Text><Text style={styles.emptyBody}>No wallet is connected, so the app has not invented transactions, balances, or market movements.</Text><ActionButton label="Open activity help" onPress={() => router.push("/help")} kind="secondary" icon="help-circle-outline" /></Surface>

        <LiveReadStatus loading={loading} error={error} readErrorCount={readErrorCount} refreshing={live.isFetching && Boolean(snapshot)} onRetry={() => { void live.refetch(); }} blockNumber={snapshot?.blockNumber} checkedAt={snapshot?.checkedAt} />
        {pendingAction ? <InfoNotice title="Not enabled in this build" tone="warning">{pendingAction}</InfoNotice> : null}
        <Text style={styles.footer}>No fabricated financial data · Polygon public reads only · Verify contract activity on PolygonScan.</Text>
      </FadeIn>
    </AppScreen>
  );
}

const styles = StyleSheet.create({
  topbar: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", gap: 12, marginBottom: 8 }, brandRow: { flexDirection: "row", alignItems: "center", gap: 10 }, logo: { width: 42, height: 42, borderRadius: 13 }, brandCopy: { gap: 3 }, wordmark: { color: palette.text, fontSize: 15, fontWeight: "900", letterSpacing: 2.5 }, networkRow: { flexDirection: "row", alignItems: "center", gap: 5 }, liveDot: { width: 6, height: 6, borderRadius: 3, backgroundColor: palette.success }, networkText: { color: palette.subtle, fontSize: 8, fontWeight: "800", letterSpacing: 1.1 }, topActions: { flexDirection: "row", alignItems: "center", gap: 10 }, iconButton: { width: 38, height: 38, borderRadius: 13, alignItems: "center", justifyContent: "center", backgroundColor: palette.raised, borderWidth: 1, borderColor: palette.line }, avatar: { width: 38, height: 38, borderRadius: 13, backgroundColor: palette.goldSoft, borderWidth: 1, borderColor: palette.gold, alignItems: "center", justifyContent: "center" }, avatarText: { color: palette.goldBright, fontSize: 15, fontWeight: "900" }, welcomeBlock: { gap: 6, marginTop: 9, marginBottom: 3 }, eyebrow: { color: palette.gold, fontSize: 10, fontWeight: "900", letterSpacing: 1.7 }, welcomeTitle: { color: palette.text, fontSize: 28, lineHeight: 33, fontWeight: "900", letterSpacing: -0.65 }, welcomeBody: { color: palette.subtle, fontSize: 13, lineHeight: 19 }, balanceCard: { padding: 18, borderColor: "#6B5422", backgroundColor: "#14130F", gap: 11 }, balanceHeader: { flexDirection: "row", justifyContent: "space-between", gap: 12 }, cardEyebrow: { color: palette.gold, fontSize: 9, fontWeight: "900", letterSpacing: 1.45 }, balanceHint: { color: palette.subtle, fontSize: 10, marginTop: 4 }, balanceControls: { flexDirection: "row", gap: 15, paddingTop: 2 }, balanceValue: { color: palette.text, fontSize: 34, fontWeight: "900", letterSpacing: -1 }, balanceMeta: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" }, balanceCurrency: { color: palette.subtle, fontSize: 11, fontWeight: "800", letterSpacing: 1 }, balanceDivider: { height: 1, backgroundColor: "#3B321E" }, balanceBreakdown: { flexDirection: "row", justifyContent: "space-between", gap: 7 }, breakdownLabel: { color: palette.subtle, fontSize: 10 }, breakdownValue: { color: palette.text, fontSize: 11, fontWeight: "800", marginTop: 3 }, connectButton: { minHeight: 46, borderRadius: 13, backgroundColor: palette.gold, flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 8, marginTop: 2 }, connectText: { color: palette.canvas, fontSize: 13, fontWeight: "900" }, sectionTop: { marginTop: 2 }, quickGrid: { flexDirection: "row", flexWrap: "wrap", gap: 10 }, quickCard: { width: "47.8%", minHeight: 116, borderRadius: 17, padding: 14, backgroundColor: palette.card, borderWidth: 1, borderColor: palette.line }, quickPrimary: { backgroundColor: palette.gold, borderColor: palette.goldBright }, quickIcon: { width: 35, height: 35, borderRadius: 11, alignItems: "center", justifyContent: "center", backgroundColor: palette.goldSoft, marginBottom: 10 }, quickIconPrimary: { backgroundColor: "rgba(0,0,0,.12)" }, quickLabel: { color: palette.text, fontSize: 14, fontWeight: "900" }, quickLabelPrimary: { color: palette.canvas }, quickDetail: { color: palette.subtle, fontSize: 10, lineHeight: 15, marginTop: 4 }, quickDetailPrimary: { color: "rgba(0,0,0,.62)" }, assetSurface: { padding: 15, gap: 13 }, assetRow: { flexDirection: "row", alignItems: "center", gap: 11 }, assetIcon: { width: 42, height: 42, borderRadius: 15, backgroundColor: palette.goldSoft, borderWidth: 1, borderColor: palette.gold, alignItems: "center", justifyContent: "center" }, assetMark: { color: palette.goldBright, fontSize: 13, fontWeight: "900", letterSpacing: -1 }, assetCopy: { flex: 1, gap: 3 }, assetName: { color: palette.text, fontSize: 14, fontWeight: "900" }, assetSub: { color: palette.subtle, fontSize: 10 }, assetValue: { alignItems: "flex-end", gap: 3 }, assetAmount: { color: palette.text, fontSize: 12, fontWeight: "800" }, assetNotice: { flexDirection: "row", gap: 7, padding: 10, borderRadius: 11, backgroundColor: palette.goldSoft }, assetNoticeText: { flex: 1, color: palette.subtle, fontSize: 10, lineHeight: 15 }, ecosystemGrid: { gap: 9 }, ecoCard: { minHeight: 67, flexDirection: "row", alignItems: "center", gap: 11, padding: 12, borderRadius: 15, backgroundColor: palette.card, borderWidth: 1, borderColor: palette.line }, ecoIcon: { width: 36, height: 36, borderRadius: 11, alignItems: "center", justifyContent: "center", backgroundColor: palette.goldSoft }, ecoCopy: { flex: 1, gap: 3 }, ecoTitle: { color: palette.text, fontSize: 13, fontWeight: "800" }, ecoDetail: { color: palette.subtle, fontSize: 10 }, ecoState: { color: palette.subtle, fontSize: 9, fontWeight: "800", textTransform: "uppercase", letterSpacing: 0.5 }, ecoLive: { color: palette.success }, emptyActivity: { alignItems: "center", padding: 20, gap: 9 }, activityIcon: { width: 45, height: 45, borderRadius: 15, backgroundColor: palette.goldSoft, alignItems: "center", justifyContent: "center" }, emptyTitle: { color: palette.text, fontSize: 14, fontWeight: "800", textAlign: "center" }, emptyBody: { color: palette.subtle, fontSize: 11, lineHeight: 17, textAlign: "center" }, pressed: { opacity: 0.78, transform: [{ scale: 0.99 }] }, footer: { color: palette.subtle, fontSize: 10, lineHeight: 15, textAlign: "center", marginTop: 2 },
});
