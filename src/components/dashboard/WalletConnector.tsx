"use client";

import { useState } from "react";
import { createWalletClient, custom, type Address, type WalletClient } from 'viem';
import { mainnet } from 'viem/chains';
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Wallet, ExternalLink, Copy, Check } from "lucide-react";
import { formatAddress } from "@/lib/utils";
import { Card, CardContent } from "@/components/ui/card";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface WalletConnectorProps {
    onWalletConnect: (walletClient: WalletClient, account: Address) => void;
    onDisconnect: () => void;
    account: Address | null;
    isConnecting?: boolean;
}

export function WalletConnector({ 
    onWalletConnect, 
    onDisconnect, 
    account, 
    isConnecting = false 
}: WalletConnectorProps) {
    const [isLoading, setIsLoading] = useState(false);
    const [copied, setCopied] = useState(false);

    const connectWallet = async () => {
        if (!window.ethereum) {
            alert('Please install MetaMask or another Web3 wallet!');
            return;
        }

        try {
            setIsLoading(true);
            
            // First get the address
            const tempClient = createWalletClient({
                chain: mainnet,
                transport: custom(window.ethereum),
            });
            const [address] = await tempClient.requestAddresses();

            // Create wallet client with account for EIP-712 signing
            const walletClient = createWalletClient({
                account: address,
                chain: mainnet,
                transport: custom(window.ethereum),
            });

            onWalletConnect(walletClient, address);
        } catch (error) {
            console.error('Failed to connect wallet:', error);
            alert('Failed to connect wallet. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    const copyAddress = () => {
        if (account) {
            navigator.clipboard.writeText(account);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        }
    };

    const openEtherscan = () => {
        if (account) {
            window.open(`https://etherscan.io/address/${account}`, '_blank');
        }
    };

    if (account) {
        return (
            <Card className="border-green-200 dark:border-green-800">
                <CardContent className="p-3">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="w-8 h-8 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center">
                                <Wallet className="w-4 h-4 text-green-600 dark:text-green-400" />
                            </div>
                            <div>
                                <Badge variant="outline" className="text-green-700 dark:text-green-300 border-green-300">
                                    Connected
                                </Badge>
                                <p className="text-sm font-mono mt-1">{formatAddress(account)}</p>
                            </div>
                        </div>
                        
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="sm">
                                    ⋮
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                                <DropdownMenuItem onClick={copyAddress}>
                                    {copied ? <Check className="w-4 h-4 mr-2" /> : <Copy className="w-4 h-4 mr-2" />}
                                    {copied ? 'Copied!' : 'Copy Address'}
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={openEtherscan}>
                                    <ExternalLink className="w-4 h-4 mr-2" />
                                    View on Etherscan
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={onDisconnect} className="text-red-600">
                                    Disconnect
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                </CardContent>
            </Card>
        );
    }

    return (
        <Button 
            onClick={connectWallet} 
            disabled={isLoading || isConnecting}
            className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700"
            size="lg"
        >
            <Wallet className="w-4 h-4 mr-2" />
            {isLoading || isConnecting ? 'Connecting...' : 'Connect Wallet'}
        </Button>
    );
}