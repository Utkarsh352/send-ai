"use client";

import React, { useMemo } from "react";
import { motion } from "framer-motion";
import { ArrowRight, Zap, Shield, Clock } from "lucide-react";
import {
	ReactFlow,
	Node,
	Edge,
	Background,
	Controls,
	MiniMap,
	useNodesState,
	useEdgesState,
	Handle,
	Position,
	NodeProps,
	MarkerType,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";

// Custom node component for blockchain networks
const NetworkNode: React.FC<NodeProps> = ({ data }) => {
	return (
		<div className="relative">
			<Handle
				type="target"
				position={Position.Top}
				style={{ background: "#555", border: "none" }}
			/>
			<motion.div
				initial={{ scale: 0 }}
				animate={{ scale: 1 }}
				transition={{ duration: 0.5 }}
				className={`
					px-4 py-3 rounded-xl shadow-lg border-2 cursor-pointer
					transition-all duration-300 hover:shadow-xl hover:scale-105
					${data.isHub ? 'border-yellow-400 bg-yellow-50' : 'border-gray-300 bg-white'}
				`}
				style={{ minWidth: '120px' }}
			>
				<div className="flex flex-col items-center gap-2">
					<div className={`
						w-12 h-12 rounded-full flex items-center justify-center
						${data.color} shadow-md
					`}>
						<span className="text-white font-bold text-lg">
							{data.symbol.slice(0, 2)}
						</span>
					</div>
					<div className="text-center">
						<div className="font-semibold text-sm text-gray-800">
							{data.label}
						</div>
						<div className="text-xs text-gray-500">
							{data.symbol}
						</div>
					</div>
					{data.isHub && (
						<div className="absolute -top-2 -right-2">
							<motion.div
								className="w-4 h-4 bg-yellow-400 rounded-full"
								animate={{
									scale: [1, 1.2, 1],
									opacity: [1, 0.8, 1]
								}}
								transition={{
									duration: 2,
									repeat: Infinity,
									ease: "easeInOut"
								}}
							/>
						</div>
					)}
				</div>
			</motion.div>
			<Handle
				type="source"
				position={Position.Bottom}
				style={{ background: "#555", border: "none" }}
			/>
		</div>
	);
};

const nodeTypes = {
	networkNode: NetworkNode,
};

export function CrossChainVisualization() {
	// Define the initial nodes
	const initialNodes: Node[] = [
		{
			id: "yellow",
			type: "networkNode",
			position: { x: 400, y: 200 },
			data: {
				label: "Yellow Network",
				symbol: "YELLOW",
				color: "bg-yellow-500",
				isHub: true
			}
		},
		{
			id: "ethereum",
			type: "networkNode",
			position: { x: 200, y: 50 },
			data: {
				label: "Ethereum",
				symbol: "ETH",
				color: "bg-blue-500"
			}
		},
		{
			id: "polygon",
			type: "networkNode",
			position: { x: 600, y: 50 },
			data: {
				label: "Polygon",
				symbol: "MATIC",
				color: "bg-purple-500"
			}
		},
		{
			id: "arbitrum",
			type: "networkNode",
			position: { x: 100, y: 200 },
			data: {
				label: "Arbitrum",
				symbol: "ARB",
				color: "bg-cyan-500"
			}
		},
		{
			id: "bnb",
			type: "networkNode",
			position: { x: 700, y: 200 },
			data: {
				label: "BNB Chain",
				symbol: "BNB",
				color: "bg-yellow-600"
			}
		},
		{
			id: "optimism",
			type: "networkNode",
			position: { x: 200, y: 350 },
			data: {
				label: "Optimism",
				symbol: "OP",
				color: "bg-red-500"
			}
		},
		{
			id: "avalanche",
			type: "networkNode",
			position: { x: 600, y: 350 },
			data: {
				label: "Avalanche",
				symbol: "AVAX",
				color: "bg-red-600"
			}
		}
	];

	// Define the initial edges
	const initialEdges: Edge[] = [
		{
			id: "e-yellow-ethereum",
			source: "yellow",
			target: "ethereum",
			animated: true,
			style: { stroke: "#facc15", strokeWidth: 2 },
			markerEnd: {
				type: MarkerType.ArrowClosed,
				color: "#facc15"
			}
		},
		{
			id: "e-yellow-polygon",
			source: "yellow",
			target: "polygon",
			animated: true,
			style: { stroke: "#facc15", strokeWidth: 2 },
			markerEnd: {
				type: MarkerType.ArrowClosed,
				color: "#facc15"
			}
		},
		{
			id: "e-yellow-arbitrum",
			source: "yellow",
			target: "arbitrum",
			animated: true,
			style: { stroke: "#facc15", strokeWidth: 2 },
			markerEnd: {
				type: MarkerType.ArrowClosed,
				color: "#facc15"
			}
		},
		{
			id: "e-yellow-bnb",
			source: "yellow",
			target: "bnb",
			animated: true,
			style: { stroke: "#facc15", strokeWidth: 2 },
			markerEnd: {
				type: MarkerType.ArrowClosed,
				color: "#facc15"
			}
		},
		{
			id: "e-yellow-optimism",
			source: "yellow",
			target: "optimism",
			animated: true,
			style: { stroke: "#facc15", strokeWidth: 2 },
			markerEnd: {
				type: MarkerType.ArrowClosed,
				color: "#facc15"
			}
		},
		{
			id: "e-yellow-avalanche",
			source: "yellow",
			target: "avalanche",
			animated: true,
			style: { stroke: "#facc15", strokeWidth: 2 },
			markerEnd: {
				type: MarkerType.ArrowClosed,
				color: "#facc15"
			}
		}
	];

	const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
	const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

	return (
		<div className="w-full bg-gradient-to-b from-background to-gray-50 py-24">
			<div className="container mx-auto px-6">
				<div className="text-center mb-16">
					<motion.h2
						initial={{ opacity: 0, y: 30 }}
						whileInView={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.8 }}
						className="text-4xl font-bold text-foreground mb-4"
					>
						Cross-Chain Network Topology
					</motion.h2>
					<motion.p
						initial={{ opacity: 0, y: 30 }}
						whileInView={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.8, delay: 0.2 }}
						className="text-lg text-muted-foreground max-w-2xl mx-auto"
					>
						Yellow Network connects multiple blockchains through state channels, enabling instant cross-chain transactions
					</motion.p>
				</div>

				{/* React Flow Graph */}
				<motion.div
					initial={{ opacity: 0, scale: 0.95 }}
					whileInView={{ opacity: 1, scale: 1 }}
					transition={{ duration: 0.8 }}
					className="bg-white rounded-2xl shadow-xl overflow-hidden"
					style={{ height: "500px" }}
				>
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
						<Background color="#f0f0f0" gap={20} />
						<Controls />
						<MiniMap
							nodeColor={(node) => {
								if (node.data?.isHub) return "#facc15";
								return "#94a3b8";
							}}
							pannable
							zoomable
						/>
					</ReactFlow>
				</motion.div>

				{/* Features Grid */}
				<motion.div
					className="grid md:grid-cols-3 gap-6 mt-16"
					initial={{ opacity: 0, y: 50 }}
					whileInView={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.8, delay: 0.3 }}
				>
					<div className="text-center p-6 bg-white rounded-lg shadow-sm border border-yellow-200">
						<div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center mx-auto mb-4">
							<Zap className="w-6 h-6 text-yellow-600" />
						</div>
						<h3 className="font-semibold text-foreground mb-2">Lightning Fast</h3>
						<p className="text-sm text-muted-foreground">
							State channels enable instant cross-chain settlements without waiting for block confirmations
						</p>
					</div>

					<div className="text-center p-6 bg-white rounded-lg shadow-sm border border-yellow-200">
						<div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center mx-auto mb-4">
							<Shield className="w-6 h-6 text-yellow-600" />
						</div>
						<h3 className="font-semibold text-foreground mb-2">Bridge-less Security</h3>
						<p className="text-sm text-muted-foreground">
							Eliminate traditional bridge risks with Yellow Network&apos;s peer-to-peer mesh architecture
						</p>
					</div>

					<div className="text-center p-6 bg-white rounded-lg shadow-sm border border-yellow-200">
						<div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center mx-auto mb-4">
							<Clock className="w-6 h-6 text-yellow-600" />
						</div>
						<h3 className="font-semibold text-foreground mb-2">Real-time Routing</h3>
						<p className="text-sm text-muted-foreground">
							AI-powered route optimization finds the best path considering speed, cost, and security
						</p>
					</div>
				</motion.div>

				{/* Call to Action */}
				<motion.div
					className="text-center mt-12"
					initial={{ opacity: 0, y: 30 }}
					whileInView={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.8, delay: 0.5 }}
				>
					<button className="inline-flex items-center space-x-2 bg-gradient-to-r from-yellow-400 to-yellow-500 text-black px-6 py-3 rounded-full font-medium hover:shadow-lg transition-shadow duration-300">
						<span>Start Routing Cross-Chain</span>
						<ArrowRight className="w-4 h-4" />
					</button>
				</motion.div>
			</div>
		</div>
	);
}