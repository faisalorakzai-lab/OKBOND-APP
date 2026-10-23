import { router } from "expo-router";

import { ActionButton, AppScreen, ContractAddress, FadeIn, InfoNotice, LiveReadStatus, MetricCard, PageHeader, Surface } from "@/components/native-ui";
import { useLiveSummary } from "@/hooks/use-live-summary";
import { openExternal } from "@/lib/external";
import { VERIFIED_CONTRACTS } from "@/lib/contracts";

export default function VaultScreen() {
  const live = useLiveSummary();
  const data = live.data;

  return (
    <AppScreen>
      <FadeIn>
        <PageHeader eyebrow="VAULT · OVERVIEW" title="One verified vault read." subtitle="This value is the OKBOND token balance held at the configured vault address." />
        <LiveReadStatus loading={live.isPending} error={live.isError} readErrorCount={data?.readErrors.length ?? 0} refreshing={live.isFetching && Boolean(data)} onRetry={() => { void live.refetch(); }} blockNumber={data?.blockNumber} checkedAt={data?.checkedAt} />
        <MetricCard label="Vault-held OKBOND" value={data?.vaultHeldOkbond.value ? data.vaultHeldOkbond.value : data?.vaultHeldOkbond.value === "0" ? "0" : live.isPending ? "Reading…" : "Unavailable"} caption="vaultBalance() · shown in OKBOND, not POL reserves" icon="business-outline" loading={live.isPending} />
        <InfoNotice title="Narrow, source-backed metric">
          The verified source exposes vaultBalance(). This screen does not infer treasury reserves, a lottery pool, audited status, or withdrawable funds from that balance.
        </InfoNotice>
        <Surface>
          <ContractAddress name={VERIFIED_CONTRACTS.vault.name} address={VERIFIED_CONTRACTS.vault.address} note="Manifest status: exact-match" onPress={() => { void openExternal(VERIFIED_CONTRACTS.vault.explorer); }} />
        </Surface>
        <ActionButton label="Back to More" onPress={() => router.back()} icon="arrow-back-outline" kind="secondary" />
      </FadeIn>
    </AppScreen>
  );
}
