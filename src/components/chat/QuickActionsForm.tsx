"use client";

import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { Textarea } from "../ui/textarea";
import { ArrowRightLeft, Send, DollarSign, BarChart3, Zap, Search, Wallet, TrendingUp, ShoppingCart, ArrowLeftRight, ArrowDownToLine, Network } from "lucide-react";

interface QuickActionsFormProps {
	onSubmitPrompt: (prompt: string) => void;
	isLoading: boolean;
	onClearMessages?: () => void;
}

export default function QuickActionsForm({ onSubmitPrompt, isLoading, onClearMessages }: QuickActionsFormProps) {
	const [activeForm, setActiveForm] = useState<string | null>(null);
	const [formData, setFormData] = useState({
		fromChain: "",
		toChain: "",
		token: "",
		amount: "",
		toAddress: "",
		swapFromToken: "",
		swapToToken: "",
		swapAmount: "",
		balanceNetwork: "",
		balanceToken: "",
		buyToken: "",
		buyAmount: "",
		bridgeFromNetwork: "",
		bridgeToNetwork: "",
		bridgeToken: "",
		bridgeAmount: "",
		depositToken: "",
		depositAmount: "",
		depositPlatform: "",
	});

	const chains = ["Ethereum", "Polygon", "BNB Chain", "Arbitrum", "Optimism", "Avalanche", "Yellow Network"];
	const tokens = ["ETH", "USDC", "USDT", "MATIC", "BNB", "AVAX", "YELLOW"];

	const quickActions = [
		{
			id: "buy",
			title: "Buy",
			icon: ShoppingCart,
			description: "Buy tokens with fiat currency",
			color: "bg-blue-500",
		},
		{
			id: "send",
			title: "Send",
			icon: Send,
			description: "Send tokens to another wallet",
			color: "bg-green-500",
		},
		{
			id: "swap",
			title: "Swap",
			icon: Zap,
			description: "Swap one token for another",
			color: "bg-purple-500",
		},
		{
			id: "bridge",
			title: "Bridge",
			icon: ArrowLeftRight,
			description: "Bridge tokens across networks",
			color: "bg-red-500",
		},
		{
			id: "deposit",
			title: "Deposit",
			icon: ArrowDownToLine,
			description: "Deposit tokens to earn yield",
			color: "bg-teal-500",
		},
		{
			id: "balance",
			title: "Check Balance",
			icon: Wallet,
			description: "View token balance on network",
			color: "bg-yellow-500",
		},
		{
			id: "portfolio",
			title: "Portfolio Overview",
			icon: BarChart3,
			description: "View portfolio with graph",
			color: "bg-orange-500",
		},
		{
			id: "cross-chain",
			title: "Cross-Chain",
			icon: Network,
			description: "View cross-chain transaction graph",
			color: "bg-indigo-500",
		},
	];

	const handleQuickAction = (actionId: string) => {
		if (activeForm !== actionId && onClearMessages) {
			onClearMessages();
		}
		setActiveForm(activeForm === actionId ? null : actionId);
	};

	const handleFormSubmit = (actionId: string) => {
		let prompt = "";

		switch (actionId) {
			case "buy":
				prompt = `Buy ${formData.buyAmount} ${formData.buyToken} with fiat currency`;
				break;
			case "send":
				prompt = `Send ${formData.amount} ${formData.token} to ${formData.toAddress}`;
				break;
			case "swap":
				prompt = `Swap ${formData.swapAmount} ${formData.swapFromToken} for ${formData.swapToToken}`;
				break;
			case "bridge":
				prompt = `Bridge ${formData.bridgeAmount} ${formData.bridgeToken} from ${formData.bridgeFromNetwork} to ${formData.bridgeToNetwork}`;
				break;
			case "deposit":
				prompt = `Deposit ${formData.depositAmount} ${formData.depositToken} to ${formData.depositPlatform} to earn yield`;
				break;
			case "balance":
				prompt = `Show my ${formData.balanceToken} balance on ${formData.balanceNetwork} network`;
				break;
			case "portfolio":
				prompt = "Show my multi-chain portfolio overview with interactive DAG (Directed Acyclic Graph) visualization using React Flow. Display each network as a node with portfolio values, connections, and hierarchical layout like a graph node structure.";
				break;
			case "cross-chain":
				prompt = "Show cross-chain transaction DAG visualization with interactive graph nodes using React Flow. Display networks as nodes in a directed acyclic graph with transaction flow arrows and hierarchical node structure.";
				break;
		}

		onSubmitPrompt(prompt);
		setActiveForm(null);
		setFormData({
			fromChain: "",
			toChain: "",
			token: "",
			amount: "",
			toAddress: "",
			swapFromToken: "",
			swapToToken: "",
			swapAmount: "",
			balanceNetwork: "",
			balanceToken: "",
			buyToken: "",
			buyAmount: "",
			bridgeFromNetwork: "",
			bridgeToNetwork: "",
			bridgeToken: "",
			bridgeAmount: "",
			depositToken: "",
			depositAmount: "",
			depositPlatform: "",
		});
	};

	const renderForm = (actionId: string) => {
		switch (actionId) {
			case "buy":
				return (
					<div className="space-y-4">
						<div className="grid grid-cols-2 gap-4">
							<div>
								<Label htmlFor="buyToken" className="text-foreground">Token</Label>
								<Select value={formData.buyToken} onValueChange={(value) => setFormData({...formData, buyToken: value})}>
									<SelectTrigger>
										<SelectValue placeholder="Select token" />
									</SelectTrigger>
									<SelectContent>
										{tokens.map(token => (
											<SelectItem key={token} value={token}>{token}</SelectItem>
										))}
									</SelectContent>
								</Select>
							</div>
							<div>
								<Label htmlFor="buyAmount" className="text-foreground">Amount (USD)</Label>
								<Input
									id="buyAmount"
									type="number"
									placeholder="100.00"
									value={formData.buyAmount}
									onChange={(e) => setFormData({...formData, buyAmount: e.target.value})}
								/>
							</div>
						</div>
					</div>
				);

			case "bridge":
				return (
					<div className="space-y-4">
						<div className="grid grid-cols-2 gap-4">
							<div>
								<Label htmlFor="bridgeFromNetwork" className="text-foreground">From Network</Label>
								<Select value={formData.bridgeFromNetwork} onValueChange={(value) => setFormData({...formData, bridgeFromNetwork: value})}>
									<SelectTrigger>
										<SelectValue placeholder="Select network" />
									</SelectTrigger>
									<SelectContent>
										{chains.map(chain => (
											<SelectItem key={chain} value={chain}>{chain}</SelectItem>
										))}
									</SelectContent>
								</Select>
							</div>
							<div>
								<Label htmlFor="bridgeToNetwork" className="text-foreground">To Network</Label>
								<Select value={formData.bridgeToNetwork} onValueChange={(value) => setFormData({...formData, bridgeToNetwork: value})}>
									<SelectTrigger>
										<SelectValue placeholder="Select network" />
									</SelectTrigger>
									<SelectContent>
										{chains.map(chain => (
											<SelectItem key={chain} value={chain}>{chain}</SelectItem>
										))}
									</SelectContent>
								</Select>
							</div>
						</div>
						<div className="grid grid-cols-2 gap-4">
							<div>
								<Label htmlFor="bridgeToken" className="text-foreground">Token</Label>
								<Select value={formData.bridgeToken} onValueChange={(value) => setFormData({...formData, bridgeToken: value})}>
									<SelectTrigger>
										<SelectValue placeholder="Select token" />
									</SelectTrigger>
									<SelectContent>
										{tokens.map(token => (
											<SelectItem key={token} value={token}>{token}</SelectItem>
										))}
									</SelectContent>
								</Select>
							</div>
							<div>
								<Label htmlFor="bridgeAmount" className="text-foreground">Amount</Label>
								<Input
									id="bridgeAmount"
									type="number"
									placeholder="0.00"
									value={formData.bridgeAmount}
									onChange={(e) => setFormData({...formData, bridgeAmount: e.target.value})}
								/>
							</div>
						</div>
					</div>
				);

			case "deposit":
				return (
					<div className="space-y-4">
						<div className="grid grid-cols-2 gap-4">
							<div>
								<Label htmlFor="depositToken" className="text-foreground">Token</Label>
								<Select value={formData.depositToken} onValueChange={(value) => setFormData({...formData, depositToken: value})}>
									<SelectTrigger>
										<SelectValue placeholder="Select token" />
									</SelectTrigger>
									<SelectContent>
										{tokens.map(token => (
											<SelectItem key={token} value={token}>{token}</SelectItem>
										))}
									</SelectContent>
								</Select>
							</div>
							<div>
								<Label htmlFor="depositAmount" className="text-foreground">Amount</Label>
								<Input
									id="depositAmount"
									type="number"
									placeholder="0.00"
									value={formData.depositAmount}
									onChange={(e) => setFormData({...formData, depositAmount: e.target.value})}
								/>
							</div>
						</div>
						<div>
							<Label htmlFor="depositPlatform" className="text-foreground">Platform</Label>
							<Select value={formData.depositPlatform} onValueChange={(value) => setFormData({...formData, depositPlatform: value})}>
								<SelectTrigger>
									<SelectValue placeholder="Select platform" />
								</SelectTrigger>
								<SelectContent>
									<SelectItem value="Aave">Aave</SelectItem>
									<SelectItem value="Compound">Compound</SelectItem>
									<SelectItem value="Uniswap">Uniswap</SelectItem>
									<SelectItem value="Curve">Curve</SelectItem>
								</SelectContent>
							</Select>
						</div>
					</div>
				);

			case "balance":
				return (
					<div className="space-y-4">
						<div className="grid grid-cols-2 gap-4">
							<div>
								<Label htmlFor="balanceNetwork" className="text-foreground">Network</Label>
								<Select value={formData.balanceNetwork} onValueChange={(value) => setFormData({...formData, balanceNetwork: value})}>
									<SelectTrigger>
										<SelectValue placeholder="Select network" />
									</SelectTrigger>
									<SelectContent>
										{chains.map(chain => (
											<SelectItem key={chain} value={chain}>{chain}</SelectItem>
										))}
									</SelectContent>
								</Select>
							</div>
							<div>
								<Label htmlFor="balanceToken" className="text-foreground">Token</Label>
								<Select value={formData.balanceToken} onValueChange={(value) => setFormData({...formData, balanceToken: value})}>
									<SelectTrigger>
										<SelectValue placeholder="Select token" />
									</SelectTrigger>
									<SelectContent>
										{tokens.map(token => (
											<SelectItem key={token} value={token}>{token}</SelectItem>
										))}
									</SelectContent>
								</Select>
							</div>
						</div>
					</div>
				);

			case "cross-chain":
			case "portfolio":
				return (
					<div className="space-y-4">
						<p className="text-muted-foreground text-sm">
							{actionId === "portfolio"
								? "Click submit to view your portfolio with graph visualization"
								: "Click submit to view cross-chain transaction graph with nodes"
							}
						</p>
					</div>
				);

			case "send":
				return (
					<div className="space-y-4">
						<div className="grid grid-cols-2 gap-4">
							<div>
								<Label htmlFor="token" className="text-foreground">Token</Label>
								<Select value={formData.token} onValueChange={(value) => setFormData({...formData, token: value})}>
									<SelectTrigger>
										<SelectValue placeholder="Select token" />
									</SelectTrigger>
									<SelectContent>
										{tokens.map(token => (
											<SelectItem key={token} value={token}>{token}</SelectItem>
										))}
									</SelectContent>
								</Select>
							</div>
							<div>
								<Label htmlFor="amount" className="text-foreground">Amount</Label>
								<Input
									id="amount"
									type="number"
									placeholder="0.00"
									value={formData.amount}
									onChange={(e) => setFormData({...formData, amount: e.target.value})}
								/>
							</div>
						</div>
						<div>
							<Label htmlFor="toAddress" className="text-foreground">To Address</Label>
							<Input
								id="toAddress"
								placeholder="0x..."
								value={formData.toAddress}
								onChange={(e) => setFormData({...formData, toAddress: e.target.value})}
							/>
						</div>
					</div>
				);

			case "swap":
				return (
					<div className="space-y-4">
						<div className="grid grid-cols-2 gap-4">
							<div>
								<Label htmlFor="swapFromToken" className="text-foreground">From Token</Label>
								<Select value={formData.swapFromToken} onValueChange={(value) => setFormData({...formData, swapFromToken: value})}>
									<SelectTrigger>
										<SelectValue placeholder="Select token" />
									</SelectTrigger>
									<SelectContent>
										{tokens.map(token => (
											<SelectItem key={token} value={token}>{token}</SelectItem>
										))}
									</SelectContent>
								</Select>
							</div>
							<div>
								<Label htmlFor="swapToToken" className="text-foreground">To Token</Label>
								<Select value={formData.swapToToken} onValueChange={(value) => setFormData({...formData, swapToToken: value})}>
									<SelectTrigger>
										<SelectValue placeholder="Select token" />
									</SelectTrigger>
									<SelectContent>
										{tokens.map(token => (
											<SelectItem key={token} value={token}>{token}</SelectItem>
										))}
									</SelectContent>
								</Select>
							</div>
						</div>
						<div>
							<Label htmlFor="swapAmount" className="text-foreground">Amount</Label>
							<Input
								id="swapAmount"
								type="number"
								placeholder="0.00"
								value={formData.swapAmount}
								onChange={(e) => setFormData({...formData, swapAmount: e.target.value})}
							/>
						</div>
					</div>
				);

			default:
				return null;
		}
	};

	return (
		<div className="w-full space-y-6">
			{/* Quick Action Buttons */}
			<div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
				{quickActions.map((action) => {
					const Icon = action.icon;
					const isActive = activeForm === action.id;

					return (
						<Card
							key={action.id}
							className={`cursor-pointer transition-all duration-200 hover:shadow-lg border-2 ${
								isActive ? 'border-yellow-500 bg-yellow-500/10 shadow-lg' : 'border-border hover:border-yellow-300 bg-card'
							}`}
							onClick={() => handleQuickAction(action.id)}
						>
							<CardContent className="p-4">
								<div className="flex flex-col items-center text-center space-y-2">
									<div className={`p-2 rounded-lg ${action.color}`}>
										<Icon className="w-5 h-5 text-white" />
									</div>
									<div>
										<h3 className="font-medium text-sm text-foreground">{action.title}</h3>
										<p className="text-xs text-muted-foreground mt-1">{action.description}</p>
									</div>
								</div>
							</CardContent>
						</Card>
					);
				})}
			</div>

			{/* Form for Selected Action */}
			{activeForm && (
				<Card className="border-yellow-500 bg-card">
					<CardHeader className="pb-3">
						<CardTitle className="text-lg flex items-center gap-2 text-foreground">
							{React.createElement(quickActions.find(a => a.id === activeForm)?.icon || Search, { className: "w-5 h-5 text-yellow-500" })}
							{quickActions.find(a => a.id === activeForm)?.title}
						</CardTitle>
					</CardHeader>
					<CardContent className="space-y-4">
						{renderForm(activeForm)}
						<div className="flex gap-2 pt-2">
							<Button
								onClick={() => handleFormSubmit(activeForm)}
								disabled={isLoading}
								className="bg-yellow-500 hover:bg-yellow-600 text-black flex-1"
							>
								{isLoading ? "Processing..." : "Submit"}
							</Button>
							<Button
								variant="outline"
								onClick={() => setActiveForm(null)}
								disabled={isLoading}
							>
								Cancel
							</Button>
						</div>
					</CardContent>
				</Card>
			)}

			{/* Quick Copy Examples */}
			<div className="grid grid-cols-1 gap-2">
				<p className="text-sm text-muted-foreground mb-2">Or try these examples:</p>
				{[
					"Send 0.2 YELLOW to 0x578dC842Bb55bb8b73472d69Fa2097ed1C19c46a",
					"How much YELLOW do I have remaining?",
					"What is the value of 10 YELLOW in USD?",
				].map((text, index) => (
					<Card
						key={index}
						className="cursor-pointer hover:bg-accent/50 transition-colors"
						onClick={() => onSubmitPrompt(text)}
					>
						<CardContent className="px-3 py-2">
							<p className="text-sm text-foreground">{text}</p>
						</CardContent>
					</Card>
				))}
			</div>
		</div>
	);
}