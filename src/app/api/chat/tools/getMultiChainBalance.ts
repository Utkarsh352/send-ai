import { tool } from "ai";
import { z } from "zod";
import { createPublicClient, http, formatEther, getAddress } from "viem";
import { mainnet, polygon, arbitrum, optimism, base, avalanche, bsc } from "viem/chains";

// ERC-20 ABI for balanceOf function
const ERC20_ABI = [
	{
		constant: true,
		inputs: [{ name: '_owner', type: 'address' }],
		name: 'balanceOf',
		outputs: [{ name: 'balance', type: 'uint256' }],
		type: 'function',
	},
	{
		constant: true,
		inputs: [],
		name: 'decimals',
		outputs: [{ name: '', type: 'uint8' }],
		type: 'function',
	},
	{
		constant: true,
		inputs: [],
		name: 'symbol',
		outputs: [{ name: '', type: 'string' }],
		type: 'function',
	},
	{
		constant: true,
		inputs: [],
		name: 'name',
		outputs: [{ name: '', type: 'string' }],
		type: 'function',
	},
] as const;

// Chain configurations with RPC endpoints and popular tokens
const CHAIN_CONFIGS = {
	ethereum: {
		chain: mainnet,
		tokens: {
			'ETH': { address: '0x0000000000000000000000000000000000000000', decimals: 18, isNative: true },
			'USDC': { address: '0xa0b86a33e6441e6c8c7ece9c2a72d3e16c8084c4', decimals: 6, isNative: false },
			'USDT': { address: '0xdac17f958d2ee523a2206206994597c13d831ec7', decimals: 6, isNative: false },
			'WBTC': { address: '0x2260fac5e5542a773aa44fbcfedf7c193bc2c599', decimals: 8, isNative: false },
		}
	},
	polygon: {
		chain: polygon,
		tokens: {
			'MATIC': { address: '0x0000000000000000000000000000000000000000', decimals: 18, isNative: true },
			'USDC': { address: '0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174', decimals: 6, isNative: false },
			'USDT': { address: '0xc2132D05D31c914a87C6611C10748AEb04B58e8F', decimals: 6, isNative: false },
		}
	},
	arbitrum: {
		chain: arbitrum,
		tokens: {
			'ETH': { address: '0x0000000000000000000000000000000000000000', decimals: 18, isNative: true },
			'USDC': { address: '0xFF970A61A04b1cA14834A43f5dE4533eBDDB5CC8', decimals: 6, isNative: false },
			'ARB': { address: '0x912CE59144191C1204E64559FE8253a0e49E6548', decimals: 18, isNative: false },
		}
	},
	optimism: {
		chain: optimism,
		tokens: {
			'ETH': { address: '0x0000000000000000000000000000000000000000', decimals: 18, isNative: true },
			'USDC': { address: '0x7F5c764cBc14f9669B88837ca1490cCa17c31607', decimals: 6, isNative: false },
			'OP': { address: '0x4200000000000000000000000000000000000042', decimals: 18, isNative: false },
		}
	},
	base: {
		chain: base,
		tokens: {
			'ETH': { address: '0x0000000000000000000000000000000000000000', decimals: 18, isNative: true },
			'USDC': { address: '0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913', decimals: 6, isNative: false },
		}
	},
	avalanche: {
		chain: avalanche,
		tokens: {
			'AVAX': { address: '0x0000000000000000000000000000000000000000', decimals: 18, isNative: true },
			'USDC': { address: '0xB97EF9Ef8734C71904D8002F8b6Bc66Dd9c48a6E', decimals: 6, isNative: false },
		}
	},
	bsc: {
		chain: bsc,
		tokens: {
			'BNB': { address: '0x0000000000000000000000000000000000000000', decimals: 18, isNative: true },
			'USDC': { address: '0x8AC76a51cc950d9822D68b83fE1Ad97B32Cd580d', decimals: 18, isNative: false },
			'USDT': { address: '0x55d398326f99059fF775485246999027B3197955', decimals: 18, isNative: false },
		}
	},
};

