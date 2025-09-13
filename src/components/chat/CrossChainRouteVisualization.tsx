"use client";

import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowRight, Clock, DollarSign, Shield, Zap, Route, Network } from "lucide-react";
import {
	ReactFlow,
	Node,
	Edge,
	Background,
	Controls,
	useNodesState,
	useEdgesState,
	Handle,
	Position,
	NodeProps,
	MarkerType,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import { motion } from "framer-motion";

interface RouteStep {
	step: number;
	action: string;
}

interface CrossChainRoute {
	id: string;
	provider: string;
	type: string;
	estimatedTime: string;
	estimatedCost: string;
	steps: RouteStep[];
	advantages: string[];
	risks: string[];
	confidence: number;
}

interface RouteVisualizationProps {
	routes: CrossChainRoute[];
	recommendation: CrossChainRoute;
	fromChain: string;
	toChain: string;
	token: string;
	amount: string;
	onSelectRoute: (routeId: string) => void;
}

// Custom node component for route visualization
const RouteNode: React.FC<NodeProps> = ({ data }) => {
	return (
		<div className="relative">
			<Handle
				type="target"
				position={Position.Left}
				style={{ background: "#555", border: "none" }}
			/>
			<motion.div
				initial={{ scale: 0 }}
				animate={{ scale: 1 }}
				transition={{ duration: 0.3 }}
				className={`
					px-3 py-2 rounded-lg shadow-md border cursor-pointer
					transition-all duration-300 hover:shadow-lg hover:scale-105
					${data.isYellow ? 'border-yellow-400 bg-yellow-500/10' : 'border-border bg-card'}
				`}
				style={{ minWidth: '100px' }}
			>
				<div className="flex flex-col items-center gap-1">
					<div className={`
						w-8 h-8 rounded-full flex items-center justify-center
						${data.color} shadow-sm text-xs font-bold text-white
					`}>
						{data.symbol}
					</div>
					<div className="text-center">
						<div className="font-medium text-xs text-foreground">
							{data.label}
						</div>
					</div>
				</div>
			</motion.div>
			<Handle
				type="source"
				position={Position.Right}
				style={{ background: "#555", border: "none" }}
			/>
		</div>
	);
};

const nodeTypes = {
	routeNode: RouteNode,
};

export function CrossChainRouteVisualization({
	routes,
	recommendation,
	fromChain,
	toChain,
	token,
	amount,
	onSelectRoute
}: RouteVisualizationProps) {
	// Create nodes and edges for the interactive graph
	const createInteractiveGraph = () => {
		const nodes: Node[] = [];
		const edges: Edge[] = [];

		// Source chain node
		nodes.push({
			id: "source",
			type: "routeNode",
			position: { x: 50, y: 120 },
			data: {
				label: fromChain.charAt(0).toUpperCase() + fromChain.slice(1),
				symbol: token.slice(0, 2),
				color: "bg-blue-500"
			}
		});

		// Destination chain node
		nodes.push({
			id: "destination",
			type: "routeNode",
			position: { x: 600, y: 120 },
			data: {
				label: toChain.charAt(0).toUpperCase() + toChain.slice(1),
				symbol: token.slice(0, 2),
				color: "bg-purple-500"
			}
		});

		// Add intermediate nodes for each unique route provider
		const uniqueProviders = Array.from(new Set(routes.map(r => r.provider)));
		uniqueProviders.forEach((provider, index) => {
			const isYellow = provider.toLowerCase().includes('yellow');
			const yPosition = 50 + (index * 100); // Stagger vertically

			nodes.push({
				id: `provider-${index}`,
				type: "routeNode",
				position: { x: 325, y: yPosition },
				data: {
					label: provider,
					symbol: provider.slice(0, 2),
					color: isYellow ? "bg-yellow-500" : "bg-gray-500",
					isYellow
				}
			});

			// Find the route for this provider
			const route = routes.find(r => r.provider === provider);
			if (route) {
				const isRecommended = route.id === recommendation.id;
				const edgeColor = isRecommended ? "#10b981" :
								 isYellow ? "#f59e0b" : "#94a3b8";

				// Edge from source to provider
				edges.push({
					id: `edge-to-${index}`,
					source: "source",
					target: `provider-${index}`,
					animated: true,
					style: {
						stroke: edgeColor,
						strokeWidth: isRecommended ? 3 : 2
					},
					markerEnd: {
						type: MarkerType.ArrowClosed,
						color: edgeColor
					},
					label: isRecommended ? "Recommended" : undefined
				});

				// Edge from provider to destination
				edges.push({
					id: `edge-from-${index}`,
					source: `provider-${index}`,
					target: "destination",
					animated: true,
					style: {
						stroke: edgeColor,
						strokeWidth: isRecommended ? 3 : 2
					},
					markerEnd: {
						type: MarkerType.ArrowClosed,
						color: edgeColor
					}
				});
			}
		});

		return { nodes, edges };
	};

	const { nodes: graphNodes, edges: graphEdges } = createInteractiveGraph();
	const [nodes, setNodes, onNodesChange] = useNodesState(graphNodes);
	const [edges, setEdges, onEdgesChange] = useEdgesState(graphEdges);

	const getProviderIcon = (provider: string) => {
		if (provider.toLowerCase().includes("yellow")) {
			return <div className="w-6 h-6 bg-yellow-500 rounded-full flex items-center justify-center text-xs font-bold text-black">Y</div>;
		}
		if (provider.toLowerCase().includes("bridge")) {
			return <Network className="w-6 h-6 text-blue-500" />;
		}
		return <Route className="w-6 h-6 text-purple-500" />;
	};

	const getTypeColor = (type: string) => {
		if (type.toLowerCase().includes("state channel")) return "bg-yellow-100 text-yellow-800";
		if (type.toLowerCase().includes("traditional")) return "bg-blue-100 text-blue-800";
		return "bg-purple-100 text-purple-800";
	};

	const getConfidenceColor = (confidence: number) => {
		if (confidence >= 90) return "text-green-600";
		if (confidence >= 75) return "text-yellow-600";
		return "text-orange-600";
	};

	return (
		<div className="space-y-6">
			{/* Route Header */}
			<div className="bg-gradient-to-r from-blue-50 to-purple-50 p-6 rounded-lg border">
				<div className="flex items-center justify-center space-x-4 mb-4">
					<div className="text-center">
						<div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold mb-2">
							{fromChain.charAt(0).toUpperCase()}
						</div>
						<p className="text-sm font-medium capitalize">{fromChain}</p>
					</div>
					<ArrowRight className="w-8 h-8 text-gray-400" />
					<div className="text-center px-4">
						<div className="bg-white px-3 py-2 rounded-full border-2 border-dashed border-gray-300">
							<span className="text-lg font-bold">{amount} {token}</span>
						</div>
					</div>
					<ArrowRight className="w-8 h-8 text-gray-400" />
					<div className="text-center">
						<div className="w-12 h-12 bg-purple-500 rounded-full flex items-center justify-center text-white font-bold mb-2">
							{toChain.charAt(0).toUpperCase()}
						</div>
						<p className="text-sm font-medium capitalize">{toChain}</p>
					</div>
				</div>
				<p className="text-center text-gray-600">
					Found {routes.length} available routes • Recommended: <span className="font-semibold text-yellow-600">{recommendation.provider}</span>
				</p>
			</div>

			{/* Interactive Route Graph */}
			<Card className="bg-card border border-border">
				<CardHeader>
					<CardTitle className="text-lg flex items-center gap-2">
						<Route className="w-5 h-5 text-yellow-500" />
						Route Visualization
					</CardTitle>
					<CardDescription>
						Interactive graph showing available routing paths and their relationships
					</CardDescription>
				</CardHeader>
				<CardContent>
					<div className="bg-background border border-border rounded-lg overflow-hidden" style={{ height: "300px" }}>
						<ReactFlow
							nodes={nodes}
							edges={edges}
							onNodesChange={onNodesChange}
							onEdgesChange={onEdgesChange}
							nodeTypes={nodeTypes}
							fitView
							proOptions={{ hideAttribution: true }}
							defaultViewport={{ x: 0, y: 0, zoom: 1 }}
						>
							<Background color="#374151" gap={20} />
							<Controls />
						</ReactFlow>
					</div>
					<div className="mt-4 flex flex-wrap gap-2 text-sm">
						<div className="flex items-center gap-2">
							<div className="w-3 h-0.5 bg-green-500"></div>
							<span className="text-muted-foreground">Recommended Route</span>
						</div>
						<div className="flex items-center gap-2">
							<div className="w-3 h-0.5 bg-orange-500"></div>
							<span className="text-muted-foreground">Yellow Network</span>
						</div>
						<div className="flex items-center gap-2">
							<div className="w-3 h-0.5 bg-gray-500"></div>
							<span className="text-muted-foreground">Alternative Routes</span>
						</div>
					</div>
				</CardContent>
			</Card>

			{/* Routes List */}
			<div className="space-y-4">
				{routes.map((route, index) => (
					<Card key={route.id} className={`transition-all duration-200 hover:shadow-lg ${
						route.id === recommendation.id ? 'ring-2 ring-yellow-500 bg-yellow-50' : ''
					}`}>
						<CardHeader className="pb-3">
							<div className="flex items-center justify-between">
								<div className="flex items-center space-x-3">
									{getProviderIcon(route.provider)}
									<div>
										<CardTitle className="text-lg">{route.provider}</CardTitle>
										<CardDescription>
											<Badge variant="secondary" className={getTypeColor(route.type)}>
												{route.type}
											</Badge>
										</CardDescription>
									</div>
								</div>
								<div className="flex items-center space-x-4 text-sm">
									<div className="flex items-center space-x-1 text-gray-600">
										<Clock className="w-4 h-4" />
										<span>{route.estimatedTime}</span>
									</div>
									<div className="flex items-center space-x-1 text-gray-600">
										<DollarSign className="w-4 h-4" />
										<span>{route.estimatedCost}</span>
									</div>
									<div className="flex items-center space-x-1">
										<Shield className="w-4 h-4" />
										<span className={`font-medium ${getConfidenceColor(route.confidence)}`}>
											{route.confidence}%
										</span>
									</div>
								</div>
							</div>
							{route.id === recommendation.id && (
								<Badge variant="default" className="w-fit bg-yellow-500 text-black">
									<Zap className="w-3 h-3 mr-1" />
									Recommended
								</Badge>
							)}
						</CardHeader>
						
						<CardContent className="space-y-4">
							{/* Route Steps */}
							<div>
								<h4 className="font-medium mb-2">Transaction Steps:</h4>
								<div className="space-y-2">
									{route.steps.map((step) => (
										<div key={step.step} className="flex items-start space-x-3">
											<div className="w-6 h-6 bg-blue-100 text-blue-800 rounded-full flex items-center justify-center text-xs font-bold mt-0.5">
												{step.step}
											</div>
											<p className="text-sm text-gray-700 flex-1">{step.action}</p>
										</div>
									))}
								</div>
							</div>

							{/* Advantages and Risks */}
							<div className="grid md:grid-cols-2 gap-4">
								<div>
									<h4 className="font-medium mb-2 text-green-700">Advantages:</h4>
									<ul className="space-y-1">
										{route.advantages.map((advantage, i) => (
											<li key={i} className="text-sm text-green-600 flex items-start space-x-1">
												<span className="text-green-500 mt-1">•</span>
												<span>{advantage}</span>
											</li>
										))}
									</ul>
								</div>
								<div>
									<h4 className="font-medium mb-2 text-orange-700">Considerations:</h4>
									<ul className="space-y-1">
										{route.risks.map((risk, i) => (
											<li key={i} className="text-sm text-orange-600 flex items-start space-x-1">
												<span className="text-orange-500 mt-1">•</span>
												<span>{risk}</span>
											</li>
										))}
									</ul>
								</div>
							</div>

							{/* Action Button */}
							<div className="pt-2">
								<Button 
									onClick={() => onSelectRoute(route.id)}
									className={`w-full ${
										route.id === recommendation.id 
											? 'bg-yellow-500 hover:bg-yellow-600 text-black' 
											: 'bg-gray-100 hover:bg-gray-200 text-gray-700'
									}`}
								>
									{route.id === recommendation.id ? 'Use Recommended Route' : 'Select This Route'}
								</Button>
							</div>
						</CardContent>
					</Card>
				))}
			</div>

			{/* Route Comparison Summary */}
			<Card className="bg-gray-50">
				<CardHeader>
					<CardTitle className="text-lg">Route Comparison</CardTitle>
				</CardHeader>
				<CardContent>
					<div className="grid md:grid-cols-3 gap-4 text-sm">
						<div>
							<h4 className="font-medium mb-2">🚀 Fastest Route</h4>
							<p className="text-gray-600">{routes.reduce((fastest, route) => 
								parseInt(route.estimatedTime) < parseInt(fastest.estimatedTime) ? route : fastest
							).provider}</p>
						</div>
						<div>
							<h4 className="font-medium mb-2">💰 Cheapest Route</h4>
							<p className="text-gray-600">{routes.reduce((cheapest, route) => 
								parseFloat(route.estimatedCost.replace('$', '')) < parseFloat(cheapest.estimatedCost.replace('$', '')) ? route : cheapest
							).provider}</p>
						</div>
						<div>
							<h4 className="font-medium mb-2">🛡️ Most Secure</h4>
							<p className="text-gray-600">{routes.reduce((secure, route) => 
								route.confidence > secure.confidence ? route : secure
							).provider}</p>
						</div>
					</div>
				</CardContent>
			</Card>
		</div>
	);
}