import { POLYGON_CHAIN_ID, VERIFIED_CONTRACTS } from "./contracts";

const POLYGON_RPC_FALLBACKS = [
  "https://polygon-bor-rpc.publicnode.com",
  "https://polygon-rpc.com",
  "https://polygon.llamarpc.com",
];
const REQUEST_TIMEOUT_MS = 10_000;
const CHAIN_ID_HEX = "0x89";

type JsonRpcEnvelope<T> = {
  result?: T;
  error?: { message?: string };
};

export type ReadValue<T> = { value: T | null };

export type LiveSummary = {
  chainId: number;
  blockNumber: string;
  checkedAt: string;
  readErrors: string[];
  tokenSupply: ReadValue<string>;
  vaultHeldOkbond: ReadValue<string>;
  lotteryStarted: ReadValue<boolean>;
  lotteryWinnersSelected: ReadValue<boolean>;
  lotteryEntryAmount: ReadValue<string>;
  lotteryLockDays: ReadValue<string>;
  lotteryRewardPerWinnerPol: ReadValue<string>;
  lotteryNativeBalancePol: ReadValue<string>;
};

function rpcEndpoints(): string[] {
  const configured = process.env.EXPO_PUBLIC_POLYGON_RPC_URL?.trim();
  return [...new Set([configured, ...POLYGON_RPC_FALLBACKS].filter((value): value is string => Boolean(value)))];
}

async function requestRpc<T>(endpoint: string, method: string, params: unknown[]): Promise<T> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);
  try {
    const response = await fetch(endpoint, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ jsonrpc: "2.0", id: 1, method, params }),
      signal: controller.signal,
    });
    if (!response.ok) throw new Error("Polygon RPC returned an HTTP error");
    const envelope = (await response.json()) as JsonRpcEnvelope<T>;
    if (envelope.error || envelope.result === undefined) throw new Error("Polygon RPC returned an invalid response");
    return envelope.result;
  } finally {
    clearTimeout(timeout);
  }
}

async function selectPolygonRpc(): Promise<{ endpoint: string; blockNumber: string }> {
  for (const endpoint of rpcEndpoints()) {
    try {
      const chainId = await requestRpc<string>(endpoint, "eth_chainId", []);
      if (chainId.toLowerCase() !== CHAIN_ID_HEX) continue;
      const blockNumber = await requestRpc<string>(endpoint, "eth_blockNumber", []);
      return { endpoint, blockNumber };
    } catch {
      // Try the next public endpoint; no provider error is converted into an on-chain zero.
    }
  }
  throw new Error(`Polygon mainnet (chain ${POLYGON_CHAIN_ID}) is temporarily unavailable`);
}

async function capture<T>(label: string, read: () => Promise<T>, readErrors: string[]): Promise<ReadValue<T>> {
  try {
    return { value: await read() };
  } catch {
    readErrors.push(label);
    return { value: null };
  }
}

function unavailable<T>(): ReadValue<T> {
  return { value: null };
}

function decodeUint(hex: string): bigint {
  if (!/^0x[0-9a-f]+$/i.test(hex)) throw new Error("Invalid uint response");
  return BigInt(hex);
}

async function readUint(endpoint: string, address: string, selector: string): Promise<bigint> {
  const result = await requestRpc<string>(endpoint, "eth_call", [{ to: address, data: selector }, "latest"]);
  return decodeUint(result);
}

async function readBool(endpoint: string, address: string, selector: string): Promise<boolean> {
  return (await readUint(endpoint, address, selector)) !== 0n;
}

async function readNativeBalance(endpoint: string, address: string): Promise<bigint> {
  const result = await requestRpc<string>(endpoint, "eth_getBalance", [address, "latest"]);
  return decodeUint(result);
}

export function formatUnits(value: bigint, decimals = 18, maxFractionDigits = 3): string {
  const negative = value < 0n;
  const magnitude = negative ? -value : value;
  const scale = 10n ** BigInt(decimals);
  const fractional = (magnitude % scale).toString().padStart(decimals, "0").slice(0, maxFractionDigits).replace(/0+$/, "");
  const wholeText = (magnitude / scale).toLocaleString("en-US");
  return `${negative ? "-" : ""}${wholeText}${fractional ? `.${fractional}` : ""}`;
}

