"use client";

import { useState, useEffect } from "react";
import { ArrowLeft, Building2, Users, Calendar, DollarSign, Globe, CreditCard, FileText, Settings, Plus, CheckCircle, Wifi, WifiOff, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import Link from "next/link";
import { motion } from "framer-motion";
import { usePayrollManager } from "@/hooks/usePayrollManager";
import { toast } from "sonner";

const payrollFeatures = [
	{
		icon: Users,
		title: "Global Workforce Management",
		description: "Manage employees, contractors, and vendors across multiple countries with automated currency conversion."
	},
	{
		icon: Calendar,
		title: "Automated Scheduling",
		description: "Set up recurring payments with flexible scheduling for salaries, subscriptions, and vendor payments."
	},
	{
		icon: Globe,
		title: "Multi-Chain Support",
		description: "Pay in any token across any supported blockchain with optimal routing and lowest fees."
	},
	{
		icon: FileText,
		title: "Compliance & Reporting",
		description: "Generate tax documents, compliance reports, and audit trails for all cross-chain transactions."
	}
];

const exampleEmployees = [
	{
		name: "Alice Johnson",
		role: "Frontend Developer",
		location: "United States",
		chain: "Ethereum",
		token: "USDC",
		amount: "8,500",
		frequency: "Monthly",
		status: "Active"
	},
	{
		name: "Carlos Rodriguez",
		role: "Backend Engineer",
		location: "Mexico",
		chain: "Polygon",
		token: "USDT",
		amount: "7,200",
		frequency: "Bi-weekly",
		status: "Active"
	},
	{
		name: "Priya Sharma",
		role: "UI/UX Designer",
		location: "India",
		chain: "BNB Chain",
		token: "BUSD",
		amount: "4,800",
		frequency: "Monthly",
		status: "Active"
	}
];

export default function PayrollPage() {
	const {
		isConnected,
		isAuthenticated,
		isConnecting,
		error,
		employees,
		processPayment,
		processAllPendingPayments,
		payrollSessions,
		payrollStats,
		connect,
		disconnect,
		isProcessingPayment,
		processingEmployeeId,
	} = usePayrollManager();

	const [autoPayEnabled, setAutoPayEnabled] = useState(true);
	const [showAddEmployee, setShowAddEmployee] = useState(false);

	// Auto-connect on mount
	useEffect(() => {
		if (!isConnected && !isConnecting) {
			connect().catch(err => {
				console.error('Failed to connect to ClearNode:', err);
			});
		}
	}, [isConnected, isConnecting, connect]);

	// Handle payment processing
	const handlePayNow = async (employeeId: string) => {
		try {
			await processPayment(employeeId);
			toast.success('Payment processed successfully via Yellow Network!');
		} catch (err) {
			toast.error(`Payment failed: ${err instanceof Error ? err.message : 'Unknown error'}`);
		}
	};

	// Handle batch payments
	const handleProcessAll = async () => {
		try {
			await processAllPendingPayments();
			toast.success('All pending payments processed!');
		} catch (err) {
			toast.error(`Batch payment failed: ${err instanceof Error ? err.message : 'Unknown error'}`);
		}
	};

	// Connection status indicator
	const ConnectionStatus = () => {
		if (isConnecting) {
			return (
				<Badge variant="outline" className="text-yellow-500">
					<Loader2 className="w-3 h-3 mr-1 animate-spin" />
					Connecting...
				</Badge>
			);
		}
		if (isConnected && isAuthenticated) {
			return (
				<Badge variant="default" className="bg-green-500">
					<Wifi className="w-3 h-3 mr-1" />
					Yellow Network Connected
				</Badge>
			);
		}
		return (
			<Badge variant="destructive">
				<WifiOff className="w-3 h-3 mr-1" />
				Disconnected
			</Badge>
		);
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
								<div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-violet-500 rounded-lg flex items-center justify-center">
									<Building2 className="w-5 h-5 text-white" />
								</div>
								<div>
									<h1 className="font-semibold text-lg">Employee Payroll</h1>
									<p className="text-sm text-muted-foreground">Global workforce management</p>
								</div>
							</div>
						</div>
						<ConnectionStatus />
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
					<h2 className="text-4xl font-bold bg-gradient-to-r from-purple-400 to-violet-400 bg-clip-text text-transparent mb-4">
						Global Employee Payroll Management
					</h2>
					<p className="text-xl text-muted-foreground max-w-3xl mx-auto">
						Pay your global workforce instantly across multiple blockchains with Yellow Network's state channels.
						Reduce costs, increase efficiency, and ensure compliance with automated cross-chain payroll.
					</p>
				</motion.div>

				{/* Dashboard Overview */}
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
									<Users className="w-5 h-5 text-purple-500" />
									Total Employees
								</CardTitle>
							</CardHeader>
							<CardContent>
								<p className="text-3xl font-bold">127</p>
								<p className="text-sm text-muted-foreground">Across 23 countries</p>
							</CardContent>
						</Card>
						<Card>
							<CardHeader className="pb-3">
								<CardTitle className="text-lg flex items-center gap-2">
									<DollarSign className="w-5 h-5 text-green-500" />
									Monthly Payroll
								</CardTitle>
							</CardHeader>
							<CardContent>
								<p className="text-3xl font-bold">$485K</p>
								<p className="text-sm text-muted-foreground">+12% from last month</p>
							</CardContent>
						</Card>
						<Card>
							<CardHeader className="pb-3">
								<CardTitle className="text-lg flex items-center gap-2">
									<CreditCard className="w-5 h-5 text-blue-500" />
									Pending Payments
								</CardTitle>
							</CardHeader>
							<CardContent>
								<p className="text-3xl font-bold">12</p>
								<p className="text-sm text-muted-foreground">Due this month</p>
							</CardContent>
						</Card>
						<Card>
							<CardHeader className="pb-3">
								<CardTitle className="text-lg flex items-center gap-2">
									<Globe className="w-5 h-5 text-orange-500" />
									Supported Chains
								</CardTitle>
							</CardHeader>
							<CardContent>
								<p className="text-3xl font-bold">8</p>
								<p className="text-sm text-muted-foreground">Optimal routing</p>
							</CardContent>
						</Card>
					</div>
				</motion.div>

				{/* Main Payroll Section */}
				<motion.div
					initial={{ opacity: 0, y: 30 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ delay: 0.2 }}
					className="mb-16"
				>
					<div className="w-full">
						<div className="space-y-6">
							<div className="flex items-center justify-between">
								<h3 className="text-2xl font-bold">Employee Payroll</h3>
								<div className="flex items-center gap-4">
									<div className="flex items-center gap-2">
										<Switch
											checked={autoPayEnabled}
											onCheckedChange={setAutoPayEnabled}
										/>
										<span className="text-sm">Auto-pay enabled</span>
									</div>
									<Button onClick={() => setShowAddEmployee(true)}>
										<Plus className="w-4 h-4 mr-2" />
										Add Employee
									</Button>
								</div>
							</div>

							<div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
								{exampleEmployees.map((employee, index) => (
									<Card key={index}>
										<CardHeader>
											<div className="flex items-center justify-between">
												<CardTitle className="text-lg">{employee.name}</CardTitle>
												<Badge variant="outline" className="text-green-500">
													{employee.status}
												</Badge>
											</div>
											<CardDescription>{employee.role} • {employee.location}</CardDescription>
										</CardHeader>
										<CardContent className="space-y-3">
											<div className="grid grid-cols-2 gap-3 text-sm">
												<div>
													<p className="text-muted-foreground">Amount</p>
													<p className="font-semibold">${employee.amount}</p>
												</div>
												<div>
													<p className="text-muted-foreground">Frequency</p>
													<p className="font-semibold">{employee.frequency}</p>
												</div>
												<div>
													<p className="text-muted-foreground">Chain</p>
													<p className="font-semibold">{employee.chain}</p>
												</div>
												<div>
													<p className="text-muted-foreground">Token</p>
													<p className="font-semibold">{employee.token}</p>
												</div>
											</div>
											<div className="flex gap-2">
												<Button variant="outline" size="sm" className="flex-1">
													<Settings className="w-4 h-4 mr-2" />
													Edit
												</Button>
												<Button variant="default" size="sm" className="flex-1">
													Pay Now
												</Button>
											</div>
										</CardContent>
									</Card>
								))}
							</div>
						</div>
					</div>
				</motion.div>

				{/* Features */}
				<motion.div
					initial={{ opacity: 0, y: 30 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ delay: 0.3 }}
					className="mb-16"
				>
					<h3 className="text-2xl font-bold text-center mb-8">Payroll Features</h3>
					<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
						{payrollFeatures.map((feature, index) => {
							const IconComponent = feature.icon;
							return (
								<Card key={index} className="text-center">
									<CardHeader>
										<div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-violet-500 rounded-lg flex items-center justify-center mx-auto mb-4">
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
							<CardTitle>Revolutionize Your Global Payroll</CardTitle>
							<CardDescription>
								Join the waitlist for early access to cross-chain employee payroll management
							</CardDescription>
						</CardHeader>
						<CardContent>
							<div className="flex gap-2 max-w-md mx-auto">
								<Input placeholder="Company email" type="email" />
								<Button>Join Waitlist</Button>
							</div>
							<p className="text-xs text-muted-foreground mt-4">
								Priority access for companies with 10+ employees
							</p>
							<div className="mt-6 text-sm text-muted-foreground">
								<p className="font-medium mb-2">Coming Soon:</p>
								<div className="flex gap-4 justify-center">
									<Badge variant="secondary">Vendor Payments</Badge>
									<Badge variant="secondary">SaaS Subscriptions</Badge>
									<Badge variant="secondary">Expense Management</Badge>
								</div>
							</div>
						</CardContent>
					</Card>
				</motion.div>
			</div>
		</div>
	);
}