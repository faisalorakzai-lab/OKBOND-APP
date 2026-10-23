import AsyncStorage from "@react-native-async-storage/async-storage";

export const REFERRAL_STORAGE_KEY = "okbond.mobile.referral-code";

export async function getReferralCode(): Promise<string | null> {
  const value = await AsyncStorage.getItem(REFERRAL_STORAGE_KEY);
  return value?.trim() || null;
}

export async function setReferralCode(code: string): Promise<void> {
  const normalized = code.trim().toUpperCase();
  if (normalized) await AsyncStorage.setItem(REFERRAL_STORAGE_KEY, normalized);
}

export async function clearReferralCode(): Promise<void> {
  await AsyncStorage.removeItem(REFERRAL_STORAGE_KEY);
}

export function normalizeReferralCode(value: string): string {
  return value.trim().toUpperCase().replace(/\s+/g, "");
}
