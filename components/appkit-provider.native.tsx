import { AppKit, AppKitProvider } from "@reown/appkit-react-native";
import type { ReactNode } from "react";
import { appKit } from "@/lib/appkit";

export function WalletProvider({ children }: { children: ReactNode }) {
  return (
    <AppKitProvider instance={appKit}>
      {children}
      <AppKit />
    </AppKitProvider>
  );
}
