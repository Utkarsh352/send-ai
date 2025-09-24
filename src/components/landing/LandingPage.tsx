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
import { PayrollDashboardPreview } from "./PayrollDashboardPreview";
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
		<div className="w-full min-h-screen text-foreground">
			<LampContainer className="px-6 pt-24 pb-16">
				<motion.h1
					initial={{ opacity: 0, y: 50 }}
					animate={hasLoaded ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
					transition={{
						delay: 0.3,
						duration: 0.8,
						ease: "easeInOut",
					}}
					className="bg-gradient-to-t pb-4 z-40 font-bold from-neutral-300 to-white bg-clip-text text-transparent text-4xl tracking-tight md:text-6xl lg:text-7xl text-center leading-[1.1] max-w-5xl mx-auto"
				>
					Hourly Pay, Redeems Instantly
				</motion.h1>

				<p className="font-normal text-lg md:text-xl text-muted-foreground tracking-normal mt-4 mb-12 max-w-2xl mx-auto text-center leading-relaxed">
					Work by the hour, access your earnings every hour. <br /> Powered by Nitrolite Protocol & Yellow Network SDK
				</p>

				{/* Action Buttons */}
				<div className="mt-8 flex justify-center items-center gap-4">
					<Button
						onClick={() => {
							setIsLoading(true);
							router.push("/dashboard/login");
						}}
						disabled={isLoading}
						size="lg"
						className="rounded-full bg-gradient-to-r from-yellow-500 to-amber-600 hover:from-yellow-600 hover:to-amber-700 px-8 py-4 text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
					>
						Get Started
						{isLoading && <Loader2 className="animate-spin ml-2 w-4 h-4"/>}
					</Button>
					<Button
						onClick={() => {
							router.push("/dashboard/employee-portal");
						}}
						size="lg"
						variant="outline"
						className="rounded-full border-2 border-yellow-500 hover:bg-yellow-500/10 px-8 py-4 text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
					>
						Employee Portal
					</Button>
				</div>

				{/* Example Interface Preview */}
				<div className="mt-16 w-full max-w-2xl mx-auto">
					<div className="flex items-center gap-4 mb-6">
						<div className="relative">
							<div className="w-10 h-10 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-xl flex items-center justify-center shadow-lg">
								<svg width="18" height="18" viewBox="0 0 16 16" fill="none">
									<path d="M2 8L8 2L14 8L8 14L2 8Z" fill="white"/>
									<path d="M8 4L12 8L8 12L4 8L8 4Z" fill="rgba(0,0,0,0.2)"/>
								</svg>
							</div>
							<div className="absolute -top-1 -right-1 w-4 h-4 bg-yellow-500 rounded-full border-2 border-white"></div>
						</div>
						<p className="text-lg text-muted-foreground font-medium">
							Track your hourly earnings and redeem instantly
						</p>
					</div>
					<div className="relative">
						<Textarea
							autoComplete="off"
							name="message"
							className="pointer-events-none shadow-2xl bg-card border border-border/50 resize-none text-yellow-600 dark:text-yellow-400 font-semibold text-xl px-6 py-6 placeholder:text-muted-foreground/70 w-full rounded-xl backdrop-blur-sm"
							placeholder="Redeem $25.50 earned in the last hour..."
							rows={3}
						/>
						<div className="absolute top-4 right-4 w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
					</div>
				</div>



				<div className="grid grid-cols-2 pt-12 gap-4 w-full mx-auto">
					<Button variant="outline" disabled={true}>HOURLY TRACKING</Button>
					<Button variant="outline" disabled={true}>INSTANT REDEMPTION</Button>
					<Button variant="outline" disabled={true}>PAYMENT STREAMING</Button>
					<Button variant="outline" disabled={true}>NITROLITE CHANNELS</Button>
					<Button variant="outline" className="col-span-2" disabled={true}>YELLOW SDK INTEGRATION</Button>
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
					Why wait for payday when you're paid{" "}
					<span className="text-yellow-400 font-medium">hourly?</span> Get your{" "}
					<span className="text-yellow-400 font-medium">earnings</span> every hour
				</motion.p>

				<motion.div
					initial={{ opacity: 0, scale: 0.8 }}
					animate={{ opacity: 1, scale: 1 }}
					transition={{ delay: 0.9, duration: 0.5 }}
					className="mt-8 flex items-center gap-2 text-sm text-muted-foreground"
				>
					<div className="w-2 h-2 bg-yellow-500 rounded-full animate-pulse" />
					<span>Never run out of money mid-month again</span>
					<div className="w-2 h-2 bg-yellow-500 rounded-full animate-pulse" />
				</motion.div>
			</div>



			{/* Usage Application Cards */}
			<UsageApplicationCards />

			{/* Payroll Dashboard Preview */}
			<PayrollDashboardPreview />

			{/* Footer */}
			<footer className="m-8 text-sm opacity-70 pb-8">
				Powered by Nitrolite Protocol & Yellow Network SDK • Instant Access to Hourly Earnings
			</footer>
		</div>
	);
}