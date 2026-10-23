export const ONBOARDING_STORAGE_KEY = "okbond.mobile.phase1.onboarding-seen";
export const ONBOARDING_COMPLETED_VALUE = "seen";

export type LaunchDestination = "auth" | "onboarding";

export interface OnboardingStorage {
  getItem(key: string): Promise<string | null>;
  setItem(key: string, value: string): Promise<void>;
  removeItem(key: string): Promise<void>;
}

export async function resolveLaunchDestination(storage: OnboardingStorage): Promise<LaunchDestination> {
  const value = await storage.getItem(ONBOARDING_STORAGE_KEY);
  return value === ONBOARDING_COMPLETED_VALUE ? "auth" : "onboarding";
}

export async function markOnboardingComplete(storage: OnboardingStorage): Promise<void> {
  await storage.setItem(ONBOARDING_STORAGE_KEY, ONBOARDING_COMPLETED_VALUE);
}

export async function resetOnboarding(storage: OnboardingStorage): Promise<void> {
  await storage.removeItem(ONBOARDING_STORAGE_KEY);
}
