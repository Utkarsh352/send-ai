import { tool } from "ai";
import { z } from "zod";
import { parseUnits } from "viem";
import { getAccount, writeContract } from "wagmi/actions";


export const send = tool({
	description: "send YELLOW tokens from your connected wallet to another address on the Yellow Network. This will trigger a wallet signing request.",
	parameters: z.object({
		to: z.string().min(42).max(42).describe("Recipient Yellow Network address."),
		amount: z.number().positive().describe("Amount of YELLOW tokens to send."),
	}),
	execute: async ({ to, amount }) => {
		console.log(`[SEND] Initiating send of ${amount} YELLOW to ${to}`);

		// Return execution signal - the actual transaction will be handled by the frontend
		return {
			action: "send",
			to,
			amount,
			message: `Sending ${amount} YELLOW to ${to}`,
			requiresWalletConfirmation: true,
			status: "pending"
		};
	}
});