export const getMultiChainBalance = tool({
	description: "Get real portfolio balances for specific chains and tokens from the blockchain",
	parameters: z.object({
		userAddress: z.string().describe("User's wallet address (automatically provided)"),
		selectedChains: z.array(z.enum(['ethereum', 'polygon', 'arbitrum', 'optimism', 'base', 'avalanche', 'bsc'])).optional().describe("Specific chains to check (user selects)"),
		tokens: z.array(z.string()).optional().describe("Specific tokens to check (optional, defaults to popular tokens)"),
	}),
	execute: async ({ userAddress, selectedChains, tokens }) => {
		console.log(`[MULTI-CHAIN-BALANCE] Fetching REAL balances for ${userAddress} on chains:`, selectedChains || "user will choose");

		if (!userAddress || !selectedChains || selectedChains.length === 0) {
			return {
				success: false,
				error: "Please connect your wallet and select at least one chain to check balances",
				availableChains: Object.keys(CHAIN_CONFIGS),
				note: "Select specific chains you want to check instead of checking all chains"
			};
		}

		try {
			// Validate address format - handle different cases
			if (!userAddress || userAddress.length !== 42 || !userAddress.startsWith('0x')) {
				throw new Error('Invalid wallet address format');
			}
			const checksumAddress = userAddress.toLowerCase() as `0x${string}`;

			const results = await Promise.allSettled(
				selectedChains.map(async (chainName) => {
					const config = CHAIN_CONFIGS[chainName as keyof typeof CHAIN_CONFIGS];
					if (!config) {
						throw new Error(`Chain ${chainName} not supported`);
					}

					// Create public client for this chain
					const client = createPublicClient({
						chain: config.chain,
						transport: http(),
					});

					const chainBalances = await Promise.allSettled(
						Object.entries(config.tokens).map(async ([symbol, tokenConfig]) => {
							try {
								let balance;
								let decimals = tokenConfig.decimals;

								if (tokenConfig.isNative) {
									// Get native token balance (ETH, MATIC, etc.)
									balance = await client.getBalance({
										address: checksumAddress,
									});
								} else {
									// Get ERC-20 token balance with proper address validation
									const tokenAddress = tokenConfig.address.toLowerCase() as `0x${string}`;
									balance = await client.readContract({
										address: tokenAddress,
										abi: ERC20_ABI,
										functionName: 'balanceOf',
										args: [checksumAddress],
									});
								}

								// Convert to human readable format based on token decimals
								const formattedBalance = tokenConfig.isNative
									? formatEther(balance)
									: (Number(balance) / Math.pow(10, decimals)).toString();
								const numericBalance = parseFloat(formattedBalance);

								// Only include tokens with non-zero balance
								if (numericBalance > 0) {
									return {
										symbol,
										name: symbol === 'ETH' ? 'Ethereum' :
											  symbol === 'MATIC' ? 'Polygon' :
											  symbol === 'AVAX' ? 'Avalanche' :
											  symbol === 'BNB' ? 'BNB' : symbol,
										balance: numericBalance.toFixed(6),
										usdValue: "0.00", // Price API needed for real USD values
										address: tokenConfig.address
									};
								}
								return null;
							} catch (error) {
								console.error(`Error fetching ${symbol} balance on ${chainName}:`, error);
								return null;
							}
						})
					);

					const validTokens = chainBalances
						.filter((result): result is PromiseFulfilledResult<any> =>
							result.status === 'fulfilled' && result.value !== null)
						.map(result => result.value);

					return {
						chain: chainName,
						chainId: config.chain.id,
						tokens: validTokens,
						totalUsdValue: "0.00", // Would need price API for real USD values
						totalTokens: validTokens.length,
						yellowNetworkSupported: ['ethereum', 'polygon', 'arbitrum'].includes(chainName),
						bridgeOpportunities: validTokens.length > 0 ? [`Bridge ${validTokens[0].symbol} via Yellow Network for lower fees`] : [],
						rpcSuccess: true
					};
				})
			);

			const successfulChains = results
				.filter((result): result is PromiseFulfilledResult<any> => result.status === 'fulfilled')
				.map(result => result.value);

			const failedChains = results
				.filter((result): result is PromiseRejectedResult => result.status === 'rejected')
				.map(result => result.reason?.message || 'Unknown error');

			// Calculate total portfolio value (would need price API for real USD values)
			const totalTokensFound = successfulChains.reduce((sum, chain) => sum + chain.totalTokens, 0);

			return {
				success: true,
				userAddress: checksumAddress,
				selectedChains,
				totalChainsChecked: successfulChains.length,
				totalPortfolioValue: "0.00", // Would need price API for real USD values
				totalTokensWithBalance: totalTokensFound,
				balances: successfulChains,
				failedChains: failedChains.length > 0 ? failedChains : undefined,
				yellowNetworkChains: successfulChains.filter(b => b.yellowNetworkSupported).length,
				crossChainOpportunities: totalTokensFound > 0 ? ["Use Yellow Network for cross-chain transfers"] : [],
				note: "Real blockchain data fetched. Connect price API for USD values.",
				recommendations: [
					totalTokensFound > 0 ? "Tokens found on selected chains" : "No tokens found on selected chains"
				]
			};

		} catch (error) {
			console.error('[MULTI-CHAIN-BALANCE] Error:', error);
			return {
				success: false,
				error: error instanceof Error ? error.message : 'Unknown error occurred',
				userAddress,
				selectedChains,
				note: "Failed to fetch real blockchain data. Check wallet address and network connectivity."
			};
		}
	}
});