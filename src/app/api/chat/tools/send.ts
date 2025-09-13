import { tool } from "ai";
import { z } from "zod";
import { parseUnits } from "viem";
import { getAccount, writeContract } from "wagmi/actions";


export const send = tool({
	description: "send YELLOW tokens from your connected wallet to another address on the Yellow Network. ASK FOR CONFIRMATION BEFORE USING THIS TOOL.",
	parameters: z.object({
		to: z.string().min(42).max(42).describe("Recipient Yellow Network address."),
		amount: z.number().positive().describe("Amount of YELLOW tokens to send."),
	}),
});