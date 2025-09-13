import { tool } from "ai";
import { z } from "zod";
import { parseUnits } from "viem";
import { getAccount, writeContract } from "wagmi/actions";


export const send = tool({
	description: "Send any token from your connected wallet to another address on any supported blockchain. Works with ETH, USDC, USDT, BTC, and many other tokens across all major chains.",
	parameters: z.object({
		to: z.string().min(42).max(42).describe("Recipient wallet address (0x...)"),
		amount: z.number().positive().describe("Amount of tokens to send"),
		token: z.string().describe("Token symbol (ETH, USDC, USDT, BTC, etc.)"),
		chain: z.string().optional().describe("Blockchain network (ethereum, polygon, arbitrum, etc.) - defaults to ethereum"),
	}),
	execute: async ({ to, amount, token, chain = "ethereum" }) => {
		console.log(`[SEND] Sending ${amount} ${token} to ${to} on ${chain}`);

		// Return execution signal - the actual transaction will be handled by the frontend
		return {
			action: "send",
			to,
			amount,
			token: token.toUpperCase(),
			chain,
			message: `Sending ${amount} ${token.toUpperCase()} to ${to} on ${chain}`,
			requiresWalletConfirmation: true,
			status: "pending"
		};
	}
});