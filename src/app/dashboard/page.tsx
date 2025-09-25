"use client";

import { useState } from "react";
import { Users, Bitcoin, Wallet, Clock, AlertTriangle, TrendingUp, Send, UserPlus, FileText, CheckCircle, XCircle, Zap, DollarSign, RefreshCw } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { HourlyPaymentManager } from "@/components/payroll/HourlyPaymentManager";
import { useNitroliteContext } from "@/providers/NitroliteProvider";

interface Employee {
  id: string;
  name: string;
  email: string;
  department: string;
  walletAddress?: string;
  avatar?: string;
}

export default function DashboardPage() {
  const [currentDate] = useState(new Date());
  const [showSendMoney, setShowSendMoney] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState("");
  const [sendAmount, setSendAmount] = useState("");
  const [sendCurrency, setSendCurrency] = useState("USDC");
  const [sendNote, setSendNote] = useState("");
  const [isSending, setIsSending] = useState(false);

  // Connect to Nitrolite for wallet functionality
  const nitrolite = useNitroliteContext();

  // Mock employee data - in real app this would come from API/database
  const employees: Employee[] = [
    {
      id: "EMP001",
      name: "John Doe",
      email: "john.doe@company.com",
      department: "Engineering",
      walletAddress: "0x1234567890123456789012345678901234567890"
    },
    {
      id: "EMP002",
      name: "Jane Smith",
      email: "jane.smith@company.com",
      department: "Marketing",
      walletAddress: "0x2345678901234567890123456789012345678901"
    },
    {
      id: "EMP003",
      name: "Bob Johnson",
      email: "bob.johnson@company.com",
      department: "Sales",
      walletAddress: "0x3456789012345678901234567890123456789012"
    },
    {
      id: "EMP004",
      name: "Alice Brown",
      email: "alice.brown@company.com",
      department: "HR",
      walletAddress: "0x4567890123456789012345678901234567890123"
    }
  ];

  const handleSendMoney = async () => {
    if (!nitrolite.privateKey || !nitrolite.isAuthenticated) {
      alert('Please connect with your private key first');
      return;
    }

    if (!selectedEmployee || !sendAmount) {
      alert('Please select an employee and enter an amount');
      return;
    }

    const employee = employees.find(emp => emp.id === selectedEmployee);
    if (!employee || !employee.walletAddress) {
      alert('Employee wallet address not found');
      return;
    }

    const amount = parseFloat(sendAmount);
    if (amount <= 0) {
      alert('Please enter a valid amount');
      return;
    }

    try {
      setIsSending(true);

      // Use real Nitrolite transfer through Yellow Network
      const transferResult = await nitrolite.transfer(
        employee.walletAddress as any,
        amount.toString(),
        sendCurrency.toLowerCase()
      );

      if (transferResult.success) {
        alert(`Successfully sent $${amount} ${sendCurrency} to ${employee.name}!`);
      } else {
        throw new Error(transferResult.error || 'Transfer failed');
      }

      // Reset form
      setSelectedEmployee("");
      setSendAmount("");
      setSendNote("");
      setShowSendMoney(false);

      // Refresh balances
      if (nitrolite.privateKey) {
        const address = `0x${nitrolite.privateKey.replace('0x', '').slice(0, 40)}` as any;
        nitrolite.fetchBalances(address);
      }

    } catch (error) {
      console.error('Send failed:', error);
      alert('Failed to send payment. Please try again.');
    } finally {
      setIsSending(false);
    }
  };

  // Mock data - in real app this would come from API/database
  const summaryStats = {
    totalRecipients: 247,
    currentTransactionStatus: "Active",
    pendingTransactions: 3,
    nextBatchDate: "2024-01-15",
    transactionProgress: 75,
    monthlyBudget: "₿12.345",
    sentThisMonth: "₿9.258",
    pendingAmount: "₿3.087"
  };

  const recentActivity = [
    {
      id: 1,
      type: "crypto_batch",
      title: "December 2024 Crypto Batch",
      status: "completed",
      amount: "₿8.923",
      date: "2024-12-20",
      approver: "Sarah Johnson"
    },
    {
      id: 2,
      type: "crypto_batch",
      title: "Engineering Team Bonus",
      status: "pending_approval",
      amount: "₿1.568",
      date: "2024-12-22",
      approver: "Mike Chen"
    },
    {
      id: 3,
      type: "recipient_added",
      title: "New Recipient Added",
      status: "completed",
      employee: "Alice Johnson",
      department: "Marketing",
      date: "2024-12-21"
    },
    {
      id: 4,
      type: "crypto_batch",
      title: "Contractor Payments",
      status: "processing",
      amount: "₿0.452",
      date: "2024-12-23"
    },
    {
      id: 5,
      type: "compliance",
      title: "Q4 Compliance Check Completed",
      status: "completed",
      date: "2024-12-19"
    }
  ];

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed":
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case "processing":
        return <Clock className="w-4 h-4 text-blue-500" />;
      case "pending_approval":
        return <AlertTriangle className="w-4 h-4 text-yellow-500" />;
      default:
        return <XCircle className="w-4 h-4 text-red-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200";
      case "processing":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200";
      case "pending_approval":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200";
      default:
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200";
    }
  };

  return (
    <DashboardLayout>
      <div className="p-6 space-y-8">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-orange-500 rounded-full flex items-center justify-center">
                <Bitcoin className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-orange-500 to-yellow-500 bg-clip-text text-transparent">
                  Crypto Dashboard
                </h1>
                <p className="text-muted-foreground">
                  Welcome back! Here&apos;s your crypto transaction overview for {currentDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}.
                </p>
              </div>
            </div>
          </div>
          <div className="flex gap-2">
            <Dialog open={showSendMoney} onOpenChange={setShowSendMoney}>
              <DialogTrigger asChild>
                <Button className="bg-gradient-to-r from-orange-500 to-yellow-500 hover:from-orange-600 hover:to-yellow-600">
                  <Send className="w-4 h-4 mr-2" />
                  Send Money
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-md">
                <DialogHeader>
                  <DialogTitle>Send Money to Employee</DialogTitle>
                  <DialogDescription>
                    Send crypto payments directly to your employees via Nitrolite
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                  {/* Authentication Status */}
                  <div className="p-4 rounded-lg border bg-gray-50 dark:bg-gray-800">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium">Authentication Status</p>
                        <p className="text-xs text-muted-foreground">
                          {nitrolite.isAuthenticated ? 'Authenticated with Yellow Network' :
                           nitrolite.isAuthenticating ? 'Authenticating...' :
                           'Not authenticated'}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        {nitrolite.isAuthenticated ? (
                          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                        ) : nitrolite.isAuthenticating ? (
                          <div className="w-2 h-2 bg-yellow-500 rounded-full animate-pulse"></div>
                        ) : (
                          <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                        )}
                      </div>
                    </div>
                    {nitrolite.privateKey && (
                      <p className="text-xs text-muted-foreground mt-1 font-mono">
                        Key: {nitrolite.privateKey.slice(0, 6)}...{nitrolite.privateKey.slice(-4)}
                      </p>
                    )}
                  </div>

                  {/* Employee Selection */}
                  <div>
                    <Label htmlFor="employee">Select Employee</Label>
                    <Select value={selectedEmployee} onValueChange={setSelectedEmployee}>
                      <SelectTrigger>
                        <SelectValue placeholder="Choose an employee" />
                      </SelectTrigger>
                      <SelectContent>
                        {employees.map((employee) => (
                          <SelectItem key={employee.id} value={employee.id}>
                            <div className="flex flex-col text-left">
                              <span>{employee.name}</span>
                              <span className="text-xs text-muted-foreground">{employee.department} • {employee.email}</span>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Amount and Currency */}
                  <div className="grid grid-cols-3 gap-2">
                    <div className="col-span-2">
                      <Label htmlFor="amount">Amount</Label>
                      <Input
                        id="amount"
                        type="number"
                        placeholder="0.00"
                        value={sendAmount}
                        onChange={(e) => setSendAmount(e.target.value)}
                        step="0.01"
                        min="0"
                      />
                    </div>
                    <div>
                      <Label htmlFor="currency">Currency</Label>
                      <Select value={sendCurrency} onValueChange={setSendCurrency}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="USDC">USDC</SelectItem>
                          <SelectItem value="USDT">USDT</SelectItem>
                          <SelectItem value="ETH">ETH</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  {/* Note */}
                  <div>
                    <Label htmlFor="note">Note (Optional)</Label>
                    <Textarea
                      id="note"
                      placeholder="Payment description..."
                      value={sendNote}
                      onChange={(e) => setSendNote(e.target.value)}
                      rows={3}
                    />
                  </div>

                  {/* Action Buttons */}
                  <div className="flex justify-end gap-2 pt-4">
                    <Button variant="outline" onClick={() => setShowSendMoney(false)} disabled={isSending}>
                      Cancel
                    </Button>
                    <Button
                      onClick={handleSendMoney}
                      disabled={isSending || !nitrolite.isAuthenticated || !selectedEmployee || !sendAmount}
                      className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600"
                    >
                      {isSending ? (
                        <>
                          <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                          Sending...
                        </>
                      ) : (
                        <>
                          <Send className="w-4 h-4 mr-2" />
                          Send Payment
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="border-l-4 border-l-blue-500">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Recipients</CardTitle>
              <Users className="h-4 w-4 text-blue-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{summaryStats.totalRecipients}</div>
              <p className="text-xs text-muted-foreground">
                Across 12 countries
              </p>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-green-500">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Current Transaction Batch</CardTitle>
              <Zap className="h-4 w-4 text-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{summaryStats.currentTransactionStatus}</div>
              <div className="mt-2">
                <Progress value={summaryStats.transactionProgress} className="h-2" />
                <p className="text-xs text-muted-foreground mt-1">
                  {summaryStats.transactionProgress}% complete
                </p>
              </div>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-yellow-500">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pending Transactions</CardTitle>
              <AlertTriangle className="h-4 w-4 text-yellow-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{summaryStats.pendingTransactions}</div>
              <p className="text-xs text-muted-foreground">
                Requires immediate attention
              </p>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-orange-500">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Next Batch Send</CardTitle>
              <Bitcoin className="h-4 w-4 text-orange-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {new Date(summaryStats.nextBatchDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
              </div>
              <p className="text-xs text-muted-foreground">
                {summaryStats.pendingAmount} pending
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Frequently used actions to manage your crypto transactions</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Button
                size="lg"
                onClick={() => setShowSendMoney(true)}
                className="h-20 flex flex-col items-center justify-center gap-2 bg-gradient-to-r from-orange-500 to-yellow-500 hover:from-orange-600 hover:to-yellow-600"
              >
                <Send className="w-6 h-6" />
                <span>Send Money</span>
              </Button>
              <Button variant="outline" size="lg" className="h-20 flex flex-col items-center justify-center gap-2 border-blue-200 hover:border-blue-400 hover:bg-blue-50">
                <UserPlus className="w-6 h-6 text-blue-500" />
                <span>Add Recipient</span>
              </Button>
              <Button variant="outline" size="lg" className="h-20 flex flex-col items-center justify-center gap-2 border-purple-200 hover:border-purple-400 hover:bg-purple-50">
                <FileText className="w-6 h-6 text-purple-500" />
                <span>Transaction Report</span>
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Recent Activity</CardTitle>
              <CardDescription>Latest crypto transactions and system updates</CardDescription>
            </div>
            <Button variant="outline" size="sm">
              View All
            </Button>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActivity.map((activity) => (
                <div key={activity.id} className="flex items-center justify-between p-4 rounded-lg border hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                  <div className="flex items-center gap-4">
                    <div className="p-2 rounded-full bg-orange-100 dark:bg-orange-900/20">
                      {getStatusIcon(activity.status)}
                    </div>
                    <div>
                      <p className="font-medium">{activity.title}</p>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <span>{new Date(activity.date).toLocaleDateString()}</span>
                        {activity.amount && (
                          <>
                            <span>•</span>
                            <span className="font-medium text-orange-600">{activity.amount}</span>
                          </>
                        )}
                        {activity.approver && (
                          <>
                            <span>•</span>
                            <span>Approved by {activity.approver}</span>
                          </>
                        )}
                        {activity.employee && (
                          <>
                            <span>•</span>
                            <span>{activity.employee} ({activity.department})</span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                  <Badge className={getStatusColor(activity.status)}>
                    {activity.status.replace('_', ' ')}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Financial Overview */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="border-2 border-orange-100">
            <CardHeader>
              <div className="flex items-center gap-2">
                <Bitcoin className="w-5 h-5 text-orange-500" />
                <CardTitle>Monthly Crypto Overview</CardTitle>
              </div>
              <CardDescription>Track your crypto transactions for this month</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                  <span className="text-sm font-medium">Total Budget</span>
                  <span className="font-bold text-lg">{summaryStats.monthlyBudget}</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                  <span className="text-sm font-medium">Sent</span>
                  <span className="font-bold text-lg text-green-600">{summaryStats.sentThisMonth}</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                  <span className="text-sm font-medium">Remaining</span>
                  <span className="font-bold text-lg text-blue-600">{summaryStats.pendingAmount}</span>
                </div>
                <div className="pt-2">
                  <div className="flex justify-between text-sm mb-2">
                    <span>Progress</span>
                    <span>75%</span>
                  </div>
                  <Progress value={75} className="h-3" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-2 border-blue-100">
            <CardHeader>
              <div className="flex items-center gap-2">
                <Zap className="w-5 h-5 text-blue-500" />
                <CardTitle>System Status</CardTitle>
              </div>
              <CardDescription>Current status of crypto systems</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                  <span className="text-sm font-medium">Bitcoin Network</span>
                </div>
                <Badge variant="outline" className="text-green-600 border-green-600 bg-green-50">
                  Connected
                </Badge>
              </div>
              <div className="flex items-center justify-between p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                  <span className="text-sm font-medium">Wallet Integration</span>
                </div>
                <Badge variant="outline" className="text-green-600 border-green-600 bg-green-50">
                  Active
                </Badge>
              </div>
              <div className="flex items-center justify-between p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 bg-yellow-500 rounded-full animate-pulse"></div>
                  <span className="text-sm font-medium">Compliance Engine</span>
                </div>
                <Badge variant="outline" className="text-yellow-600 border-yellow-600 bg-yellow-50">
                  Processing
                </Badge>
              </div>
              <div className="flex items-center justify-between p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                  <span className="text-sm font-medium">Notification System</span>
                </div>
                <Badge variant="outline" className="text-green-600 border-green-600 bg-green-50">
                  Online
                </Badge>
              </div>
              <div className="mt-4 pt-4 border-t">
                <div className="text-xs text-muted-foreground text-center">
                  Network Fee: 2.5 sat/vB • Mempool: 12,543 tx
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Hourly Payment System */}
        <div className="mt-12">
          <HourlyPaymentManager />
        </div>
      </div>
    </DashboardLayout>
  );
}