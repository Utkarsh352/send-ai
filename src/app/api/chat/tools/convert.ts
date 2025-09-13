import { tool } from "ai";
import { z } from "zod";

// import from .env the API_KEY
const API_KEY = process.env.CRYPTOCOMPARE_API_KEY;

export const convert = tool({
	description: "Convert an amount of cryptocurrency from one currency to another.",
	parameters: z.object({
		amount: z.number().positive().describe("Amount to convert."),
		fromCurrency: z.string().describe("Currency code to convert from (e.g. BTC)."),
		toCurrency: z.string().describe("Currency code to convert to (e.g. USD)."),
	}),
	execute: async ({ amount, fromCurrency, toCurrency }) => {
		// Temporary: Return mock data to avoid 401 API errors
		const from = fromCurrency.toUpperCase();
		const to = toCurrency.toUpperCase();

		// Simple mock conversion rates
		const mockRates: Record<string, number> = {
			'BTC-USD': 45000,
			'ETH-USD': 2500,
			'USD-EUR': 0.85,
			'EUR-USD': 1.18,
		};

		const rateKey = `${from}-${to}`;
		const reverseKey = `${to}-${from}`;

		let rate = mockRates[rateKey];
		if (!rate && mockRates[reverseKey]) {
			rate = 1 / mockRates[reverseKey];
		}
		if (!rate) {
			rate = 1; // Default 1:1 if no rate found
		}

		const convertedAmount = amount * rate;

		return JSON.stringify({
			amount: amount,
			convertedAmount: convertedAmount,
			fromCurrency: from,
			toCurrency: to,
			note: "Mock conversion rate used. Connect price API for real rates."
		});
	},
});