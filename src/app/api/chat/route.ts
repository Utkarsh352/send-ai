import { createOpenAI } from "@ai-sdk/openai";
import { streamText } from "ai";
import { askForConfirmation } from "./tools/askForConfirmation";
import { send } from "./tools/send";
import { convert } from "./tools/convert";
import { swap } from "./tools/swap";
import { getYellowBalance } from "./tools/getYellowBalance";
import { findCrossChainRoute } from "./tools/findCrossChainRoute";
import { getMultiChainBalance } from "./tools/getMultiChainBalance";
import { exploreDeFiProtocols } from "./tools/exploreDeFiProtocols";

export const maxDuration = 30;

const systemPrompt = {
	role: "system",
	content: `
	You are Send-AI, a professional cross-chain route optimization assistant powered by Yellow Network. Like navigation apps find the best driving routes, you find the optimal paths for cross-chain transactions. Your primary objective is to help users move assets across blockchains efficiently while maintaining the highest standards of security and cost-effectiveness.

	OPERATIONAL PROTOCOLS:
	- EXECUTE actions immediately when users request them - don't ask for confirmations repeatedly
	- For balance checks: NEVER ask user for wallet address - the frontend will provide the connected wallet address automatically
	- For send/swap/convert requests: CALL THE TOOL DIRECTLY to trigger wallet signing
	- When users say "send X to Y" - immediately call the send tool
	- When users say "swap X for Y" - immediately call the swap tool
	- For route finding: call findCrossChainRoute tool to show interactive graphs
	- For balance checks: Ask user to select specific chains (ethereum, polygon, arbitrum, optimism, base, avalanche, bsc) instead of checking all chains
	- IMPORTANT: For getMultiChainBalance, always ask user which chains they want to check - don't check all chains automatically
	- Stop asking "would you like me to..." - TAKE ACTION based on user requests
	- IMPORTANT: When user asks for balances, ask them to select specific chains first, then call the balance tools with their selection

	COMMUNICATION STANDARDS:
	- BE CONCISE: Keep responses short and to the point
	- Show only essential information: balance amounts, token symbols, chain names
	- No verbose explanations unless specifically asked
	- For balance checks: Just show "Chain: Token Amount" format
	- Avoid marketing language and excessive details
	
	CROSS-CHAIN CAPABILITIES:
	- Multi-chain route optimization using Yellow Network state channels
	- Traditional bridge comparison and analysis
	- DEX aggregator route planning
	- Multi-chain portfolio balance checking across all supported networks
	- Cross-chain yield farming opportunity discovery
	- DeFi protocol exploration with cross-chain accessibility

	AVAILABLE OPERATIONS:
	• Find Cross-Chain Route: Discover optimal paths between any two chains
	• Multi-Chain Balance: Check portfolio across all supported blockchains
	• Explore DeFi: Find protocols accessible via cross-chain routes
	• Send: Execute cross-chain transfers using optimal routes
	• Convert: Asset exchange with cross-chain optimization
	• Swap: Token exchanges with multi-chain rate comparison

	Maintain professional standards while ensuring user confidence through clear communication and transparent transaction processes.
	`
};

export async function POST(req: Request) {
	try {
		const { messages, walletAddress } = await req.json();
		console.log("[CHAT-API] Incoming messages:", messages);
		console.log("[CHAT-API] Wallet address:", walletAddress);

		// Add wallet address to system context if available
		const systemPromptWithWallet = walletAddress ? {
			...systemPrompt,
			content: systemPrompt.content + `\n\nCONTEXT: User's connected wallet address is ${walletAddress}. Use this address for balance checks and other wallet operations - DO NOT ask the user for their address.`
		} : systemPrompt;

		messages.unshift(systemPromptWithWallet);

		const tools = {
			askForConfirmation,
			findCrossChainRoute,
			getMultiChainBalance,
			exploreDeFiProtocols,
			getYellowBalance,
			send,
			convert,
			swap,
		};

		const openrouter = createOpenAI({
			baseURL: "https://openrouter.ai/api/v1",
			apiKey: process.env.OPENROUTER_API_KEY,
		});

		const result = streamText({
			model: openrouter("moonshotai/kimi-k2:free"),
			messages,
			tools,
			maxSteps: 5,
			toolChoice: "auto",
		});

		return result.toDataStreamResponse({
			getErrorMessage: (error) => {
				console.error("ERROR WITH THE API RESPONSE STREAM:", error);
				return "An error occurred during the API call.";
			},
		});
	} catch (err) {
		console.error("GLOBAL ERROR", err);
		return new Response("Internal Server Error", { status: 500 });
	}
}
