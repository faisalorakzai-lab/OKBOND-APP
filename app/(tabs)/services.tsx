import { Ionicons } from "@expo/vector-icons";
import { StyleSheet, Text, View } from "react-native";

import { ActionButton, AppScreen, FadeIn, InfoNotice, PageHeader, SectionHeading, Surface } from "@/components/native-ui";
import { palette } from "@/lib/design";
import { SERVICES, SERVICES_URL } from "@/lib/services";
import { openExternal } from "@/lib/external";

const GROUPS = ["Travel & mobility", "Property", "Everyday utilities"] as const;

export default function ServicesScreen() {
  return (
    <AppScreen>
      <FadeIn>
        <PageHeader eyebrow="SERVICES" title="Everyday essentials, one ecosystem." subtitle="Browse the published service categories and their current availability." />
        <InfoNotice title="Inquiry-only status">
          The app does not book, bill, or collect service-request details. Service inquiries are handled on the existing website.
        </InfoNotice>
        {GROUPS.map((group) => (
          <View key={group} style={styles.group}>
            <SectionHeading title={group} detail={`${SERVICES.filter((service) => service.group === group).length} categories`} />
            <Surface style={styles.list}>
              {SERVICES.filter((service) => service.group === group).map((service, index) => (
                <View key={service.id} style={[styles.serviceRow, index === 0 ? styles.firstRow : null]}>
                  <View style={styles.iconBox}><Ionicons name={service.icon} size={19} color={palette.gold} /></View>
                  <View style={styles.copy}>
                    <Text style={styles.serviceName}>{service.name}</Text>
                    <Text style={styles.availability}>{service.availability}</Text>
                  </View>
                </View>
              ))}
            </Surface>
          </View>
        ))}
        <ActionButton label="Open Services on OKBOND website" onPress={() => { void openExternal(SERVICES_URL); }} icon="open-outline" />
        <Text style={styles.footnote}>Website inquiries may request contact details; review the website privacy information before submitting.</Text>
      </FadeIn>
    </AppScreen>
  );
}

const styles = StyleSheet.create({
  group: { gap: 11 },
  list: { paddingVertical: 4, gap: 0 },
  serviceRow: { flexDirection: "row", alignItems: "center", gap: 12, minHeight: 60, paddingVertical: 9, borderTopWidth: StyleSheet.hairlineWidth, borderTopColor: palette.line },
  firstRow: { borderTopWidth: 0 },
  iconBox: { width: 37, height: 37, borderRadius: 12, backgroundColor: palette.goldSoft, alignItems: "center", justifyContent: "center" },
  copy: { flex: 1, gap: 3 },
  serviceName: { color: palette.text, fontSize: 13, fontWeight: "700" },
  availability: { color: palette.subtle, fontSize: 10, lineHeight: 15 },
  footnote: { color: palette.subtle, fontSize: 10, lineHeight: 15, textAlign: "center" },
});
