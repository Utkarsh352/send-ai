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