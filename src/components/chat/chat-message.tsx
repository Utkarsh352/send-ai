import { CheckIcon, CopyIcon } from "@radix-ui/react-icons";
import { ChatRequestOptions, ToolInvocation } from "ai";
import { Message } from "ai/react";
import { motion } from "framer-motion";
import { RefreshCcw } from "lucide-react";
import Image from "next/image";
import { memo, useMemo, useRef, useState } from "react";
import Markdown from "react-markdown";
import remarkGfm from "remark-gfm";
import ButtonWithTooltip from "../button-with-tooltip";
import CodeDisplayBlock from "../code-display-block";
import { Button } from "../ui/button";
import {
	ChatBubble,
	ChatBubbleAvatar,
	ChatBubbleMessage,
} from "../ui/chat/chat-bubble";
import { ConfirmationDialog } from "../ui/ConfirmationDialog";
import { Address } from "viem";
import { CrossChainRouteInvocation } from "./CrossChainRouteInvocation";
import { MultiChainPortfolioInvocation } from "./MultiChainPortfolioInvocation";
import { SwapRouteVisualization } from "./SwapRouteVisualization";

// shadcn Dialog imports
import { useAccount, useBalance, useSendTransaction, useWaitForTransactionReceipt, useWriteContract } from "wagmi";
import ToolExecutor from "./ToolExecutor";
import { createPublicClient, http, parseEther, parseUnits } from "viem";
import { abiApprouve } from "@/constants/abi";
import { getToken } from "@/constants/tokenInfo";
import {
	ChainId,
	Token,
	TokenAmount,
	Percent,
} from "@traderjoe-xyz/sdk-core";
import {
	PairV2,
	RouteV2,
	TradeV2,
	TradeOptions,
	LB_ROUTER_V22_ADDRESS,
	jsonAbis,
} from "@traderjoe-xyz/sdk-v2";

import { mainnet } from "viem/chains";
import SendResultDialog from "./SendResultDialog";

export type ChatMessageProps = {
	message: Message;
	isLast: boolean;
	isLoading: boolean | undefined;
	reload: (chatRequestOptions?: ChatRequestOptions) => Promise<string | null | undefined>;
	addToolResult?: (args: { toolCallId: string; result: string }) => void;
};

const MOTION_CONFIG = {
	initial: { opacity: 0, scale: 1, y: 20, x: 0 },
	animate: { opacity: 1, scale: 1, y: 0, x: 0 },
	exit: { opacity: 0, scale: 1, y: 20, x: 0 },
	transition: {
		opacity: { duration: 0.1 },
		layout: {
			type: "spring",
			bounce: 0.3,
			duration: 0.2,
		},
	},
};

// --------------- HELPER COMPONENTS ---------------

// The final card once the send is complete
//TODO A AMELIORER
function SendCompleteCard({ result, action }: { result: string, action: string }) {
	const [dialogOpen, setDialogOpen] = useState(false);

	return (
		<div className="border w-full border-border p-4 mb-8 rounded-md shadow-sm">
			<p className="font-semibold text-sm mb-2">{action} complete</p>
			<p className="text-xs">Your {action} was processed successfully.</p>
			<div className="mt-6">
				<SendResultDialog open={dialogOpen} onOpenChange={setDialogOpen} result={result} />
			</div>
		</div>
	);
}

// --------------- MAIN COMPONENT ---------------

