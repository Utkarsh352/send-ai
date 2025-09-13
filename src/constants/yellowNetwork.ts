// Yellow Network Configuration and Constants

export const YELLOW_NETWORK_CHAINS = {
	TESTNET: {
		id: 999999,
		name: "Yellow Network Testnet",
		rpcUrl: "https://rpc.testnet.yellow.network",
		explorer: "https://explorer.testnet.yellow.network",
		nativeCurrency: {
			name: "Yellow Token",
			symbol: "YELLOW",
			decimals: 18,
		},
		supported: true,
		features: ["state-channels", "bridge-less", "cross-chain-swaps"]
	},
	MAINNET: {
		id: 888888, // Placeholder - actual mainnet launches Q2 2025
		name: "Yellow Network Mainnet",
		rpcUrl: "https://rpc.yellow.network",
		explorer: "https://explorer.yellow.network", 
		nativeCurrency: {
			name: "Yellow Token",
			symbol: "YELLOW",
			decimals: 18,
		},
		supported: false, // Will be enabled when mainnet launches
		features: ["state-channels", "bridge-less", "cross-chain-swaps", "neodax", "clearsync"]
	}
};

export const YELLOW_SUPPORTED_CHAINS = [
	{
		id: 1,
		name: "ethereum",
		displayName: "Ethereum",
		yellowCompatible: true,
		features: ["state-channels", "erc-7824"]
	},
	{
		id: 137,
		name: "polygon", 
		displayName: "Polygon",
		yellowCompatible: true,
		features: ["state-channels", "erc-7824"]
	},
	{
		id: 42161,
		name: "arbitrum",
		displayName: "Arbitrum One", 
		yellowCompatible: true,
		features: ["state-channels", "erc-7824"]
	},
	{
		id: 10,
		name: "optimism",
		displayName: "Optimism",
		yellowCompatible: false, // Coming soon based on roadmap
		features: []
	},
	{
		id: 8453,
		name: "base",
		displayName: "Base",
		yellowCompatible: false,
		features: []
	},
	{
		id: 43114,
		name: "avalanche",
		displayName: "Avalanche C-Chain",
		yellowCompatible: false,
		features: []
	},
	{
		id: 56,
		name: "bsc",
		displayName: "BNB Smart Chain",
		yellowCompatible: false,
		features: []
	}
];

export const YELLOW_NETWORK_FEATURES = {
	STATE_CHANNELS: {
		name: "ERC-7824 State Channels",
		description: "Off-chain interactions with on-chain settlement",
		benefits: ["Gasless transactions", "Instant settlement", "High throughput"],
		risks: ["Beta technology", "Limited adoption"]
	},
	BRIDGE_LESS: {
		name: "Bridge-less Cross-chain",
		description: "Direct asset movement without traditional bridges",
		benefits: ["No bridge risk", "Faster settlement", "Lower fees"],
		risks: ["Network dependency", "Liquidity limitations"]
	},
	MESH_NETWORK: {
		name: "P2P Mesh Network",
		description: "Decentralized broker network for liquidity aggregation",
		benefits: ["Distributed liquidity", "Censorship resistant", "No single point of failure"],
		risks: ["Network effects needed", "Complex routing"]
	}
};

export const YELLOW_NETWORK_TOKENS = [
	{
		symbol: "YELLOW",
		name: "Yellow Network Token",
		address: "0x0000000000000000000000000000000000000000", // TBD
		decimals: 18,
		isNative: true
	},
	{
		symbol: "USDC",
		name: "USD Coin",
		yellowSupported: true,
		commonAddresses: {
			ethereum: "0xa0b86a33e6441e6ed2072e96b6c7c0c00f3e15c1",
			polygon: "0x2791bca1f2de4661ed88a30c99a7a9449aa84174",
			arbitrum: "0xaf88d065e77c8cc2239327c5edb3a432268e5831"
		}
	},
	{
		symbol: "WETH",
		name: "Wrapped Ethereum", 
		yellowSupported: true,
		commonAddresses: {
			ethereum: "0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2",
			polygon: "0x7ceb23fd6c49f04c90e37eaa7f75c0059c4d8b12",
			arbitrum: "0x82af49447d8a07e3bd95bd0d56f35241523fbab1"
		}
	}
];

export const YELLOW_NETWORK_ENDPOINTS = {
	TESTNET: {
		rpc: "https://rpc.testnet.yellow.network",
		api: "https://api.testnet.yellow.network",
		explorer: "https://explorer.testnet.yellow.network",
		docs: "https://docs.yellow.org"
	},
	MAINNET: {
		rpc: "https://rpc.yellow.network", 
		api: "https://api.yellow.network",
		explorer: "https://explorer.yellow.network",
		docs: "https://docs.yellow.org"
	}
};

export const DEFAULT_YELLOW_CONFIG = {
	network: "testnet" as "testnet" | "mainnet",
	enableStateChannels: true,
	preferYellowRoutes: true,
	fallbackToBridges: true,
	maxSlippage: "0.5",
	gasOptimization: true
};

export function getYellowNetworkConfig(network: "testnet" | "mainnet" = "testnet") {
	return network === "testnet" ? YELLOW_NETWORK_CHAINS.TESTNET : YELLOW_NETWORK_CHAINS.MAINNET;
}

export function isYellowCompatible(chainId: number): boolean {
	return YELLOW_SUPPORTED_CHAINS.some(chain => 
		chain.id === chainId && chain.yellowCompatible
	);
}

export function getYellowFeatures(chainId: number): string[] {
	const chain = YELLOW_SUPPORTED_CHAINS.find(c => c.id === chainId);
	return chain?.features || [];
}