export async function readPolygonSummary(): Promise<LiveSummary> {
  const { endpoint, blockNumber } = await selectPolygonRpc();
  const readErrors: string[] = [];
  const [tokenCode, vaultCode, lotteryCode] = await Promise.all([
    capture("Token contract code", () => requestRpc<string>(endpoint, "eth_getCode", [VERIFIED_CONTRACTS.token.address, "latest"]), readErrors),
    capture("Vault contract code", () => requestRpc<string>(endpoint, "eth_getCode", [VERIFIED_CONTRACTS.vault.address, "latest"]), readErrors),
    capture("Lottery contract code", () => requestRpc<string>(endpoint, "eth_getCode", [VERIFIED_CONTRACTS.lottery.address, "latest"]), readErrors),
  ]);

  const isDeployed = (code: ReadValue<string>) => code.value !== null && code.value !== "0x";
  if (tokenCode.value === "0x") readErrors.push("Token contract code");
  if (vaultCode.value === "0x") readErrors.push("Vault contract code");
  if (lotteryCode.value === "0x") readErrors.push("Lottery contract code");

  const [tokenSupply, vaultHeldOkbond, lotteryStarted, lotteryWinnersSelected, lotteryEntryAmount, lotteryLockSeconds, lotteryRewardPerWinnerPol, lotteryNativeBalancePol] = await Promise.all([
    isDeployed(tokenCode)
      ? capture("Token supply", async () => formatUnits(await readUint(endpoint, VERIFIED_CONTRACTS.token.address, "0x18160ddd"), 18, 2), readErrors)
      : Promise.resolve(unavailable<string>()),
    isDeployed(vaultCode)
      ? capture("Vault balance", async () => formatUnits(await readUint(endpoint, VERIFIED_CONTRACTS.vault.address, "0x0bf6cc08"), 18, 2), readErrors)
      : Promise.resolve(unavailable<string>()),
    isDeployed(lotteryCode)
      ? capture("Lottery started status", () => readBool(endpoint, VERIFIED_CONTRACTS.lottery.address, "0x5a3811b9"), readErrors)
      : Promise.resolve(unavailable<boolean>()),
    isDeployed(lotteryCode)
      ? capture("Lottery winner-selection status", () => readBool(endpoint, VERIFIED_CONTRACTS.lottery.address, "0x8bc53285"), readErrors)
      : Promise.resolve(unavailable<boolean>()),
    isDeployed(lotteryCode)
      ? capture("Lottery entry amount", async () => formatUnits(await readUint(endpoint, VERIFIED_CONTRACTS.lottery.address, "0x991def3c"), 18, 2), readErrors)
      : Promise.resolve(unavailable<string>()),
    isDeployed(lotteryCode)
      ? capture("Lottery lock duration", () => readUint(endpoint, VERIFIED_CONTRACTS.lottery.address, "0x04554443"), readErrors)
      : Promise.resolve(unavailable<bigint>()),
    isDeployed(lotteryCode)
      ? capture("Lottery reward setting", async () => formatUnits(await readUint(endpoint, VERIFIED_CONTRACTS.lottery.address, "0x9abed90d"), 18, 4), readErrors)
      : Promise.resolve(unavailable<string>()),
    isDeployed(lotteryCode)
      ? capture("Lottery native balance", async () => formatUnits(await readNativeBalance(endpoint, VERIFIED_CONTRACTS.lottery.address), 18, 4), readErrors)
      : Promise.resolve(unavailable<string>()),
  ]);

  return {
    chainId: POLYGON_CHAIN_ID,
    blockNumber: BigInt(blockNumber).toLocaleString("en-US"),
    checkedAt: new Date().toISOString(),
    readErrors,
    tokenSupply,
    vaultHeldOkbond,
    lotteryStarted,
    lotteryWinnersSelected,
    lotteryEntryAmount,
    lotteryLockDays: { value: lotteryLockSeconds.value === null ? null : formatUnits(lotteryLockSeconds.value, 0, 0) },
    lotteryRewardPerWinnerPol,
    lotteryNativeBalancePol,
  };
}
