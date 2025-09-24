"use client";

import { formatCurrency } from "@/lib/utils";
import { Wallet, TrendingUp, TrendingDown } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface BalanceDisplayProps {
    balance: string | null;
    symbol: string;
    isLoading?: boolean;
    showTrend?: boolean;
    trend?: 'up' | 'down' | 'neutral';
    className?: string;
}

export function BalanceDisplay({ 
    balance, 
    symbol, 
    isLoading = false,
    showTrend = false,
    trend = 'neutral',
    className = ""
}: BalanceDisplayProps) {
    const formattedBalance = balance ? formatCurrency(balance) : '0.00';

    const getTrendIcon = () => {
        switch (trend) {
            case 'up':
                return <TrendingUp className="w-4 h-4 text-green-500" />;
            case 'down':
                return <TrendingDown className="w-4 h-4 text-red-500" />;
            default:
                return null;
        }
    };

    const getTrendColor = () => {
        switch (trend) {
            case 'up':
                return 'text-green-600';
            case 'down':
                return 'text-red-600';
            default:
                return 'text-gray-600';
        }
    };

    return (
        <Card className={`border-2 ${className}`}>
            <CardContent className="p-4">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-full">
                            <Wallet className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                        </div>
                        <div>
                            <p className="text-sm text-muted-foreground">Balance</p>
                            <div className="flex items-center gap-2">
                                {isLoading ? (
                                    <div className="flex items-center gap-2">
                                        <div className="h-6 w-20 bg-gray-200 dark:bg-gray-700 animate-pulse rounded" />
                                        <Badge variant="outline">Loading...</Badge>
                                    </div>
                                ) : (
                                    <>
                                        <span className={`text-lg font-bold font-mono ${getTrendColor()}`}>
                                            {formattedBalance}
                                        </span>
                                        <Badge variant="outline" className="text-xs">
                                            {symbol}
                                        </Badge>
                                        {showTrend && getTrendIcon()}
                                    </>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}