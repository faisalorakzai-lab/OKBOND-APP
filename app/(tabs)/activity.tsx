import { Ionicons } from "@expo/vector-icons";
import { StyleSheet, Text, View } from "react-native";
import { AppScreen, FadeIn, InfoNotice, PageHeader, Surface } from "@/components/native-ui";
import { palette } from "@/lib/design";

export default function ActivityScreen() {
  return (
    <AppScreen>
      <FadeIn>
        <PageHeader eyebrow="ACTIVITY" title="Your activity, when it is real." subtitle="Only confirmed activity from a connected wallet or configured service will appear here." />
        <Surface style={styles.empty}>
          <View style={styles.icon}><Ionicons name="time-outline" size={25} color={palette.gold} /></View>
          <Text style={styles.title}>No recent activity</Text>
          <Text style={styles.body}>Your recent activity will appear here. This version does not invent transactions, pending states, profits, or market movements.</Text>
        </Surface>
        <InfoNotice title="Wallet activity is not connected yet" tone="warning">
          A mobile wallet adapter and server-verified transaction/activity source are required before personal wallet history can be shown.
        </InfoNotice>
      </FadeIn>
    </AppScreen>
  );
}
const styles = StyleSheet.create({ empty: { minHeight: 230, alignItems: "center", justifyContent: "center", padding: 24, gap: 11 }, icon: { width: 52, height: 52, borderRadius: 17, backgroundColor: palette.goldSoft, alignItems: "center", justifyContent: "center" }, title: { color: palette.text, fontSize: 16, fontWeight: "800" }, body: { color: palette.subtle, fontSize: 12, lineHeight: 19, textAlign: "center" }, });
