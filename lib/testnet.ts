import type { User } from "@/lib/_core/auth";

export const TESTNET_PREVIEW_USER: User = {
  id: 900001,
  openId: "okbond-testnet-preview",
  name: "Testnet Preview",
  email: "testnet@okbond.local",
  loginMethod: "testnet-preview",
  lastSignedIn: new Date("2026-01-01T00:00:00.000Z"),
};

export function isTestnetPreviewEnabled(): boolean {
  return process.env.EXPO_PUBLIC_TESTNET_PREVIEW === "true";
}

export function isTestnetPreviewUser(user: User | null): boolean {
  return user?.loginMethod === "testnet-preview";
}
