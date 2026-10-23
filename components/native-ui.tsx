import { Ionicons } from "@expo/vector-icons";
import { useEffect, useRef, useState, type ComponentProps, type ReactNode } from "react";
import {
  ActivityIndicator,
  Animated,
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
  type ViewStyle,
} from "react-native";

import { ScreenContainer } from "@/components/screen-container";
import { useMotionPreference } from "@/hooks/use-reduced-motion";
import { palette, spacing } from "@/lib/design";

export type AppIconName = ComponentProps<typeof Ionicons>["name"];

export function AppScreen({ children, contentStyle }: { children: ReactNode; contentStyle?: ViewStyle }) {
  return (
    <ScreenContainer className="flex-1 bg-background" safeAreaClassName="bg-background" edges={["top", "left", "right"]}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[styles.page, contentStyle]}
        keyboardShouldPersistTaps="handled"
      >
        {children}
      </ScrollView>
    </ScreenContainer>
  );
}

export function FadeIn({ children, delay = 0 }: { children: ReactNode; delay?: number }) {
  const [opacity] = useState(() => new Animated.Value(0));
  const [offset] = useState(() => new Animated.Value(10));
  const motion = useMotionPreference();
  const hasAnimated = useRef(false);

  useEffect(() => {
    if (motion === "pending") return;
    if (motion === "reduced") {
      opacity.setValue(1);
      offset.setValue(0);
      hasAnimated.current = true;
      return;
    }
    if (hasAnimated.current) return;
    hasAnimated.current = true;
    opacity.setValue(0);
    offset.setValue(10);
    const animation = Animated.parallel([
      Animated.timing(opacity, { toValue: 1, duration: 360, delay, useNativeDriver: true }),
      Animated.timing(offset, { toValue: 0, duration: 360, delay, useNativeDriver: true }),
    ]);
    animation.start();
    return () => animation.stop();
  }, [delay, motion, offset, opacity]);

  return <Animated.View style={{ opacity, transform: [{ translateY: offset }] }}>{children}</Animated.View>;
}

export function BrandHeader({ compact = false }: { compact?: boolean }) {
  return (
    <View style={styles.brandHeader}>
      <Image source={require("../assets/images/icon.png")} style={compact ? styles.brandLogoCompact : styles.brandLogo} accessibilityLabel="OKBOND emblem" />
      <View>
        <Text style={styles.brandName}>OKBOND</Text>
        <Text style={styles.brandCaption}>POLYGON · READ ONLY</Text>
      </View>
    </View>
  );
}

export function PageHeader({ eyebrow, title, subtitle, right }: { eyebrow: string; title: string; subtitle?: string; right?: ReactNode }) {
  return (
    <View style={styles.pageHeader}>
      <View style={styles.pageHeaderCopy}>
        <Text style={styles.eyebrow}>{eyebrow}</Text>
        <Text style={styles.pageTitle}>{title}</Text>
        {subtitle ? <Text style={styles.pageSubtitle}>{subtitle}</Text> : null}
      </View>
      {right}
    </View>
  );
}

export function SectionHeading({ title, detail }: { title: string; detail?: string }) {
  return (
    <View style={styles.sectionHeading}>
      <Text style={styles.sectionTitle}>{title}</Text>
      {detail ? <Text style={styles.sectionDetail}>{detail}</Text> : null}
    </View>
  );
}

export function Surface({ children, style }: { children: ReactNode; style?: ViewStyle }) {
  return <View style={[styles.surface, style]}>{children}</View>;
}

export function MetricCard({ label, value, caption, icon, loading = false, style }: {
  label: string;
  value: string;
  caption?: string;
  icon?: AppIconName;
  loading?: boolean;
  style?: ViewStyle;
}) {
  return (
    <View style={[styles.metricCard, style]}>
      <View style={styles.metricTop}>
        {icon ? <View style={styles.metricIcon}><Ionicons name={icon} size={17} color={palette.gold} /></View> : <View />}
        {loading ? <ActivityIndicator size="small" color={palette.gold} /> : null}
      </View>
      <Text style={styles.metricLabel}>{label}</Text>
      <Text style={styles.metricValue} numberOfLines={1} adjustsFontSizeToFit>{loading ? "Reading…" : value}</Text>
      {caption ? <Text style={styles.metricCaption}>{caption}</Text> : null}
    </View>
  );
}

