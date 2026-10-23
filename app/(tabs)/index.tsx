import { router } from "expo-router";
import { StyleSheet, Text, View } from "react-native";

import { ActionButton, AppScreen, BrandHeader, FadeIn, InfoNotice, LiveReadStatus, MetricCard, PageHeader, SectionHeading, StatusTag, Surface } from "@/components/native-ui";
import { useLiveSummary } from "@/hooks/use-live-summary";
import { palette } from "@/lib/design";

export default function HomeScreen() {
  const live = useLiveSummary();
  const snapshot = live.data;
  const loading = live.isPending;
  const error = live.isError;
  const readErrorCount = snapshot?.readErrors.length ?? 0;

  return (
    <AppScreen>
      <FadeIn>
        <BrandHeader />
        <PageHeader
          eyebrow="OKBOND ECOSYSTEM"
          title="The essentials, in clear view."
          subtitle="A read-only companion for Services and public Polygon contract data."
          right={<StatusTag label="No wallet" icon="wallet-outline" />}
        />
        <Surface style={styles.hero}>
          <View style={styles.heroTop}>
            <View style={styles.heroCopy}>
              <Text style={styles.heroEyebrow}>POLYGON MAINNET · CHAIN 137</Text>
              <Text style={styles.heroTitle}>Clarity over claims.</Text>
            </View>
            <View style={styles.heroMark}><Text style={styles.heroMarkText}>OB</Text></View>
          </View>
          <Text style={styles.heroBody}>Public contract reads only. No account, wallet connection, token purchase, staking, lottery entry, or financial transaction in this phase.</Text>
          <LiveReadStatus loading={loading} error={error} readErrorCount={readErrorCount} refreshing={live.isFetching && Boolean(snapshot)} onRetry={() => { void live.refetch(); }} blockNumber={snapshot?.blockNumber} checkedAt={snapshot?.checkedAt} />
        </Surface>

        <SectionHeading title="Public contract snapshot" detail="Values appear only after a successful Polygon read." />
        <View style={styles.metrics}>
          <MetricCard label="OKBOND supply" value={snapshot?.tokenSupply.value ?? (loading ? "Reading…" : "Unavailable")} caption="Public token contract · OKBOND" icon="layers-outline" loading={loading} />
          <MetricCard label="Vault-held" value={snapshot?.vaultHeldOkbond.value ?? (loading ? "Reading…" : "Unavailable")} caption="OKBOND held at the verified vault address" icon="business-outline" loading={loading} />
        </View>

        <SectionHeading title="Explore" detail="Move between the app's read-only sections." />
        <View style={styles.actions}>
          <ActionButton label="Open portfolio overview" onPress={() => router.push("/portfolio")} icon="pie-chart-outline" />
          <ActionButton label="Explore OKBOND Services" onPress={() => router.push("/services")} icon="grid-outline" kind="secondary" />
        </View>

        <InfoNotice title="Honest live-data states" tone={error || readErrorCount > 0 ? "warning" : "info"}>
          {error
            ? snapshot
              ? `The refresh failed. This screen is showing the last successful snapshot from block #${snapshot.blockNumber}; retry to update it.`
              : "The configured Polygon providers could not be reached. This does not prove the chain is offline; retry later."
            : readErrorCount > 0
              ? `${readErrorCount} verified contract read(s) are unavailable. Other values are successful RPC results; retry the unavailable reads.`
              : "The app does not turn failed contract reads into zero balances or estimated rewards."}
        </InfoNotice>
        <Text style={styles.footer}>Informational only · Check contract sources on PolygonScan before relying on any on-chain data.</Text>
      </FadeIn>
    </AppScreen>
  );
}

const styles = StyleSheet.create({
  hero: { padding: 18, borderColor: "#5A4822", backgroundColor: "#11120F" },
  heroTop: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", gap: 12 },
  heroCopy: { flex: 1, gap: 6 },
  heroEyebrow: { color: palette.gold, fontSize: 9, fontWeight: "800", letterSpacing: 1.5 },
  heroTitle: { color: palette.text, fontSize: 22, fontWeight: "800", letterSpacing: -0.4 },
  heroMark: { width: 52, height: 52, borderRadius: 18, borderWidth: 1, borderColor: "#695329", backgroundColor: palette.goldSoft, alignItems: "center", justifyContent: "center" },
  heroMarkText: { color: palette.goldBright, fontFamily: "serif", fontSize: 18, fontWeight: "700" },
  heroBody: { color: palette.subtle, fontSize: 12, lineHeight: 19 },
  metrics: { flexDirection: "row", flexWrap: "wrap", gap: 10 },
  actions: { gap: 10 },
  footer: { color: palette.subtle, fontSize: 10, lineHeight: 15, textAlign: "center", marginTop: 2 },
});
