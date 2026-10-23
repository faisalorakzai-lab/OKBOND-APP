import { router } from "expo-router";

import { AppScreen, FadeIn, InfoNotice, PageHeader, RowLink, Surface } from "@/components/native-ui";

export default function MoreScreen() {
  return (
    <AppScreen>
      <FadeIn>
        <PageHeader eyebrow="MORE" title="Explore the details." subtitle="Read-only ecosystem information and app settings." />
        <InfoNotice title="No financial controls">
          Wallet connection, voting, lottery entry, staking and claims are not available in this Phase 1 app.
        </InfoNotice>
        <Surface>
          <RowLink title="Lottery information" detail="Contract facts and current read status" icon="ticket-outline" onPress={() => router.push("/lottery")} />
          <RowLink title="Vault overview" detail="Verified OKBOND balance getter" icon="business-outline" onPress={() => router.push("/vault")} />
          <RowLink title="Governance overview" detail="Deployment status and source availability" icon="people-outline" onPress={() => router.push("/governance")} />
          <RowLink title="Profile & settings" detail="Local app preferences; no account profile" icon="person-circle-outline" onPress={() => router.push("/settings")} />
          <RowLink title="Help" detail="App scope and support route" icon="help-circle-outline" onPress={() => router.push("/help")} />
          <RowLink title="Legal & privacy note" detail="Data and store-submission disclosures" icon="document-text-outline" onPress={() => router.push("/legal")} />
        </Surface>
      </FadeIn>
    </AppScreen>
  );
}