export function StatusTag({ label, tone = "neutral", icon }: { label: string; tone?: "neutral" | "success" | "warning" | "error"; icon?: AppIconName }) {
  const color = tone === "success" ? palette.success : tone === "warning" ? palette.warning : tone === "error" ? palette.error : palette.subtle;
  const backgroundColor = tone === "success" ? "#10241D" : tone === "warning" ? "#292113" : tone === "error" ? "#2A1716" : palette.raised;
  return (
    <View style={[styles.statusTag, { backgroundColor, borderColor: `${color}55` }]}>
      {icon ? <Ionicons name={icon} size={12} color={color} /> : null}
      <Text style={[styles.statusText, { color }]}>{label}</Text>
    </View>
  );
}

export function ActionButton({ label, onPress, icon = "arrow-forward-outline", kind = "primary", disabled = false }: {
  label: string;
  onPress: () => void;
  icon?: AppIconName;
  kind?: "primary" | "secondary";
  disabled?: boolean;
}) {
  const primary = kind === "primary";
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ disabled }}
      disabled={disabled}
      onPress={onPress}
      style={({ pressed }) => [
        styles.actionButton,
        primary ? styles.primaryButton : styles.secondaryButton,
        pressed && !disabled ? styles.buttonPressed : null,
        disabled ? styles.buttonDisabled : null,
      ]}
    >
      <Text style={[styles.actionLabel, primary ? styles.primaryLabel : styles.secondaryLabel]}>{label}</Text>
      <Ionicons name={icon} size={17} color={primary ? palette.canvas : palette.gold} />
    </Pressable>
  );
}

export function RowLink({ title, detail, icon, onPress, trailing = "chevron-forward" }: {
  title: string;
  detail?: string;
  icon: AppIconName;
  onPress: () => void;
  trailing?: AppIconName;
}) {
  return (
    <Pressable accessibilityRole="button" onPress={onPress} style={({ pressed }) => [styles.rowLink, pressed ? styles.rowPressed : null]}>
      <View style={styles.rowIcon}><Ionicons name={icon} size={19} color={palette.gold} /></View>
      <View style={styles.rowCopy}>
        <Text style={styles.rowTitle}>{title}</Text>
        {detail ? <Text style={styles.rowDetail}>{detail}</Text> : null}
      </View>
      <Ionicons name={trailing} size={17} color={palette.subtle} />
    </Pressable>
  );
}

export function InfoNotice({ title, children, tone = "info" }: { title: string; children: ReactNode; tone?: "info" | "warning" | "success" }) {
  const icon: AppIconName = tone === "warning" ? "warning-outline" : tone === "success" ? "shield-checkmark-outline" : "information-circle-outline";
  const accent = tone === "warning" ? palette.warning : tone === "success" ? palette.success : palette.gold;
  return (
    <View style={[styles.notice, { borderLeftColor: accent }]}>
      <Ionicons name={icon} size={19} color={accent} style={styles.noticeIcon} />
      <View style={styles.noticeCopy}>
        <Text style={styles.noticeTitle}>{title}</Text>
        <Text style={styles.noticeBody}>{children}</Text>
      </View>
    </View>
  );
}

