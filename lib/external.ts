import { Linking } from "react-native";

export async function openExternal(url: string): Promise<void> {
  try {
    const supported = await Linking.canOpenURL(url);
    if (supported) await Linking.openURL(url);
  } catch {
    // A failed external handoff is non-fatal; the native screen remains usable.
  }
}
