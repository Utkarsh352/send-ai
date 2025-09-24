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

