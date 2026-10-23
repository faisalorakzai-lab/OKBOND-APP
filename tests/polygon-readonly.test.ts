import { afterEach, describe, expect, it, vi } from "vitest";

import { VERIFIED_CONTRACTS } from "../lib/contracts";
import { formatUnits, readPolygonSummary } from "../lib/polygon";
import { SERVICES } from "../lib/services";

afterEach(() => {
  vi.unstubAllGlobals();
});

describe("OKBOND read-only data", () => {
  it("formats base units without changing the denomination", () => {
    expect(formatUnits(0n)).toBe("0");
    expect(formatUnits(100n * 10n ** 18n)).toBe("100");
    expect(formatUnits(1_234_567_890_000_000_000n, 18, 3)).toBe("1.234");
    expect(formatUnits(1_230_000_000_000_000_000n, 18, 4)).toBe("1.23");
  });

  it("uses only exact-match configured verified contracts", () => {
    expect(VERIFIED_CONTRACTS.token.sourceStatus).toBe("exact-match");
    expect(VERIFIED_CONTRACTS.services.sourceStatus).toBe("exact-match");
    expect(VERIFIED_CONTRACTS.vault.sourceStatus).toBe("exact-match");
    expect(VERIFIED_CONTRACTS.lottery.sourceStatus).toBe("exact-match");
    expect(Object.keys(VERIFIED_CONTRACTS)).not.toContain("staking");
    expect(Object.keys(VERIFIED_CONTRACTS)).not.toContain("governance");
  });

  it("keeps the full website Services catalog with no hidden transaction state", () => {
    expect(SERVICES).toHaveLength(12);
    expect(new Set(SERVICES.map((service) => service.group))).toEqual(
      new Set(["Travel & mobility", "Property", "Everyday utilities"]),
    );
  });

  it("keeps contract values unavailable if code is absent rather than fabricating zeros", async () => {
    vi.stubGlobal("fetch", vi.fn(async (_input: RequestInfo | URL, init?: RequestInit) => {
      const request = JSON.parse(String(init?.body)) as { method: string };
      const result = request.method === "eth_chainId" ? "0x89"
        : request.method === "eth_blockNumber" ? "0x10"
          : "0x";
      return new Response(JSON.stringify({ jsonrpc: "2.0", id: 1, result }), { status: 200 });
    }));

    const summary = await readPolygonSummary();
    expect(summary.chainId).toBe(137);
    expect(summary.tokenSupply.value).toBeNull();
    expect(summary.vaultHeldOkbond.value).toBeNull();
    expect(summary.lotteryStarted.value).toBeNull();
    expect(summary.lotteryEntryAmount.value).toBeNull();
    expect(summary.lotteryNativeBalancePol.value).toBeNull();
    expect(summary.readErrors.length).toBeGreaterThan(0);
  });

  it("surfaces a failed verified getter while preserving other real reads, including legitimate zero values", async () => {
    vi.stubGlobal("fetch", vi.fn(async (_input: RequestInfo | URL, init?: RequestInit) => {
      const request = JSON.parse(String(init?.body)) as { method: string; params?: Array<{ to?: string; data?: string }> };
      if (request.method === "eth_call" && request.params?.[0]?.to === VERIFIED_CONTRACTS.vault.address) {
        return new Response(JSON.stringify({ jsonrpc: "2.0", id: 1, error: { message: "provider detail is intentionally omitted" } }), { status: 200 });
      }
      const result = request.method === "eth_chainId" ? "0x89"
        : request.method === "eth_blockNumber" ? "0x10"
          : request.method === "eth_getCode" ? "0x6001"
            : "0x0";
      return new Response(JSON.stringify({ jsonrpc: "2.0", id: 1, result }), { status: 200 });
    }));

    const summary = await readPolygonSummary();
    expect(summary.tokenSupply.value).toBe("0");
    expect(summary.vaultHeldOkbond.value).toBeNull();
    expect(summary.readErrors).toContain("Vault balance");
  });

  it("does not treat a different chain as Polygon or as zero-valued success", async () => {
    vi.stubGlobal("fetch", vi.fn(async () => new Response(
      JSON.stringify({ jsonrpc: "2.0", id: 1, result: "0x1" }),
      { status: 200 },
    )));

    await expect(readPolygonSummary()).rejects.toThrow("Polygon mainnet (chain 137) is temporarily unavailable");
  });
});
