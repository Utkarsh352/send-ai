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

// Enhanced custom node component for blockchain networks
const NetworkNode: React.FC<NodeProps> = ({ data }) => {
	return (
		<div className="relative">
			{/* Connection handles - hidden but functional */}
			<Handle
				type="target"
				position={Position.Top}
				style={{ background: "transparent", border: "none", width: 1, height: 1 }}
				id="top"
			/>
			<Handle
				type="target"
				position={Position.Left}
				style={{ background: "transparent", border: "none", width: 1, height: 1 }}
				id="left"
			/>
			<Handle
				type="target"
				position={Position.Right}
				style={{ background: "transparent", border: "none", width: 1, height: 1 }}
				id="right"
			/>
			<Handle
				type="target"
				position={Position.Bottom}
				style={{ background: "transparent", border: "none", width: 1, height: 1 }}
				id="bottom"
			/>

			<div className="relative group">
				{/* Glowing background effect */}
				<div className={`
					absolute -inset-2 rounded-2xl blur-lg opacity-30 group-hover:opacity-50 transition-opacity duration-300
					${data.isHub
						? 'bg-gradient-to-r from-yellow-400 to-amber-500'
						: `bg-gradient-to-r ${data.gradient}`
					}
				`} />

				{/* Main node container */}
				<div className={`
					relative px-6 py-4 rounded-2xl shadow-xl border-2 cursor-pointer backdrop-blur-sm
					transition-all duration-300 hover:shadow-2xl hover:scale-110 hover:-translate-y-2
					${data.isHub
						? 'border-yellow-400/60 bg-gradient-to-br from-yellow-500/20 to-amber-600/20 bg-card/80'
						: 'border-white/20 bg-card/90'
					}
				`}
				style={{ minWidth: '140px' }}
				>
					{/* Network icon container */}
					<div className="flex flex-col items-center gap-3">
						<div className={`
							relative w-16 h-16 rounded-2xl flex items-center justify-center shadow-lg
							bg-gradient-to-br ${data.gradient}
							group-hover:shadow-xl transition-shadow duration-300
						`}>
							{/* Network logo placeholder */}
							<span className="text-white font-bold text-xl tracking-tight">
								{data.symbol.slice(0, 2)}
							</span>

							{/* Pulse effect for hub */}
							{data.isHub && (
								<div className="absolute inset-0 rounded-2xl bg-yellow-400/30 animate-pulse" />
							)}
						</div>

						{/* Network details */}
						<div className="text-center space-y-1">
							<div className="font-bold text-base text-foreground group-hover:text-yellow-400 transition-colors">
								{data.label}
							</div>
							<div className="text-xs text-muted-foreground font-medium tracking-wide">
								{data.symbol}
							</div>
							{data.amount && (
								<div className={`text-xs font-bold px-2 py-1 rounded-full ${
									data.isSource ? 'bg-blue-500/20 text-blue-400' :
									data.isDestination ? 'bg-purple-500/20 text-purple-400' :
									'bg-green-500/20 text-green-400'
								}`}>
									{data.amount}
								</div>
							)}
							{data.routeInfo && (
								<div className="text-xs text-yellow-400 font-semibold">
									{data.routeInfo}
								</div>
							)}
						</div>

						{/* Route status indicator */}
						<div className="flex items-center gap-2">
							{data.isSource && (
								<>
									<div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse" />
									<span className="text-xs text-blue-400 font-medium">Source</span>
								</>
							)}
							{data.isDestination && (
								<>
									<div className="w-2 h-2 bg-purple-400 rounded-full animate-pulse" />
									<span className="text-xs text-purple-400 font-medium">Destination</span>
								</>
							)}
							{data.isHub && !data.isSource && !data.isDestination && (
								<>
									<div className="w-2 h-2 bg-yellow-400 rounded-full animate-pulse" />
									<span className="text-xs text-yellow-400 font-medium">Router</span>
								</>
							)}
						</div>
					</div>

					{/* Hub indicator */}
					{data.isHub && (
						<div className="absolute -top-3 -right-3">
							<div className="w-6 h-6 bg-gradient-to-r from-yellow-400 to-amber-500 rounded-full flex items-center justify-center shadow-lg animate-spin">
								<div className="w-2 h-2 bg-white rounded-full" />
							</div>
						</div>
					)}
				</div>
			</div>

			{/* Source handles - hidden but functional */}
			<Handle
				type="source"
				position={Position.Top}
				style={{ background: "transparent", border: "none", width: 1, height: 1 }}
				id="top-out"
			/>
			<Handle
				type="source"
				position={Position.Left}
				style={{ background: "transparent", border: "none", width: 1, height: 1 }}
				id="left-out"
			/>
			<Handle
				type="source"
				position={Position.Right}
				style={{ background: "transparent", border: "none", width: 1, height: 1 }}
				id="right-out"
			/>
			<Handle
				type="source"
				position={Position.Bottom}
				style={{ background: "transparent", border: "none", width: 1, height: 1 }}
				id="bottom-out"
			/>
		</div>
	);
};

