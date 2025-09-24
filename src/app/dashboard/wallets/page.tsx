"use client";

import { useState } from "react";
import { Plus, Wallet, Bitcoin, Eye, EyeOff, Copy, Send, ArrowDownToLine, Settings, Shield, TrendingUp } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";

interface WalletData {
  id: string;
  name: string;
  type: "hot" | "cold" | "multisig";
  balance: string;
  balanceUsd: string;
  address: string;
  lastActivity: string;
  transactionCount: number;
  isDefault: boolean;
  security: "high" | "medium" | "low";
}

export default function WalletsPage() {
  const [showBalances, setShowBalances] = useState(true);

  // Mock data - in real app this would come from API
  const wallets: WalletData[] = [
    {
      id: "wallet-1",
      name: "Main Wallet",
      type: "hot",
      balance: "₿12.34567890",
      balanceUsd: "$842,350.42",
      address: "bc1qw508d6qejxtdg4y5r3zarvary0c5xw7kv8f3t4",
      lastActivity: "2024-12-20T16:30:00Z",
      transactionCount: 156,
      isDefault: true,
      security: "high"
    },
    {
      id: "wallet-2",
      name: "Cold Storage",
      type: "cold",
      balance: "₿45.67891234",
      balanceUsd: "$3,123,456.78",
      address: "bc1qar0srrr7xfkvy5l643lydnw9re59gtzzwf5mdq",
      lastActivity: "2024-12-15T10:00:00Z",
      transactionCount: 23,
      isDefault: false,
      security: "high"
    },
    {
      id: "wallet-3",
      name: "Operations Wallet",
      type: "hot",
      balance: "₿3.21098765",
      balanceUsd: "$219,456.32",
      balanceUsd: "$219,456.32",
      address: "bc1qx2tsj6qz7n37x2j6qz5n7r3l9k5m6q2w1e5t7y",
      lastActivity: "2024-12-20T14:15:00Z",
      transactionCount: 89,
      isDefault: false,
      security: "medium"
    },
    {
      id: "wallet-4",
      name: "Multi-Sig Treasury",
      type: "multisig",
      balance: "₿78.90123456",
      balanceUsd: "$5,392,847.61",
      address: "bc1qy4xvj9k7n8m5c6v4b2n9m8l5q3w7e9r6t8y2u",
      lastActivity: "2024-12-18T09:45:00Z",
      transactionCount: 45,
      isDefault: false,
      security: "high"
    }
  ];

  const getTotalBalance = () => {
    return wallets.reduce((sum, wallet) => {
      return sum + parseFloat(wallet.balance.replace("₿", ""));
    }, 0);
  };

  const getTotalUsd = () => {
    return wallets.reduce((sum, wallet) => {
      return sum + parseFloat(wallet.balanceUsd.replace(/[$,]/g, ""));
    }, 0);
  };

  const getWalletTypeColor = (type: string) => {
    switch (type) {
      case "hot":
        return "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200";
      case "cold":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200";
      case "multisig":
        return "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200";
    }
  };

  const getSecurityColor = (security: string) => {
    switch (security) {
      case "high":
        return "text-green-600";
      case "medium":
        return "text-yellow-600";
      case "low":
        return "text-red-600";
      default:
        return "text-gray-600";
    }
  };

  const getSecurityIcon = (security: string) => {
    const color = getSecurityColor(security);
    return <Shield className={`w-4 h-4 ${color}`} />;
  };

  return (
    <DashboardLayout>
      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold tracking-tight flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                <Wallet className="w-6 h-6 text-white" />
              </div>
              Wallets
            </h1>
            <p className="text-muted-foreground">
              Manage your Bitcoin wallets and monitor balances
            </p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => setShowBalances(!showBalances)}>
              {showBalances ? <EyeOff className="w-4 h-4 mr-2" /> : <Eye className="w-4 h-4 mr-2" />}
              {showBalances ? "Hide" : "Show"} Balances
            </Button>
            <Button className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600">
              <Plus className="w-4 h-4 mr-2" />
              Add Wallet
            </Button>
          </div>
        </div>

        {/* Portfolio Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="border-l-4 border-l-orange-500">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Balance</CardTitle>
              <Bitcoin className="h-4 w-4 text-orange-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold font-mono">
                {showBalances ? `₿${getTotalBalance().toFixed(8)}` : "₿••••••••"}
              </div>
              <p className="text-xs text-muted-foreground">
                {showBalances ? `$${getTotalUsd().toLocaleString()}` : "$•••,•••.••"}
              </p>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-green-500">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Wallets</CardTitle>
              <Wallet className="h-4 w-4 text-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{wallets.length}</div>
              <p className="text-xs text-muted-foreground">
                {wallets.filter(w => w.security === "high").length} high security
              </p>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-blue-500">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">24h Change</CardTitle>
              <TrendingUp className="h-4 w-4 text-blue-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">+2.34%</div>
              <p className="text-xs text-muted-foreground">
                {showBalances ? "+$127,843.21" : "+$•••,•••.••"}
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Wallets Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {wallets.map((wallet) => (
            <Card key={wallet.id} className={`relative ${wallet.isDefault ? 'ring-2 ring-orange-500' : ''}`}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                      <Wallet className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <CardTitle className="flex items-center gap-2">
                        {wallet.name}
                        {wallet.isDefault && (
                          <Badge variant="outline" className="text-orange-600 border-orange-600">
                            Default
                          </Badge>
                        )}
                      </CardTitle>
                      <CardDescription className="flex items-center gap-2">
                        <Badge className={getWalletTypeColor(wallet.type)}>
                          {wallet.type.toUpperCase()}
                        </Badge>
                        {getSecurityIcon(wallet.security)}
                        <span className="text-xs">{wallet.security} security</span>
                      </CardDescription>
                    </div>
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm">
                        <Settings className="w-4 h-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem>
                        <Send className="w-4 h-4 mr-2" />
                        Send from this wallet
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <ArrowDownToLine className="w-4 h-4 mr-2" />
                        Receive to this wallet
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <Copy className="w-4 h-4 mr-2" />
                        Copy address
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <Settings className="w-4 h-4 mr-2" />
                        Wallet settings
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Balance */}
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Balance</span>
                    <div className="text-right">
                      <p className="font-bold font-mono text-lg">
                        {showBalances ? wallet.balance : "₿••••••••"}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {showBalances ? wallet.balanceUsd : "$•••,•••.••"}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Address */}
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Address</span>
                    <Button variant="ghost" size="sm">
                      <Copy className="w-3 h-3" />
                    </Button>
                  </div>
                  <p className="font-mono text-xs bg-gray-100 dark:bg-gray-800 p-2 rounded break-all">
                    {wallet.address}
                  </p>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-2 gap-4 pt-2">
                  <div>
                    <p className="text-sm text-muted-foreground">Transactions</p>
                    <p className="font-medium">{wallet.transactionCount}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Last Activity</p>
                    <p className="font-medium text-xs">
                      {new Date(wallet.lastActivity).toLocaleDateString()}
                    </p>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-2 pt-2">
                  <Button size="sm" className="flex-1">
                    <Send className="w-4 h-4 mr-2" />
                    Send
                  </Button>
                  <Button size="sm" variant="outline" className="flex-1">
                    <ArrowDownToLine className="w-4 h-4 mr-2" />
                    Receive
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Common wallet operations</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Button variant="outline" className="h-20 flex flex-col items-center justify-center gap-2">
                <Plus className="w-6 h-6 text-blue-500" />
                <span>Create Wallet</span>
              </Button>
              <Button variant="outline" className="h-20 flex flex-col items-center justify-center gap-2">
                <ArrowDownToLine className="w-6 h-6 text-green-500" />
                <span>Import Wallet</span>
              </Button>
              <Button variant="outline" className="h-20 flex flex-col items-center justify-center gap-2">
                <Shield className="w-6 h-6 text-purple-500" />
                <span>Setup Multi-Sig</span>
              </Button>
              <Button variant="outline" className="h-20 flex flex-col items-center justify-center gap-2">
                <Settings className="w-6 h-6 text-gray-500" />
                <span>Wallet Settings</span>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}