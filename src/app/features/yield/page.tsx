"use client";

import { useState } from "react";
import { ArrowLeft, TrendingUp, DollarSign, Shield, Zap, AlertTriangle, Target, BarChart3, PieChart, TrendingDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription } from "@/components/ui/alert";
import Link from "next/link";
import { motion } from "framer-motion";

const yieldFeatures = [
	{
		icon: Target,
		title: "AI-Powered Recommendations",
		description: "Get personalized yield farming strategies based on your risk tolerance and capital size."
	},
	{
		icon: BarChart3,
		title: "Real-time APY Tracking",
		description: "Monitor yields across all major DeFi protocols with live updates and historical data."
	},
	{
		icon: Shield,
		title: "Risk Assessment",
		description: "Comprehensive risk scoring for smart contracts, teams, and protocols before you invest."
	},
	{
		icon: Zap,
		title: "Auto-Compounding",
		description: "Automated harvest and reinvestment strategies to maximize your yield potential."
	}
];

const yieldOpportunities = [
	{
		protocol: "Aave",
		chain: "Ethereum",
		asset: "USDC",
		apy: "4.2%",
		tvl: "$1.2B",
		riskScore: 92,
		type: "Lending",
		rewards: ["AAVE"],
		strategy: "Stable yield with governance rewards"
	},
	{
		protocol: "Compound",
		chain: "Ethereum",
		asset: "ETH",
		apy: "3.8%",
		tvl: "$850M",
		riskScore: 89,
		type: "Lending",
		rewards: ["COMP"],
		strategy: "Blue-chip asset lending"
	},
	{
		protocol: "Uniswap V3",
		chain: "Arbitrum",
		asset: "USDC/ETH",
		apy: "12.5%",
		tvl: "$420M",
		riskScore: 78,
		type: "LP",
		rewards: ["ARB"],
		strategy: "Concentrated liquidity with incentives"
	},
	{
		protocol: "Curve",
		chain: "Polygon",
		asset: "USDC/USDT",
		apy: "8.9%",
		tvl: "$180M",
		riskScore: 85,
		type: "LP",
		rewards: ["CRV", "MATIC"],
		strategy: "Stable coin pair with dual rewards"
	},
	{
		protocol: "GMX",
		chain: "Arbitrum",
		asset: "GLP",
		apy: "15.3%",
		tvl: "$350M",
		riskScore: 72,
		type: "Index",
		rewards: ["GMX", "ETH"],
		strategy: "Perpetual trading fees + escrowed rewards"
	}
];

const portfolioStrategies = [
	{
		name: "Conservative",
		description: "Low-risk strategies focused on stable yields",
		allocation: {
			lending: 70,
			stablecoinLP: 25,
			bluechipLP: 5
		},
		expectedAPY: "4-7%",
		riskLevel: "Low",
		color: "bg-green-500"
	},
	{
		name: "Balanced",
		description: "Moderate risk with diversified yield sources",
		allocation: {
			lending: 40,
			stablecoinLP: 30,
			bluechipLP: 20,
			altcoins: 10
		},
		expectedAPY: "8-15%",
		riskLevel: "Medium",
		color: "bg-blue-500"
	},
	{
		name: "Aggressive",
		description: "High-yield opportunities with elevated risk",
		allocation: {
			lending: 20,
			bluechipLP: 30,
			altcoins: 35,
			derivatives: 15
		},
		expectedAPY: "15-35%",
		riskLevel: "High",
		color: "bg-orange-500"
	}
];

const riskFactors = [
	{
		factor: "Smart Contract Risk",
		description: "Risk of bugs or exploits in protocol code",
		mitigation: "Audit history and time-tested protocols"
	},
	{
		factor: "Impermanent Loss",
		description: "Value loss from price divergence in LP positions",
		mitigation: "Correlated asset pairs and stable coins"
	},
	{
		factor: "Liquidation Risk",
		description: "Risk of position liquidation in leveraged strategies",
		mitigation: "Conservative collateral ratios"
	},
	{
		factor: "Token Risk",
		description: "Risk from reward token price volatility",
		mitigation: "Auto-harvesting and diversification"
	}
];