export function LiveReadStatus({
  loading,
  error,
  readErrorCount = 0,
  refreshing = false,
  onRetry,
  blockNumber,
  checkedAt,
}: {
  loading: boolean;
  error: boolean;
  readErrorCount?: number;
  refreshing?: boolean;
  onRetry: () => void;
  blockNumber?: string;
  checkedAt?: string;
}) {
  if (loading) return <StatusTag label="Reading Polygon" icon="sync-outline" />;

  const checkedDate = checkedAt ? new Date(checkedAt) : null;
  const checkedTime = checkedDate && Number.isFinite(checkedDate.getTime())
    ? `${checkedDate.toISOString().slice(11, 16)} UTC`
    : null;
  const blockLabel = blockNumber ? `block #${blockNumber}` : null;
  const lastRead = [checkedTime ? `last successful read ${checkedTime}` : null, blockLabel]
    .filter(Boolean)
    .join(" · ");

  if (error || readErrorCount > 0) {
    const hasStaleSnapshot = Boolean(checkedTime);
    const label = error
      ? hasStaleSnapshot ? "Refresh failed" : "Polygon unavailable"
      : "Partial contract read";
    const detail = error
      ? hasStaleSnapshot
        ? `Showing the previous snapshot from ${lastRead}.${readErrorCount > 0 ? ` ${readErrorCount} read(s) were unavailable in that snapshot.` : ""}`
        : "No verified Polygon snapshot is available. Retry when the provider can be reached."
      : `${readErrorCount} verified contract read(s) unavailable. Other values are from ${lastRead || "the latest successful chain check"}.`;
    return (
      <View style={styles.liveUnavailable}>
        <View style={styles.liveStatusCopy}>
          <StatusTag label={label} tone="warning" icon={error ? "cloud-offline-outline" : "warning-outline"} />
          <Text style={styles.liveStatusDetail}>{detail}</Text>
        </View>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Retry Polygon contract data"
          accessibilityHint="Fetch the latest public on-chain values"
          hitSlop={8}
          onPress={onRetry}
          style={styles.retryButton}
        >
          <Ionicons name="refresh-outline" size={14} color={palette.gold} />
          <Text style={styles.retryText}>Retry</Text>
        </Pressable>
      </View>
    );
  }

  return (
    <View style={styles.liveStatusCopy}>
      <StatusTag label={refreshing ? "Refreshing Polygon" : blockNumber ? `Polygon · #${blockNumber}` : "Polygon connected"} tone="success" icon="radio-outline" />
      <Text style={styles.liveReadTime}>{refreshing ? `Showing snapshot from ${lastRead}.` : checkedTime ? `Last read ${checkedTime}.` : "Polygon data read successfully."}</Text>
    </View>
  );
}

