"use client";

import { useState } from "react";
import { Search, Filter, Download, Eye, ExternalLink, Calendar, Bitcoin, CheckCircle, Clock, XCircle, AlertTriangle } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";

interface Transaction {
  id: string;
  type: "sent" | "received";
  recipient: string;
  amount: string;
  status: "completed" | "pending" | "failed" | "confirming";
  txHash: string;
  date: string;
  confirmations: number;
  fee: string;
  note?: string;
  fromAddress: string;
  toAddress: string;
}

export default function TransactionHistoryPage() {
  const [selectedStatus, setSelectedStatus] = useState<string>("all");
  const [selectedType, setSelectedType] = useState<string>("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [dateRange, setDateRange] = useState<string>("all");

  // Mock data - in real app this would come from API
  const transactions: Transaction[] = [
    {
      id: "TX-001",
      type: "sent",
      recipient: "Alice Johnson",
      amount: "₿0.152",
      status: "completed",
      txHash: "a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6q7r8s9t0",
      date: "2024-12-20T10:30:00Z",
      confirmations: 6,
      fee: "₿0.00001500",
      note: "Monthly salary payment",
      fromAddress: "bc1q...main",
      toAddress: "bc1q...alice"
    },
    {
      id: "TX-002",
      type: "sent",
      recipient: "Bob Chen",
      amount: "₿0.085",
      status: "completed",
      txHash: "b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6q7r8s9t0u1",
      date: "2024-12-20T09:15:00Z",
      confirmations: 8,
      fee: "₿0.00001200",
      note: "Bonus payment",
      fromAddress: "bc1q...main",
      toAddress: "bc1q...bob"
    },
    {
      id: "TX-003",
      type: "sent",
      recipient: "Carol Davis",
      amount: "₿0.203",
      status: "confirming",
      txHash: "c3d4e5f6g7h8i9j0k1l2m3n4o5p6q7r8s9t0u1v2",
      date: "2024-12-20T14:45:00Z",
      confirmations: 2,
      fee: "₿0.00002100",
      note: "Project completion bonus",
      fromAddress: "bc1q...main",
      toAddress: "bc1q...carol"
    },
    {
      id: "TX-004",
      type: "sent",
      recipient: "David Wilson",
      amount: "₿0.095",
      status: "pending",
      txHash: "d4e5f6g7h8i9j0k1l2m3n4o5p6q7r8s9t0u1v2w3",
      date: "2024-12-20T16:20:00Z",
      confirmations: 0,
      fee: "₿0.00001800",
      note: "Weekly payment",
      fromAddress: "bc1q...main",
      toAddress: "bc1q...david"
    },
    {
      id: "TX-005",
      type: "sent",
      recipient: "Eve Rodriguez",
      amount: "₿0.127",
      status: "failed",
      txHash: "",
      date: "2024-12-19T11:30:00Z",
      confirmations: 0,
      fee: "₿0.00000000",
      note: "Contractor payment - insufficient funds",
      fromAddress: "bc1q...main",
      toAddress: "bc1q...eve"
    }
  ];

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed":
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case "confirming":
        return <Clock className="w-4 h-4 text-blue-500" />;
      case "pending":
        return <Clock className="w-4 h-4 text-yellow-500" />;
      case "failed":
        return <XCircle className="w-4 h-4 text-red-500" />;
      default:
        return <AlertTriangle className="w-4 h-4 text-gray-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200";
      case "confirming":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200";
      case "pending":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200";
      case "failed":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200";
    }
  };

  const filteredTransactions = transactions.filter((tx) => {
    if (selectedStatus !== "all" && tx.status !== selectedStatus) return false;
    if (selectedType !== "all" && tx.type !== selectedType) return false;
    if (searchTerm && !tx.recipient.toLowerCase().includes(searchTerm.toLowerCase()) && !tx.txHash.toLowerCase().includes(searchTerm.toLowerCase())) return false;
    return true;
  });

  const totalSent = transactions
    .filter(tx => tx.type === "sent" && tx.status === "completed")
    .reduce((sum, tx) => sum + parseFloat(tx.amount.replace("₿", "")), 0);

  const totalFees = transactions
    .filter(tx => tx.status === "completed")
    .reduce((sum, tx) => sum + parseFloat(tx.fee.replace("₿", "")), 0);

  return (
    <DashboardLayout>
      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold tracking-tight flex items-center gap-3">
              <div className="w-10 h-10 bg-purple-500 rounded-full flex items-center justify-center">
                <Calendar className="w-6 h-6 text-white" />
              </div>
              Transaction History
            </h1>
            <p className="text-muted-foreground">
              View and manage all your crypto transactions
            </p>
          </div>
          <Button>
            <Download className="w-4 h-4 mr-2" />
            Export CSV
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="border-l-4 border-l-green-500">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Sent</CardTitle>
              <Bitcoin className="h-4 w-4 text-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold font-mono">₿{totalSent.toFixed(8)}</div>
              <p className="text-xs text-muted-foreground">All time</p>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-blue-500">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Transactions</CardTitle>
              <Calendar className="h-4 w-4 text-blue-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{transactions.length}</div>
              <p className="text-xs text-muted-foreground">This month</p>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-orange-500">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Network Fees</CardTitle>
              <Bitcoin className="h-4 w-4 text-orange-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold font-mono">₿{totalFees.toFixed(8)}</div>
              <p className="text-xs text-muted-foreground">Total paid</p>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-purple-500">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Success Rate</CardTitle>
              <CheckCircle className="h-4 w-4 text-purple-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {Math.round((transactions.filter(tx => tx.status === "completed").length / transactions.length) * 100)}%
              </div>
              <p className="text-xs text-muted-foreground">Completion rate</p>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Filter className="w-5 h-5" />
              Filters
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-4">
              <div className="flex-1 min-w-[200px]">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    placeholder="Search transactions..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                <SelectTrigger className="w-[150px]">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                  <SelectItem value="confirming">Confirming</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="failed">Failed</SelectItem>
                </SelectContent>
              </Select>
              <Select value={selectedType} onValueChange={setSelectedType}>
                <SelectTrigger className="w-[150px]">
                  <SelectValue placeholder="Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="sent">Sent</SelectItem>
                  <SelectItem value="received">Received</SelectItem>
                </SelectContent>
              </Select>
              <Select value={dateRange} onValueChange={setDateRange}>
                <SelectTrigger className="w-[150px]">
                  <SelectValue placeholder="Date Range" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Time</SelectItem>
                  <SelectItem value="today">Today</SelectItem>
                  <SelectItem value="week">This Week</SelectItem>
                  <SelectItem value="month">This Month</SelectItem>
                  <SelectItem value="year">This Year</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Transactions Table */}
        <Card>
          <CardHeader>
            <CardTitle>Transactions</CardTitle>
            <CardDescription>
              Showing {filteredTransactions.length} of {transactions.length} transactions
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>Recipient</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Confirmations</TableHead>
                    <TableHead>Fee</TableHead>
                    <TableHead>Transaction Hash</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredTransactions.map((tx) => (
                    <TableRow key={tx.id} className="hover:bg-gray-50 dark:hover:bg-gray-800">
                      <TableCell>
                        {new Date(tx.date).toLocaleDateString()} {new Date(tx.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </TableCell>
                      <TableCell>
                        <div>
                          <p className="font-medium">{tx.recipient}</p>
                          {tx.note && <p className="text-sm text-muted-foreground">{tx.note}</p>}
                        </div>
                      </TableCell>
                      <TableCell className="font-mono font-medium text-orange-600">
                        {tx.amount}
                      </TableCell>
                      <TableCell>
                        <Badge className={getStatusColor(tx.status)}>
                          <div className="flex items-center gap-1">
                            {getStatusIcon(tx.status)}
                            {tx.status.charAt(0).toUpperCase() + tx.status.slice(1)}
                          </div>
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <span>{tx.confirmations}</span>
                          {tx.confirmations >= 6 && <CheckCircle className="w-3 h-3 text-green-500" />}
                        </div>
                      </TableCell>
                      <TableCell className="font-mono text-sm">
                        {tx.fee}
                      </TableCell>
                      <TableCell>
                        {tx.txHash ? (
                          <div className="font-mono text-sm">
                            {tx.txHash.slice(0, 8)}...{tx.txHash.slice(-8)}
                            <Button variant="ghost" size="sm" className="ml-2 h-6 w-6 p-0">
                              <ExternalLink className="w-3 h-3" />
                            </Button>
                          </div>
                        ) : (
                          <span className="text-muted-foreground">-</span>
                        )}
                      </TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm">
                              Actions
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem>
                              <Eye className="w-4 h-4 mr-2" />
                              View Details
                            </DropdownMenuItem>
                            {tx.txHash && (
                              <DropdownMenuItem>
                                <ExternalLink className="w-4 h-4 mr-2" />
                                View on Explorer
                              </DropdownMenuItem>
                            )}
                            <DropdownMenuItem>
                              <Download className="w-4 h-4 mr-2" />
                              Download Receipt
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}