export default function YieldAdvisorPage() {
	const [riskTolerance, setRiskTolerance] = useState("");
	const [investmentAmount, setInvestmentAmount] = useState("");

	const getRiskColor = (score: number) => {
		if (score >= 85) return "text-green-500 bg-green-500/10";
		if (score >= 70) return "text-yellow-500 bg-yellow-500/10";
		return "text-red-500 bg-red-500/10";
	};

	const getStrategyColor = (strategy: string) => {
		switch (strategy) {
			case "Conservative": return "border-green-500 bg-green-500/5";
			case "Balanced": return "border-blue-500 bg-blue-500/5";
			case "Aggressive": return "border-orange-500 bg-orange-500/5";
			default: return "border-gray-500 bg-gray-500/5";
		}
	};

	return (
		<div className="min-h-screen bg-background">
			{/* Header */}
			<header className="border-b border-border/40 bg-background/80 backdrop-blur-md sticky top-0 z-50">
				<div className="container mx-auto px-6 py-4">
					<div className="flex items-center justify-between">
						<div className="flex items-center gap-4">
							<Link href="/">
								<Button variant="ghost" size="sm">
									<ArrowLeft className="w-4 h-4 mr-2" />
									Back to Home
								</Button>
							</Link>
							<div className="flex items-center gap-3">
								<div className="w-10 h-10 bg-gradient-to-br from-yellow-500 to-amber-500 rounded-lg flex items-center justify-center">
									<TrendingUp className="w-5 h-5 text-white" />
								</div>
								<div>
									<h1 className="font-semibold text-lg">Cross-Chain Yield Advisor</h1>
									<p className="text-sm text-muted-foreground">AI-powered portfolio optimization</p>
								</div>
							</div>
						</div>
						<Badge variant="secondary">Coming Soon</Badge>
					</div>
				</div>
			</header>

			<div className="container mx-auto px-6 py-12">
				{/* Hero Section */}
				<motion.div
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					className="text-center mb-16"
				>
					<h2 className="text-4xl font-bold bg-gradient-to-r from-yellow-400 to-amber-400 bg-clip-text text-transparent mb-4">
						AI-Powered Cross-Chain Yield Optimization
					</h2>
					<p className="text-xl text-muted-foreground max-w-3xl mx-auto">
						Maximize your DeFi yields with intelligent portfolio management across multiple chains.
						Get personalized recommendations, risk assessments, and automated strategies.
					</p>
				</motion.div>

				{/* Risk Disclaimer */}
				<motion.div
					initial={{ opacity: 0, y: 30 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ delay: 0.1 }}
					className="mb-16"
				>
					<Alert className="max-w-4xl mx-auto border-yellow-500/50 bg-yellow-500/5">
						<AlertTriangle className="h-4 w-4 text-yellow-500" />
						<AlertDescription className="text-yellow-700 dark:text-yellow-300">
							<strong>Investment Disclaimer:</strong> DeFi yield farming involves significant risks including smart contract vulnerabilities,
							impermanent loss, and potential total loss of funds. This tool provides educational information only and is not financial advice.
							Always do your own research and never invest more than you can afford to lose.
						</AlertDescription>
					</Alert>
				</motion.div>

				{/* Interactive Strategy Builder */}
				<motion.div
					initial={{ opacity: 0, y: 30 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ delay: 0.2 }}
					className="mb-16"
				>
					<Card className="max-w-4xl mx-auto">
						<CardHeader>
							<CardTitle className="flex items-center gap-2">
								<Target className="w-5 h-5 text-yellow-500" />
								Personalized Strategy Builder
							</CardTitle>
							<CardDescription>
								Tell us about your preferences to get customized yield farming recommendations
							</CardDescription>
						</CardHeader>
						<CardContent>
							<div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
								<div>
									<label className="text-sm font-medium mb-2 block">Investment Amount</label>
									<Input
										placeholder="10,000"
										value={investmentAmount}
										onChange={(e) => setInvestmentAmount(e.target.value)}
									/>
								</div>
								<div>
									<label className="text-sm font-medium mb-2 block">Risk Tolerance</label>
									<Select value={riskTolerance} onValueChange={setRiskTolerance}>
										<SelectTrigger>
											<SelectValue placeholder="Select risk level" />
										</SelectTrigger>
										<SelectContent>
											<SelectItem value="conservative">Conservative (4-7% APY)</SelectItem>
											<SelectItem value="moderate">Moderate (8-15% APY)</SelectItem>
											<SelectItem value="aggressive">Aggressive (15%+ APY)</SelectItem>
										</SelectContent>
									</Select>
								</div>
								<div className="flex items-end">
									<Button className="w-full" disabled>
										Generate Strategy
									</Button>
								</div>
							</div>

							{riskTolerance && investmentAmount && (
								<motion.div
									initial={{ opacity: 0, height: 0 }}
									animate={{ opacity: 1, height: "auto" }}
									className="border border-border/50 rounded-lg p-6 bg-accent/20"
								>
									<h4 className="font-semibold mb-4">Preview: Recommended Strategy</h4>
									<div className="grid grid-cols-1 md:grid-cols-3 gap-4">
										<div className="text-center">
											<p className="text-2xl font-bold text-yellow-500">${parseInt(investmentAmount || "0").toLocaleString()}</p>
											<p className="text-sm text-muted-foreground">Investment Amount</p>
										</div>
										<div className="text-center">
											<p className="text-2xl font-bold text-green-500">
												{riskTolerance === 'conservative' ? '5.2%' :
												 riskTolerance === 'moderate' ? '11.8%' : '22.4%'}
											</p>
											<p className="text-sm text-muted-foreground">Expected APY</p>
										</div>
										<div className="text-center">
											<p className="text-2xl font-bold text-blue-500">
												{riskTolerance === 'conservative' ? '3' :
												 riskTolerance === 'moderate' ? '5' : '7'}
											</p>
											<p className="text-sm text-muted-foreground">Protocols</p>
										</div>
									</div>
									<p className="text-xs text-muted-foreground mt-4 text-center">
										Full strategy breakdown with specific allocations will be available soon
									</p>
								</motion.div>
							)}
						</CardContent>
					</Card>
				</motion.div>

				{/* Yield Opportunities */}
				<motion.div
					initial={{ opacity: 0, y: 30 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ delay: 0.3 }}
					className="mb-16"
				>
					<Tabs defaultValue="opportunities" className="w-full">
						<TabsList className="grid w-full grid-cols-3 max-w-lg mx-auto">
							<TabsTrigger value="opportunities">Opportunities</TabsTrigger>
							<TabsTrigger value="strategies">Strategies</TabsTrigger>
							<TabsTrigger value="risks">Risk Analysis</TabsTrigger>
						</TabsList>

						<TabsContent value="opportunities" className="space-y-6">
							<h3 className="text-2xl font-bold text-center">Top Yield Opportunities</h3>
							<div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
								{yieldOpportunities.map((opportunity, index) => (
									<Card key={index} className="relative overflow-hidden">
										<CardHeader>
											<div className="flex items-center justify-between">
												<CardTitle className="text-lg">{opportunity.protocol}</CardTitle>
												<div className="flex items-center gap-2">
													<Badge className={getRiskColor(opportunity.riskScore)}>
														{opportunity.riskScore}/100
													</Badge>
													<Badge variant="outline">{opportunity.chain}</Badge>
												</div>
											</div>
											<CardDescription>{opportunity.strategy}</CardDescription>
										</CardHeader>
										<CardContent className="space-y-4">
											<div className="grid grid-cols-2 gap-4">
												<div>
													<p className="text-sm text-muted-foreground">APY</p>
													<p className="text-2xl font-bold text-green-500">{opportunity.apy}</p>
												</div>
												<div>
													<p className="text-sm text-muted-foreground">TVL</p>
													<p className="text-lg font-semibold">{opportunity.tvl}</p>
												</div>
												<div>
													<p className="text-sm text-muted-foreground">Asset</p>
													<p className="font-semibold">{opportunity.asset}</p>
												</div>
												<div>
													<p className="text-sm text-muted-foreground">Type</p>
													<p className="font-semibold">{opportunity.type}</p>
												</div>
											</div>
											<div>
												<p className="text-sm text-muted-foreground mb-2">Rewards</p>
												<div className="flex gap-1">
													{opportunity.rewards.map((reward, i) => (
														<Badge key={i} variant="outline" className="text-xs">
															{reward}
														</Badge>
													))}
												</div>
											</div>
											<Button variant="outline" size="sm" className="w-full" disabled>
												Add to Strategy
											</Button>
										</CardContent>
									</Card>
								))}
							</div>
						</TabsContent>

						<TabsContent value="strategies" className="space-y-6">
							<h3 className="text-2xl font-bold text-center">Portfolio Strategies</h3>
							<div className="grid grid-cols-1 md:grid-cols-3 gap-6">
								{portfolioStrategies.map((strategy, index) => (
									<Card key={index} className={`relative border-2 ${getStrategyColor(strategy.name)}`}>
										<CardHeader>
											<CardTitle className="text-lg flex items-center gap-2">
												<div className={`w-4 h-4 rounded-full ${strategy.color}`} />
												{strategy.name}
											</CardTitle>
											<CardDescription>{strategy.description}</CardDescription>
										</CardHeader>
										<CardContent className="space-y-4">
											<div className="space-y-2">
												<div className="flex justify-between text-sm">
													<span>Expected APY</span>
													<span className="font-semibold text-green-500">{strategy.expectedAPY}</span>
												</div>
												<div className="flex justify-between text-sm">
													<span>Risk Level</span>
													<Badge variant="outline">{strategy.riskLevel}</Badge>
												</div>
											</div>
											<div className="space-y-2">
												<p className="text-sm font-medium">Allocation:</p>
												{Object.entries(strategy.allocation).map(([key, value]) => (
													<div key={key} className="flex justify-between text-xs">
														<span className="capitalize">{key.replace(/([A-Z])/g, ' $1')}</span>
														<span>{value}%</span>
													</div>
												))}
											</div>
											<Button variant="outline" size="sm" className="w-full" disabled>
												Select Strategy
											</Button>
										</CardContent>
									</Card>
								))}
							</div>
						</TabsContent>

						<TabsContent value="risks" className="space-y-6">
							<h3 className="text-2xl font-bold text-center">Risk Factors & Mitigation</h3>
							<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
								{riskFactors.map((risk, index) => (
									<Card key={index}>
										<CardHeader>
											<CardTitle className="text-lg flex items-center gap-2">
												<AlertTriangle className="w-5 h-5 text-yellow-500" />
												{risk.factor}
											</CardTitle>
										</CardHeader>
										<CardContent className="space-y-3">
											<p className="text-sm text-muted-foreground">{risk.description}</p>
											<div className="border-l-4 border-green-500 pl-4">
												<p className="text-sm font-medium text-green-600 dark:text-green-400">Mitigation Strategy:</p>
												<p className="text-sm">{risk.mitigation}</p>
											</div>
										</CardContent>
									</Card>
								))}
							</div>
						</TabsContent>
					</Tabs>
				</motion.div>

				{/* Features */}
				<motion.div
					initial={{ opacity: 0, y: 30 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ delay: 0.4 }}
					className="mb-16"
				>
					<h3 className="text-2xl font-bold text-center mb-8">Advisor Features</h3>
					<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
						{yieldFeatures.map((feature, index) => {
							const IconComponent = feature.icon;
							return (
								<Card key={index} className="text-center">
									<CardHeader>
										<div className="w-12 h-12 bg-gradient-to-br from-yellow-500 to-amber-500 rounded-lg flex items-center justify-center mx-auto mb-4">
											<IconComponent className="w-6 h-6 text-white" />
										</div>
										<CardTitle className="text-lg">{feature.title}</CardTitle>
									</CardHeader>
									<CardContent>
										<CardDescription>{feature.description}</CardDescription>
									</CardContent>
								</Card>
							);
						})}
					</div>
				</motion.div>

				{/* Coming Soon CTA */}
				<motion.div
					initial={{ opacity: 0, y: 30 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ delay: 0.5 }}
					className="text-center"
				>
					<Card className="max-w-2xl mx-auto">
						<CardHeader>
							<CardTitle>Maximize Your DeFi Yields</CardTitle>
							<CardDescription>
								Get notified when our AI-powered yield advisor launches
							</CardDescription>
						</CardHeader>
						<CardContent>
							<div className="flex gap-2 max-w-md mx-auto">
								<Input placeholder="Your email" type="email" />
								<Button disabled>Get Early Access</Button>
							</div>
							<p className="text-xs text-muted-foreground mt-4">
								Early access for experienced DeFi users and portfolio managers
							</p>
						</CardContent>
					</Card>
				</motion.div>
			</div>
		</div>
	);
}