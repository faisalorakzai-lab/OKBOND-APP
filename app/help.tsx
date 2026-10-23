import { AppScreen, FadeIn, InfoNotice, PageHeader, RowLink, Surface } from "@/components/native-ui";
import { openExternal } from "@/lib/external";

export default function HelpScreen() {
  return (
    <AppScreen>
      <FadeIn>
        <PageHeader eyebrow="HELP & SUPPORT" title="Need a hand?" subtitle="This Phase 1 app is an informational, read-only companion." />
        <InfoNotice title="What the app can do">
          Sign in to the protected app journey, browse Services categories, and inspect public reads from configured Polygon contracts. Wallet signing, personal holdings, service inquiries, and financial transactions are not enabled.
        </InfoNotice>
        <Surface>
          <RowLink title="Email support" detail="support@orakzaibond.com" icon="mail-outline" trailing="open-outline" onPress={() => { void openExternal("mailto:support@orakzaibond.com"); }} />
          <RowLink title="Open OKBOND website" detail="Read website information in your browser" icon="globe-outline" trailing="open-outline" onPress={() => { void openExternal("https://orakzaibond.com"); }} />
        </Surface>
      </FadeIn>
    </AppScreen>
  );
}
