"use client";

import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Wallet, TrendingUp, ArrowUpRight, Network, Eye, EyeOff } from "lucide-react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

interface MultiChainPortfolioInvocationProps {
	result: {
		success: boolean;
		userAddress: string;
		totalChainsChecked: number;
		totalPortfolioValue: string;
		balances: Array<{
			chain: string;
			chainId: number;
			tokens: Array<{
				symbol: string;
				name: string;
				balance: string;
				usdValue: string;
				address: string;
			}>;
			totalUsdValue: string;
			yellowNetworkSupported: boolean;
			bridgeOpportunities: string[];
		}>;
		yellowNetworkChains: number;
		crossChainOpportunities: string[];
		recommendations: string[];
	};
}

export function MultiChainPortfolioInvocation({ result }: MultiChainPortfolioInvocationProps) {
	const [showAllChains, setShowAllChains] = useState(false);
	const [hideSmallBalances, setHideSmallBalances] = useState(true);

	if (!result.success) {
		return (
			<Card className="border-red-200 bg-red-50">
				<CardHeader>
					<CardTitle className="text-red-800">Portfolio Check Failed</CardTitle>
					<CardDescription className="text-red-600">
						Unable to retrieve multi-chain portfolio data. Please verify your wallet address.
					</CardDescription>
				</CardHeader>
			</Card>
		);
	}

	const displayedBalances = result.balances.filter(balance => {
		if (!hideSmallBalances) return true;
		return parseFloat(balance.totalUsdValue) > 10; // Hide chains with less than $10
	});

	const formatCurrency = (value: string) => {
		return new Intl.NumberFormat('en-US', {
			style: 'currency',
			currency: 'USD',
			minimumFractionDigits: 2,
			maximumFractionDigits: 2
		}).format(parseFloat(value));
	};

	const getChainColor = (chain: string) => {
		const colors: Record<string, string> = {
			ethereum: "bg-blue-100 text-blue-800",
			polygon: "bg-purple-100 text-purple-800", 
			arbitrum: "bg-cyan-100 text-cyan-800",
			optimism: "bg-red-100 text-red-800",
			base: "bg-blue-100 text-blue-800",
			avalanche: "bg-red-100 text-red-800",
			bsc: "bg-yellow-100 text-yellow-800",
			"yellow-testnet": "bg-yellow-100 text-yellow-800"
		};
		return colors[chain] || "bg-gray-100 text-gray-800";
	};

	const getChainIcon = (chain: string) => {
		return chain.charAt(0).toUpperCase() + chain.charAt(1).toUpperCase();
	};

	return (
		<div className="space-y-6">
			{/* Portfolio Overview */}
			<Card className="bg-gradient-to-r from-green-50 to-blue-50 border-green-200">
				<CardHeader>
					<div className="flex items-center justify-between">
						<div className="flex items-center space-x-3">
							<div className="p-2 bg-green-500 rounded-lg">
								<Wallet className="w-6 h-6 text-white" />
							</div>
							<div>
								<CardTitle className="text-xl text-green-900">Multi-Chain Portfolio</CardTitle>
								<CardDescription className="text-green-700">
									{result.totalChainsChecked} chains • {result.yellowNetworkChains} Yellow Network compatible
								</CardDescription>
							</div>
						</div>
						<div className="text-right">
							<div className="text-2xl font-bold text-green-900">
								{formatCurrency(result.totalPortfolioValue)}
							</div>
							<Badge variant="secondary" className="bg-green-200 text-green-800">
								<TrendingUp className="w-3 h-3 mr-1" />
								Total Value
							</Badge>
						</div>
					</div>
				</CardHeader>
				<CardContent>
					<div className="flex items-center justify-between mb-4">
						<p className="text-gray-600 text-sm">
							Wallet: <code className="bg-gray-100 px-2 py-1 rounded text-xs">{result.userAddress}</code>
						</p>
						<div className="flex space-x-2">
							<Button
								variant="outline"
								size="sm"
								onClick={() => setHideSmallBalances(!hideSmallBalances)}
							>
								{hideSmallBalances ? <Eye className="w-4 h-4 mr-1" /> : <EyeOff className="w-4 h-4 mr-1" />}
								{hideSmallBalances ? "Show All" : "Hide Small"}
							</Button>
						</div>
					</div>
				</CardContent>
			</Card>

			{/* Chain Balances */}
			<div className="space-y-4">
				<div className="flex items-center justify-between">
					<h3 className="text-lg font-semibold">Chain Balances</h3>
					<Badge variant="outline" className="text-xs">
						{displayedBalances.length} of {result.balances.length} chains shown
					</Badge>
				</div>

				<Accordion type="multiple" className="space-y-2">
					{displayedBalances.map((balance, index) => (
						<AccordionItem key={balance.chainId} value={`chain-${index}`} className="border rounded-lg">
							<AccordionTrigger className="px-4 py-3 hover:no-underline">
								<div className="flex items-center justify-between w-full pr-4">
									<div className="flex items-center space-x-3">
										<div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center text-xs font-bold">
											{getChainIcon(balance.chain)}
										</div>
										<div className="text-left">
											<p className="font-medium capitalize">{balance.chain}</p>
											<div className="flex items-center space-x-2">
												<Badge variant="secondary" className={getChainColor(balance.chain)}>
													{balance.tokens.length} tokens
												</Badge>
												{balance.yellowNetworkSupported && (
													<Badge variant="secondary" className="bg-yellow-100 text-yellow-800">
														<Network className="w-3 h-3 mr-1" />
														Yellow
													</Badge>
												)}
											</div>
										</div>
									</div>
									<div className="text-right">
										<p className="font-semibold">{formatCurrency(balance.totalUsdValue)}</p>
										<p className="text-xs text-gray-500">Chain Total</p>
									</div>
								</div>
							</AccordionTrigger>
							<AccordionContent className="px-4 pb-4">
								<div className="space-y-3">
									{/* Token List */}
									<div className="space-y-2">
										{balance.tokens.map((token, tokenIndex) => (
											<div key={tokenIndex} className="flex items-center justify-between bg-gray-50 p-3 rounded-lg">
												<div className="flex items-center space-x-3">
													<div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white text-xs font-bold">
														{token.symbol.charAt(0)}
													</div>
													<div>
														<p className="font-medium">{token.symbol}</p>
														<p className="text-xs text-gray-500">{token.name}</p>
													</div>
												</div>
												<div className="text-right">
													<p className="font-semibold">{token.balance} {token.symbol}</p>
													<p className="text-sm text-gray-600">{formatCurrency(token.usdValue)}</p>
												</div>
											</div>
										))}
									</div>

									{/* Bridge Opportunities */}
									{balance.bridgeOpportunities.length > 0 && (
										<div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
											<h4 className="font-medium text-blue-900 mb-2 flex items-center">
												<ArrowUpRight className="w-4 h-4 mr-1" />
												Optimization Opportunities
											</h4>
											<ul className="space-y-1">
												{balance.bridgeOpportunities.map((opportunity, i) => (
													<li key={i} className="text-sm text-blue-700">• {opportunity}</li>
												))}
											</ul>
										</div>
									)}
								</div>
							</AccordionContent>
						</AccordionItem>
					))}
				</Accordion>
			</div>

			{/* Cross-Chain Opportunities */}
			<Card>
				<CardHeader>
					<CardTitle className="text-lg flex items-center">
						<Network className="w-5 h-5 mr-2 text-yellow-500" />
						Cross-Chain Opportunities
					</CardTitle>
				</CardHeader>
				<CardContent className="space-y-4">
					<div className="grid gap-3">
						{result.crossChainOpportunities.map((opportunity, index) => (
							<div key={index} className="p-3 bg-gradient-to-r from-yellow-50 to-orange-50 border border-yellow-200 rounded-lg">
								<p className="text-sm text-yellow-800">{opportunity}</p>
							</div>
						))}
					</div>
				</CardContent>
			</Card>

			{/* Recommendations */}
			<Card>
				<CardHeader>
					<CardTitle className="text-lg">AI Recommendations</CardTitle>
				</CardHeader>
				<CardContent>
					<ul className="space-y-2">
						{result.recommendations.map((recommendation, index) => (
							<li key={index} className="flex items-start space-x-2">
								<span className="text-green-500 mt-1">•</span>
								<p className="text-sm text-gray-700">{recommendation}</p>
							</li>
						))}
					</ul>
				</CardContent>
			</Card>
		</div>
	);
}