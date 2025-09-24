"use client";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
	ArrowRight,
	Building2,
	Coins,
	TrendingUp,
	Users,
	FileText,
	Calculator
} from "lucide-react";
import Link from "next/link";

const applications = [
	{
		id: 1,
		title: "Real-Time Earnings Tracking",
		description: "Track your hourly earnings as you work, with automatic accumulation powered by Nitrolite Protocol's state channels.",
		icon: Calculator,
		status: "Available",
		gradient: "from-blue-500 to-cyan-500",
		href: "/features/payroll"
	},
	{
		id: 2,
		title: "Instant Hourly Redemption",
		description: "Access your earned wages instantly every hour through Yellow SDK integration with zero wait times.",
		icon: Users,
		status: "Available",
		gradient: "from-purple-500 to-violet-500",
		href: "/dashboard/employee-portal"
	},
	{
		id: 3,
		title: "Nitrolite Channel Security",
		description: "Secure off-chain channels using ERC-7824 state channels for efficient hourly wage access and redemption.",
		icon: FileText,
		status: "Available",
		gradient: "from-orange-500 to-red-500",
		href: "/dashboard/compliance"
	},
	{
		id: 4,
		title: "Yellow Network Integration",
		description: "Seamless integration with Yellow Network SDK for cross-chain wage redemption and instant settlements.",
		icon: TrendingUp,
		status: "Available",
		gradient: "from-yellow-500 to-amber-500",
		href: "/dashboard/compensation"
	}
];

export default function UsageApplicationCards() {
	return (
		<section className="w-full py-24 px-6">
			<div className="container mx-auto max-w-7xl">
				<div className="text-center mb-16">
					<h2 className="text-4xl font-bold bg-gradient-to-b from-white to-gray-400 bg-clip-text text-transparent mb-4">
						Features
					</h2>
					<p className="text-lg text-muted-foreground max-w-2xl mx-auto">
						Experience revolutionary hourly work with instant wage access powered by Nitrolite Protocol
					</p>
				</div>

				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
					{applications.map((app) => {
						const IconComponent = app.icon;
						return (
							<Link key={app.id} href={app.href}>
								<Card className="group relative overflow-hidden border-border/50 bg-card/50 backdrop-blur-sm hover:border-border transition-all duration-300 hover:scale-105 cursor-pointer">
									<CardHeader className="relative z-10">
										<div className="flex items-center justify-between mb-4">
											<div className={`w-12 h-12 rounded-lg bg-gradient-to-br ${app.gradient} flex items-center justify-center shadow-lg`}>
												<IconComponent className="w-6 h-6 text-white" />
											</div>
											<Badge variant="secondary" className="text-xs">
												{app.status}
											</Badge>
										</div>
										<CardTitle className="text-xl font-semibold text-foreground group-hover:text-yellow-500 transition-colors">
											{app.title}
										</CardTitle>
									</CardHeader>
									<CardContent className="relative z-10">
										<CardDescription className="text-muted-foreground leading-relaxed">
											{app.description}
										</CardDescription>
										<div className="mt-6 flex items-center text-sm text-yellow-500 opacity-0 group-hover:opacity-100 transition-opacity">
											Learn more
											<ArrowRight className="w-4 h-4 ml-2 transform group-hover:translate-x-1 transition-transform" />
										</div>
									</CardContent>

									{/* Subtle gradient overlay */}
									<div className={`absolute inset-0 bg-gradient-to-br ${app.gradient} opacity-0 group-hover:opacity-5 transition-opacity duration-300`} />
								</Card>
							</Link>
						);
					})}
				</div>
			</div>
		</section>
	);
}