import { StyleSheet, Text } from "react-native";

import { AppScreen, FadeIn, InfoNotice, PageHeader, StatusTag, Surface } from "@/components/native-ui";
import { palette } from "@/lib/design";

export default function GovernanceScreen() {
  return (
    <AppScreen>
      <FadeIn>
        <PageHeader eyebrow="GOVERNANCE" title="No verified governance source." subtitle="Governance is shown as an information section only; no voting contract is listed in the verified mainnet manifest." right={<StatusTag label="Not configured" tone="warning" icon="alert-circle-outline" />} />
        <InfoNotice title="No vote or proposal actions" tone="warning">
          The inspected website repository contains no Governance route, and the Polygon mainnet manifest contains no governance contract address. This app will not invent a proposal count or voting power.
        </InfoNotice>
        <Surface>
          <Text style={styles.title}>What is available</Text>
          <Text style={styles.body}>No verified governance contract, public proposal API, or on-chain voting read is configured in the source reviewed for this app.</Text>
          <Text style={styles.body}>The page will remain unavailable for live governance data until an official source is added and reviewed.</Text>
        </Surface>
      </FadeIn>
    </AppScreen>
  );
}

const styles = StyleSheet.create({
  title: { color: palette.text, fontSize: 15, fontWeight: "700" },
  body: { color: palette.subtle, fontSize: 12, lineHeight: 19 },
});
