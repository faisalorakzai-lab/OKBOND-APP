import { readFileSync, readdirSync, statSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";

import {
  ONBOARDING_STORAGE_KEY,
  markOnboardingComplete,
  resetOnboarding,
  resolveLaunchDestination,
  type OnboardingStorage,
} from "../lib/onboarding";

function memoryStorage(seed: Record<string, string> = {}) {
  const values = new Map(Object.entries(seed));
  const storage: OnboardingStorage = {
    async getItem(key) { return values.get(key) ?? null; },
    async setItem(key, value) { values.set(key, value); },
    async removeItem(key) { values.delete(key); },
  };
  return { storage, values };
}

describe("OKBOND first-launch onboarding", () => {
  it("routes a fresh install to onboarding", async () => {
    const { storage } = memoryStorage();
    await expect(resolveLaunchDestination(storage)).resolves.toBe("onboarding");
  });

  it("saves completion locally and routes a later launch directly to the app", async () => {
    const { storage } = memoryStorage();
    await markOnboardingComplete(storage);
    await expect(resolveLaunchDestination(storage)).resolves.toBe("app");
    await expect(resolveLaunchDestination(storage)).resolves.toBe("app");
  });

  it("replay removes only the onboarding flag and returns the next launch to onboarding", async () => {
    const { storage, values } = memoryStorage({ [ONBOARDING_STORAGE_KEY]: "seen", unrelated: "keep" });
    await resetOnboarding(storage);
    expect(values.get("unrelated")).toBe("keep");
    await expect(resolveLaunchDestination(storage)).resolves.toBe("onboarding");
  });

  it("treats unknown stored values as incomplete rather than as completed", async () => {
    const { storage } = memoryStorage({ [ONBOARDING_STORAGE_KEY]: "unknown" });
    await expect(resolveLaunchDestination(storage)).resolves.toBe("onboarding");
  });

  it("propagates storage failures so the launch gate can show recovery instead of an onboarding flash", async () => {
    const broken: OnboardingStorage = {
      async getItem() { throw new Error("local storage unavailable"); },
      async setItem() { throw new Error("local storage unavailable"); },
      async removeItem() { throw new Error("local storage unavailable"); },
    };
    await expect(resolveLaunchDestination(broken)).rejects.toThrow("local storage unavailable");
    await expect(markOnboardingComplete(broken)).rejects.toThrow("local storage unavailable");
    await expect(resetOnboarding(broken)).rejects.toThrow("local storage unavailable");
  });
});

describe("bundled onboarding animation assets", () => {
  const animationDir = join(process.cwd(), "assets", "animations");
  const animationFiles = readdirSync(animationDir).filter((name) => name.endsWith(".json")).sort();

  it("contains one local 512px composition for each of the five onboarding scenes", () => {
    expect(animationFiles).toEqual([
      "ecosystem-services.json",
      "final-emblem.json",
      "logo-reveal.json",
      "vault-network.json",
      "wallet-token.json",
    ]);
    for (const file of animationFiles) {
      const animation = JSON.parse(readFileSync(join(animationDir, file), "utf8")) as {
        w: number; h: number; fr: number; op: number; layers: unknown[];
      };
      expect(animation.w).toBe(512);
      expect(animation.h).toBe(512);
      expect(animation.fr).toBe(30);
      expect(animation.op).toBe(90);
      expect(animation.layers.length).toBeGreaterThan(0);
    }
  });

  it("keeps all new onboarding animation and emblem assets below the 350 KB plan budget", () => {
    const animationBytes = animationFiles.reduce((sum, name) => sum + statSync(join(animationDir, name)).size, 0);
    const emblemBytes = statSync(join(process.cwd(), "assets", "images", "onboarding-emblem.jpg")).size;
    expect(animationBytes + emblemBytes).toBeLessThan(350 * 1024);
  });
});
