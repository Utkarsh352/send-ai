"use client";

import React, { useState } from "react";
import { CrossChainRouteVisualization } from "./CrossChainRouteVisualization";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ExternalLink, MapPin, Zap } from "lucide-react";

interface CrossChainRouteInvocationProps {
	result: {
		success: boolean;
		routes: any[];
		recommendation: any;
		fromChain: string;
		toChain: string;
		token: string;
		amount: string;
		userAddress: string;
		totalRoutesFound: number;
		analysis: string;
	};
}

export function CrossChainRouteInvocation({ result }: CrossChainRouteInvocationProps) {
	const [selectedRoute, setSelectedRoute] = useState<string | null>(null);

	if (!result.success) {
		return (
			<Card className="border-red-200 bg-red-50">
				<CardHeader>
					<CardTitle className="text-red-800">Route Finding Failed</CardTitle>
					<CardDescription className="text-red-600">
						Unable to find suitable cross-chain routes. Please try again or contact support.
					</CardDescription>
				</CardHeader>
			</Card>
		);
	}

	const handleRouteSelection = (routeId: string) => {
		setSelectedRoute(routeId);
		// Here you would typically trigger the actual transaction execution
		console.log(`Selected route: ${routeId}`);
	};

	return (
		<div className="space-y-6">
			{/* Header Card */}
			<Card className="bg-gradient-to-r from-yellow-50 to-orange-50 border-yellow-200">
				<CardHeader className="pb-4">
					<div className="flex items-center justify-between">
						<div className="flex items-center space-x-3">
							<div className="p-2 bg-yellow-500 rounded-lg">
								<MapPin className="w-6 h-6 text-black" />
							</div>
							<div>
								<CardTitle className="text-xl text-yellow-900">Cross-Chain Routes Found</CardTitle>
								<CardDescription className="text-yellow-700">
									{result.totalRoutesFound} optimal paths discovered for your transaction
								</CardDescription>
							</div>
						</div>
						<Badge variant="secondary" className="bg-yellow-200 text-yellow-800">
							<Zap className="w-3 h-3 mr-1" />
							Send-AI Optimized
						</Badge>
					</div>
				</CardHeader>
				<CardContent>
					<p className="text-gray-700 text-sm leading-relaxed">
						{result.analysis}
					</p>
				</CardContent>
			</Card>

			{/* Route Visualization */}
			<CrossChainRouteVisualization
				routes={result.routes}
				recommendation={result.recommendation}
				fromChain={result.fromChain}
				toChain={result.toChain}
				token={result.token}
				amount={result.amount}
				onSelectRoute={handleRouteSelection}
			/>

			{/* Selected Route Confirmation */}
			{selectedRoute && (
				<Card className="border-green-200 bg-green-50">
					<CardHeader>
						<CardTitle className="text-green-800 flex items-center space-x-2">
							<span>Route Selected</span>
							<ExternalLink className="w-4 h-4" />
						</CardTitle>
						<CardDescription className="text-green-600">
							Ready to execute transaction using {result.routes.find(r => r.id === selectedRoute)?.provider}
						</CardDescription>
					</CardHeader>
					<CardContent>
						<div className="flex space-x-3">
							<Button 
								className="bg-green-600 hover:bg-green-700 text-white"
								onClick={() => {
									// Here you would integrate with actual transaction execution
									console.log("Executing transaction...");
								}}
							>
								Execute Transaction
							</Button>
							<Button 
								variant="outline" 
								onClick={() => setSelectedRoute(null)}
							>
								Choose Different Route
							</Button>
						</div>
					</CardContent>
				</Card>
			)}
		</div>
	);
}