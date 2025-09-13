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
			{/* Multiple connection handles for mesh network */}
			<Handle
				type="target"
				position={Position.Top}
				style={{ background: "#555", border: "none" }}
				id="top"
			/>
			<Handle
				type="target"
				position={Position.Left}
				style={{ background: "#555", border: "none" }}
				id="left"
			/>
			<Handle
				type="target"
				position={Position.Right}
				style={{ background: "#555", border: "none" }}
				id="right"
			/>
			<Handle
				type="target"
				position={Position.Bottom}
				style={{ background: "#555", border: "none" }}
				id="bottom"
			/>

			<motion.div
				initial={{ scale: 0 }}
				animate={{ scale: 1 }}
				transition={{ duration: 0.5 }}
				className={`
					px-4 py-3 rounded-xl shadow-lg border-2 cursor-pointer
					transition-all duration-300 hover:shadow-xl hover:scale-105
					${data.isHub ? 'border-yellow-400 bg-card' : 'border-border bg-card'}
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
						<div className="font-semibold text-sm text-foreground">
							{data.label}
						</div>
						<div className="text-xs text-muted-foreground">
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

			{/* Source handles */}
			<Handle
				type="source"
				position={Position.Top}
				style={{ background: "#555", border: "none" }}
				id="top-out"
			/>
			<Handle
				type="source"
				position={Position.Left}
				style={{ background: "#555", border: "none" }}
				id="left-out"
			/>
			<Handle
				type="source"
				position={Position.Right}
				style={{ background: "#555", border: "none" }}
				id="right-out"
			/>
			<Handle
				type="source"
				position={Position.Bottom}
				style={{ background: "#555", border: "none" }}
				id="bottom-out"
			/>
		</div>
	);
};

const nodeTypes = {
	networkNode: NetworkNode,
};

export function CrossChainVisualization() {
	// Simplified nodes focusing on key networks
	const initialNodes: Node[] = [
		{
			id: "ethereum",
			type: "networkNode",
			position: { x: 200, y: 100 },
			data: {
				label: "Ethereum",
				symbol: "ETH",
				color: "bg-blue-500"
			}
		},
		{
			id: "bnb",
			type: "networkNode",
			position: { x: 600, y: 100 },
			data: {
				label: "BNB Chain",
				symbol: "BNB",
				color: "bg-yellow-600"
			}
		},
		{
			id: "polygon",
			type: "networkNode",
			position: { x: 400, y: 100 },
			data: {
				label: "Polygon",
				symbol: "MATIC",
				color: "bg-purple-500"
			}
		},
		{
			id: "yellow",
			type: "networkNode",
			position: { x: 400, y: 300 },
			data: {
				label: "Yellow Network",
				symbol: "YELLOW",
				color: "bg-yellow-500",
				isHub: true
			}
		}
	];

	// Simplified edges showing key paths to Yellow Network
	const initialEdges: Edge[] = [
		// Direct connections to Yellow Network (fastest & cheapest)
		{
			id: "e-yellow-ethereum",
			source: "yellow",
			target: "ethereum",
			animated: true,
			style: { stroke: "#10b981", strokeWidth: 3 },
			markerEnd: {
				type: MarkerType.ArrowClosed,
				color: "#10b981"
			},
			label: "Fastest Route"
		},
		{
			id: "e-yellow-bnb",
			source: "yellow",
			target: "bnb",
			animated: true,
			style: { stroke: "#f59e0b", strokeWidth: 3 },
			markerEnd: {
				type: MarkerType.ArrowClosed,
				color: "#f59e0b"
			},
			label: "Cheapest Route"
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
		}
	];

	const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
	const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

	return (
		<div className="w-full bg-background py-24">
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
					className="bg-card border border-border rounded-2xl shadow-2xl overflow-hidden"
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
						<Background color="#374151" gap={20} />
						<Controls />
						<MiniMap
							nodeColor={(node) => {
								if (node.data?.isHub) return "#facc15";
								return "#94a3b8";
							}}
							pannable
							zoomable
							style={{
								backgroundColor: '#1f2937',
								border: '1px solid #374151'
							}}
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
					<div className="text-center p-6 bg-card rounded-lg shadow-sm border border-border">
						<div className="w-12 h-12 bg-yellow-500/10 rounded-lg flex items-center justify-center mx-auto mb-4">
							<Zap className="w-6 h-6 text-yellow-500" />
						</div>
						<h3 className="font-semibold text-foreground mb-2">Lightning Fast</h3>
						<p className="text-sm text-muted-foreground">
							State channels enable instant cross-chain settlements without waiting for block confirmations
						</p>
					</div>

					<div className="text-center p-6 bg-card rounded-lg shadow-sm border border-border">
						<div className="w-12 h-12 bg-yellow-500/10 rounded-lg flex items-center justify-center mx-auto mb-4">
							<Shield className="w-6 h-6 text-yellow-500" />
						</div>
						<h3 className="font-semibold text-foreground mb-2">Bridge-less Security</h3>
						<p className="text-sm text-muted-foreground">
							Eliminate traditional bridge risks with Yellow Network&apos;s peer-to-peer mesh architecture
						</p>
					</div>

					<div className="text-center p-6 bg-card rounded-lg shadow-sm border border-border">
						<div className="w-12 h-12 bg-yellow-500/10 rounded-lg flex items-center justify-center mx-auto mb-4">
							<Clock className="w-6 h-6 text-yellow-500" />
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
					<button className="inline-flex items-center space-x-2 bg-gradient-to-r from-yellow-400 to-yellow-500 text-black px-6 py-3 rounded-full font-medium hover:shadow-lg transition-all duration-300 hover:scale-105">
						<span>Start Routing Cross-Chain</span>
						<ArrowRight className="w-4 h-4" />
					</button>
				</motion.div>
			</div>
		</div>
	);
}