import { AppScreen, FadeIn, InfoNotice, PageHeader, RowLink, SectionHeading, Surface } from "@/components/native-ui";
import { openExternal } from "@/lib/external";

export default function LegalScreen() {
  return (
    <AppScreen>
      <FadeIn>
        <PageHeader eyebrow="LEGAL & PRIVACY" title="Know what this version does." subtitle="This information describes the intended Phase 1 build; store declarations must be checked against the exact shipped binary and SDKs." />
        <InfoNotice title="No account or submitted inquiry" tone="success">
          The app does not create an account, request a wallet address, connect a signer, send a service request, or store a personal profile. The onboarding-seen flag is stored locally on this device.
        </InfoNotice>
        <SectionHeading title="Network requests" detail="One public RPC is selected for a read at a time; a failed provider is skipped." />
        <Surface>
          <RowLink title="PublicNode · Polygon RPC" detail="polygon-bor-rpc.publicnode.com" icon="globe-outline" onPress={() => { void openExternal("https://polygon-bor-rpc.publicnode.com"); }} trailing="open-outline" />
          <RowLink title="Polygon RPC" detail="polygon-rpc.com" icon="globe-outline" onPress={() => { void openExternal("https://polygon-rpc.com"); }} trailing="open-outline" />
          <RowLink title="LlamaRPC · Polygon" detail="polygon.llamarpc.com" icon="globe-outline" onPress={() => { void openExternal("https://polygon.llamarpc.com"); }} trailing="open-outline" />
          <RowLink title="PolygonScan" detail="Third-party contract-explorer links" icon="open-outline" onPress={() => { void openExternal("https://polygonscan.com"); }} trailing="open-outline" />
        </Surface>
        <InfoNotice title="Third-party network metadata">
          RPC providers receive network requests and may see IP address, device/network metadata, and requested public contract data. Review current privacy terms for each provider before a store submission.
        </InfoNotice>
        <InfoNotice title="Store release requires owner review" tone="warning">
          A dedicated app privacy-policy URL, approved data-retention/deletion contact, legal publisher details, Apple/Google declarations, and final store identifiers are not confirmed by this app project. Do not submit the app until those details are approved.
        </InfoNotice>
        <Surface>
          <RowLink title="OKBOND website legal / transparency page" detail="Not represented as a dedicated app privacy policy" icon="document-text-outline" onPress={() => { void openExternal("https://orakzaibond.com/legal"); }} trailing="open-outline" />
          <RowLink title="Email support" detail="support@orakzaibond.com" icon="mail-outline" onPress={() => { void openExternal("mailto:support@orakzaibond.com"); }} trailing="open-outline" />
        </Surface>
      </FadeIn>
    </AppScreen>
  );
}
