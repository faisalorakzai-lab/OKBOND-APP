import { Platform } from "react-native";

type EthereumProvider = {
  request: (args: { method: string; params?: unknown[] }) => Promise<unknown>;
};

declare global {
  interface Window { ethereum?: EthereumProvider }
}

export async function connectBrowserWallet(): Promise<{ address: string; chainId: string }> {
  if (Platform.OS !== "web" || typeof window === "undefined") {
    throw new Error("Mobile wallet connection needs the OKBOND WalletConnect project ID. Browser MetaMask/Trust Wallet works on the web when installed.");
  }
  const provider = window.ethereum;
  if (!provider) {
    throw new Error("No browser wallet found. Install MetaMask or open this site in Trust Wallet's in-app browser, then try again.");
  }
  const accounts = await provider.request({ method: "eth_requestAccounts" }) as string[];
  const address = accounts?.[0];
  if (!address) throw new Error("The wallet did not return an address.");
  let chainId = String(await provider.request({ method: "eth_chainId" }));
  if (chainId.toLowerCase() !== "0x89") {
    try {
      await provider.request({ method: "wallet_switchEthereumChain", params: [{ chainId: "0x89" }] });
    } catch (switchError: any) {
      if (switchError?.code === 4902) {
        await provider.request({ method: "wallet_addEthereumChain", params: [{ chainId: "0x89", chainName: "Polygon Mainnet", nativeCurrency: { name: "POL", symbol: "POL", decimals: 18 }, rpcUrls: ["https://polygon-rpc.com"], blockExplorerUrls: ["https://polygonscan.com"] }] });
      } else throw switchError;
    }
    chainId = String(await provider.request({ method: "eth_chainId" }));
  }
  return { address, chainId };
}
