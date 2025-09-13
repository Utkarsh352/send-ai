"use client";

import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { Textarea } from "../ui/textarea";
import { ArrowRightLeft, Send, DollarSign, BarChart3, Zap, Search, Wallet, TrendingUp } from "lucide-react";

interface QuickActionsFormProps {
	onSubmitPrompt: (prompt: string) => void;
	isLoading: boolean;
}

export default function QuickActionsForm({ onSubmitPrompt, isLoading }: QuickActionsFormProps) {
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
	});

	const chains = ["Ethereum", "Polygon", "BNB Chain", "Arbitrum", "Optimism", "Avalanche", "Yellow Network"];
	const tokens = ["ETH", "USDC", "USDT", "MATIC", "BNB", "AVAX", "YELLOW"];

	const quickActions = [
		{
			id: "cross-chain",
			title: "Cross-Chain Transfer",
			icon: ArrowRightLeft,
			description: "Send tokens between different blockchains",
			color: "bg-blue-500",
		},
		{
			id: "send",
			title: "Send Tokens",
			icon: Send,
			description: "Send tokens to another wallet address",
			color: "bg-green-500",
		},
		{
			id: "swap",
			title: "Token Swap",
			icon: Zap,
			description: "Swap one token for another",
			color: "bg-purple-500",
		},
		{
			id: "balance",
			title: "Check Balance",
			icon: Wallet,
			description: "View your token balances across chains",
			color: "bg-yellow-500",
		},
		{
			id: "portfolio",
			title: "Portfolio Overview",
			icon: BarChart3,
			description: "View your multi-chain portfolio",
			color: "bg-orange-500",
		},
		{
			id: "rates",
			title: "Exchange Rates",
			icon: TrendingUp,
			description: "Check current token exchange rates",
			color: "bg-indigo-500",
		},
	];

	const handleQuickAction = (actionId: string) => {
		setActiveForm(activeForm === actionId ? null : actionId);
	};

	const handleFormSubmit = (actionId: string) => {
		let prompt = "";

		switch (actionId) {
			case "cross-chain":
				prompt = `Find the best route to send ${formData.amount} ${formData.token} from ${formData.fromChain} to ${formData.toChain}${formData.toAddress ? ` to address ${formData.toAddress}` : ""}. Show me the fastest and cheapest options.`;
				break;
			case "send":
				prompt = `Send ${formData.amount} ${formData.token} to ${formData.toAddress}`;
				break;
			case "swap":
				prompt = `Swap ${formData.swapAmount} ${formData.swapFromToken} for ${formData.swapToToken}`;
				break;
			case "balance":
				prompt = "Show my token balances across all chains";
				break;
			case "portfolio":
				prompt = "Show my multi-chain portfolio overview with total values";
				break;
			case "rates":
				prompt = "Show current exchange rates for major tokens";
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
		});
	};

	const renderForm = (actionId: string) => {
		switch (actionId) {
			case "cross-chain":
				return (
					<div className="space-y-4">
						<div className="grid grid-cols-2 gap-4">
							<div>
								<Label htmlFor="fromChain">From Chain</Label>
								<Select value={formData.fromChain} onValueChange={(value) => setFormData({...formData, fromChain: value})}>
									<SelectTrigger>
										<SelectValue placeholder="Select chain" />
									</SelectTrigger>
									<SelectContent>
										{chains.map(chain => (
											<SelectItem key={chain} value={chain}>{chain}</SelectItem>
										))}
									</SelectContent>
								</Select>
							</div>
							<div>
								<Label htmlFor="toChain">To Chain</Label>
								<Select value={formData.toChain} onValueChange={(value) => setFormData({...formData, toChain: value})}>
									<SelectTrigger>
										<SelectValue placeholder="Select chain" />
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
								<Label htmlFor="token">Token</Label>
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
								<Label htmlFor="amount">Amount</Label>
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
							<Label htmlFor="toAddress">To Address (Optional)</Label>
							<Input
								id="toAddress"
								placeholder="0x..."
								value={formData.toAddress}
								onChange={(e) => setFormData({...formData, toAddress: e.target.value})}
							/>
						</div>
					</div>
				);

			case "send":
				return (
					<div className="space-y-4">
						<div className="grid grid-cols-2 gap-4">
							<div>
								<Label htmlFor="token">Token</Label>
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
								<Label htmlFor="amount">Amount</Label>
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
							<Label htmlFor="toAddress">To Address</Label>
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
								<Label htmlFor="swapFromToken">From Token</Label>
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
								<Label htmlFor="swapToToken">To Token</Label>
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
							<Label htmlFor="swapAmount">Amount</Label>
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
								isActive ? 'border-yellow-500 bg-yellow-50 shadow-lg' : 'border-border hover:border-yellow-300'
							}`}
							onClick={() => handleQuickAction(action.id)}
						>
							<CardContent className="p-4">
								<div className="flex flex-col items-center text-center space-y-2">
									<div className={`p-2 rounded-lg ${action.color}`}>
										<Icon className="w-5 h-5 text-white" />
									</div>
									<div>
										<h3 className="font-medium text-sm">{action.title}</h3>
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
				<Card className="border-yellow-300 bg-yellow-50">
					<CardHeader className="pb-3">
						<CardTitle className="text-lg flex items-center gap-2">
							{React.createElement(quickActions.find(a => a.id === activeForm)?.icon || Search, { className: "w-5 h-5" })}
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