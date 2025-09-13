import { tool } from "ai";
import { z } from "zod";
import { createPublicClient, http, formatEther, defineChain } from "viem";

// Define Yellow Network Testnet chain for API usage
const yellowTestnet = defineChain({
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

const publicClient = createPublicClient({
	chain: yellowTestnet,
	transport: http("https://rpc.testnet.yellow.network"),
});

export const getYellowBalance = tool({
	description:
		"Get the balance of YELLOW tokens in your wallet on Yellow Network Testnet. You don't need any confirmation to execute this tool.",
	parameters: z.object({
		address: z.string().describe("The wallet address to check balance for"),
	}),
	execute: async ({ address }) => {
		try {
			const balance = await publicClient.getBalance({
				address: address as `0x${string}`,
			});
			
			const formattedBalance = formatEther(balance);
			return {
				address,
				balance: formattedBalance,
				symbol: "YELLOW",
				chain: "Yellow Network Testnet",
				explorer: `https://explorer.testnet.yellow.network/address/${address}`,
				features: ["State Channels", "Cross-chain routing", "ERC-7824 compatible"]
			};
		} catch (error) {
			console.error("Error getting YELLOW balance:", error);
			return {
				error: "Failed to get YELLOW balance. Make sure you're connected to Yellow Network Testnet.",
				address,
				switchNetwork: "Please switch to Yellow Network Testnet (Chain ID: 999999)",
			};
		}
	},
});