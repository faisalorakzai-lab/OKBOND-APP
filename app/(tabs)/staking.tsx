import { StyleSheet, Text, View } from "react-native";

import { AppScreen, FadeIn, InfoNotice, PageHeader, StatusTag, Surface } from "@/components/native-ui";
import { palette } from "@/lib/design";

export default function StakingScreen() {
  return (
    <AppScreen>
      <FadeIn>
        <PageHeader eyebrow="STAKING OVERVIEW" title="No verified staking data yet." subtitle="This screen is read-only and does not connect a wallet." right={<StatusTag label="Not configured" tone="warning" icon="alert-circle-outline" />} />
        <InfoNotice title="No verified deployment in the manifest" tone="warning">
          The current Polygon mainnet deployment manifest contains no staking contract address or matching verified source. The app therefore does not show live staking totals, personal positions, or an APY.
        </InfoNotice>
        <Surface>
          <Text style={styles.cardTitle}>What is intentionally unavailable</Text>
          <View style={styles.list}>
            <Text style={styles.listItem}>• No guessed or legacy-only contract address</Text>
            <Text style={styles.listItem}>• No displayed APY or estimated yield</Text>
            <Text style={styles.listItem}>• No stake, withdraw, or claim controls</Text>
          </View>
          <Text style={styles.body}>If a verified staking deployment and source are added to the official configuration later, this page can display public read-only values after review.</Text>
        </Surface>
      </FadeIn>
    </AppScreen>
  );
}

const styles = StyleSheet.create({
  cardTitle: { color: palette.text, fontSize: 15, fontWeight: "700" },
  list: { gap: 10 },
  listItem: { color: palette.subtle, fontSize: 12, lineHeight: 18 },
  body: { color: palette.subtle, fontSize: 12, lineHeight: 19 },
});
