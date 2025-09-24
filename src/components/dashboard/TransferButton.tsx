"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Send, Loader2, CheckCircle, AlertCircle } from "lucide-react";
import { useNitroliteContext } from "@/providers/NitroliteProvider";
import { type Address } from "viem";
import { formatCurrency } from "@/lib/utils";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import {
    Alert,
    AlertDescription,
} from "@/components/ui/alert";

interface TransferButtonProps {
    recipientAddress: string;
    recipientName: string;
    amount: string;
    asset?: string;
    disabled?: boolean;
    size?: "sm" | "md" | "lg";
    variant?: "default" | "outline" | "ghost";
    className?: string;
}

export function TransferButton({
    recipientAddress,
    recipientName,
    amount,
    asset = "usdc",
    disabled = false,
    size = "md",
    variant = "default",
    className = ""
}: TransferButtonProps) {
    const nitrolite = useNitroliteContext();
    const [isOpen, setIsOpen] = useState(false);
    const [transferState, setTransferState] = useState<'idle' | 'sending' | 'success' | 'error'>('idle');
    const [errorMessage, setErrorMessage] = useState('');

    const handleTransfer = async () => {
        if (!nitrolite.isAuthenticated) {
            setErrorMessage('Please connect wallet and authenticate first');
            setTransferState('error');
            return;
        }

        try {
            setTransferState('sending');
            setErrorMessage('');
            
            const result = await nitrolite.transfer(recipientAddress as Address, amount, asset);
            
            if (result.success) {
                setTransferState('success');
                // Auto-close dialog after success
                setTimeout(() => {
                    setIsOpen(false);
                    setTransferState('idle');
                }, 2000);
            } else {
                setTransferState('error');
                setErrorMessage(result.error || 'Transfer failed');
            }
        } catch (error) {
            setTransferState('error');
            setErrorMessage(error instanceof Error ? error.message : 'Unknown error occurred');
        }
    };

    const getButtonContent = () => {
        if (nitrolite.isTransferring && transferState === 'sending') {
            return (
                <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Sending...
                </>
            );
        }

        return (
            <>
                <Send className="w-4 h-4 mr-2" />
                Send {formatCurrency(amount)} {asset.toUpperCase()}
            </>
        );
    };

    const canTransfer = nitrolite.isAuthenticated && 
                       nitrolite.account && 
                       !nitrolite.isTransferring && 
                       !disabled;

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
                <Button
                    variant={variant}
                    size={size}
                    disabled={!canTransfer}
                    className={className}
                >
                    {getButtonContent()}
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        <Send className="w-5 h-5" />
                        Send Payment
                    </DialogTitle>
                    <DialogDescription>
                        Send {formatCurrency(amount)} {asset.toUpperCase()} to {recipientName}
                    </DialogDescription>
                </DialogHeader>
                
                <div className="space-y-4">
                    {/* Transfer Details */}
                    <div className="space-y-3 p-4 bg-gray-50 dark:bg-gray-900 rounded-lg">
                        <div className="flex justify-between items-center">
                            <span className="text-sm text-muted-foreground">Recipient:</span>
                            <span className="font-medium">{recipientName}</span>
                        </div>
                        <div className="flex justify-between items-center">
                            <span className="text-sm text-muted-foreground">Amount:</span>
                            <div className="flex items-center gap-2">
                                <span className="font-mono font-bold">{formatCurrency(amount)}</span>
                                <Badge variant="outline">{asset.toUpperCase()}</Badge>
                            </div>
                        </div>
                        <div className="flex justify-between items-center">
                            <span className="text-sm text-muted-foreground">Network:</span>
                            <span className="text-sm">Yellow Network (Nitrolite)</span>
                        </div>
                    </div>

                    {/* Status Messages */}
                    {transferState === 'success' && (
                        <Alert className="border-green-200 bg-green-50 dark:bg-green-950">
                            <CheckCircle className="h-4 w-4 text-green-600" />
                            <AlertDescription className="text-green-700 dark:text-green-300">
                                Payment sent successfully! The transaction will be processed instantly.
                            </AlertDescription>
                        </Alert>
                    )}

                    {transferState === 'error' && errorMessage && (
                        <Alert className="border-red-200 bg-red-50 dark:bg-red-950">
                            <AlertCircle className="h-4 w-4 text-red-600" />
                            <AlertDescription className="text-red-700 dark:text-red-300">
                                {errorMessage}
                            </AlertDescription>
                        </Alert>
                    )}

                    {/* Action Button */}
                    <div className="flex gap-2">
                        <Button
                            onClick={handleTransfer}
                            disabled={transferState === 'sending' || transferState === 'success' || !canTransfer}
                            className="flex-1"
                        >
                            {transferState === 'sending' && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                            {transferState === 'success' && <CheckCircle className="w-4 h-4 mr-2 text-green-500" />}
                            {transferState === 'idle' && <Send className="w-4 h-4 mr-2" />}
                            {transferState === 'error' && <AlertCircle className="w-4 h-4 mr-2" />}
                            
                            {transferState === 'sending' ? 'Sending...' :
                             transferState === 'success' ? 'Sent!' :
                             transferState === 'error' ? 'Retry' :
                             'Confirm Transfer'}
                        </Button>
                        <Button variant="outline" onClick={() => setIsOpen(false)}>
                            Cancel
                        </Button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}