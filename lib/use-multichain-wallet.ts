export function useMultichainWallet() {
  return { open: (_options?: { view: "Connect" }) => undefined, address: undefined as string | undefined };
}
