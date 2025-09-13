"use client";

import React, { useMemo } from "react";
import { motion } from "framer-motion";
import { Clock, DollarSign, Shield, ArrowRight, Zap } from "lucide-react";
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

interface RouteData {
	fromChain: string;
	toChain: string;
	fromToken: string;
	toToken: string;
	amount: string;
	routes: {
		fastest: {
			time: string;
			cost: string;
			steps: string[];
			security: "High" | "Medium" | "Low";
		};
		cheapest: {
			time: string;
			cost: string;
			steps: string[];
			security: "High" | "Medium" | "Low";
		};
	};
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
						{data.symbol.slice(0, 2)}
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

interface RouteVisualizationProps {
	routeData: RouteData;
}

export function RouteVisualization({ routeData }: RouteVisualizationProps) {
	// Create nodes for the route visualization
	const createRouteNodes = (routeType: 'fastest' | 'cheapest', yOffset: number) => {
		const route = routeData.routes[routeType];
		const nodes: Node[] = [];

		// Source chain
		nodes.push({
			id: `${routeType}-source`,
			type: "routeNode",
			position: { x: 50, y: yOffset },
			data: {
				label: routeData.fromChain,
				symbol: routeData.fromToken,
				color: "bg-blue-500"
			}
		});

		// Intermediate steps (bridges/protocols)
		route.steps.forEach((step, index) => {
			nodes.push({
				id: `${routeType}-step-${index}`,
				type: "routeNode",
				position: { x: 200 + (index * 150), y: yOffset },
				data: {
					label: step,
					symbol: step.slice(0, 2),
					color: step.toLowerCase().includes('yellow') ? "bg-yellow-500" : "bg-gray-500",
					isYellow: step.toLowerCase().includes('yellow')
				}
			});
		});

		// Destination chain
		nodes.push({
			id: `${routeType}-dest`,
			type: "routeNode",
			position: { x: 200 + (route.steps.length * 150), y: yOffset },
			data: {
				label: routeData.toChain,
				symbol: routeData.toToken,
				color: "bg-purple-500"
			}
		});

		return nodes;
	};

	const createRouteEdges = (routeType: 'fastest' | 'cheapest') => {
		const route = routeData.routes[routeType];
		const edges: Edge[] = [];

		// Source to first step
		edges.push({
			id: `${routeType}-edge-0`,
			source: `${routeType}-source`,
			target: `${routeType}-step-0`,
			animated: true,
			style: {
				stroke: routeType === 'fastest' ? "#10b981" : "#f59e0b",
				strokeWidth: 2
			},
			markerEnd: {
				type: MarkerType.ArrowClosed,
				color: routeType === 'fastest' ? "#10b981" : "#f59e0b"
			}
		});

		// Between steps
		for (let i = 0; i < route.steps.length - 1; i++) {
			edges.push({
				id: `${routeType}-edge-${i + 1}`,
				source: `${routeType}-step-${i}`,
				target: `${routeType}-step-${i + 1}`,
				animated: true,
				style: {
					stroke: routeType === 'fastest' ? "#10b981" : "#f59e0b",
					strokeWidth: 2
				},
				markerEnd: {
					type: MarkerType.ArrowClosed,
					color: routeType === 'fastest' ? "#10b981" : "#f59e0b"
				}
			});
		}

		// Last step to destination
		edges.push({
			id: `${routeType}-edge-final`,
			source: `${routeType}-step-${route.steps.length - 1}`,
			target: `${routeType}-dest`,
			animated: true,
			style: {
				stroke: routeType === 'fastest' ? "#10b981" : "#f59e0b",
				strokeWidth: 2
			},
			markerEnd: {
				type: MarkerType.ArrowClosed,
				color: routeType === 'fastest' ? "#10b981" : "#f59e0b"
			}
		});

		return edges;
	};

	const allNodes = [
		...createRouteNodes('fastest', 50),
		...createRouteNodes('cheapest', 200)
	];

	const allEdges = [
		...createRouteEdges('fastest'),
		...createRouteEdges('cheapest')
	];

	const [nodes, setNodes, onNodesChange] = useNodesState(allNodes);
	const [edges, setEdges, onEdgesChange] = useEdgesState(allEdges);

	return (
		<div className="w-full bg-card border border-border rounded-lg p-4 mt-4">
			<div className="mb-4">
				<h3 className="text-lg font-semibold text-foreground mb-2">
					Cross-Chain Route Analysis
				</h3>
				<p className="text-sm text-muted-foreground">
					Send {routeData.amount} {routeData.fromToken} from {routeData.fromChain} to {routeData.toChain}
				</p>
			</div>

			{/* Route Visualization */}
			<div className="bg-background border border-border rounded-lg overflow-hidden mb-4" style={{ height: "300px" }}>
				<ReactFlow
					nodes={nodes}
					edges={edges}
					onNodesChange={onNodesChange}
					onEdgesChange={onEdgesChange}
					nodeTypes={nodeTypes}
					fitView
					proOptions={{ hideAttribution: true }}
					defaultViewport={{ x: 0, y: 0, zoom: 0.8 }}
				>
					<Background color="#374151" gap={20} />
					<Controls />
				</ReactFlow>
			</div>

			{/* Route Comparison Cards */}
			<div className="grid md:grid-cols-2 gap-4">
				{/* Fastest Route */}
				<motion.div
					initial={{ opacity: 0, x: -20 }}
					animate={{ opacity: 1, x: 0 }}
					transition={{ duration: 0.5 }}
					className="bg-background border border-green-500/30 rounded-lg p-4"
				>
					<div className="flex items-center gap-2 mb-3">
						<Zap className="w-5 h-5 text-green-500" />
						<h4 className="font-semibold text-foreground">Fastest Route</h4>
					</div>
					<div className="space-y-2">
						<div className="flex justify-between items-center">
							<span className="text-sm text-muted-foreground flex items-center gap-1">
								<Clock className="w-4 h-4" />
								Time:
							</span>
							<span className="text-sm font-medium text-green-500">{routeData.routes.fastest.time}</span>
						</div>
						<div className="flex justify-between items-center">
							<span className="text-sm text-muted-foreground flex items-center gap-1">
								<DollarSign className="w-4 h-4" />
								Cost:
							</span>
							<span className="text-sm font-medium">{routeData.routes.fastest.cost}</span>
						</div>
						<div className="flex justify-between items-center">
							<span className="text-sm text-muted-foreground flex items-center gap-1">
								<Shield className="w-4 h-4" />
								Security:
							</span>
							<span className={`text-sm font-medium ${
								routeData.routes.fastest.security === 'High' ? 'text-green-500' :
								routeData.routes.fastest.security === 'Medium' ? 'text-yellow-500' : 'text-red-500'
							}`}>
								{routeData.routes.fastest.security}
							</span>
						</div>
						<div className="mt-3">
							<p className="text-xs text-muted-foreground mb-1">Route:</p>
							<p className="text-xs text-foreground">{routeData.routes.fastest.steps.join(' → ')}</p>
						</div>
					</div>
				</motion.div>

				{/* Cheapest Route */}
				<motion.div
					initial={{ opacity: 0, x: 20 }}
					animate={{ opacity: 1, x: 0 }}
					transition={{ duration: 0.5, delay: 0.1 }}
					className="bg-background border border-orange-500/30 rounded-lg p-4"
				>
					<div className="flex items-center gap-2 mb-3">
						<DollarSign className="w-5 h-5 text-orange-500" />
						<h4 className="font-semibold text-foreground">Cheapest Route</h4>
					</div>
					<div className="space-y-2">
						<div className="flex justify-between items-center">
							<span className="text-sm text-muted-foreground flex items-center gap-1">
								<Clock className="w-4 h-4" />
								Time:
							</span>
							<span className="text-sm font-medium">{routeData.routes.cheapest.time}</span>
						</div>
						<div className="flex justify-between items-center">
							<span className="text-sm text-muted-foreground flex items-center gap-1">
								<DollarSign className="w-4 h-4" />
								Cost:
							</span>
							<span className="text-sm font-medium text-orange-500">{routeData.routes.cheapest.cost}</span>
						</div>
						<div className="flex justify-between items-center">
							<span className="text-sm text-muted-foreground flex items-center gap-1">
								<Shield className="w-4 h-4" />
								Security:
							</span>
							<span className={`text-sm font-medium ${
								routeData.routes.cheapest.security === 'High' ? 'text-green-500' :
								routeData.routes.cheapest.security === 'Medium' ? 'text-yellow-500' : 'text-red-500'
							}`}>
								{routeData.routes.cheapest.security}
							</span>
						</div>
						<div className="mt-3">
							<p className="text-xs text-muted-foreground mb-1">Route:</p>
							<p className="text-xs text-foreground">{routeData.routes.cheapest.steps.join(' → ')}</p>
						</div>
					</div>
				</motion.div>
			</div>
		</div>
	);
}