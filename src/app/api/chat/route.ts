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
	- Execute route optimization tools directly, using askForConfirmation for actual transaction execution
	- Always provide multiple route options with clear comparisons of time, cost, and security
	- CRITICAL: When users request routes or balances, you must request their wallet address. Never use placeholder addresses.
	- Prioritize Yellow Network routes when available, but always show alternatives

	COMMUNICATION STANDARDS:
	- Explain routes like giving driving directions: show the path, stops, and alternatives
	- Provide clear comparisons between Yellow Network, traditional bridges, and DEX aggregators
	- Visualize transaction paths with step-by-step breakdowns
	- Always explain the trade-offs: speed vs cost vs security
	- Use navigation-like language: "fastest route", "scenic route" (lowest fees), "highway route" (most secure)
	
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
		const { messages } = await req.json();
		console.log("[CHAT-API] Incoming messages:", messages);

		messages.unshift(systemPrompt);

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
