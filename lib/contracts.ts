export const POLYGON_CHAIN_ID = 137;

export const VERIFIED_CONTRACTS = {
  token: {
    name: "OKBOND Token",
    address: "0xc89729DA02a8c2E282EC3070A9a680E01bE2E22F",
    sourceStatus: "exact-match",
    auditStatus: "not-submitted",
    explorer: "https://polygonscan.com/address/0xc89729da02a8c2e282ec3070a9a680e01be2e22f#code",
  },
  services: {
    name: "OKBOND Services / ICO contract",
    address: "0x7BB2458740c4F491277973212309d831385Ab9D7",
    sourceStatus: "exact-match",
    auditStatus: "not-submitted",
    explorer: "https://polygonscan.com/address/0x7bb2458740c4f491277973212309d831385ab9d7#code",
  },
  lottery: {
    name: "OKBOND Lottery",
    address: "0x5BC55d4b347e39B986864E28604Ddca5dE6357B7",
    sourceStatus: "exact-match",
    auditStatus: "not-submitted",
    explorer: "https://polygonscan.com/address/0x5bc55d4b347e39b986864e28604ddca5de6357b7#code",
  },
  vault: {
    name: "OKBOND Vault V7",
    address: "0x3Cb45d2022e2E15AFa8C4822647B89935a2ceD08",
    sourceStatus: "exact-match",
    auditStatus: "not-submitted",
    explorer: "https://polygonscan.com/address/0x3cb45d2022e2e15afa8c4822647b89935a2ced08#code",
  },
} as const;

export type ContractKey = keyof typeof VERIFIED_CONTRACTS;

export function shortenAddress(address: string): string {
  return `${address.slice(0, 8)}…${address.slice(-6)}`;
}
