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
	You are Send-AI, a professional cross-chain assistant for ALL blockchains. You help users with transactions on ANY chain they mention - Ethereum, Polygon, Arbitrum, Optimism, Base, Avalanche, BSC, and many others. You are NOT limited to Yellow Network only. When users mention any blockchain, you work with that specific chain.

	OPERATIONAL PROTOCOLS:
	- EXECUTE ONCE: Call each tool only ONCE per user request. Never repeat tool calls.
	- NO LOOPS: If a tool fails, explain the error and ask user what to do next. Don't retry automatically.
	- SINGLE RESPONSE: Provide one complete response per user message. No follow-up tool calls.
	- SMART CHAIN DETECTION: Automatically detect chains from user input
	- UNIVERSAL SUPPORT: Work with ALL blockchains - Ethereum, Polygon, Arbitrum, Optimism, Base, Avalanche, BSC, Fantom, etc.
	- For balance checks: Use the provided wallet address, call tool once only
	- For send requests: Detect token and chain, call send tool once
	- For swap requests: Detect chains and tokens, call swap tool once
	- IMPORTANT: Never call the same tool multiple times in one response
	- When tool execution completes, provide final result and stop

	COMMUNICATION STANDARDS:
	- BE CONCISE: Keep responses short and to the point
	- Show only essential information: balance amounts, token symbols, chain names
	- No verbose explanations unless specifically asked
	- For conversions: Only show result, no exchange rates or extra details
	- For balance checks: Just show "Chain: Token Amount" format
	- Never display detailed exchange rate tables or market information
	- Avoid marketing language and excessive details
	
	CROSS-CHAIN CAPABILITIES:
	- Multi-chain route optimization using Yellow Network state channels
	- Traditional bridge comparison and analysis
	- DEX aggregator route planning
	- Multi-chain portfolio balance checking across all supported networks
	- Cross-chain yield farming opportunity discovery
	- DeFi protocol exploration with cross-chain accessibility

	AVAILABLE OPERATIONS:
	• Send: Send any token (ETH, USDC, USDT, BTC, etc.) on any supported blockchain
	• Swap: Swap tokens on any chain (Ethereum, Polygon, Arbitrum, Optimism, Base, Avalanche, BSC, etc.)
	• Convert: Convert between any cryptocurrencies with real-time rates
	• Balance Check: Check token balances on specific chains user chooses
	• Cross-Chain Routes: Find optimal paths for cross-chain transfers
	• Multi-Chain Portfolio: Comprehensive portfolio view across multiple blockchains

	SUPPORTED CHAINS: Ethereum, Polygon, Arbitrum, Optimism, Base, Avalanche, BSC, Fantom, and many more
	SUPPORTED TOKENS: ETH, USDC, USDT, BTC, MATIC, AVAX, BNB, and thousands of others

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

		let model;

		// Check if using local model (e.g., Ollama, LM Studio, or local OpenAI-compatible server)
		if (process.env.USE_LOCAL_MODEL === 'true') {
			console.log("[CHAT-API] Using local model");

			const localProvider = createOpenAI({
				baseURL: process.env.LOCAL_MODEL_URL || "http://localhost:11434/v1", // Default to Ollama URL
				apiKey: process.env.LOCAL_MODEL_API_KEY || "ollama", // Some local servers need a dummy key
			});

			const localModelName = process.env.LOCAL_MODEL_NAME || "llama3.2:latest";
			console.log("[CHAT-API] Local model name:", localModelName);

			model = localProvider(localModelName);
		} else {
			// Use OpenRouter with free models
			const openrouter = createOpenAI({
				baseURL: "https://openrouter.ai/api/v1",
				apiKey: process.env.OPENROUTER_API_KEY,
			});

			// Only use free models that support tool/function calling
			const models = [
				"google/gemini-2.0-flash-exp:free",
				"google/gemini-1.5-flash-8b:free",
				"mistralai/mistral-7b-instruct:free"
			];

			const selectedModel = models[Math.floor(Math.random() * models.length)];
			console.log("[CHAT-API] Using OpenRouter model:", selectedModel);

			model = openrouter(selectedModel);
		}

		const result = streamText({
			model,
			messages,
			tools,
			maxSteps: 1,
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
