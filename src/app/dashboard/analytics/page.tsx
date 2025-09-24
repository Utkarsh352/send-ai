"use client";

import { useState } from "react";
import { BarChart3, TrendingUp, Download, Filter, Calendar, Bitcoin, Users, ArrowUpRight, ArrowDownRight } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";

interface AnalyticsData {
  totalSent: string;
  totalTransactions: number;
  avgTransactionValue: string;
  totalFees: string;
  successRate: number;
  topRecipients: Array<{
    name: string;
    amount: string;
    percentage: number;
  }>;
  monthlyData: Array<{
    month: string;
    sent: number;
    transactions: number;
  }>;
  departmentData: Array<{
    department: string;
    amount: string;
    percentage: number;
  }>;
}

export default function AnalyticsPage() {
  const [selectedPeriod, setSelectedPeriod] = useState<string>("30");
  const [selectedMetric, setSelectedMetric] = useState<string>("volume");

  // Mock data - in real app this would come from API
  const analyticsData: AnalyticsData = {
    totalSent: "₿45.67891234",
    totalTransactions: 247,
    avgTransactionValue: "₿0.18490742",
    totalFees: "₿0.00456789",
    successRate: 97.5,
    topRecipients: [
      { name: "Alice Johnson", amount: "₿8.234", percentage: 18 },
      { name: "Bob Chen", amount: "₿6.789", percentage: 15 },
      { name: "Carol Davis", amount: "₿5.456", percentage: 12 },
      { name: "David Wilson", amount: "₿4.123", percentage: 9 },
      { name: "Eve Rodriguez", amount: "₿3.890", percentage: 8 }
    ],
    monthlyData: [
      { month: "Nov", sent: 12.34, transactions: 45 },
      { month: "Dec", sent: 18.67, transactions: 67 },
      { month: "Jan", sent: 24.12, transactions: 89 },
      { month: "Feb", sent: 31.45, transactions: 123 },
      { month: "Mar", sent: 28.90, transactions: 98 },
      { month: "Apr", sent: 35.67, transactions: 156 }
    ],
    departmentData: [
      { department: "Engineering", amount: "₿18.234", percentage: 40 },
      { department: "Design", amount: "₿11.456", percentage: 25 },
      { department: "Marketing", amount: "₿9.123", percentage: 20 },
      { department: "Operations", amount: "₿4.567", percentage: 10 },
      { department: "HR", amount: "₿2.296", percentage: 5 }
    ]
  };

  return (
    <DashboardLayout>
      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold tracking-tight flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                <BarChart3 className="w-6 h-6 text-white" />
              </div>
              Analytics
            </h1>
            <p className="text-muted-foreground">
              Insights and analytics for your crypto transactions
            </p>
          </div>
          <div className="flex gap-2">
            <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
              <SelectTrigger className="w-[130px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="7">Last 7 days</SelectItem>
                <SelectItem value="30">Last 30 days</SelectItem>
                <SelectItem value="90">Last 90 days</SelectItem>
                <SelectItem value="365">Last year</SelectItem>
              </SelectContent>
            </Select>
            <Button>
              <Download className="w-4 h-4 mr-2" />
              Export Report
            </Button>
          </div>
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="border-l-4 border-l-orange-500">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Sent</CardTitle>
              <Bitcoin className="h-4 w-4 text-orange-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold font-mono">{analyticsData.totalSent}</div>
              <div className="flex items-center text-xs text-green-600">
                <ArrowUpRight className="w-3 h-3 mr-1" />
                +12.5% from last period
              </div>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-blue-500">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Transactions</CardTitle>
              <TrendingUp className="h-4 w-4 text-blue-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{analyticsData.totalTransactions}</div>
              <div className="flex items-center text-xs text-green-600">
                <ArrowUpRight className="w-3 h-3 mr-1" />
                +8.2% from last period
              </div>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-green-500">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Avg Transaction</CardTitle>
              <Bitcoin className="h-4 w-4 text-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold font-mono">{analyticsData.avgTransactionValue}</div>
              <div className="flex items-center text-xs text-red-600">
                <ArrowDownRight className="w-3 h-3 mr-1" />
                -3.1% from last period
              </div>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-purple-500">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Success Rate</CardTitle>
              <TrendingUp className="h-4 w-4 text-purple-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{analyticsData.successRate}%</div>
              <div className="flex items-center text-xs text-green-600">
                <ArrowUpRight className="w-3 h-3 mr-1" />
                +0.8% from last period
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="recipients">Recipients</TabsTrigger>
            <TabsTrigger value="departments">Departments</TabsTrigger>
            <TabsTrigger value="trends">Trends</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Transaction Volume Chart Placeholder */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BarChart3 className="w-5 h-5 text-blue-500" />
                    Transaction Volume
                  </CardTitle>
                  <CardDescription>Monthly transaction volume over time</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-64 flex items-center justify-center bg-gray-50 dark:bg-gray-800 rounded-lg">
                    <div className="text-center">
                      <BarChart3 className="w-12 h-12 text-muted-foreground mx-auto mb-2" />
                      <p className="text-muted-foreground">Chart visualization would go here</p>
                      <p className="text-sm text-muted-foreground">Showing last 6 months of data</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Network Fees Analysis */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Bitcoin className="w-5 h-5 text-orange-500" />
                    Network Fees
                  </CardTitle>
                  <CardDescription>Fee analysis and optimization insights</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Total Fees Paid</span>
                    <span className="font-bold font-mono">{analyticsData.totalFees}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Average Fee per Transaction</span>
                    <span className="font-bold font-mono">₿0.00001851</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Fee as % of Total Volume</span>
                    <span className="font-bold">0.01%</span>
                  </div>
                  <div className="pt-2">
                    <div className="flex justify-between text-sm mb-1">
                      <span>Fee Efficiency</span>
                      <span>94%</span>
                    </div>
                    <Progress value={94} className="h-2" />
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="recipients" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="w-5 h-5 text-green-500" />
                  Top Recipients
                </CardTitle>
                <CardDescription>Recipients receiving the most Bitcoin</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {analyticsData.topRecipients.map((recipient, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-bold text-sm">
                          {index + 1}
                        </div>
                        <span className="font-medium">{recipient.name}</span>
                      </div>
                      <div className="flex items-center gap-4">
                        <span className="font-mono font-bold text-orange-600">{recipient.amount}</span>
                        <div className="flex items-center gap-2">
                          <Progress value={recipient.percentage} className="w-16 h-2" />
                          <span className="text-sm text-muted-foreground">{recipient.percentage}%</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="departments" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="w-5 h-5 text-purple-500" />
                  Department Breakdown
                </CardTitle>
                <CardDescription>Bitcoin distribution by department</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {analyticsData.departmentData.map((dept, index) => (
                    <div key={index} className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="font-medium">{dept.department}</span>
                        <span className="font-mono font-bold text-orange-600">{dept.amount}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Progress value={dept.percentage} className="flex-1 h-3" />
                        <span className="text-sm text-muted-foreground w-12">{dept.percentage}%</span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="trends" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-blue-500" />
                  Transaction Trends
                </CardTitle>
                <CardDescription>Analysis of transaction patterns and trends</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <h4 className="font-medium">Key Insights</h4>
                    <div className="space-y-3">
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                        <span className="text-sm">Transaction volume increased 12.5% this month</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                        <span className="text-sm">Average transaction size decreased 3.1%</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                        <span className="text-sm">Peak transaction time: 2-4 PM UTC</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                        <span className="text-sm">Engineering dept receives 40% of total volume</span>
                      </div>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <h4 className="font-medium">Recommendations</h4>
                    <div className="space-y-3">
                      <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                        <p className="text-sm">Consider batch processing during low-fee periods (early morning UTC)</p>
                      </div>
                      <div className="p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                        <p className="text-sm">Current fee optimization is performing well at 94% efficiency</p>
                      </div>
                      <div className="p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
                        <p className="text-sm">Monitor recipient concentration - top 5 recipients receive 62% of volume</p>
                      </div>
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