export function ContractAddress({ name, address, onPress, note }: { name: string; address: string; onPress?: () => void; note?: string }) {
  return (
    <Pressable accessibilityRole="button" accessibilityLabel={`${name}, ${address}. Open on PolygonScan`} onPress={onPress} disabled={!onPress} style={styles.contractRow}>
      <View style={styles.rowCopy}>
        <Text style={styles.contractName}>{name}</Text>
        <Text style={styles.contractAddress} selectable>{address}</Text>
        {note ? <Text style={styles.rowDetail}>{note}</Text> : null}
      </View>
      <Ionicons name="open-outline" size={16} color={palette.gold} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  page: { paddingHorizontal: spacing.page, paddingTop: 14, paddingBottom: 34, gap: 18 },
  brandHeader: { flexDirection: "row", alignItems: "center", gap: 11, marginBottom: 2 },
  brandLogo: { width: 48, height: 48, borderRadius: 14 },
  brandLogoCompact: { width: 38, height: 38, borderRadius: 12 },
  brandName: { color: palette.text, fontSize: 14, fontWeight: "800", letterSpacing: 2.3 },
  brandCaption: { color: palette.subtle, fontSize: 9, fontWeight: "700", letterSpacing: 1.4, marginTop: 3 },
  pageHeader: { flexDirection: "row", alignItems: "flex-start", justifyContent: "space-between", gap: 12, marginTop: 8, marginBottom: 4 },
  pageHeaderCopy: { flex: 1, gap: 7 },
  eyebrow: { color: palette.gold, fontSize: 10, fontWeight: "800", letterSpacing: 1.65, textTransform: "uppercase" },
  pageTitle: { color: palette.text, fontSize: 29, lineHeight: 35, fontWeight: "800", letterSpacing: -0.7 },
  pageSubtitle: { color: palette.subtle, fontSize: 14, lineHeight: 21, maxWidth: 360 },
  sectionHeading: { gap: 5, marginTop: 2, marginBottom: -5 },
  sectionTitle: { color: palette.text, fontSize: 17, fontWeight: "700" },
  sectionDetail: { color: palette.subtle, fontSize: 12, lineHeight: 18 },
  surface: { backgroundColor: palette.card, borderColor: palette.line, borderWidth: 1, borderRadius: 18, padding: 17, gap: 12 },
  metricCard: { flex: 1, minWidth: 142, backgroundColor: palette.card, borderColor: palette.line, borderWidth: 1, borderRadius: 17, padding: 15, gap: 8 },
  metricTop: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", minHeight: 28 },
  metricIcon: { width: 30, height: 30, borderRadius: 10, backgroundColor: palette.goldSoft, alignItems: "center", justifyContent: "center" },
  metricLabel: { color: palette.subtle, fontSize: 10, fontWeight: "800", letterSpacing: 1.25, textTransform: "uppercase", marginTop: 2 },
  metricValue: { color: palette.text, fontSize: 20, fontWeight: "800", letterSpacing: -0.35 },
  metricCaption: { color: palette.subtle, fontSize: 11, lineHeight: 15 },
  statusTag: { alignSelf: "flex-start", minHeight: 26, flexDirection: "row", alignItems: "center", gap: 6, borderRadius: 20, borderWidth: 1, paddingHorizontal: 10, paddingVertical: 5 },
  statusText: { fontSize: 10, fontWeight: "800", letterSpacing: 0.35 },
  actionButton: { minHeight: 48, borderRadius: 14, paddingHorizontal: 15, flexDirection: "row", alignItems: "center", justifyContent: "space-between", gap: 12 },
  primaryButton: { backgroundColor: palette.gold, borderWidth: 1, borderColor: palette.goldBright },
  secondaryButton: { backgroundColor: palette.raised, borderWidth: 1, borderColor: palette.line },
  actionLabel: { flex: 1, fontSize: 13, fontWeight: "800" },
  primaryLabel: { color: palette.canvas },
  secondaryLabel: { color: palette.text },
  buttonPressed: { opacity: 0.84, transform: [{ scale: 0.99 }] },
  buttonDisabled: { opacity: 0.5 },
  rowLink: { minHeight: 64, paddingVertical: 9, flexDirection: "row", alignItems: "center", gap: 12, borderBottomColor: palette.line, borderBottomWidth: StyleSheet.hairlineWidth },
  rowPressed: { opacity: 0.7 },
  rowIcon: { width: 38, height: 38, borderRadius: 12, alignItems: "center", justifyContent: "center", backgroundColor: palette.goldSoft },
  rowCopy: { flex: 1, gap: 3 },
  rowTitle: { color: palette.text, fontSize: 13, fontWeight: "700" },
  rowDetail: { color: palette.subtle, fontSize: 11, lineHeight: 16 },
  notice: { flexDirection: "row", gap: 10, alignItems: "flex-start", padding: 14, backgroundColor: palette.raised, borderColor: palette.line, borderWidth: 1, borderLeftWidth: 3, borderRadius: 14 },
  noticeIcon: { marginTop: 1 },
  noticeCopy: { flex: 1, gap: 4 },
  noticeTitle: { color: palette.text, fontSize: 13, fontWeight: "700" },
  noticeBody: { color: palette.subtle, fontSize: 12, lineHeight: 18 },
  liveUnavailable: { flexDirection: "row", alignItems: "flex-start", justifyContent: "space-between", gap: 8 },
  liveStatusCopy: { flex: 1, gap: 6 },
  liveStatusDetail: { color: palette.warning, fontSize: 11, lineHeight: 16 },
  liveReadTime: { color: palette.subtle, fontSize: 10, lineHeight: 14 },
  retryButton: { minHeight: 48, minWidth: 88, flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 6, paddingHorizontal: 14, borderRadius: 12, backgroundColor: palette.raised, borderColor: palette.line, borderWidth: 1 },
  retryText: { color: palette.gold, fontSize: 12, fontWeight: "700" },
  contractRow: { minHeight: 56, flexDirection: "row", alignItems: "center", gap: 12, paddingVertical: 8, borderBottomColor: palette.line, borderBottomWidth: StyleSheet.hairlineWidth },
  contractName: { color: palette.text, fontSize: 12, fontWeight: "700" },
  contractAddress: { color: palette.goldBright, fontSize: 11, fontFamily: "monospace", marginTop: 3 },
});
