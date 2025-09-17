"use client";

import { useState } from "react";
import { ArrowLeft, Route, Zap, Shield, Clock, DollarSign, Layers, ArrowRight, Play } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import Link from "next/link";
import { motion } from "framer-motion";

const chains = [
	{ name: "Ethereum", symbol: "ETH", color: "bg-blue-500" },
	{ name: "Polygon", symbol: "MATIC", color: "bg-purple-500" },
	{ name: "Arbitrum", symbol: "ARB", color: "bg-orange-500" },
	{ name: "Optimism", symbol: "OP", color: "bg-red-500" },
	{ name: "Base", symbol: "BASE", color: "bg-blue-600" },
	{ name: "BNB Chain", symbol: "BNB", color: "bg-yellow-500" }
];

const routeExamples = [
	{
		from: "Ethereum",
		to: "Polygon",
		token: "USDC",
		amount: "1,000",
		time: "2-5 min",
		cost: "$8.50",
		safety: "A+",
		bridges: ["Polygon Bridge", "LayerZero"],
		steps: 3
	},
	{
		from: "Arbitrum",
		to: "Base",
		token: "ETH",
		amount: "0.5",
		time: "1-3 min",
		cost: "$12.30",
		safety: "A",
		bridges: ["Stargate", "Across"],
		steps: 2
	},
	{
		from: "BNB Chain",
		to: "Optimism",
		token: "USDT",
		amount: "500",
		time: "3-7 min",
		cost: "$6.75",
		safety: "A-",
		bridges: ["Multichain", "Celer"],
		steps: 4
	}
];

const features = [
	{
		icon: Route,
		title: "Multi-Path Analysis",
		description: "Analyze multiple routing paths simultaneously to find the optimal solution for your cross-chain transaction."
	},
	{
		icon: Zap,
		title: "Real-time Optimization",
		description: "Dynamic route optimization based on current network conditions, fees, and liquidity availability."
	},
	{
		icon: Shield,
		title: "Security Assessment",
		description: "Comprehensive security scoring for each route based on bridge history, audit status, and TVL."
	},
	{
		icon: Clock,
		title: "Time Prediction",
		description: "Accurate time estimates for transaction completion with confidence intervals."
	}
];

