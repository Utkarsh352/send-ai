import { tool } from "ai";
import { z } from "zod";
import { YELLOW_SUPPORTED_CHAINS, isYellowCompatible } from "../../../../constants/yellowNetwork";

export const addEmployee = tool({
	description: "Add a new employee to the payroll system with cross-chain payment configuration",
	parameters: z.object({
		name: z.string().describe("Employee's full name"),
		role: z.string().describe("Job title or role"),
		location: z.string().describe("Employee's country/location"),
		salary: z.string().describe("Monthly salary amount"),
		currency: z.string().describe("Salary currency (USD, EUR, etc.)"),
		paymentToken: z.string().describe("Preferred crypto token (USDC, USDT, ETH, etc.)"),
		paymentChain: z.string().describe("Preferred blockchain for payments (ethereum, polygon, arbitrum, etc.)"),
		walletAddress: z.string().describe("Employee's wallet address"),
		frequency: z.enum(["Monthly", "Bi-weekly", "Weekly"]).describe("Payment frequency"),
		startDate: z.string().describe("Employment start date (YYYY-MM-DD)")
	}),
	execute: async ({
		name,
		role,
		location,
		salary,
		currency,
		paymentToken,
		paymentChain,
		walletAddress,
		frequency,
		startDate
	}) => {
		console.log(`[PAYROLL] Adding new employee: ${name} (${role})`);

		try {
			// Validate wallet address format
			if (!walletAddress.match(/^0x[a-fA-F0-9]{40}$/)) {
				return {
					success: false,
					error: "Invalid wallet address format. Please provide a valid Ethereum-compatible address."
				};
			}

			// Find the chain configuration
			const chainConfig = YELLOW_SUPPORTED_CHAINS.find(chain =>
				chain.name.toLowerCase() === paymentChain.toLowerCase()
			);

			if (!chainConfig) {
				return {
					success: false,
					error: `Unsupported blockchain: ${paymentChain}. Supported chains: ${YELLOW_SUPPORTED_CHAINS.map(c => c.displayName).join(', ')}`
				};
			}

			// Check Yellow Network compatibility
			const yellowCompatible = isYellowCompatible(chainConfig.id);

			// Create employee record
			const employee = {
				id: `emp_${Date.now()}_${name.toLowerCase().replace(/\s+/g, '_')}`,
				name,
				role,
				location,
				salary: {
					amount: salary,
					currency,
					paymentToken,
					paymentChain: chainConfig.displayName
				},
				wallet: {
					address: walletAddress,
					chainId: chainConfig.id,
					chainName: chainConfig.displayName
				},
				paymentSchedule: {
					frequency,
					nextPaymentDate: getNextPaymentDate(startDate, frequency),
					autoPayEnabled: false // Default to manual approval
				},
				yellowNetwork: {
					compatible: yellowCompatible,
					features: yellowCompatible ? chainConfig.features : [],
					benefits: yellowCompatible ? [
						"State channel payments (gasless)",
						"Instant settlement (~2 minutes)",
						"Lower transaction fees",
						"Bridge-less cross-chain transfers"
					] : []
				},
				status: "Active",
				createdAt: new Date().toISOString(),
				startDate
			};

			return {
				success: true,
				employee,
				message: `Successfully added ${name} to payroll system`,
				yellowNetworkBenefits: yellowCompatible ?
					`${name} can receive payments via Yellow Network on ${chainConfig.displayName} with instant settlement and lower fees` :
					null,
				nextSteps: [
					"Configure auto-pay settings",
					"Set up payment schedule",
					"Send onboarding information to employee",
					yellowCompatible ? "Enable Yellow Network state channels" : "Standard cross-chain setup"
				]
			};

		} catch (error) {
			console.error("Add employee error:", error);
			return {
				success: false,
				error: "Failed to add employee to payroll system",
				details: error instanceof Error ? error.message : "Unknown error"
			};
		}
	}
});

function getNextPaymentDate(startDate: string, frequency: string): string {
	const start = new Date(startDate);
	const now = new Date();

	// Calculate next payment based on frequency
	let nextPayment = new Date(start);

	switch (frequency) {
		case "Weekly":
			while (nextPayment <= now) {
				nextPayment.setDate(nextPayment.getDate() + 7);
			}
			break;
		case "Bi-weekly":
			while (nextPayment <= now) {
				nextPayment.setDate(nextPayment.getDate() + 14);
			}
			break;
		case "Monthly":
		default:
			while (nextPayment <= now) {
				nextPayment.setMonth(nextPayment.getMonth() + 1);
			}
			break;
	}

	return nextPayment.toISOString().split('T')[0];
}