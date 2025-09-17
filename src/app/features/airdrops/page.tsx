"use client";

import { useState } from "react";
import { ArrowLeft, Coins, Users, Target, Send, Calendar, BarChart3, Filter, Plus, CheckCircle, Clock, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";
import Link from "next/link";
import { motion } from "framer-motion";

const airdropFeatures = [
	{
		icon: Target,
		title: "Smart Targeting",
		description: "Use AI-powered criteria to identify and target the most valuable recipients across multiple chains."
	},
	{
		icon: Send,
		title: "Multi-Chain Distribution",
		description: "Distribute tokens across any supported blockchain with optimized gas fees and routing."
	},
	{
		icon: BarChart3,
		title: "Real-time Analytics",
		description: "Track distribution progress, claim rates, and recipient engagement with detailed analytics."
	},
	{
		icon: Users,
		title: "Community Building",
		description: "Build and engage communities through strategic token distribution and reward programs."
	}
];

const activeAirdrops = [
	{
		name: "Token Launch Campaign",
		token: "LAUNCH",
		chain: "Ethereum",
		totalAmount: "1,000,000",
		recipients: 5000,
		claimed: 3200,
		startDate: "Dec 15, 2023",
		endDate: "Jan 31, 2024",
		status: "Active",
		claimRate: 64
	},
	{
		name: "Community Rewards",
		token: "REWARD",
		chain: "Polygon",
		totalAmount: "500,000",
		recipients: 2500,
		claimed: 2100,
		startDate: "Jan 1, 2024",
		endDate: "Feb 29, 2024",
		status: "Active",
		claimRate: 84
	},
	{
		name: "Early Adopter Bonus",
		token: "EARLY",
		chain: "Arbitrum",
		totalAmount: "250,000",
		recipients: 1000,
		claimed: 950,
		startDate: "Nov 1, 2023",
		endDate: "Dec 31, 2023",
		status: "Completed",
		claimRate: 95
	}
];

const recipientCategories = [
	{
		name: "NFT Holders",
		description: "Users holding specific NFT collections",
		count: "15,420",
		chains: ["Ethereum", "Polygon"]
	},
	{
		name: "DeFi Power Users",
		description: "Active users of DeFi protocols",
		count: "8,750",
		chains: ["Ethereum", "Arbitrum", "Optimism"]
	},
	{
		name: "Early Supporters",
		description: "Community members and early adopters",
		count: "12,300",
		chains: ["Multiple"]
	},
	{
		name: "Governance Participants",
		description: "Active DAO and governance voters",
		count: "5,680",
		chains: ["Ethereum", "Polygon"]
	}
];

const distributionMethods = [
	{
		name: "Merkle Tree Distribution",
		description: "Gas-efficient distribution using merkle proofs",
		gasEfficiency: "Very High",
		complexity: "Medium"
	},
	{
		name: "Direct Transfer",
		description: "Direct token transfers to recipient wallets",
		gasEfficiency: "Low",
		complexity: "Low"
	},
	{
		name: "Claim Portal",
		description: "Recipients claim tokens through custom interface",
		gasEfficiency: "High",
		complexity: "High"
	}
];

export default function AirdropsPage() {
	const [selectedFilter, setSelectedFilter] = useState("all");

	const getStatusColor = (status: string) => {
		switch (status) {
			case "Active": return "bg-green-500";
			case "Completed": return "bg-blue-500";
			case "Pending": return "bg-yellow-500";
			default: return "bg-gray-500";
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
								<div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-red-500 rounded-lg flex items-center justify-center">
									<Coins className="w-5 h-5 text-white" />
								</div>
								<div>
									<h1 className="font-semibold text-lg">Airdrops Management</h1>
									<p className="text-sm text-muted-foreground">Create & distribute tokens</p>
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
					<h2 className="text-4xl font-bold bg-gradient-to-r from-orange-400 to-red-400 bg-clip-text text-transparent mb-4">
						Advanced Airdrop Management Platform
					</h2>
					<p className="text-xl text-muted-foreground max-w-3xl mx-auto">
						Create, manage, and analyze token airdrops across multiple blockchains.
						Target the right audiences, optimize distribution costs, and track engagement in real-time.
					</p>
				</motion.div>

				{/* Dashboard Stats */}
				<motion.div
					initial={{ opacity: 0, y: 30 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ delay: 0.1 }}
					className="mb-16"
				>
					<div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
						<Card>
							<CardHeader className="pb-3">
								<CardTitle className="text-lg flex items-center gap-2">
									<Coins className="w-5 h-5 text-orange-500" />
									Active Campaigns
								</CardTitle>
							</CardHeader>
							<CardContent>
								<p className="text-3xl font-bold">12</p>
								<p className="text-sm text-muted-foreground">Across 6 chains</p>
							</CardContent>
						</Card>
						<Card>
							<CardHeader className="pb-3">
								<CardTitle className="text-lg flex items-center gap-2">
									<Users className="w-5 h-5 text-blue-500" />
									Total Recipients
								</CardTitle>
							</CardHeader>
							<CardContent>
								<p className="text-3xl font-bold">125K</p>
								<p className="text-sm text-muted-foreground">+15% this month</p>
							</CardContent>
						</Card>
						<Card>
							<CardHeader className="pb-3">
								<CardTitle className="text-lg flex items-center gap-2">
									<Send className="w-5 h-5 text-green-500" />
									Tokens Distributed
								</CardTitle>
							</CardHeader>
							<CardContent>
								<p className="text-3xl font-bold">2.5M</p>
								<p className="text-sm text-muted-foreground">$487K value</p>
							</CardContent>
						</Card>
						<Card>
							<CardHeader className="pb-3">
								<CardTitle className="text-lg flex items-center gap-2">
									<BarChart3 className="w-5 h-5 text-purple-500" />
									Avg Claim Rate
								</CardTitle>
							</CardHeader>
							<CardContent>
								<p className="text-3xl font-bold">78%</p>
								<p className="text-sm text-muted-foreground">Above industry avg</p>
							</CardContent>
						</Card>
					</div>
				</motion.div>

				{/* Airdrops Management */}
				<motion.div
					initial={{ opacity: 0, y: 30 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ delay: 0.2 }}
					className="mb-16"
				>
					<Tabs defaultValue="campaigns" className="w-full">
						<TabsList className="grid w-full grid-cols-3 max-w-lg mx-auto">
							<TabsTrigger value="campaigns">Campaigns</TabsTrigger>
							<TabsTrigger value="targeting">Targeting</TabsTrigger>
							<TabsTrigger value="distribution">Distribution</TabsTrigger>
						</TabsList>

						<TabsContent value="campaigns" className="space-y-6">
							<div className="flex items-center justify-between">
								<h3 className="text-2xl font-bold">Airdrop Campaigns</h3>
								<div className="flex items-center gap-4">
									<Select value={selectedFilter} onValueChange={setSelectedFilter}>
										<SelectTrigger className="w-32">
											<SelectValue />
										</SelectTrigger>
										<SelectContent>
											<SelectItem value="all">All Status</SelectItem>
											<SelectItem value="active">Active</SelectItem>
											<SelectItem value="completed">Completed</SelectItem>
											<SelectItem value="pending">Pending</SelectItem>
										</SelectContent>
									</Select>
									<Button disabled>
										<Plus className="w-4 h-4 mr-2" />
										New Campaign
									</Button>
								</div>
							</div>

							<div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
								{activeAirdrops.map((airdrop, index) => (
									<Card key={index} className="relative overflow-hidden">
										<CardHeader>
											<div className="flex items-center justify-between">
												<CardTitle className="text-lg">{airdrop.name}</CardTitle>
												<Badge className={getStatusColor(airdrop.status)}>
													{airdrop.status}
												</Badge>
											</div>
											<CardDescription>
												{airdrop.totalAmount} {airdrop.token} • {airdrop.chain}
											</CardDescription>
										</CardHeader>
										<CardContent className="space-y-4">
											<div className="space-y-2">
												<div className="flex justify-between text-sm">
													<span>Claim Progress</span>
													<span>{airdrop.claimed.toLocaleString()} / {airdrop.recipients.toLocaleString()}</span>
												</div>
												<Progress value={airdrop.claimRate} />
												<p className="text-xs text-muted-foreground">
													{airdrop.claimRate}% claim rate
												</p>
											</div>
											<div className="grid grid-cols-2 gap-3 text-sm">
												<div>
													<p className="text-muted-foreground">Start Date</p>
													<p className="font-semibold">{airdrop.startDate}</p>
												</div>
												<div>
													<p className="text-muted-foreground">End Date</p>
													<p className="font-semibold">{airdrop.endDate}</p>
												</div>
											</div>
											<div className="flex gap-2">
												<Button variant="outline" size="sm" className="flex-1" disabled>
													View Details
												</Button>
												<Button variant="outline" size="sm" className="flex-1" disabled>
													Analytics
												</Button>
											</div>
										</CardContent>
									</Card>
								))}
							</div>
						</TabsContent>

						<TabsContent value="targeting" className="space-y-6">
							<div className="flex items-center justify-between">
								<h3 className="text-2xl font-bold">Recipient Targeting</h3>
								<Button disabled>
									<Plus className="w-4 h-4 mr-2" />
									Create Target Group
								</Button>
							</div>

							<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
								{recipientCategories.map((category, index) => (
									<Card key={index}>
										<CardHeader>
											<CardTitle className="text-lg">{category.name}</CardTitle>
											<CardDescription>{category.description}</CardDescription>
										</CardHeader>
										<CardContent className="space-y-4">
											<div className="flex items-center justify-between">
												<span className="text-sm text-muted-foreground">Eligible Recipients</span>
												<span className="text-2xl font-bold">{category.count}</span>
											</div>
											<div>
												<p className="text-sm text-muted-foreground mb-2">Supported Chains</p>
												<div className="flex gap-1 flex-wrap">
													{category.chains.map((chain, i) => (
														<Badge key={i} variant="outline" className="text-xs">
															{chain}
														</Badge>
													))}
												</div>
											</div>
											<Button variant="outline" size="sm" className="w-full" disabled>
												Select for Campaign
											</Button>
										</CardContent>
									</Card>
								))}
							</div>
						</TabsContent>

						<TabsContent value="distribution" className="space-y-6">
							<div className="flex items-center justify-between">
								<h3 className="text-2xl font-bold">Distribution Methods</h3>
							</div>

							<div className="grid grid-cols-1 md:grid-cols-3 gap-6">
								{distributionMethods.map((method, index) => (
									<Card key={index} className="relative">
										<CardHeader>
											<CardTitle className="text-lg">{method.name}</CardTitle>
											<CardDescription>{method.description}</CardDescription>
										</CardHeader>
										<CardContent className="space-y-4">
											<div className="space-y-2">
												<div className="flex justify-between">
													<span className="text-sm">Gas Efficiency</span>
													<Badge variant={
														method.gasEfficiency === 'Very High' ? 'default' :
														method.gasEfficiency === 'High' ? 'secondary' : 'outline'
													}>
														{method.gasEfficiency}
													</Badge>
												</div>
												<div className="flex justify-between">
													<span className="text-sm">Complexity</span>
													<Badge variant="outline">{method.complexity}</Badge>
												</div>
											</div>
											<Button variant="outline" size="sm" className="w-full" disabled>
												Select Method
											</Button>
										</CardContent>
									</Card>
								))}
							</div>

							<Card>
								<CardHeader>
									<CardTitle>Distribution Timeline</CardTitle>
									<CardDescription>
										Recommended timeline for efficient airdrop execution
									</CardDescription>
								</CardHeader>
								<CardContent>
									<div className="space-y-4">
										<div className="flex items-center gap-4">
											<div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white text-sm font-bold">1</div>
											<div className="flex-1">
												<p className="font-semibold">Target Selection (2-3 days)</p>
												<p className="text-sm text-muted-foreground">Define criteria and compile recipient lists</p>
											</div>
										</div>
										<div className="flex items-center gap-4">
											<div className="w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center text-white text-sm font-bold">2</div>
											<div className="flex-1">
												<p className="font-semibold">Campaign Setup (1-2 days)</p>
												<p className="text-sm text-muted-foreground">Configure distribution parameters and smart contracts</p>
											</div>
										</div>
										<div className="flex items-center gap-4">
											<div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center text-white text-sm font-bold">3</div>
											<div className="flex-1">
												<p className="font-semibold">Distribution Launch (1 day)</p>
												<p className="text-sm text-muted-foreground">Execute distribution across selected chains</p>
											</div>
										</div>
										<div className="flex items-center gap-4">
											<div className="w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center text-white text-sm font-bold">4</div>
											<div className="flex-1">
												<p className="font-semibold">Monitoring & Analytics (Ongoing)</p>
												<p className="text-sm text-muted-foreground">Track claims and engagement metrics</p>
											</div>
										</div>
									</div>
								</CardContent>
							</Card>
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
					<h3 className="text-2xl font-bold text-center mb-8">Airdrop Features</h3>
					<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
						{airdropFeatures.map((feature, index) => {
							const IconComponent = feature.icon;
							return (
								<Card key={index} className="text-center">
									<CardHeader>
										<div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-red-500 rounded-lg flex items-center justify-center mx-auto mb-4">
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
							<CardTitle>Launch Your Next Airdrop Campaign</CardTitle>
							<CardDescription>
								Get early access to the most advanced airdrop management platform
							</CardDescription>
						</CardHeader>
						<CardContent>
							<div className="flex gap-2 max-w-md mx-auto">
								<Input placeholder="Project email" type="email" />
								<Button disabled>Early Access</Button>
							</div>
							<p className="text-xs text-muted-foreground mt-4">
								Priority access for projects planning token distributions
							</p>
						</CardContent>
					</Card>
				</motion.div>
			</div>
		</div>
	);
}