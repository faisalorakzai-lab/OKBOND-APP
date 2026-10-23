import { router } from "expo-router";
import { StyleSheet, Text, View } from "react-native";

import { ActionButton, AppScreen, ContractAddress, FadeIn, InfoNotice, LiveReadStatus, MetricCard, PageHeader, SectionHeading, StatusTag, Surface } from "@/components/native-ui";
import { useLiveSummary } from "@/hooks/use-live-summary";
import { palette } from "@/lib/design";
import { openExternal } from "@/lib/external";
import { VERIFIED_CONTRACTS } from "@/lib/contracts";

export default function LotteryScreen() {
  const live = useLiveSummary();
  const summary = live.data;
  const loading = live.isPending;

  return (
    <AppScreen>
      <FadeIn>
        <PageHeader eyebrow="LOTTERY · INFORMATION" title="Read the contract facts." subtitle="Public on-chain status only. No entry, refund, winner selection, or reward-claim controls are available." right={<StatusTag label="No entry actions" icon="eye-outline" />} />
        <LiveReadStatus loading={loading} error={live.isError} readErrorCount={summary?.readErrors.length ?? 0} refreshing={live.isFetching && Boolean(summary)} onRetry={() => { void live.refetch(); }} blockNumber={summary?.blockNumber} checkedAt={summary?.checkedAt} />
        <View style={styles.metrics}>
          <MetricCard label="Entry amount" value={summary?.lotteryEntryAmount.value ? `${summary.lotteryEntryAmount.value} OKBOND` : summary?.lotteryEntryAmount.value === "0" ? "0 OKBOND" : loading ? "Reading…" : "Unavailable"} caption="Contract getter · entryAmount()" icon="ticket-outline" loading={loading} />
          <MetricCard label="Reward per winner" value={summary?.lotteryRewardPerWinnerPol.value ? `${summary.lotteryRewardPerWinnerPol.value} POL` : summary?.lotteryRewardPerWinnerPol.value === "0" ? "0 POL" : loading ? "Reading…" : "Unavailable"} caption="Configured value; not a guaranteed payout" icon="trophy-outline" loading={loading} />
        </View>
        <View style={styles.metrics}>
          <MetricCard label="Lock period" value={summary?.lotteryLockDays.value === null || summary?.lotteryLockDays.value === undefined ? (loading ? "Reading…" : "Unavailable") : `${Number(summary.lotteryLockDays.value) / 86400} days`} caption="Contract getter · lockDuration()" icon="time-outline" loading={loading} />
          <MetricCard label="Winner selection" value={summary?.lotteryWinnersSelected.value === true ? "Selected" : summary?.lotteryWinnersSelected.value === false ? "Pending" : loading ? "Reading…" : "Unavailable"} caption="Current contract flag only" icon="ribbon-outline" loading={loading} />
        </View>
        <SectionHeading title="Verified source disclosures" detail="Exact-match source in the existing Polygon deployment manifest." />
        <Surface>
          <View style={styles.factRow}><Text style={styles.factLabel}>Winners per round in source</Text><Text style={styles.factValue}>5</Text></View>
          <View style={styles.factRow}><Text style={styles.factLabel}>Selection process</Text><Text style={styles.factValue}>Owner-only</Text></View>
          <View style={styles.factRow}><Text style={styles.factLabel}>Randomness inputs in source</Text><Text style={styles.factValue}>block.timestamp + block.prevrandao</Text></View>
          <View style={styles.factRow}><Text style={styles.factLabel}>Independent audit</Text><Text style={[styles.factValue, styles.auditStatus]}>Not submitted</Text></View>
          <Text style={styles.body}>The source does not establish Chainlink VRF, automatic refunds, or a guaranteed result. The app does not make or recommend a participation decision.</Text>
          <ContractAddress name={VERIFIED_CONTRACTS.lottery.name} address={VERIFIED_CONTRACTS.lottery.address} note="Review verified source directly before relying on contract behavior" onPress={() => { void openExternal(VERIFIED_CONTRACTS.lottery.explorer); }} />
        </Surface>
        <InfoNotice title="No personal participation data" tone="info">
          This app does not connect a wallet or submit an entry. Values are public contract reads only; RPC data may be unavailable on some networks.
        </InfoNotice>
        <ActionButton label="Back to More" onPress={() => router.back()} icon="arrow-back-outline" kind="secondary" />
      </FadeIn>
    </AppScreen>
  );
}

const styles = StyleSheet.create({
  metrics: { flexDirection: "row", flexWrap: "wrap", gap: 10 },
  factRow: { minHeight: 40, flexDirection: "row", alignItems: "center", justifyContent: "space-between", gap: 12, borderBottomColor: palette.line, borderBottomWidth: StyleSheet.hairlineWidth },
  factLabel: { color: palette.subtle, fontSize: 11, flex: 1 },
  factValue: { color: palette.text, fontSize: 11, fontWeight: "700", flex: 1, textAlign: "right" },
  auditStatus: { color: palette.warning },
  body: { color: palette.subtle, fontSize: 11, lineHeight: 17 },
});
