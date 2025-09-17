"use client";

import useChatStore from "@/app/hooks/useChatStore";
import { Attachment, ChatRequestOptions, generateId } from "ai";
import { Message, useChat } from "ai/react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import React, { useRef, useState } from "react";
import { toast } from "sonner";
import { ChevronUp, ChevronDown } from "lucide-react";
import { Button } from "../ui/button";
import ChatBottombar from "./chat-bottombar";
import ChatList from "./chat-list";
import ChatTopbar from "./chat-topbar";
import { Card, CardContent } from "../ui/card";
import CardList  from "./CardList";
import QuickActionsForm from "./QuickActionsForm";
import { useAccount } from "wagmi";

export interface ChatProps {
	id: string;
	initialMessages: Message[] | [];
}

export default function Chat({ initialMessages, id }: ChatProps) {
	const {
		messages,
		input,
		handleInputChange,
		handleSubmit,
		isLoading,
		stop,
		setMessages,
		setInput,
		reload,
		addToolResult
	} = useChat({
		id,
		initialMessages,
		onResponse: (response) => {
			if (response) {
				setLoadingSubmit(false);
			}
		},
		onFinish: (message) => {
			const savedMessages = getMessagesById(id);
			saveMessages(id, [...savedMessages, message]);
			setLoadingSubmit(false);
			router.replace(`/home/c/${id}`);
		},
		onError: (error) => {
			setLoadingSubmit(false);
			console.error("Chat error:", error.message);
			console.error("Chat error cause:", error.cause);
		},
		onToolCall: (tool) => {
			if (tool.toolCall.toolName == "getYellowBalance") {
				toast("Checking your YELLOW balance...");
				// here get the balance from the wallet
			}
		}
	});
	const { address } = useAccount();
	const [loadingSubmit, setLoadingSubmit] = React.useState(false);
	const [buttonsVisible, setButtonsVisible] = useState(true);
	const saveMessages = useChatStore((state) => state.saveMessages);
	const getMessagesById = useChatStore((state) => state.getMessagesById);
	const isLocal = useChatStore((state) => state.isLocal);
	const router = useRouter();

	const isToolInProgress = messages.some(
		(m: Message) =>
			m.role === 'assistant' &&
			m.toolInvocations?.some((tool) => !('result' in tool))
	);


	const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();

		const userMessage: Message = {
			id: generateId(),
			role: "user",
			content: input,
		};

		setLoadingSubmit(true);

		const requestOptions: ChatRequestOptions = {
			body: {
				isLocal: isLocal,
				walletAddress: address,
			},
		};

		handleSubmit(e, requestOptions);
		saveMessages(id, [...messages, userMessage]);
	};

	const onSubmitPrompt = (prompt: string) => {
		const userMessage: Message = {
			id: generateId(),
			role: "user",
			content: prompt,
		};

		setLoadingSubmit(true);
		setInput(prompt);

		const requestOptions: ChatRequestOptions = {
			body: {
				isLocal: isLocal,
				walletAddress: address,
			},
		};

		// Create a synthetic form event
		const syntheticEvent = {
			preventDefault: () => {},
		} as React.FormEvent<HTMLFormElement>;

		handleSubmit(syntheticEvent, requestOptions);
		saveMessages(id, [...messages, userMessage]);
	};

	const removeLatestMessage = () => {
		const updatedMessages = messages.slice(0, -1);
		setMessages(updatedMessages);
		saveMessages(id, updatedMessages);
		return updatedMessages;
	};

	const handleStop = () => {
		stop();
		saveMessages(id, [...messages]);
		setLoadingSubmit(false);
	};

	return (
		<div className="flex flex-col w-full max-w-3xl h-full">

			<ChatTopbar
				isLoading={isLoading}
				chatId={id}
				messages={messages}
				setMessages={setMessages}
			/>

			{messages.length === 0 ? (
				<div className="flex flex-col h-full w-full items-center gap-4 justify-center">

					<h1 className="text-[80px] -mb-6 font-bold">S</h1>
					<h2 className="text-2xl mb-6">Send-AI</h2>


					<p className="self-start pl-6 text-base text-foreground">
						How can I help you today?
					</p>

					<ChatBottombar
						input={input}
						handleInputChange={handleInputChange}
						handleSubmit={onSubmit}
						isLoading={isLoading}
						stop={handleStop}
						setInput={setInput}
						isToolInProgress={isToolInProgress}
						isMiddle={true}
					/>

					<div className="relative">
						{/* Toggle Button */}
						<div className="flex justify-center mb-2">
							<Button
								variant="outline"
								size="sm"
								onClick={() => setButtonsVisible(!buttonsVisible)}
								className="rounded-full bg-background/80 backdrop-blur-sm border-border hover:bg-accent"
							>
								{buttonsVisible ? <ChevronDown className="w-4 h-4" /> : <ChevronUp className="w-4 h-4" />}
							</Button>
						</div>

						{/* Collapsible Quick Actions */}
						<div className={`overflow-hidden transition-all duration-300 ease-in-out ${
							buttonsVisible ? 'max-h-[1000px] opacity-100' : 'max-h-0 opacity-0'
						}`}>
							<QuickActionsForm
								onSubmitPrompt={onSubmitPrompt}
								isLoading={isLoading || loadingSubmit}
								onClearMessages={() => setMessages([])}
							/>
						</div>
					</div>

				

				</div>
			) : (
				<>
					<ChatList
						messages={messages}
						isLoading={isLoading}
						loadingSubmit={loadingSubmit}
						reload={async () => {
							removeLatestMessage();

							const requestOptions: ChatRequestOptions = {
								body: {
									isLocal: isLocal,
								},
							};

							setLoadingSubmit(true);
							return reload(requestOptions);
						}}
						addToolResult={addToolResult}
					/>
					<ChatBottombar
						input={input}
						handleInputChange={handleInputChange}
						handleSubmit={onSubmit}
						isLoading={isLoading}
						stop={handleStop}
						setInput={setInput}
						isToolInProgress={isToolInProgress}
						isMiddle={false}
					/>
				</>
			)}
		</div>
	);
}
