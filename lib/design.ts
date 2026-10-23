import { Colors } from "@/constants/theme";

export const palette = {
  canvas: Colors.dark.background,
  card: Colors.dark.surface,
  raised: "#17191C",
  gold: Colors.dark.primary,
  goldBright: "#F2D88B",
  goldSoft: "#282113",
  text: Colors.dark.foreground,
  subtle: Colors.dark.muted,
  line: Colors.dark.border,
  success: Colors.dark.success,
  warning: Colors.dark.warning,
  error: Colors.dark.error,
} as const;

export const spacing = {
  page: 20,
  section: 24,
  card: 18,
  compact: 12,
} as const;
