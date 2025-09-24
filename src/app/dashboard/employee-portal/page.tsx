"use client";

import { useState } from "react";
import { User, FileText, Download, Upload, Calendar, DollarSign, Clock, CreditCard, Settings, Bell, RefreshCw, Plus, Wallet, ArrowUpRight, ArrowDownRight } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { useNitroliteContext } from "@/providers/NitroliteProvider";


interface Payslip {
  id: string;
  month: string;
  year: string;
  grossPay: number;
  deductions: number;
  netPay: number;
  status: "Paid" | "Processing" | "Pending";
  date: string;
}

interface LeaveRequest {
  id: string;
  type: string;
  startDate: string;
  endDate: string;
  days: number;
  status: "Approved" | "Pending" | "Rejected";
  reason: string;
  appliedDate: string;
}


interface Transaction {
  id: string;
  type: "credit" | "debit";
  amount: number;
  description: string;
  date: string;
  status: "Completed" | "Pending" | "Failed";
  reference: string;
}

export default function EmployeePortalPage() {
  const [showLeaveRequest, setShowLeaveRequest] = useState(false);
  const [isClaiming, setIsClaiming] = useState(false);

  // Connect to Nitrolite for balance and claiming functionality
  const nitrolite = useNitroliteContext();

  // Calculate claimable amount from balance
  const claimableAmount = nitrolite.balances?.['usdc'] || nitrolite.balances?.['USDC'] || '0';
  const claimableFloat = parseFloat(claimableAmount);

  const handleClaim = async () => {
    if (!nitrolite.account || !nitrolite.isAuthenticated) {
      alert('Please connect your wallet and authenticate first');
      return;
    }

    if (claimableFloat <= 0) {
      alert('No funds available to claim');
      return;
    }

    try {
      setIsClaiming(true);
      // In a real implementation, this would transfer from employer to employee
      // For demo purposes, we'll show a success message

      await new Promise(resolve => setTimeout(resolve, 2000)); // Simulate transaction time

      alert(`Successfully claimed $${claimableFloat.toFixed(2)} USDC!`);

      // Refresh balances
      if (nitrolite.account) {
        nitrolite.fetchBalances(nitrolite.account);
      }
    } catch (error) {
      console.error('Claim failed:', error);
      alert('Failed to claim funds. Please try again.');
    } finally {
      setIsClaiming(false);
    }
  };

  // Mock employee data - in real app this would come from API based on logged-in user
  const employeeInfo = {
    name: "John Doe",
    employeeId: "EMP001",
    email: "john.doe@company.com",
    phone: "+1 (555) 123-4567",
    department: "Engineering",
    role: "Senior Developer",
    manager: "Sarah Johnson",
    joinDate: "2022-03-15",
    location: "New York, NY",
    avatar: "/api/placeholder/100/100"
  };

  const payslips: Payslip[] = [
    {
      id: "PAY001",
      month: "December",
      year: "2024",
      grossPay: 8500,
      deductions: 1584,
      netPay: 6916,
      status: "Paid",
      date: "2024-12-31"
    },
    {
      id: "PAY002",
      month: "November",
      year: "2024",
      grossPay: 8500,
      deductions: 1584,
      netPay: 6916,
      status: "Paid",
      date: "2024-11-30"
    },
    {
      id: "PAY003",
      month: "October",
      year: "2024",
      grossPay: 8500,
      deductions: 1584,
      netPay: 6916,
      status: "Paid",
      date: "2024-10-31"
    }
  ];

  const leaveBalance = {
    annual: 18,
    sick: 5,
    personal: 3,
    used: {
      annual: 7,
      sick: 2,
      personal: 1
    }
  };

  const leaveRequests: LeaveRequest[] = [
    {
      id: "LEAVE001",
      type: "Annual Leave",
      startDate: "2024-02-15",
      endDate: "2024-02-19",
      days: 5,
      status: "Approved",
      reason: "Vacation with family",
      appliedDate: "2024-01-20"
    },
    {
      id: "LEAVE002",
      type: "Sick Leave",
      startDate: "2024-01-25",
      endDate: "2024-01-25",
      days: 1,
      status: "Approved",
      reason: "Medical appointment",
      appliedDate: "2024-01-24"
    }
  ];


  const transactions: Transaction[] = [
    {
      id: "TXN001",
      type: "credit",
      amount: 125.50,
      description: "Hourly earnings claim",
      date: "2024-12-23",
      status: "Completed",
      reference: "PAY-2024-001"
    },
    {
      id: "TXN002",
      type: "credit",
      amount: 300.00,
      description: "Hourly earnings claim",
      date: "2024-12-20",
      status: "Completed",
      reference: "PAY-2024-002"
    },
    {
      id: "TXN003",
      type: "credit",
      amount: 87.25,
      description: "Overtime earnings",
      date: "2024-12-18",
      status: "Completed",
      reference: "OT-2024-001"
    },
    {
      id: "TXN004",
      type: "credit",
      amount: 425.00,
      description: "Weekly salary payment",
      date: "2024-12-15",
      status: "Completed",
      reference: "SAL-2024-50"
    },
    {
      id: "TXN005",
      type: "credit",
      amount: 95.50,
      description: "Hourly earnings claim",
      date: "2024-12-13",
      status: "Pending",
      reference: "PAY-2024-003"
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Paid":
      case "Approved":
      case "Completed":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200";
      case "Pending":
      case "Processing":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200";
      case "Rejected":
      case "Failed":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200";
    }
  };

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  return (
    <DashboardLayout>
      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Employee Self-Service</h1>
            <p className="text-muted-foreground">
              Access your payroll information, submit requests, and manage your profile
            </p>
          </div>
        </div>

        {/* Employee Profile Card */}
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-6">
              <Avatar className="w-20 h-20">
                <AvatarImage src={employeeInfo.avatar} alt={employeeInfo.name} />
                <AvatarFallback className="text-lg">{getInitials(employeeInfo.name)}</AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <h2 className="text-2xl font-bold">{employeeInfo.name}</h2>
                <p className="text-muted-foreground">{employeeInfo.role} • {employeeInfo.department}</p>
                <div className="flex items-center gap-4 mt-2 text-sm">
                  <span>ID: {employeeInfo.employeeId}</span>
                  <span>•</span>
                  <span>Manager: {employeeInfo.manager}</span>
                  <span>•</span>
                  <span>Joined: {new Date(employeeInfo.joinDate).toLocaleDateString()}</span>
                </div>
              </div>
              <Button variant="outline">
                <Settings className="w-4 h-4 mr-2" />
                Edit Profile
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">This Month</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">${payslips[0]?.netPay.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">Net Pay</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Claimable Amount</CardTitle>
              <Wallet className="h-4 w-4 text-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">
                {nitrolite.isLoadingBalances ? 'Loading...' : `$${claimableFloat.toFixed(2)}`}
              </div>
              <p className="text-xs text-muted-foreground">
                {nitrolite.isAuthenticated ? 'Ready to claim' : 'Connect wallet to view'}
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Annual Leave</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{leaveBalance.annual}</div>
              <p className="text-xs text-muted-foreground">{leaveBalance.used.annual} days used</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Sick Leave</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{leaveBalance.sick}</div>
              <p className="text-xs text-muted-foreground">{leaveBalance.used.sick} days used</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pending Requests</CardTitle>
              <CreditCard className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{leaveRequests.filter(leave => leave.status === "Pending").length}</div>
              <p className="text-xs text-muted-foreground">Leave requests</p>
            </CardContent>
          </Card>
        </div>

        {/* Claim Available Earnings */}
        <Card className="border-green-200 bg-green-50 dark:bg-green-950 dark:border-green-800">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-green-800 dark:text-green-200">Available to Claim</CardTitle>
                <CardDescription className="text-green-700 dark:text-green-300">
                  {nitrolite.isAuthenticated
                    ? "Your hourly earnings are ready for instant withdrawal"
                    : "Connect your wallet to view available earnings"
                  }
                </CardDescription>
              </div>
              <div className="text-3xl font-bold text-green-600">
                {nitrolite.isLoadingBalances ? 'Loading...' :
                 nitrolite.isAuthenticated ? `$${claimableFloat.toFixed(2)}` :
                 '$0.00'}
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="text-sm text-green-700 dark:text-green-300">
                {nitrolite.isAuthenticated ? (
                  <>
                    <p>Available balance from your Nitrolite account</p>
                    <p>Last updated: {nitrolite.balances ? 'Just now' : 'Never'}</p>
                  </>
                ) : (
                  <>
                    <p>Connect wallet to view earnings</p>
                    <p>Payments processed via Yellow Network</p>
                  </>
                )}
              </div>
              <Button
                size="lg"
                className="bg-green-600 hover:bg-green-700 text-white px-8 py-3 disabled:opacity-50"
                onClick={handleClaim}
                disabled={!nitrolite.isAuthenticated || claimableFloat <= 0 || isClaiming || nitrolite.isLoadingBalances}
              >
                {isClaiming ? (
                  <>
                    <RefreshCw className="w-5 h-5 mr-2 animate-spin" />
                    Claiming...
                  </>
                ) : !nitrolite.isAuthenticated ? (
                  <>
                    <Wallet className="w-5 h-5 mr-2" />
                    Connect Wallet
                  </>
                ) : claimableFloat <= 0 ? (
                  <>
                    <DollarSign className="w-5 h-5 mr-2" />
                    No Funds
                  </>
                ) : (
                  <>
                    <DollarSign className="w-5 h-5 mr-2" />
                    Claim Now
                  </>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Main Content Tabs */}
        <Tabs defaultValue="transactions" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="transactions">Transaction History</TabsTrigger>
            <TabsTrigger value="payslips">My Payslips</TabsTrigger>
            <TabsTrigger value="leaves">Attendance & Leaves</TabsTrigger>
          </TabsList>

          <TabsContent value="transactions">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Wallet className="w-5 h-5" />
                  Transaction History
                </CardTitle>
                <CardDescription>
                  Your complete payment and earnings history
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Date</TableHead>
                        <TableHead>Type</TableHead>
                        <TableHead>Description</TableHead>
                        <TableHead>Amount</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Reference</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {transactions.map((transaction) => (
                        <TableRow key={transaction.id}>
                          <TableCell>{new Date(transaction.date).toLocaleDateString()}</TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              {transaction.type === "credit" ? (
                                <ArrowDownRight className="w-4 h-4 text-green-500" />
                              ) : (
                                <ArrowUpRight className="w-4 h-4 text-red-500" />
                              )}
                              <span className="capitalize">{transaction.type}</span>
                            </div>
                          </TableCell>
                          <TableCell>{transaction.description}</TableCell>
                          <TableCell className={transaction.type === "credit" ? "text-green-600 font-medium" : "text-red-600 font-medium"}>
                            {transaction.type === "credit" ? "+" : "-"}${transaction.amount.toFixed(2)}
                          </TableCell>
                          <TableCell>
                            <Badge className={getStatusColor(transaction.status)}>
                              {transaction.status}
                            </Badge>
                          </TableCell>
                          <TableCell className="font-mono text-sm">{transaction.reference}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="payslips">
            <div>
              <Card>
                <CardHeader>
                  <CardTitle>My Payslips</CardTitle>
                  <CardDescription>
                    Download your monthly payslips and salary statements
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Month</TableHead>
                          <TableHead>Gross Pay</TableHead>
                          <TableHead>Deductions</TableHead>
                          <TableHead>Net Pay</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {payslips.map((payslip) => (
                          <TableRow key={payslip.id}>
                            <TableCell className="font-medium">
                              {payslip.month} {payslip.year}
                            </TableCell>
                            <TableCell>${payslip.grossPay.toLocaleString()}</TableCell>
                            <TableCell className="text-red-600">${payslip.deductions.toLocaleString()}</TableCell>
                            <TableCell className="font-medium text-green-600">
                              ${payslip.netPay.toLocaleString()}
                            </TableCell>
                            <TableCell>
                              <Badge className={getStatusColor(payslip.status)}>
                                {payslip.status}
                              </Badge>
                            </TableCell>
                            <TableCell className="text-right">
                              <Button variant="ghost" size="sm">
                                <Download className="w-4 h-4 mr-2" />
                                Download
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>


          <TabsContent value="leaves">
            <div className="space-y-6">
              {/* Leave Balance */}
              <Card>
                <CardHeader>
                  <CardTitle>Leave Balance</CardTitle>
                  <CardDescription>
                    Your current leave balance and usage
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="text-center p-4 rounded-lg bg-muted">
                      <p className="text-2xl font-bold">{leaveBalance.annual}</p>
                      <p className="text-sm text-muted-foreground">Annual Leave Available</p>
                      <p className="text-xs text-muted-foreground mt-1">{leaveBalance.used.annual} used</p>
                    </div>
                    <div className="text-center p-4 rounded-lg bg-muted">
                      <p className="text-2xl font-bold">{leaveBalance.sick}</p>
                      <p className="text-sm text-muted-foreground">Sick Leave Available</p>
                      <p className="text-xs text-muted-foreground mt-1">{leaveBalance.used.sick} used</p>
                    </div>
                    <div className="text-center p-4 rounded-lg bg-muted">
                      <p className="text-2xl font-bold">{leaveBalance.personal}</p>
                      <p className="text-sm text-muted-foreground">Personal Leave Available</p>
                      <p className="text-xs text-muted-foreground mt-1">{leaveBalance.used.personal} used</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Leave Requests */}
              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <div>
                    <CardTitle>Leave Requests</CardTitle>
                    <CardDescription>
                      View and manage your leave applications
                    </CardDescription>
                  </div>
                  <Dialog open={showLeaveRequest} onOpenChange={setShowLeaveRequest}>
                    <DialogTrigger asChild>
                      <Button>
                        <Plus className="w-4 h-4 mr-2" />
                        Request Leave
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Request Leave</DialogTitle>
                        <DialogDescription>
                          Submit a new leave application
                        </DialogDescription>
                      </DialogHeader>
                      <div className="space-y-4">
                        <div>
                          <Label>Leave Type</Label>
                          <Select>
                            <SelectTrigger>
                              <SelectValue placeholder="Select leave type" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="annual">Annual Leave</SelectItem>
                              <SelectItem value="sick">Sick Leave</SelectItem>
                              <SelectItem value="personal">Personal Leave</SelectItem>
                              <SelectItem value="maternity">Maternity Leave</SelectItem>
                              <SelectItem value="emergency">Emergency Leave</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <Label htmlFor="startDate">Start Date</Label>
                            <Input id="startDate" type="date" />
                          </div>
                          <div>
                            <Label htmlFor="endDate">End Date</Label>
                            <Input id="endDate" type="date" />
                          </div>
                        </div>
                        <div>
                          <Label htmlFor="reason">Reason</Label>
                          <Textarea id="reason" placeholder="Reason for leave..." rows={3} />
                        </div>
                        <div className="flex justify-end gap-2">
                          <Button variant="outline" onClick={() => setShowLeaveRequest(false)}>
                            Cancel
                          </Button>
                          <Button onClick={() => setShowLeaveRequest(false)}>
                            Submit Request
                          </Button>
                        </div>
                      </div>
                    </DialogContent>
                  </Dialog>
                </CardHeader>
                <CardContent>
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Type</TableHead>
                          <TableHead>Duration</TableHead>
                          <TableHead>Days</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead>Applied</TableHead>
                          <TableHead>Reason</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {leaveRequests.map((leave) => (
                          <TableRow key={leave.id}>
                            <TableCell className="font-medium">{leave.type}</TableCell>
                            <TableCell>
                              {new Date(leave.startDate).toLocaleDateString()} - {new Date(leave.endDate).toLocaleDateString()}
                            </TableCell>
                            <TableCell>{leave.days}</TableCell>
                            <TableCell>
                              <Badge className={getStatusColor(leave.status)}>
                                {leave.status}
                              </Badge>
                            </TableCell>
                            <TableCell>{new Date(leave.appliedDate).toLocaleDateString()}</TableCell>
                            <TableCell className="max-w-xs truncate">{leave.reason}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
}