const nodeTypes = {
	networkNode: NetworkNode,
};

export function CrossChainVisualization() {
	// Route visualization nodes - showing a specific transaction route
	const initialNodes: Node[] = [
		{
			id: "ethereum",
			type: "networkNode",
			position: { x: 100, y: 100 },
			data: {
				label: "Ethereum",
				symbol: "ETH",
				gradient: "from-blue-400 to-blue-600",
				amount: "1,000 USDC",
				isSource: true
			}
		},
		{
			id: "yellow",
			type: "networkNode",
			position: { x: 350, y: 100 },
			data: {
				label: "Yellow Network",
				symbol: "YELLOW",
				gradient: "from-yellow-400 to-amber-500",
				isHub: true,
				routeInfo: "Routing Hub"
			}
		},
		{
			id: "polygon",
			type: "networkNode",
			position: { x: 600, y: 100 },
			data: {
				label: "Polygon",
				symbol: "MATIC",
				gradient: "from-purple-400 to-purple-600",
				amount: "998 USDC",
				isDestination: true
			}
		}
	];

	// Route edges showing the transaction path
	const initialEdges: Edge[] = [
		// Step 1: From Ethereum to Yellow Network
		{
			id: "route-step-1",
			source: "ethereum",
			target: "yellow",
			animated: true,
			style: {
				stroke: "url(#gradient-route)",
				strokeWidth: 6,
				strokeDasharray: "10,5"
			},
			markerEnd: {
				type: MarkerType.ArrowClosed,
				color: "#10b981",
				width: 25,
				height: 25
			},
			label: "Step 1: Bridge to Yellow",
			labelStyle: {
				fill: "#10b981",
				fontWeight: 700,
				fontSize: 14,
				background: "rgba(0,0,0,0.9)",
				padding: "4px 8px",
				borderRadius: "6px",
				border: "1px solid #10b981"
			},
			labelBgBorderRadius: 6,
			labelBgPadding: [8, 4]
		},
		// Step 2: From Yellow Network to Polygon
		{
			id: "route-step-2",
			source: "yellow",
			target: "polygon",
			animated: true,
			style: {
				stroke: "url(#gradient-route)",
				strokeWidth: 6,
				strokeDasharray: "10,5"
			},
			markerEnd: {
				type: MarkerType.ArrowClosed,
				color: "#10b981",
				width: 25,
				height: 25
			},
			label: "Step 2: Deliver to Polygon",
			labelStyle: {
				fill: "#10b981",
				fontWeight: 700,
				fontSize: 14,
				background: "rgba(0,0,0,0.9)",
				padding: "4px 8px",
				borderRadius: "6px",
				border: "1px solid #10b981"
			},
			labelBgBorderRadius: 6,
			labelBgPadding: [8, 4]
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
						Cross-Chain Route Visualization
					</motion.h2>
					<motion.p
						initial={{ opacity: 0, y: 30 }}
						whileInView={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.8, delay: 0.2 }}
						className="text-lg text-muted-foreground max-w-2xl mx-auto"
					>
						Watch how your assets move from Ethereum to Polygon through Yellow Network's optimized routing
					</motion.p>
				</div>

				{/* Enhanced React Flow Graph */}
				<motion.div
					initial={{ opacity: 0, scale: 0.95 }}
					whileInView={{ opacity: 1, scale: 1 }}
					transition={{ duration: 0.8 }}
					className="relative group"
				>
					{/* Glowing border effect */}
					<div className="absolute -inset-1 bg-gradient-to-r from-yellow-400/30 via-blue-500/30 to-purple-500/30 rounded-3xl blur opacity-40 group-hover:opacity-60 transition-opacity duration-500" />

					{/* Main container */}
					<div className="relative bg-gradient-to-br from-slate-900/90 to-slate-800/90 border border-slate-700/50 rounded-2xl shadow-2xl overflow-hidden backdrop-blur-sm"
						style={{ height: "600px" }}
					>
						{/* Header with route indicator */}
						<div className="absolute top-0 left-0 right-0 z-10 bg-gradient-to-b from-slate-900/80 to-transparent p-4">
							<div className="flex items-center justify-between">
								<div className="flex items-center gap-3">
									<div className="w-3 h-3 bg-green-400 rounded-full animate-pulse" />
									<span className="text-green-400 text-sm font-semibold">Live Route Simulation</span>
								</div>
								<div className="flex items-center gap-4 text-xs">
									<div className="flex items-center gap-2">
										<div className="w-2 h-2 bg-blue-400 rounded-full" />
										<span className="text-blue-400">Source Chain</span>
									</div>
									<div className="flex items-center gap-2">
										<div className="w-2 h-2 bg-yellow-400 rounded-full" />
										<span className="text-yellow-400">Router</span>
									</div>
									<div className="flex items-center gap-2">
										<div className="w-2 h-2 bg-purple-400 rounded-full" />
										<span className="text-purple-400">Destination</span>
									</div>
								</div>
							</div>
						</div>

						<ReactFlow
							nodes={nodes}
							edges={edges}
							onNodesChange={onNodesChange}
							onEdgesChange={onEdgesChange}
							nodeTypes={nodeTypes}
							fitView
							proOptions={{ hideAttribution: true }}
							defaultViewport={{ x: 0, y: 0, zoom: 0.9 }}
							style={{ background: 'transparent' }}
						>
							{/* SVG Gradients for route edges */}
							<defs>
								<linearGradient id="gradient-route" x1="0%" y1="0%" x2="100%" y2="0%">
									<stop offset="0%" stopColor="#10b981" stopOpacity="1" />
									<stop offset="50%" stopColor="#34d399" stopOpacity="0.9" />
									<stop offset="100%" stopColor="#10b981" stopOpacity="1" />
								</linearGradient>
							</defs>

							<Background
								color="#475569"
								gap={25}
								size={1}
								style={{ opacity: 0.4 }}
							/>
							<Controls
								style={{
									background: 'rgba(15,23,42,0.9)',
									border: '1px solid #475569',
									borderRadius: '12px',
									color: '#e2e8f0'
								}}
							/>
							<MiniMap
								nodeColor={(node) => {
									if (node.data?.isHub) return "#fbbf24";
									return "#64748b";
								}}
								pannable
								zoomable
								style={{
									backgroundColor: 'rgba(15,23,42,0.9)',
									border: '1px solid #475569',
									borderRadius: '8px'
								}}
							/>
						</ReactFlow>

						{/* Bottom route stats */}
						<div className="absolute bottom-0 left-0 right-0 z-10 bg-gradient-to-t from-slate-900/80 to-transparent p-4">
							<div className="flex items-center justify-center gap-8 text-sm">
								<div className="text-center">
									<div className="text-2xl font-bold text-green-400">2</div>
									<div className="text-slate-400 text-xs">Route Steps</div>
								</div>
								<div className="text-center">
									<div className="text-2xl font-bold text-blue-400">~4s</div>
									<div className="text-slate-400 text-xs">Est. Time</div>
								</div>
								<div className="text-center">
									<div className="text-2xl font-bold text-yellow-400">$2.00</div>
									<div className="text-slate-400 text-xs">Total Fee</div>
								</div>
								<div className="text-center">
									<div className="text-2xl font-bold text-purple-400">998</div>
									<div className="text-slate-400 text-xs">USDC Out</div>
								</div>
							</div>
						</div>
					</div>
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