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

  it("saves completion locally and routes a later launch to authentication", async () => {
    const { storage } = memoryStorage();
    await markOnboardingComplete(storage);
    await expect(resolveLaunchDestination(storage)).resolves.toBe("auth");
    await expect(resolveLaunchDestination(storage)).resolves.toBe("auth");
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

describe("screen two OKBOND card artwork", () => {
  const cardArtwork = readFileSync(join(process.cwd(), "components", "onboarding-card-artwork.tsx"), "utf8");
  const sceneArtwork = readFileSync(join(process.cwd(), "components", "onboarding-artwork.tsx"), "utf8");
  const walletAnimation = JSON.parse(readFileSync(join(process.cwd(), "assets", "animations", "wallet-token.json"), "utf8")) as {
    layers: Array<{ nm: string; ks: { p: { k: Array<{ s: number[] }> } } }>;
  };

  it("uses the real bundled emblem and factual read-only copy without copied payment credentials", () => {
    expect(cardArtwork).toContain('require("../assets/images/onboarding-emblem.jpg")');
    expect(cardArtwork).toContain("PUBLIC DATA · READ ONLY");
    expect(cardArtwork).toContain("NO WALLET LINKED");
    expect(cardArtwork).not.toMatch(/5218|FAISAL ORAKZAI|VISA|INFINITE/i);
    expect(sceneArtwork).toContain("if (index === 1) return <OnboardingCardArtwork />");
  });

  it("centers the restrained gold halo on the card emblem", () => {
    expect(walletAnimation.layers[0].nm).toBe("OKBOND emblem orbit");
    expect(walletAnimation.layers[0].ks.p.k[0].s).toEqual([256, 205, 0]);
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
