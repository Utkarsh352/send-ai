"use client";
import { useRouter } from "next/navigation";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { useEffect, useState } from "react";
import { useAccount, useChainId, useSwitchChain } from "wagmi";
import { yellowTestnet } from "@/providers/config";
import { Button } from "@/components/ui/button";
import Link from "next/link";

import {
	Accordion,
	AccordionContent,
	AccordionItem,
	AccordionTrigger,
} from "@/components/ui/accordion";

import { motion } from "framer-motion";
import { LampContainer } from "../ui/lamp";
import { Textarea } from "../ui/textarea";
import Image from "next/image";
import { Loader2, Plus } from "lucide-react";
import { CrossChainVisualization } from "./CrossChainVisualization";
import UsageApplicationCards from "./UsageApplicationCards";

export default function LandingPage() {
	const chainId = useChainId();
	const { switchChain } = useSwitchChain();
	const { address, isConnected } = useAccount();
	const router = useRouter();
	const [isLoading, setIsLoading] = useState(false);
	const [hasLoaded, setHasLoaded] = useState(false);

	useEffect(() => {
		setHasLoaded(true);
	}, []);

	useEffect(() => {
		if (isConnected && chainId !== yellowTestnet.id) {
			switchChain?.({ chainId: yellowTestnet.id });
		}
	}, [chainId, isConnected, switchChain]);

	return (
		<div className="container min-h-screen flex flex-col items-center text-foreground">
			<LampContainer className="px-6 pt-48">
				<motion.h1
					initial={{ opacity: 0, y: 50 }}
					animate={hasLoaded ? { opacity: 1, y: 0 } : {}}
					transition={{
						delay: 0.3,
						duration: 0.8,
						ease: "easeInOut",
					}}
					className="bg-gradient-to-t pb-4 z-40 font-bold from-neutral-400 to-neutral-100  bg-clip-text text-transparent text-4xl tracking-tight md:text-7xl text-center leading-[1.2]"
				>
					Maps for Cross-Chain Transactions
				</motion.h1>

				<p className="font-normal text-lg text-muted-foreground tracking-normal mt-1 mb-8 max-w-xl mx-auto text-center">
					Find the best routes for cross-chain transactions. <br /> Powered by Yellow Network & AI-driven path optimization
				</p>

				{/* Action Buttons */}

				{/* Connect or Start Button */}
				<div className="mt-8">
					{isConnected ? (
						<Button
							onClick={() => {
								setIsLoading(true);
								router.push("/home");
							}}
							disabled={isLoading}
							className="rounded-full"
						>
							Start
							{isLoading && <Loader2 className="animate-spin ml-2 w-4 h-4"/>}
						</Button>
					) : (
						<ConnectButton chainStatus="icon" showBalance={false} label="Connect Wallet" />
					)}
				</div>

				{/* Example Chat Prompt */}
				<div className="mt-12 w-full mx-auto">
					<div className="flex items-center gap-4 mb-4">
						<div className="relative">
							<div className="w-10 h-10 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-xl flex items-center justify-center shadow-lg">
								<svg width="18" height="18" viewBox="0 0 16 16" fill="none">
									<path d="M2 8L8 2L14 8L8 14L2 8Z" fill="white"/>
									<path d="M8 4L12 8L8 12L4 8L8 4Z" fill="rgba(0,0,0,0.2)"/>
								</svg>
							</div>
							<div className="absolute -top-1 -right-1 w-4 h-4 bg-yellow-500 rounded-full border-2 border-white"></div>
						</div>
						<p className="text-lg text-muted-foreground">
							Where would you like to send your assets across chains?
						</p>
					</div>
					<Textarea
						autoComplete="off"
						name="message"
						className="pointer-events-none shadow-2xl bg-accent resize-none text-orange-500 text-bold text-xl px-4 py-6 placeholder:text-zinc-100 disabled:opacity-50 w-full rounded-md"
						placeholder="Send 100 USDC from Ethereum to Polygon..."
					/>
				</div>



				<div className="grid grid-cols-2 pt-12 gap-4 w-full mx-auto">
					<Button variant="outline" disabled={true}>CROSS-CHAIN SEND</Button>
					<Button variant="outline" disabled={true}>ROUTE FINDER</Button>
					<Button variant="outline" disabled={true}>BRIDGE ASSETS</Button>
					<Button variant="outline" disabled={true}>YIELD FARMING</Button>
					<Button variant="outline" className="col-span-2" disabled={true}>DEFI PROTOCOL EXPLORER</Button>
				</div>
			</LampContainer>

			<div className="container items-center max-w-4xl text-center flex flex-col w-full mt-32 mb-24">
				<motion.div
					initial={{ opacity: 0, y: 30 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ delay: 0.5, duration: 0.8 }}
					className="relative"
				>
					<h2 className="relative z-20 bg-gradient-to-b from-yellow-400 via-yellow-500 to-amber-600 bg-clip-text text-transparent py-4 text-5xl font-medium sm:text-8xl tracking-tight">
						Send-AI
					</h2>
					<div className="absolute inset-0 bg-gradient-to-r from-yellow-400/20 to-amber-500/20 blur-3xl -z-10" />
				</motion.div>

				<motion.p
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ delay: 0.7, duration: 0.6 }}
					className="text-xl sm:text-2xl font-light text-muted-foreground max-w-3xl leading-relaxed mt-6"
				>
					<span className="text-yellow-400 font-medium">Maps</span> for{" "}
					<span className="text-yellow-400 font-medium">Cross-chain</span> transactions powered by{" "}
					<span className="text-yellow-400 font-medium">AI</span>
				</motion.p>

				<motion.div
					initial={{ opacity: 0, scale: 0.8 }}
					animate={{ opacity: 1, scale: 1 }}
					transition={{ delay: 0.9, duration: 0.5 }}
					className="mt-8 flex items-center gap-2 text-sm text-muted-foreground"
				>
					<div className="w-2 h-2 bg-yellow-500 rounded-full animate-pulse" />
					<span>Revolutionizing cross-chain finance</span>
					<div className="w-2 h-2 bg-yellow-500 rounded-full animate-pulse" />
				</motion.div>
			</div>



			{/* Usage Application Cards */}
			<UsageApplicationCards />

			{/* Cross-Chain Visualization */}
			<CrossChainVisualization />

			{/* Footer */}
			<footer className="m-8 text-sm opacity-70 pb-8">
				Powered by Yellow Network • Cross-Chain Route Optimization & Artificial Intelligence
			</footer>
		</div>
	);
}