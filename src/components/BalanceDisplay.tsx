import { formatCurrency } from '@/lib/utils'
import { Card, CardContent } from '@/components/ui/card'
import { Wallet, Loader2 } from 'lucide-react'

interface BalanceDisplayProps {
    balance: string | null
    symbol: string
    isLoading?: boolean
    className?: string
}

export function BalanceDisplay({
    balance,
    symbol,
    isLoading = false,
    className = ""
}: BalanceDisplayProps) {
    const formattedBalance = balance ? formatCurrency(balance) : '0.00'

    return (
        <Card className={`border-muted ${className}`}>
            <CardContent className="flex items-center space-x-3 p-4">
                <div className="flex items-center justify-center w-10 h-10 rounded-full bg-primary/10">
                    {isLoading ? (
                        <Loader2 className="h-5 w-5 animate-spin text-primary" />
                    ) : (
                        <Wallet className="h-5 w-5 text-primary" />
                    )}
                </div>
                <div>
                    <p className="text-sm font-medium text-muted-foreground">Balance</p>
                    <div className="flex items-center space-x-2">
                        <span className="text-xl font-bold">
                            {isLoading ? '...' : formattedBalance}
                        </span>
                        <span className="text-sm font-medium text-muted-foreground">
                            {symbol}
                        </span>
                    </div>
                </div>
            </CardContent>
        </Card>
    )
}

// Compact version for header display
export function BalanceDisplayCompact({
    balance,
    symbol,
    isLoading = false
}: BalanceDisplayProps) {
    const formattedBalance = balance ? formatCurrency(balance) : '0.00'

    return (
        <div className="flex items-center space-x-2 px-3 py-2 rounded-md border bg-card text-card-foreground">
            {isLoading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
                <Wallet className="h-4 w-4" />
            )}
            <span className="font-mono text-sm font-medium">
                {isLoading ? 'Loading...' : `${formattedBalance} ${symbol}`}
            </span>
        </div>
    )
}