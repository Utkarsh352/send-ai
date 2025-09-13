"use client";

import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowRight, Clock, DollarSign, TrendingUp, Zap, Shield } from "lucide-react";

interface SwapRouteProps {
	result: {
		action: string;
		fromToken: string;
		toToken: string;
		amount: number;
		fromChain: string;
		toChain: string;
		route: {
			steps: Array<{
				step: number;
				action: string;
				from: string;
				to: string;
				chain: string;
				protocol: string;
				fee: string;
				time: string;
			}>;
			nodes: Array<{
				id: string;
				label: string;
				type: string;
			}>;
			edges: Array<{
				from: string;
				to: string;
				label: string;
			}>;
		};
		fees: {
			networkFee: string;
			bridgeFee: string;
			totalFees: string;
			slippage: string;
		};
		estimates: {
			outputAmount: string;
			estimatedTime: string;
			priceImpact: string;
		};
		message: string;
		requiresWalletConfirmation: boolean;
		status: string;
	};
}

export function SwapRouteVisualization({ result }: SwapRouteProps) {
	const getChainColor = (chain: string) => {
		const colors: Record<string, string> = {
			ethereum: "border-blue-400 bg-blue-50 text-blue-800",
			polygon: "border-purple-400 bg-purple-50 text-purple-800",
			arbitrum: "border-cyan-400 bg-cyan-50 text-cyan-800",
			optimism: "border-red-400 bg-red-50 text-red-800",
			base: "border-blue-400 bg-blue-50 text-blue-800",
			avalanche: "border-red-400 bg-red-50 text-red-800",
			bsc: "border-yellow-400 bg-yellow-50 text-yellow-800",
			"yellow-bridge": "border-yellow-500 bg-yellow-100 text-yellow-900"
		};
		return colors[chain] || "border-gray-400 bg-gray-50 text-gray-800";
	};

	const getNodeIcon = (type: string) => {
		switch (type) {
			case "source": return "🏁";
			case "bridge": return "🌉";
			case "destination": return "🎯";
			default: return "⚡";
		}
	};

	return (
		<div className="space-y-6 p-4 max-w-4xl">
			{/* Route Visualization Graph */}
			<Card className="bg-gradient-to-br from-slate-900 to-slate-800 border-slate-700">
				<CardHeader>
					<CardTitle className="text-slate-100 flex items-center">
						<Zap className="w-5 h-5 mr-2 text-yellow-400" />
						Cross-Chain Swap Route
					</CardTitle>
				</CardHeader>
				<CardContent>
					<div className="flex items-center justify-center space-x-8 py-6">
						{result.route.nodes.map((node, index) => (
							<div key={node.id} className="flex items-center">
								<div className={`
									relative p-6 rounded-xl border-2 ${getChainColor(node.id)}
									shadow-lg min-w-[120px] text-center
									${node.type === 'bridge' ? 'bg-gradient-to-r from-yellow-100 to-orange-100' : ''}
								`}>
									<div className="text-2xl mb-2">{getNodeIcon(node.type)}</div>
									<div className="font-semibold text-sm">{node.label}</div>
									{node.type === 'source' && (
										<div className="text-xs mt-1 opacity-75">{result.amount} {result.fromToken}</div>
									)}
									{node.type === 'destination' && (
										<div className="text-xs mt-1 opacity-75">{result.estimates.outputAmount}</div>
									)}
								</div>

								{index < result.route.nodes.length - 1 && (
									<div className="flex flex-col items-center mx-4">
										<ArrowRight className="w-6 h-6 text-slate-400 mb-1" />
										<div className="text-xs text-slate-400 text-center max-w-[80px]">
											{result.route.edges[index]?.label}
										</div>
									</div>
								)}
							</div>
						))}
					</div>
				</CardContent>
			</Card>

			{/* Transaction Steps */}
			<Card className="border-slate-700 bg-slate-900">
				<CardHeader>
					<CardTitle className="text-slate-100">Transaction Steps</CardTitle>
				</CardHeader>
				<CardContent className="space-y-4">
					{result.route.steps.map((step, index) => (
						<div key={step.step} className="flex items-center space-x-4 p-4 rounded-lg border border-slate-700 bg-slate-800">
							<div className="flex-shrink-0 w-8 h-8 bg-yellow-500 rounded-full flex items-center justify-center text-black font-bold">
								{step.step}
							</div>
							<div className="flex-1">
								<div className="flex items-center justify-between">
									<div>
										<h4 className="font-semibold text-slate-200">{step.action}</h4>
										<p className="text-sm text-slate-400">{step.from} → {step.to}</p>
										<p className="text-xs text-slate-500">via {step.protocol} on {step.chain}</p>
									</div>
									<div className="text-right">
										<Badge variant="outline" className="bg-slate-700 text-slate-300 border-slate-600">
											<Clock className="w-3 h-3 mr-1" />
											{step.time}
										</Badge>
										<div className="text-xs text-slate-400 mt-1">Fee: {step.fee} {result.fromToken}</div>
									</div>
								</div>
							</div>
						</div>
					))}
				</CardContent>
			</Card>

			{/* Fee Breakdown */}
			<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
				<Card className="border-slate-700 bg-slate-900">
					<CardHeader>
						<CardTitle className="text-slate-100 flex items-center">
							<DollarSign className="w-5 h-5 mr-2 text-green-400" />
							Fee Breakdown
						</CardTitle>
					</CardHeader>
					<CardContent className="space-y-3">
						<div className="flex justify-between">
							<span className="text-slate-400">Network Fee:</span>
							<span className="text-slate-200">{result.fees.networkFee}</span>
						</div>
						<div className="flex justify-between">
							<span className="text-slate-400">Bridge Fee:</span>
							<span className="text-slate-200">{result.fees.bridgeFee}</span>
						</div>
						<div className="flex justify-between">
							<span className="text-slate-400">Slippage:</span>
							<span className="text-slate-200">{result.fees.slippage}</span>
						</div>
						<hr className="border-slate-700" />
						<div className="flex justify-between font-semibold">
							<span className="text-slate-200">Total Fees:</span>
							<span className="text-yellow-400">{result.fees.totalFees}</span>
						</div>
					</CardContent>
				</Card>

				<Card className="border-slate-700 bg-slate-900">
					<CardHeader>
						<CardTitle className="text-slate-100 flex items-center">
							<TrendingUp className="w-5 h-5 mr-2 text-blue-400" />
							Estimates
						</CardTitle>
					</CardHeader>
					<CardContent className="space-y-3">
						<div className="flex justify-between">
							<span className="text-slate-400">You'll Receive:</span>
							<span className="text-slate-200 font-semibold">{result.estimates.outputAmount}</span>
						</div>
						<div className="flex justify-between">
							<span className="text-slate-400">Est. Time:</span>
							<span className="text-slate-200">{result.estimates.estimatedTime}</span>
						</div>
						<div className="flex justify-between">
							<span className="text-slate-400">Price Impact:</span>
							<span className="text-green-400">{result.estimates.priceImpact}</span>
						</div>
						<div className="mt-4 p-3 bg-green-900/20 border border-green-700 rounded-lg">
							<div className="flex items-center text-green-400">
								<Shield className="w-4 h-4 mr-2" />
								<span className="text-sm">Protected by Yellow Network security</span>
							</div>
						</div>
					</CardContent>
				</Card>
			</div>

			{/* Confirmation Message */}
			<Card className="border-yellow-500 bg-gradient-to-r from-yellow-900/20 to-orange-900/20">
				<CardContent className="pt-6">
					<p className="text-slate-200 mb-4">{result.message}</p>
					{result.requiresWalletConfirmation && (
						<Button className="bg-yellow-500 hover:bg-yellow-600 text-black font-semibold">
							Confirm Swap in Wallet
						</Button>
					)}
				</CardContent>
			</Card>
		</div>
	);
}