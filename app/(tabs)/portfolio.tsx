import { router } from "expo-router";
import { StyleSheet, View } from "react-native";

import { ActionButton, AppScreen, ContractAddress, FadeIn, InfoNotice, LiveReadStatus, MetricCard, PageHeader, SectionHeading, StatusTag, Surface } from "@/components/native-ui";
import { useLiveSummary } from "@/hooks/use-live-summary";
import { openExternal } from "@/lib/external";
import { VERIFIED_CONTRACTS } from "@/lib/contracts";

export default function PortfolioScreen() {
  const live = useLiveSummary();
  const snapshot = live.data;
  const loading = live.isPending;
  const error = live.isError;
  const readErrorCount = snapshot?.readErrors.length ?? 0;

  return (
    <AppScreen>
      <FadeIn>
        <PageHeader eyebrow="PORTFOLIO" title="A public view of OKBOND." subtitle="This Phase 1 app does not connect a wallet, so personal holdings are not shown." right={<StatusTag label="Personal wallet off" icon="wallet-outline" />} />
        <LiveReadStatus loading={loading} error={error} readErrorCount={readErrorCount} refreshing={live.isFetching && Boolean(snapshot)} onRetry={() => { void live.refetch(); }} blockNumber={snapshot?.blockNumber} checkedAt={snapshot?.checkedAt} />
        <View style={styles.metrics}>
          <MetricCard label="Token supply" value={snapshot?.tokenSupply.value ?? (loading ? "Reading…" : "Unavailable")} caption="Public total supply · OKBOND" icon="layers-outline" loading={loading} />
          <MetricCard label="Held by vault" value={snapshot?.vaultHeldOkbond.value ?? (loading ? "Reading…" : "Unavailable")} caption="OKBOND balance from the verified vault getter" icon="business-outline" loading={loading} />
        </View>
        <MetricCard label="Lottery contract balance" value={snapshot?.lotteryNativeBalancePol.value ?? (loading ? "Reading…" : "Unavailable")} caption="Native POL at the lottery address; not a guaranteed prize amount" icon="ticket-outline" loading={loading} />
        <InfoNotice title="No personal portfolio read" tone="info">
          Wallet balances, staking positions, and user transaction history are intentionally not requested or stored in this app.
        </InfoNotice>
        <SectionHeading title="Polygon mainnet contracts" detail="Addresses and source-match status come from the existing deployment manifest." />
        <Surface>
          <ContractAddress name={VERIFIED_CONTRACTS.token.name} address={VERIFIED_CONTRACTS.token.address} note="Source match: exact-match · independent audit: not-submitted" onPress={() => { void openExternal(VERIFIED_CONTRACTS.token.explorer); }} />
          <ContractAddress name={VERIFIED_CONTRACTS.services.name} address={VERIFIED_CONTRACTS.services.address} note="Source match: exact-match · no purchase action in app" onPress={() => { void openExternal(VERIFIED_CONTRACTS.services.explorer); }} />
          <ContractAddress name={VERIFIED_CONTRACTS.lottery.name} address={VERIFIED_CONTRACTS.lottery.address} note="Source match: exact-match · independent audit: not-submitted" onPress={() => { void openExternal(VERIFIED_CONTRACTS.lottery.explorer); }} />
          <ContractAddress name={VERIFIED_CONTRACTS.vault.name} address={VERIFIED_CONTRACTS.vault.address} note="Source match: exact-match · vault getter reads OKBOND balance" onPress={() => { void openExternal(VERIFIED_CONTRACTS.vault.explorer); }} />
        </Surface>
        <ActionButton label="Read lottery information" onPress={() => router.push("/lottery")} icon="ticket-outline" kind="secondary" />
      </FadeIn>
    </AppScreen>
  );
}

const styles = StyleSheet.create({ metrics: { flexDirection: "row", flexWrap: "wrap", gap: 10 } });