export default function RoutingVisualizationPage() {
	const [fromChain, setFromChain] = useState("");
	const [toChain, setToChain] = useState("");
	const [amount, setAmount] = useState("");

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
								<div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-lg flex items-center justify-center">
									<Route className="w-5 h-5 text-white" />
								</div>
								<div>
									<h1 className="font-semibold text-lg">Cross-Chain Routing</h1>
									<p className="text-sm text-muted-foreground">Visualize optimal paths</p>
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
					<h2 className="text-4xl font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent mb-4">
						Intelligent Cross-Chain Route Visualization
					</h2>
					<p className="text-xl text-muted-foreground max-w-3xl mx-auto">
						See exactly how your assets will move across chains with detailed path analysis,
						security ratings, and cost optimization. Make informed decisions with complete transparency.
					</p>
				</motion.div>

				{/* Interactive Demo */}
				<motion.div
					initial={{ opacity: 0, y: 30 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ delay: 0.2 }}
					className="mb-16"
				>
					<Card className="max-w-4xl mx-auto">
						<CardHeader>
							<CardTitle className="flex items-center gap-2">
								<Play className="w-5 h-5 text-blue-500" />
								Try Route Visualization
							</CardTitle>
							<CardDescription>
								Select chains and amount to see how our routing visualization will work
							</CardDescription>
						</CardHeader>
						<CardContent>
							<div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
								<div>
									<label className="text-sm font-medium mb-2 block">From Chain</label>
									<Select value={fromChain} onValueChange={setFromChain}>
										<SelectTrigger>
											<SelectValue placeholder="Select chain" />
										</SelectTrigger>
										<SelectContent>
											{chains.map((chain) => (
												<SelectItem key={chain.name} value={chain.name}>
													<div className="flex items-center gap-2">
														<div className={`w-3 h-3 rounded-full ${chain.color}`} />
														{chain.name}
													</div>
												</SelectItem>
											))}
										</SelectContent>
									</Select>
								</div>
								<div>
									<label className="text-sm font-medium mb-2 block">To Chain</label>
									<Select value={toChain} onValueChange={setToChain}>
										<SelectTrigger>
											<SelectValue placeholder="Select chain" />
										</SelectTrigger>
										<SelectContent>
											{chains.map((chain) => (
												<SelectItem key={chain.name} value={chain.name}>
													<div className="flex items-center gap-2">
														<div className={`w-3 h-3 rounded-full ${chain.color}`} />
														{chain.name}
													</div>
												</SelectItem>
											))}
										</SelectContent>
									</Select>
								</div>
								<div>
									<label className="text-sm font-medium mb-2 block">Amount</label>
									<Input
										placeholder="1000"
										value={amount}
										onChange={(e) => setAmount(e.target.value)}
									/>
								</div>
								<div className="flex items-end">
									<Button className="w-full" disabled>
										Visualize Route
									</Button>
								</div>
							</div>

							{fromChain && toChain && amount && (
								<motion.div
									initial={{ opacity: 0, height: 0 }}
									animate={{ opacity: 1, height: "auto" }}
									className="border border-border/50 rounded-lg p-6 bg-accent/20"
								>
									<h4 className="font-semibold mb-4">Preview: Route Visualization</h4>
									<div className="flex items-center justify-between text-sm">
										<div className="flex items-center gap-2">
											<div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white text-xs font-bold">
												{fromChain.charAt(0)}
											</div>
											<span>{fromChain}</span>
										</div>
										<div className="flex-1 mx-4">
											<div className="border-t-2 border-dashed border-blue-500 relative">
												<ArrowRight className="w-4 h-4 text-blue-500 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-background" />
											</div>
										</div>
										<div className="flex items-center gap-2">
											<div className="w-8 h-8 bg-cyan-500 rounded-full flex items-center justify-center text-white text-xs font-bold">
												{toChain.charAt(0)}
											</div>
											<span>{toChain}</span>
										</div>
									</div>
									<p className="text-xs text-muted-foreground mt-4 text-center">
										Full visualization with security ratings, fees, and timing will be available soon
									</p>
								</motion.div>
							)}
						</CardContent>
					</Card>
				</motion.div>

				{/* Example Routes */}
				<motion.div
					initial={{ opacity: 0, y: 30 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ delay: 0.3 }}
					className="mb-16"
				>
					<h3 className="text-2xl font-bold text-center mb-8">Example Route Analysis</h3>
					<div className="grid grid-cols-1 md:grid-cols-3 gap-6">
						{routeExamples.map((route, index) => (
							<Card key={index} className="relative overflow-hidden">
								<CardHeader>
									<div className="flex items-center justify-between">
										<CardTitle className="text-lg">{route.from} → {route.to}</CardTitle>
										<Badge className={`
											${route.safety === 'A+' ? 'bg-green-500' :
											  route.safety === 'A' ? 'bg-blue-500' : 'bg-yellow-500'}
										`}>
											{route.safety}
										</Badge>
									</div>
									<CardDescription>
										{route.amount} {route.token}
									</CardDescription>
								</CardHeader>
								<CardContent className="space-y-4">
									<div className="grid grid-cols-2 gap-4 text-sm">
										<div className="flex items-center gap-2">
											<Clock className="w-4 h-4 text-muted-foreground" />
											<span>{route.time}</span>
										</div>
										<div className="flex items-center gap-2">
											<DollarSign className="w-4 h-4 text-muted-foreground" />
											<span>{route.cost}</span>
										</div>
										<div className="flex items-center gap-2">
											<Layers className="w-4 h-4 text-muted-foreground" />
											<span>{route.steps} steps</span>
										</div>
										<div className="flex items-center gap-2">
											<Shield className="w-4 h-4 text-muted-foreground" />
											<span>Audited</span>
										</div>
									</div>
									<div>
										<p className="text-xs text-muted-foreground mb-2">Bridges Used:</p>
										<div className="flex gap-1">
											{route.bridges.map((bridge, i) => (
												<Badge key={i} variant="outline" className="text-xs">
													{bridge}
												</Badge>
											))}
										</div>
									</div>
								</CardContent>
							</Card>
						))}
					</div>
				</motion.div>

				{/* Features */}
				<motion.div
					initial={{ opacity: 0, y: 30 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ delay: 0.4 }}
					className="mb-16"
				>
					<h3 className="text-2xl font-bold text-center mb-8">Visualization Features</h3>
					<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
						{features.map((feature, index) => {
							const IconComponent = feature.icon;
							return (
								<Card key={index} className="text-center">
									<CardHeader>
										<div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-lg flex items-center justify-center mx-auto mb-4">
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
							<CardTitle>Get Notified When Available</CardTitle>
							<CardDescription>
								Be the first to experience intelligent cross-chain route visualization
							</CardDescription>
						</CardHeader>
						<CardContent>
							<div className="flex gap-2 max-w-md mx-auto">
								<Input placeholder="Enter your email" type="email" />
								<Button disabled>Notify Me</Button>
							</div>
							<p className="text-xs text-muted-foreground mt-4">
								We'll send you an update when this feature launches
							</p>
						</CardContent>
					</Card>
				</motion.div>
			</div>
		</div>
	);
}