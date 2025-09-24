"use client";

import { useState } from "react";
import { Activity, Zap, Network, Settings, AlertCircle, CheckCircle, Clock, TrendingUp, Wallet, ArrowRightLeft } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";

interface ChannelData {
  id: string;
  counterparty: string;
  balance: string;
  capacity: string;
  status: "active" | "pending" | "closed";
  utilization: number;
  lastActivity: string;
}

interface NetworkStats {
  connectedNodes: number;
  totalChannels: number;
  totalCapacity: string;
  averageFee: string;
  uptime: number;
  throughput: string;
}

export default function YellowNetworkPage() {
  const [selectedTab, setSelectedTab] = useState("overview");

  // Mock data - in real app this would come from Yellow Network SDK
  const networkStats: NetworkStats = {
    connectedNodes: 247,
    totalChannels: 15,
    totalCapacity: "45.67 YEL",
    averageFee: "0.001 YEL",
    uptime: 99.8,
    throughput: "125 tx/min"
  };

  const channels: ChannelData[] = [
    {
      id: "ch_001",
      counterparty: "Yellow Hub 1",
      balance: "12.345 YEL",
      capacity: "25.000 YEL",
      status: "active",
      utilization: 49,
      lastActivity: "2 minutes ago"
    },
    {
      id: "ch_002",
      counterparty: "Yellow Hub 2",
      balance: "8.756 YEL",
      capacity: "20.000 YEL",
      status: "active",
      utilization: 44,
      lastActivity: "5 minutes ago"
    },
    {
      id: "ch_003",
      counterparty: "Payroll Router",
      balance: "15.234 YEL",
      capacity: "30.000 YEL",
      status: "active",
      utilization: 51,
      lastActivity: "1 minute ago"
    },
    {
      id: "ch_004",
      counterparty: "Settlement Node",
      balance: "0.000 YEL",
      capacity: "10.000 YEL",
      status: "pending",
      utilization: 0,
      lastActivity: "Never"
    }
  ];

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "active":
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case "pending":
        return <Clock className="w-4 h-4 text-yellow-500" />;
      case "closed":
        return <AlertCircle className="w-4 h-4 text-red-500" />;
      default:
        return <AlertCircle className="w-4 h-4 text-gray-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200";
      case "pending":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200";
      case "closed":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200";
    }
  };

  return (
    <DashboardLayout>
      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold tracking-tight flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-full flex items-center justify-center">
                <Activity className="w-6 h-6 text-white" />
              </div>
              Yellow Network
            </h1>
            <p className="text-muted-foreground">
              Manage Yellow Network connections and Nitrolite channels for instant payroll settlements
            </p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline">
              <Settings className="w-4 h-4 mr-2" />
              Network Settings
            </Button>
            <Button className="bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600">
              <Zap className="w-4 h-4 mr-2" />
              Open Channel
            </Button>
          </div>
        </div>

        {/* Network Status Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="border-l-4 border-l-green-500">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Network Status</CardTitle>
              <Activity className="h-4 w-4 text-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">Connected</div>
              <p className="text-xs text-muted-foreground">
                Uptime: {networkStats.uptime}%
              </p>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-blue-500">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Channels</CardTitle>
              <Network className="h-4 w-4 text-blue-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{channels.filter(ch => ch.status === "active").length}</div>
              <p className="text-xs text-muted-foreground">
                {networkStats.totalChannels} total channels
              </p>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-yellow-500">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Capacity</CardTitle>
              <Wallet className="h-4 w-4 text-yellow-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold font-mono">{networkStats.totalCapacity}</div>
              <p className="text-xs text-muted-foreground">
                Available for payments
              </p>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-purple-500">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Throughput</CardTitle>
              <TrendingUp className="h-4 w-4 text-purple-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{networkStats.throughput}</div>
              <p className="text-xs text-muted-foreground">
                Average processing rate
              </p>
            </CardContent>
          </Card>
        </div>

        <Tabs value={selectedTab} onValueChange={setSelectedTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="channels">Channels</TabsTrigger>
            <TabsTrigger value="routing">Routing</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Network Performance */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="w-5 h-5 text-blue-500" />
                    Network Performance
                  </CardTitle>
                  <CardDescription>Real-time network statistics</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Connected Nodes</span>
                      <span className="font-bold">{networkStats.connectedNodes}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Average Fee</span>
                      <span className="font-mono font-bold">{networkStats.averageFee}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Network Uptime</span>
                      <span className="font-bold text-green-600">{networkStats.uptime}%</span>
                    </div>
                  </div>

                  <div className="pt-4 border-t">
                    <div className="space-y-3">
                      <div>
                        <div className="flex justify-between text-sm mb-1">
                          <span>Channel Utilization</span>
                          <span>67%</span>
                        </div>
                        <Progress value={67} className="h-2 [&>div]:bg-gradient-to-r [&>div]:from-yellow-500 [&>div]:to-orange-500" />
                      </div>
                      <div>
                        <div className="flex justify-between text-sm mb-1">
                          <span>Payment Success Rate</span>
                          <span>99.2%</span>
                        </div>
                        <Progress value={99.2} className="h-2 [&>div]:bg-gradient-to-r [&>div]:from-green-500 [&>div]:to-emerald-500" />
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Quick Actions */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Zap className="w-5 h-5 text-yellow-500" />
                    Quick Actions
                  </CardTitle>
                  <CardDescription>Common network operations</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Button className="w-full justify-start" variant="outline">
                    <Network className="w-4 h-4 mr-2" />
                    Open New Payment Channel
                  </Button>
                  <Button className="w-full justify-start" variant="outline">
                    <ArrowRightLeft className="w-4 h-4 mr-2" />
                    Rebalance Channels
                  </Button>
                  <Button className="w-full justify-start" variant="outline">
                    <Settings className="w-4 h-4 mr-2" />
                    Configure Routing Policy
                  </Button>
                  <Button className="w-full justify-start" variant="outline">
                    <TrendingUp className="w-4 h-4 mr-2" />
                    View Network Analytics
                  </Button>
                </CardContent>
              </Card>
            </div>

            {/* Integration Status */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Activity className="w-5 h-5 text-green-500" />
                  Yellow Network Integration
                </CardTitle>
                <CardDescription>SDK and protocol integration status</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="flex items-center gap-3 p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                    <CheckCircle className="w-6 h-6 text-green-500" />
                    <div>
                      <p className="font-medium">Yellow SDK</p>
                      <p className="text-sm text-muted-foreground">Connected & Active</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                    <CheckCircle className="w-6 h-6 text-green-500" />
                    <div>
                      <p className="font-medium">Nitrolite Protocol</p>
                      <p className="text-sm text-muted-foreground">Channels Open</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
                    <Clock className="w-6 h-6 text-yellow-500" />
                    <div>
                      <p className="font-medium">Smart Contract</p>
                      <p className="text-sm text-muted-foreground">Deploying...</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="channels" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Network className="w-5 h-5 text-blue-500" />
                  Payment Channels
                </CardTitle>
                <CardDescription>Manage your Nitrolite payment channels</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {channels.map((channel) => (
                    <div key={channel.id} className="p-4 border rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-full flex items-center justify-center">
                            <Network className="w-5 h-5 text-white" />
                          </div>
                          <div>
                            <p className="font-medium">{channel.counterparty}</p>
                            <p className="text-sm text-muted-foreground">Channel ID: {channel.id}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          {getStatusIcon(channel.status)}
                          <Badge className={getStatusColor(channel.status)}>
                            {channel.status.toUpperCase()}
                          </Badge>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div>
                          <p className="text-sm text-muted-foreground">Balance</p>
                          <p className="font-mono font-bold">{channel.balance}</p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">Capacity</p>
                          <p className="font-mono font-bold">{channel.capacity}</p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">Utilization</p>
                          <div className="flex items-center gap-2">
                            <Progress value={channel.utilization} className="flex-1 h-2" />
                            <span className="text-sm font-medium">{channel.utilization}%</span>
                          </div>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">Last Activity</p>
                          <p className="text-sm">{channel.lastActivity}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="routing" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <ArrowRightLeft className="w-5 h-5 text-purple-500" />
                  Payment Routing
                </CardTitle>
                <CardDescription>Optimize payment routes for your payroll transactions</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                  <h4 className="font-medium mb-2">Automatic Routing</h4>
                  <p className="text-sm text-muted-foreground mb-3">
                    The system automatically finds the best routes for your payroll transactions using Yellow Network's routing algorithm.
                  </p>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    <span className="text-sm">Enabled</span>
                  </div>
                </div>

                <div className="space-y-3">
                  <h4 className="font-medium">Routing Preferences</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                      <span className="text-sm">Prioritize Low Fees</span>
                      <CheckCircle className="w-4 h-4 text-green-500" />
                    </div>
                    <div className="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                      <span className="text-sm">Fast Settlement</span>
                      <CheckCircle className="w-4 h-4 text-green-500" />
                    </div>
                    <div className="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                      <span className="text-sm">High Reliability</span>
                      <CheckCircle className="w-4 h-4 text-green-500" />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
}