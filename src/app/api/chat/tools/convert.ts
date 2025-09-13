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
		const from = fromCurrency.toUpperCase();
		const to = toCurrency.toUpperCase();

		// Realistic market rates (would be from real API in production)
		const marketRates: Record<string, number> = {
			'BTC-USD': 43750,
			'ETH-USD': 2380,
			'USDC-USD': 1.00,
			'USDT-USD': 0.999,
			'BNB-USD': 315,
			'AVAX-USD': 28.5,
			'MATIC-USD': 0.68,
			'USD-EUR': 0.92,
			'EUR-USD': 1.09,
		};

		const rateKey = `${from}-${to}`;
		const reverseKey = `${to}-${from}`;

		let rate = marketRates[rateKey];
		if (!rate && marketRates[reverseKey]) {
			rate = 1 / marketRates[reverseKey];
		}
		if (!rate) {
			rate = 1;
		}

		const convertedAmount = amount * rate;

		return JSON.stringify({
			amount: amount,
			convertedAmount: parseFloat(convertedAmount.toFixed(6)),
			fromCurrency: from,
			toCurrency: to,
			rate: rate,
			success: true
		});
	},
});