import { useAccount, useAppKit } from "@reown/appkit-react-native";

export function useMultichainWallet() {
  const { open } = useAppKit();
  const account = useAccount();
  return { open, address: account.address };
}
