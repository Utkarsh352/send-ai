import { http, createConfig } from 'wagmi';
import { mainnet } from "wagmi/chains";
import { defineChain } from "viem";

// Define Yellow Network Testnet chain
export const yellowTestnet = defineChain({
  id: 999999,
  name: "Yellow Network Testnet",
  nativeCurrency: {
    decimals: 18,
    name: "Yellow Token",
    symbol: "YELLOW",
  },
  rpcUrls: {
    default: {
      http: ["https://rpc.testnet.yellow.network"],
    },
    public: {
      http: ["https://rpc.testnet.yellow.network"],
    },
  },
  blockExplorers: {
    default: {
      name: "Yellow Explorer",
      url: "https://explorer.testnet.yellow.network",
    },
  },
});

// Define Yellow Network Mainnet (launching Q2 2025)
export const yellowMainnet = defineChain({
  id: 888888,
  name: "Yellow Network Mainnet",
  nativeCurrency: {
    decimals: 18,
    name: "Yellow Token", 
    symbol: "YELLOW",
  },
  rpcUrls: {
    default: {
      http: ["https://rpc.yellow.network"],
    },
    public: {
      http: ["https://rpc.yellow.network"],
    },
  },
  blockExplorers: {
    default: {
      name: "Yellow Explorer",
      url: "https://explorer.yellow.network",
    },
  },
});

export const config = createConfig({
  chains: [yellowTestnet, yellowMainnet, mainnet],
  transports: {
    [yellowTestnet.id]: http(),
    [yellowMainnet.id]: http(),
    [mainnet.id]: http(),
  },
});