function ChatMessage({
	message,
	isLast,
	isLoading,
	reload,
	addToolResult,
}: ChatMessageProps) {
	const [isCopied, setIsCopied] = useState<boolean>(false);


	// Clean up the content, removing <think> tags
	const { cleanContent } = useMemo(() => {
		return {
			cleanContent: message.content
				.replace(/<think>[\s\S]*?(?:<\/think>|$)/g, "")
				.trim(),
		};
	}, [message.content]);

	const contentParts = useMemo(() => cleanContent.split("```"), [cleanContent]);

	const handleCopy = () => {
		navigator.clipboard.writeText(message.content);
		setIsCopied(true);
		setTimeout(() => setIsCopied(false), 1500);
	};

	const renderContent = () => (
		contentParts.map((part, index) =>
			index % 2 === 0 ? (
				<Markdown key={index} remarkPlugins={[remarkGfm]}>
					{part}
				</Markdown>
			) : (
				<pre className="whitespace-pre-wrap" key={index}>
					<CodeDisplayBlock code={part} />
				</pre>
			)
		)
	);

	const { address } = useAccount();


	const dataBalance = useBalance({
		address,
		chainId: 43113,
	})

	const { data: dataSend, sendTransactionAsync } = useSendTransaction();

	const { data: dataSwap, writeContractAsync } = useWriteContract();

	
	const renderToolInvocations = () => {

		if (!message.toolInvocations) return null;

		console.log("===> message.toolInvocations", message.toolInvocations);

		return message.toolInvocations.map((toolInvocation: ToolInvocation) => {
			const { toolCallId, toolName } = toolInvocation;


			const confirmResult = (result: string) => {
				if (!addToolResult) return;
				addToolResult({ toolCallId, result });
			};

			if (toolName === "convert") {
				if (!("result" in toolInvocation)) {
					return (<div key={toolCallId}>Tool executing issue</div>)
				}

				return (
					<div key={toolCallId} className="mt-2">
						<SendCompleteCard result={toolInvocation.result as string} action="Convertion" />
					</div>
				);
			}

			// send tool
			if (toolName === "send") {
				// si le résultat n'existe pas encore, c'est que le tool est en cours d'exécution
				if (!("result" in toolInvocation)) {
					return (
						<ToolExecutor
							key={toolCallId}
							toolCallId={toolCallId}
							addToolResult={addToolResult}
							executeTool={async () => {
								const { to, amount } = toolInvocation.args;
								try {
									// Appel asynchrone qui lance la popup Metamask
									const hash = await sendTransactionAsync({
										to,
										value: parseEther(amount.toString()),
									});
									return JSON.stringify({
										message: "Transaction sent!",
										amount: `${amount} ETH`,
										from: address,
										to,
										hash,
										explorerLink: `https://testnet.snowtrace.io/tx/${hash}`
									});
								} catch (error) {
									console.error("Transaction cancelled or error:", error);
									// Retourne un message qui indique l'annulation ou l'erreur
									return "Transaction cancelled.";
								}
							}}
						/>
					);
				}
				if (toolInvocation.result === "Transaction cancelled.") {
					// Afficher un message d'annulation plutôt que la SendCompleteCard
					return (
						<div key={toolCallId} className="mt-2">
							<div className="border w-full border-border p-4 mb-8 rounded-md shadow-sm">
								<p className="font-semibold text-sm mb-2">Transaction Cancelled</p>
								<p className="text-xs">The transaction was cancelled.</p>
							</div>
						</div>
					);
				}

				return (
					<div key={toolCallId} className="mt-2">
						<SendCompleteCard result={toolInvocation.result as string} action="Send" />
					</div>
				);
			}


			if (toolName === "swap") {
				// If the swap tool hasn't finished executing yet…
				if (!("result" in toolInvocation)) {
					return (
						<ToolExecutor
							key={toolCallId}
							toolCallId={toolCallId}
							addToolResult={addToolResult}
							executeTool={async () => {
								try {
									// 1. Get the amount from the tool args.
									const amount = toolInvocation.args.amount; // e.g. 100 (USDC)
									const typedValue = amount.toString();

									// 2. Set chain and token details.
									const CHAIN_ID = 43113;
									const router = LB_ROUTER_V22_ADDRESS[CHAIN_ID];
									const inputToken = getToken("USDC");
									const outputToken = getToken("YELLOW");
									const typedValueParsed = parseUnits(typedValue, inputToken.decimals);
									const amountIn = new TokenAmount(inputToken, typedValueParsed);
									const BASES = [
										getToken("YELLOW"),
										getToken("USDC"),
										getToken("USDT"),
									];

									// 3. Create token pairs and routes.
									const allTokenPairs = PairV2.createAllTokenPairs(inputToken, outputToken, BASES);
									const allPairs = PairV2.initPairs(allTokenPairs);
									const allRoutes = RouteV2.createAllRoutes(allPairs, inputToken, outputToken);

									if (!address) throw new Error("User address not found");

									// 4. Create a public client (using viem) to wait for tx confirmation.
									const publicClient = createPublicClient({
										chain: mainnet,
										key: address,
										transport: http(),
									});

									// 5. Approve USDC for the router.
									const approvalTx = await writeContractAsync({
										address: getToken("USDC").address as Address,
										abi: abiApprouve,
										functionName: "approve",
										args: [router, typedValueParsed],
									});

									// Wait for the approval to be confirmed.
									await publicClient.waitForTransactionReceipt({ hash: approvalTx });

									// 6. Get trade routes for the swap.
									const trades = await TradeV2.getTradesExactIn(
										allRoutes,
										amountIn,
										outputToken,
										false,
										true,
										publicClient,
										CHAIN_ID
									);
									const validTrades = trades.filter((trade): trade is TradeV2 => trade !== undefined);
									const bestTrade = TradeV2.chooseBestTrade(validTrades, true); // isExactIn = true
									if (!bestTrade) throw new Error("No valid trade found");

									// // 7. Get fee details.
									const { totalFeePct, feeAmountIn } = await bestTrade.getTradeFee();
									const userSlippageTolerance = new Percent("200", "10000");
									const swapOptions: TradeOptions = {
										allowedSlippage: userSlippageTolerance,
										ttl: 3600,
										recipient: address,
										feeOnTransfer: false,
									};

									// // 8. Prepare swap call parameters.
									const { methodName, args, value } = bestTrade.swapCallParameters(swapOptions);

									// 9. Execute the swap.
									const { LBRouterV22ABI } = jsonAbis;
									const swapTx = await writeContractAsync({
										address: router,
										abi: LBRouterV22ABI,
										functionName: methodName,
										args: args,
										account: address,
									});
									// // Wait for swap tx confirmation.
									await publicClient.waitForTransactionReceipt({ hash: swapTx });

									// 10. Return all relevant info.
									// return `Swap executed successfully!`;
									return JSON.stringify({
										message: "Swap executed successfully!",
										amount: `${amount} USDC`,
										adress: address,
										transactionHash: swapTx,
										fee: `${feeAmountIn.toSignificant(6)} ${feeAmountIn.token.symbol}`,
										totalFeePercentage: `${totalFeePct.toSignificant(6)}%`,
										explorerLink: `https://testnet.snowtrace.io/tx/${swapTx}`
									});
								} catch (error) {
									console.error("Swap failed:", error);
									return "Transaction cancelled.";
								}
							}}
						/>
					);
				}

				// If the swap tool result is "Transaction cancelled."
				if (toolInvocation.result === "Transaction cancelled.") {
					return (
						<div key={toolCallId} className="mt-2">
							<div className="border w-full border-border p-4 mb-8 rounded-md shadow-sm">
								<p className="font-semibold text-sm mb-2">Transaction Cancelled</p>
								<p className="text-xs">The transaction was cancelled.</p>
							</div>
						</div>
					);
				}

				// Otherwise, display the new swap route visualization
				try {
					const result = JSON.parse(toolInvocation.result as string);
					if (result.showVisualization) {
						return (
							<div key={toolCallId} className="mt-2">
								<SwapRouteVisualization result={result} />
							</div>
						);
					}
				} catch (error) {
					console.error("Error parsing swap result:", error);
				}

				// Fallback to original display
				return (
					<div key={toolCallId} className="mt-2">
						<SendCompleteCard result={toolInvocation.result as string} action="Swap" />
					</div>
				);
			}



			// askForConfirmation
			if (toolName === "askForConfirmation") {

				const { actionType, message, destination, amount, tokenName } = toolInvocation.args;

				const user_adress = address;

				const parameters = {
					destination,
					user_adress,
					amount,
					tokenName,
				};


				if ("result" in toolInvocation) {
					return (
						<div key={toolCallId} className="mt-2">
							<div className="border w-full border-border p-4 mb-3 rounded-md shadow-sm">
								<p className="font-semibold text-sm mb-2">Confirmation Given</p>
								<p className="text-xs">{toolInvocation.result}</p>
							</div>
						</div>
					);
				}
				// Render dialog if not yet confirmed
				return (
					<div key={toolCallId} className="mt-2">
						<ConfirmationDialog
							actionType={actionType}
							message={message}
							parameters={parameters}
							onConfirm={() => confirmResult("Yes")}
							onCancel={() => confirmResult("No")}
							toolCallId={toolCallId}
							addToolResult={addToolResult}
						/>
					</div>
				);
			}


			if (toolName === "getYellowBalance") {
				if (!("result" in toolInvocation)) {
					return (
						<ToolExecutor
							key={toolCallId}
							toolCallId={toolCallId}
							addToolResult={addToolResult}
							executeTool={async () => {
								// Here you can perform your async operation.
								// For example, using useBalance data (make sure it's defined and fetched):
								return JSON.stringify({
									"balance": dataBalance.data?.value?.toString() || "0",
									"address": address,
									"chainId": 999999,
									"symbol": "YELLOW",
									"chain": "Yellow Network Testnet"
								});
							}}
						/>
					);
				}

				return (
					<SendCompleteCard key={toolCallId} result={toolInvocation.result as string} action="Get Yellow Balance" />
				);
			}

			// findCrossChainRoute tool
			if (toolName === "findCrossChainRoute") {
				if (!("result" in toolInvocation)) {
					return (
						<ToolExecutor
							key={toolCallId}
							toolCallId={toolCallId}
							addToolResult={addToolResult}
							executeTool={async () => {
								// Simulate async route finding
								await new Promise(resolve => setTimeout(resolve, 1000));
								return JSON.stringify({
									success: true,
									routes: [
										{
											id: "yellow-network-1",
											provider: "Yellow Network",
											type: "State Channel",
											estimatedTime: "~2 minutes",
											estimatedCost: "$1.50",
											steps: [
												{ step: 1, action: `Lock ${toolInvocation.args.amount} ${toolInvocation.args.token} in Yellow Network state channel on ${toolInvocation.args.fromChain}` },
												{ step: 2, action: `Yellow Network validates and routes through mesh network` },
												{ step: 3, action: `Unlock ${toolInvocation.args.amount} ${toolInvocation.args.token} on ${toolInvocation.args.toChain}` }
											],
											advantages: ["No traditional bridge risk", "Fastest settlement", "Lower fees"],
											risks: ["Beta network", "Limited liquidity"],
											confidence: 85
										},
										{
											id: "traditional-bridge-1",
											provider: "Polygon Bridge",
											type: "Traditional Bridge",
											estimatedTime: "~8 minutes",
											estimatedCost: "$3.20",
											steps: [
												{ step: 1, action: `Lock ${toolInvocation.args.amount} ${toolInvocation.args.token} on ${toolInvocation.args.fromChain} bridge contract` },
												{ step: 2, action: `Wait for confirmation (6-8 minutes)` },
												{ step: 3, action: `Mint wrapped ${toolInvocation.args.token} on ${toolInvocation.args.toChain}` }
											],
											advantages: ["Battle-tested", "High liquidity", "Widely supported"],
											risks: ["Bridge smart contract risk", "Longer settlement"],
											confidence: 95
										}
									],
									recommendation: {
										id: "yellow-network-1",
										provider: "Yellow Network",
										type: "State Channel"
									},
									...toolInvocation.args,
									totalRoutesFound: 2,
									analysis: "Found 2 viable routes. Yellow Network offers the fastest and cheapest option, though it's in beta."
								});
							}}
						/>
					);
				}

				try {
					const result = JSON.parse(toolInvocation.result as string);
					return (
						<div key={toolCallId} className="mt-2">
							<CrossChainRouteInvocation result={result} />
						</div>
					);
				} catch (error) {
					return (
						<div key={toolCallId} className="mt-2">
							<div className="border border-red-200 bg-red-50 p-4 rounded-md">
								<p className="text-red-800 font-semibold">Route finding failed</p>
								<p className="text-red-600 text-sm">Unable to parse route results</p>
							</div>
						</div>
					);
				}
			}

			// getMultiChainBalance tool
			if (toolName === "getMultiChainBalance") {
				if (!("result" in toolInvocation)) {
					return (
						<ToolExecutor
							key={toolCallId}
							toolCallId={toolCallId}
							addToolResult={addToolResult}
							executeTool={async () => {
								// Simulate async multi-chain balance checking
								await new Promise(resolve => setTimeout(resolve, 1500));
								const chains = ["ethereum", "polygon", "arbitrum", "yellow-testnet"];
								const balances = chains.map(chain => ({
									chain,
									chainId: chain === "ethereum" ? 1 : chain === "polygon" ? 137 : chain === "arbitrum" ? 42161 : 999999,
									tokens: [
										{
											symbol: "ETH",
											name: "Ethereum",
											balance: (Math.random() * 10).toFixed(4),
											usdValue: (Math.random() * 20000).toFixed(2),
											address: "0x0000000000000000000000000000000000000000"
										},
										{
											symbol: "USDC",
											name: "USD Coin",
											balance: (Math.random() * 1000).toFixed(2),
											usdValue: (Math.random() * 1000).toFixed(2),
											address: "0xa0b86a33e6441e6ed2072e96b6c7c0c00f3e15c1"
										}
									],
									totalUsdValue: (Math.random() * 25000).toFixed(2),
									yellowNetworkSupported: ["ethereum", "polygon", "arbitrum", "yellow-testnet"].includes(chain),
									bridgeOpportunities: Math.random() > 0.5 ? [`Bridge USDC from ${chain} for lower fees`] : []
								}));

								return JSON.stringify({
									success: true,
									userAddress: toolInvocation.args.userAddress,
									totalChainsChecked: chains.length,
									totalPortfolioValue: balances.reduce((sum, b) => sum + parseFloat(b.totalUsdValue), 0).toFixed(2),
									balances,
									yellowNetworkChains: balances.filter(b => b.yellowNetworkSupported).length,
									crossChainOpportunities: [
										"Consolidate USDC holdings using Yellow Network for minimal fees",
										"Bridge ETH from high-fee chains to L2s for better yield farming"
									],
									recommendations: [
										"Consider using Yellow Network for transfers between supported chains",
										"Diversify holdings across multiple chains for better opportunities"
									]
								});
							}}
						/>
					);
				}

				try {
					const result = JSON.parse(toolInvocation.result as string);
					return (
						<div key={toolCallId} className="mt-2">
							<MultiChainPortfolioInvocation result={result} />
						</div>
					);
				} catch (error) {
					return (
						<div key={toolCallId} className="mt-2">
							<div className="border border-red-200 bg-red-50 p-4 rounded-md">
								<p className="text-red-800 font-semibold">Portfolio check failed</p>
								<p className="text-red-600 text-sm">Unable to parse portfolio results</p>
							</div>
						</div>
					);
				}
			}

			// exploreDeFiProtocols tool
			if (toolName === "exploreDeFiProtocols") {
				if (!("result" in toolInvocation)) {
					return (
						<ToolExecutor
							key={toolCallId}
							toolCallId={toolCallId}
							addToolResult={addToolResult}
							executeTool={async () => {
								// Simulate async DeFi protocol exploration
								await new Promise(resolve => setTimeout(resolve, 1200));
								return JSON.stringify({
									success: true,
									category: toolInvocation.args.category,
									totalProtocols: 5,
									protocols: [
										{
											name: "Yellow Network DEX",
											category: "dex",
											chain: "yellow-testnet",
											tvl: 15000000,
											apy: "8.5%",
											description: "Native DEX on Yellow Network with cross-chain state channel integration",
											features: ["Gasless swaps", "Cross-chain liquidity", "State channel routing"],
											accessRoutes: ["Direct on Yellow Network", "Bridge from Ethereum via Yellow channels"],
											risks: ["Beta network", "New protocol"],
											yellowNetworkNative: true
										},
										{
											name: "Uniswap V3",
											category: "dex",
											chain: "ethereum",
											tvl: 3200000000,
											apy: "12.3%",
											description: "Leading automated market maker with concentrated liquidity",
											features: ["High liquidity", "Multiple fee tiers", "LP NFT positions"],
											accessRoutes: ["Direct on Ethereum", "Bridge via Yellow Network"],
											risks: ["Impermanent loss", "Smart contract risk"],
											yellowNetworkNative: false
										}
									],
									yellowNetworkCompatible: 2,
									crossChainOpportunities: [
										{
											strategy: "Yield Arbitrage",
											description: "Compare lending rates across chains and move capital via Yellow Network",
											estimatedApy: "2-4% additional yield",
											complexity: "Medium"
										}
									],
									recommendations: [
										"Prioritize Yellow Network compatible protocols for better cross-chain experience",
										"Always DYOR before investing in any DeFi protocol"
									]
								});
							}}
						/>
					);
				}

				try {
					const result = JSON.parse(toolInvocation.result as string);
					return (
						<div key={toolCallId} className="mt-2">
							<div className="border border-green-200 bg-green-50 p-4 rounded-md">
								<h4 className="font-semibold text-green-800 mb-2">DeFi Protocols Found</h4>
								<p className="text-green-700 text-sm mb-3">
									Found {result.totalProtocols} protocols in {result.category} category
								</p>
								<div className="space-y-2">
									{result.protocols.slice(0, 3).map((protocol: any, index: number) => (
										<div key={index} className="bg-white p-3 rounded border">
											<div className="flex justify-between items-start mb-1">
												<h5 className="font-medium">{protocol.name}</h5>
												<span className="text-sm text-gray-600">{protocol.apy} APY</span>
											</div>
											<p className="text-xs text-gray-600 mb-2">{protocol.description}</p>
											<div className="flex items-center space-x-2">
												<span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
													{protocol.chain}
												</span>
												{protocol.yellowNetworkNative && (
													<span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded">
														Yellow Native
													</span>
												)}
											</div>
										</div>
									))}
								</div>
							</div>
						</div>
					);
				} catch (error) {
					return (
						<div key={toolCallId} className="mt-2">
							<div className="border border-red-200 bg-red-50 p-4 rounded-md">
								<p className="text-red-800 font-semibold">DeFi exploration failed</p>
								<p className="text-red-600 text-sm">Unable to parse protocol results</p>
							</div>
						</div>
					);
				}
			}

			// fallback if we have other tools
			if (!("result" in toolInvocation)) {
				return (
					<div key={toolCallId} className="mt-2">
						{`Appel du tool ${toolName}...`}
					</div>
				);
			}

			return null;
		});
	};

	// Copy + Regenerate buttons
	const renderActionButtons = () =>
		message.role === "assistant" && (
			<div className="pt-2 flex gap-1 items-center text-muted-foreground">
				{!isLoading && (
					<ButtonWithTooltip side="bottom" toolTipText="Copy">
						<Button
							onClick={handleCopy}
							variant="ghost"
							size="icon"
							className="h-4 w-4"
						>
							{isCopied ? (
								<CheckIcon className="w-3.5 h-3.5 transition-all" />
							) : (
								<CopyIcon className="w-3.5 h-3.5 transition-all" />
							)}
						</Button>
					</ButtonWithTooltip>
				)}
				{!isLoading && isLast && (
					<ButtonWithTooltip side="bottom" toolTipText="Regenerate">
						<Button
							variant="ghost"
							size="icon"
							className="h-4 w-4"
							onClick={() => reload()}
						>
							<RefreshCcw className="w-3.5 h-3.5 scale-100 transition-all" />
						</Button>
					</ButtonWithTooltip>
				)}
			</div>
		);

	return (
		<motion.div {...MOTION_CONFIG} className="flex flex-col gap-2 whitespace-pre-wrap">
			<ChatBubble variant={message.role === "user" ? "sent" : "received"}>
				{message.role === "assistant" && (
					<ChatBubbleAvatar
						src={message.role === "assistant" ? "/yellow_logo.svg" : ""}
						width={6}
						height={6}
						className="object-contain"
					/>
				)}
				<ChatBubbleMessage>
					{renderToolInvocations()}
					{renderContent()}
					{renderActionButtons()}
				</ChatBubbleMessage>
			</ChatBubble>
		</motion.div>
	);
}

export default memo(
	ChatMessage,
	(prevProps, nextProps) => {
		if (nextProps.isLast) return false;
		return (
			prevProps.isLast === nextProps.isLast &&
			prevProps.message === nextProps.message
		);
	}
);