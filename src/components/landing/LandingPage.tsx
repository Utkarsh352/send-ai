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
					Google Maps for Cross-Chain
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
						<Image
							src="/red_logo.svg"
							alt="Send-AI Logo"
							width={32}
							height={32}
							className="h-8 w-8 object-contain"
						/>
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

			<div className="container items-center max-w-lg text-center flex flex-col w-full mt-24 mb-48">
				<p className="relative -mb-2 z-20 bg-gradient-to-b text-yellow-500 bg-clip-text py-8 text-4xl font-thin sm:text-7xl">Send-AI</p>
				<p className="text-lg font-light text-foreground">
					<span className="text-yellow-500 font-semibold">Cross</span>-chain <span className="text-yellow-500 font-semibold">Route</span> optimization powered by <span className="text-yellow-500 font-semibold">A</span>rtificial <span className="text-yellow-500 font-semibold">I</span>ntelligence
				</p>
			</div>


			<div className="justify-center mb-36 container w-full px-24 items-center flex flex-col">
				{/*<div className="w-full h-0.5 bg-accent my-8 z-40"></div>*/}
				{/* We limit the width here for a cleaner, centered look */}
				<Accordion type="single" collapsible className="w-full max-w-3xl mx-auto space-y-2">
					<AccordionItem value="what">
						<AccordionTrigger className="text-3xl font-medium">
							What?
						</AccordionTrigger>
						<AccordionContent>
							<p className="text-base text-muted-foreground mt-2">
								We build intelligent routing systems that find the optimal paths for <strong>cross-chain transactions</strong> through intuitive conversational interfaces powered by <strong>Yellow Network</strong>. Rather than manually searching for bridges and exchanges,
								our AI agent finds the best routes, lowest fees, and fastest settlement times using plain language commands.
							</p>
						</AccordionContent>
					</AccordionItem>

					<AccordionItem value="how">
						<AccordionTrigger className="text-3xl font-medium">
							How?
						</AccordionTrigger>
						<AccordionContent>
							<p className="text-base text-muted-foreground mt-2">
								Connect your wallet and describe where you want to send assets using natural language.
								Our AI analyzes multiple routes across Yellow Network&apos;s state channels, traditional bridges, and DEX aggregators
								to find the optimal path considering speed, cost, and security for your cross-chain transaction.
							</p>
						</AccordionContent>
					</AccordionItem>

					<AccordionItem value="why">
						<AccordionTrigger className="text-3xl font-medium">
							Why?
						</AccordionTrigger>
						<AccordionContent>
							<p className="text-base text-muted-foreground mt-2">
								Cross-chain transactions are fragmented across hundreds of bridges and protocols, each with different risks and costs.
								We&apos;re committed to making cross-chain finance accessible to <strong>all users</strong>.
								Like Google Maps finds the best driving routes, Send-AI finds the optimal paths for moving assets across blockchains,
								saving you time, money, and reducing the complexity of multi-chain DeFi.
							</p>
						</AccordionContent>
					</AccordionItem>
				</Accordion>
			</div>



			{/* Footer */}


			<footer className="m-8 text-sm opacity-70 pb-8">
				Powered by Yellow Network • Cross-Chain Route Optimization & Artificial Intelligence
			</footer>
		</div>
	);
}