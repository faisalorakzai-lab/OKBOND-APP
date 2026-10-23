import AsyncStorage from "@react-native-async-storage/async-storage";
import { EthersAdapter } from "@reown/appkit-ethers-react-native";
import { createAppKit, type Storage } from "@reown/appkit-react-native";
import type { Network } from "@reown/appkit-common-react-native";

const PROJECT_ID = process.env.EXPO_PUBLIC_WALLETCONNECT_PROJECT_ID ?? "994ec9b9f33001e1a3269b4065ab1379";

const networks: Network[] = [
  { id: 1, name: "Ethereum", nativeCurrency: { name: "Ether", symbol: "ETH", decimals: 18 }, rpcUrls: { default: { http: ["https://ethereum-rpc.publicnode.com"] } }, blockExplorers: { default: { name: "Etherscan", url: "https://etherscan.io" } } },
  { id: 137, name: "Polygon", nativeCurrency: { name: "POL", symbol: "POL", decimals: 18 }, rpcUrls: { default: { http: ["https://polygon-bor-rpc.publicnode.com"] } }, blockExplorers: { default: { name: "PolygonScan", url: "https://polygonscan.com" } } },
  { id: 56, name: "BNB Smart Chain", nativeCurrency: { name: "BNB", symbol: "BNB", decimals: 18 }, rpcUrls: { default: { http: ["https://bsc-rpc.publicnode.com"] } }, blockExplorers: { default: { name: "BscScan", url: "https://bscscan.com" } } },
  { id: 42161, name: "Arbitrum One", nativeCurrency: { name: "Ether", symbol: "ETH", decimals: 18 }, rpcUrls: { default: { http: ["https://arbitrum-one-rpc.publicnode.com"] } }, blockExplorers: { default: { name: "Arbiscan", url: "https://arbiscan.io" } } },
  { id: 10, name: "Optimism", nativeCurrency: { name: "Ether", symbol: "ETH", decimals: 18 }, rpcUrls: { default: { http: ["https://optimism-rpc.publicnode.com"] } }, blockExplorers: { default: { name: "Optimism Explorer", url: "https://optimistic.etherscan.io" } } },
  { id: 8453, name: "Base", nativeCurrency: { name: "Ether", symbol: "ETH", decimals: 18 }, rpcUrls: { default: { http: ["https://base-rpc.publicnode.com"] } }, blockExplorers: { default: { name: "Basescan", url: "https://basescan.org" } } },
  { id: 43114, name: "Avalanche C-Chain", nativeCurrency: { name: "Avalanche", symbol: "AVAX", decimals: 18 }, rpcUrls: { default: { http: ["https://avalanche-c-chain-rpc.publicnode.com"] } }, blockExplorers: { default: { name: "Snowtrace", url: "https://snowtrace.io" } } },
];

const storage: Storage = {
  async getKeys() { return Array.from(await AsyncStorage.getAllKeys()); },
  async getEntries<T = unknown>() { const entries = await AsyncStorage.multiGet(await AsyncStorage.getAllKeys()); return entries.map(([key, value]) => [key, value ? JSON.parse(value) as T : undefined] as [string, T]); },
  async getItem<T = unknown>(key: string) { const value = await AsyncStorage.getItem(key); return value ? JSON.parse(value) as T : undefined; },
  async setItem<T = unknown>(key: string, value: T) { await AsyncStorage.setItem(key, JSON.stringify(value)); },
  async removeItem(key: string) { await AsyncStorage.removeItem(key); },
};

export const appKit = createAppKit({
  projectId: PROJECT_ID,
  metadata: { name: "OKBOND", description: "OKBOND multichain wallet", url: "https://orakzaibond.com", icons: ["https://orakzaibond.com/favicon.ico"] },
  adapters: [new EthersAdapter()],
  networks,
  defaultNetwork: networks[0],
  storage,
  themeMode: "dark",
  themeVariables: { accent: "#B38A27" },
  enableAnalytics: true,
});
