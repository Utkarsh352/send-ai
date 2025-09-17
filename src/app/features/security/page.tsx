"use client";

import { useState } from "react";
import { ArrowLeft, Shield, AlertTriangle, CheckCircle, XCircle, Star, Lock, Eye, TrendingUp, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Link from "next/link";
import { motion } from "framer-motion";

const securityMetrics = [
	{ label: "Audit Status", weight: 30 },
	{ label: "TVL Stability", weight: 25 },
	{ label: "Bridge History", weight: 20 },
	{ label: "Insurance Coverage", weight: 15 },
	{ label: "Decentralization", weight: 10 }
];

const bridgeRatings = [
	{
		name: "Polygon Bridge",
		rating: "A+",
		score: 95,
		tvl: "$2.1B",
		audits: 4,
		incidents: 0,
		insuranceCoverage: true,
		chains: ["Ethereum", "Polygon"],
		riskLevel: "Very Low",
		color: "bg-green-500"
	},
	{
		name: "Arbitrum Bridge",
		rating: "A+",
		score: 93,
		tvl: "$3.8B",
		audits: 5,
		incidents: 0,
		insuranceCoverage: true,
		chains: ["Ethereum", "Arbitrum"],
		riskLevel: "Very Low",
		color: "bg-green-500"
	},
	{
		name: "Stargate Finance",
		rating: "A",
		score: 88,
		tvl: "$850M",
		audits: 3,
		incidents: 0,
		insuranceCoverage: true,
		chains: ["Multiple"],
		riskLevel: "Low",
		color: "bg-blue-500"
	},
	{
		name: "Multichain",
		rating: "B+",
		score: 75,
		tvl: "$1.2B",
		audits: 2,
		incidents: 1,
		insuranceCoverage: false,
		chains: ["Multiple"],
		riskLevel: "Medium",
		color: "bg-yellow-500"
	},
	{
		name: "Anyswap",
		rating: "B",
		score: 68,
		tvl: "$450M",
		audits: 1,
		incidents: 2,
		insuranceCoverage: false,
		chains: ["Multiple"],
		riskLevel: "Medium-High",
		color: "bg-orange-500"
	}
];

const chainRatings = [
	{
		name: "Ethereum",
		rating: "A+",
		score: 98,
		decentralization: 95,
		security: 99,
		liquidity: 98,
		validators: "400K+",
		uptime: "99.99%",
		color: "bg-blue-500"
	},
	{
		name: "Polygon",
		rating: "A",
		score: 89,
		decentralization: 85,
		security: 90,
		liquidity: 92,
		validators: "100+",
		uptime: "99.95%",
		color: "bg-purple-500"
	},
	{
		name: "Arbitrum",
		rating: "A",
		score: 87,
		decentralization: 80,
		security: 92,
		liquidity: 90,
		validators: "N/A",
		uptime: "99.9%",
		color: "bg-orange-500"
	},
	{
		name: "BNB Chain",
		rating: "B+",
		score: 78,
		decentralization: 70,
		security: 85,
		liquidity: 80,
		validators: "21",
		uptime: "99.8%",
		color: "bg-yellow-500"
	}
];

const securityFeatures = [
	{
		icon: Shield,
		title: "Real-time Risk Assessment",
		description: "Continuous monitoring of bridge and chain security parameters with instant risk updates."
	},
	{
		icon: Eye,
		title: "Transparency Reports",
		description: "Detailed security audits, incident history, and risk factors for informed decision making."
	},
	{
		icon: Lock,
		title: "Insurance Integration",
		description: "Track insurance coverage and protection levels for each bridge and protocol."
	},
	{
		icon: TrendingUp,
		title: "Historical Analysis",
		description: "Long-term security trends and performance metrics to predict future reliability."
	}
];

export default function SecurityRatingsPage() {
	const [searchTerm, setSearchTerm] = useState("");

	const filteredBridges = bridgeRatings.filter(bridge =>
		bridge.name.toLowerCase().includes(searchTerm.toLowerCase())
	);

	const getRatingColor = (rating: string) => {
		switch (rating) {
			case "A+": return "text-green-500 bg-green-500/10";
			case "A": return "text-blue-500 bg-blue-500/10";
			case "B+": return "text-yellow-500 bg-yellow-500/10";
			case "B": return "text-orange-500 bg-orange-500/10";
			default: return "text-red-500 bg-red-500/10";
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
								<div className="w-10 h-10 bg-gradient-to-br from-green-500 to-emerald-500 rounded-lg flex items-center justify-center">
									<Shield className="w-5 h-5 text-white" />
								</div>
								<div>
									<h1 className="font-semibold text-lg">Security Ratings</h1>
									<p className="text-sm text-muted-foreground">Bridge & chain safety</p>
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
					<h2 className="text-4xl font-bold bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text text-transparent mb-4">
						Comprehensive Security Intelligence
					</h2>
					<p className="text-xl text-muted-foreground max-w-3xl mx-auto">
						Make informed decisions with real-time security ratings for chains and bridges.
						Our AI-powered analysis evaluates audit status, TVL stability, incident history, and more.
					</p>
				</motion.div>

				{/* Security Metrics Overview */}
				<motion.div
					initial={{ opacity: 0, y: 30 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ delay: 0.1 }}
					className="mb-16"
				>
					<Card>
						<CardHeader>
							<CardTitle>Security Rating Methodology</CardTitle>
							<CardDescription>
								Our security scores are calculated using weighted factors that matter most for cross-chain safety
							</CardDescription>
						</CardHeader>
						<CardContent>
							<div className="space-y-4">
								{securityMetrics.map((metric, index) => (
									<div key={index} className="flex items-center justify-between">
										<span className="text-sm font-medium">{metric.label}</span>
										<div className="flex items-center gap-4 flex-1 max-w-md">
											<Progress value={metric.weight * 3} className="flex-1" />
											<span className="text-sm text-muted-foreground w-12">{metric.weight}%</span>
										</div>
									</div>
								))}
							</div>
						</CardContent>
					</Card>
				</motion.div>

				{/* Ratings Tabs */}
				<motion.div
					initial={{ opacity: 0, y: 30 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ delay: 0.2 }}
					className="mb-16"
				>
					<Tabs defaultValue="bridges" className="w-full">
						<TabsList className="grid w-full grid-cols-2 max-w-md mx-auto">
							<TabsTrigger value="bridges">Bridge Ratings</TabsTrigger>
							<TabsTrigger value="chains">Chain Ratings</TabsTrigger>
						</TabsList>

						<TabsContent value="bridges" className="space-y-6">
							<div className="flex items-center gap-4 mb-6">
								<Input
									placeholder="Search bridges..."
									value={searchTerm}
									onChange={(e) => setSearchTerm(e.target.value)}
									className="max-w-md"
								/>
							</div>

							<div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
								{filteredBridges.map((bridge, index) => (
									<Card key={index} className="relative overflow-hidden">
										<CardHeader>
											<div className="flex items-center justify-between">
												<CardTitle className="text-lg">{bridge.name}</CardTitle>
												<Badge className={getRatingColor(bridge.rating)}>
													{bridge.rating}
												</Badge>
											</div>
											<div className="flex items-center gap-4">
												<div className="flex items-center gap-2">
													<div className={`w-3 h-3 rounded-full ${bridge.color}`} />
													<span className="text-sm text-muted-foreground">Score: {bridge.score}/100</span>
												</div>
											</div>
										</CardHeader>
										<CardContent className="space-y-4">
											<div className="grid grid-cols-2 gap-4 text-sm">
												<div>
													<p className="text-muted-foreground">TVL</p>
													<p className="font-semibold">{bridge.tvl}</p>
												</div>
												<div>
													<p className="text-muted-foreground">Risk Level</p>
													<p className="font-semibold">{bridge.riskLevel}</p>
												</div>
												<div>
													<p className="text-muted-foreground">Audits</p>
													<div className="flex items-center gap-1">
														{Array.from({ length: bridge.audits }).map((_, i) => (
															<CheckCircle key={i} className="w-3 h-3 text-green-500" />
														))}
														<span className="ml-1">{bridge.audits}</span>
													</div>
												</div>
												<div>
													<p className="text-muted-foreground">Incidents</p>
													<div className="flex items-center gap-1">
														{bridge.incidents === 0 ? (
															<CheckCircle className="w-3 h-3 text-green-500" />
														) : (
															<AlertTriangle className="w-3 h-3 text-yellow-500" />
														)}
														<span>{bridge.incidents}</span>
													</div>
												</div>
											</div>
											<div className="flex items-center justify-between pt-2 border-t">
												<div className="flex items-center gap-2">
													{bridge.insuranceCoverage ? (
														<>
															<Lock className="w-4 h-4 text-green-500" />
															<span className="text-sm text-green-500">Insured</span>
														</>
													) : (
														<>
															<AlertCircle className="w-4 h-4 text-yellow-500" />
															<span className="text-sm text-yellow-500">No Insurance</span>
														</>
													)}
												</div>
												<Badge variant="outline" className="text-xs">
													{bridge.chains.join(" • ")}
												</Badge>
											</div>
										</CardContent>
									</Card>
								))}
							</div>
						</TabsContent>

						<TabsContent value="chains" className="space-y-6">
							<div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
								{chainRatings.map((chain, index) => (
									<Card key={index} className="relative overflow-hidden">
										<CardHeader>
											<div className="flex items-center justify-between">
												<CardTitle className="text-lg">{chain.name}</CardTitle>
												<Badge className={getRatingColor(chain.rating)}>
													{chain.rating}
												</Badge>
											</div>
											<div className="flex items-center gap-2">
												<div className={`w-3 h-3 rounded-full ${chain.color}`} />
												<span className="text-sm text-muted-foreground">Overall Score: {chain.score}/100</span>
											</div>
										</CardHeader>
										<CardContent className="space-y-4">
											<div className="space-y-3">
												<div>
													<div className="flex justify-between text-sm mb-1">
														<span>Decentralization</span>
														<span>{chain.decentralization}%</span>
													</div>
													<Progress value={chain.decentralization} />
												</div>
												<div>
													<div className="flex justify-between text-sm mb-1">
														<span>Security</span>
														<span>{chain.security}%</span>
													</div>
													<Progress value={chain.security} />
												</div>
												<div>
													<div className="flex justify-between text-sm mb-1">
														<span>Liquidity</span>
														<span>{chain.liquidity}%</span>
													</div>
													<Progress value={chain.liquidity} />
												</div>
											</div>
											<div className="grid grid-cols-2 gap-4 text-sm pt-2 border-t">
												<div>
													<p className="text-muted-foreground">Validators</p>
													<p className="font-semibold">{chain.validators}</p>
												</div>
												<div>
													<p className="text-muted-foreground">Uptime</p>
													<p className="font-semibold">{chain.uptime}</p>
												</div>
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
					transition={{ delay: 0.3 }}
					className="mb-16"
				>
					<h3 className="text-2xl font-bold text-center mb-8">Security Features</h3>
					<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
						{securityFeatures.map((feature, index) => {
							const IconComponent = feature.icon;
							return (
								<Card key={index} className="text-center">
									<CardHeader>
										<div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-500 rounded-lg flex items-center justify-center mx-auto mb-4">
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
					transition={{ delay: 0.4 }}
					className="text-center"
				>
					<Card className="max-w-2xl mx-auto">
						<CardHeader>
							<CardTitle>Stay Secure with Real-Time Ratings</CardTitle>
							<CardDescription>
								Get notified about security updates and new bridge ratings
							</CardDescription>
						</CardHeader>
						<CardContent>
							<div className="flex gap-2 max-w-md mx-auto">
								<Input placeholder="Enter your email" type="email" />
								<Button disabled>Get Updates</Button>
							</div>
							<p className="text-xs text-muted-foreground mt-4">
								We'll alert you to security changes and new features
							</p>
						</CardContent>
					</Card>
				</motion.div>
			</div>
		</div>
	);
}