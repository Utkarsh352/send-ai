"use client";

import { useState } from "react";
import { Plus, Filter, Download, Eye, Edit, CheckCircle, Clock, XCircle, AlertTriangle, Calendar, Search, Play, Pause, Zap, Activity } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { ScheduledPaymentsManager } from "@/components/dashboard/ScheduledPaymentsManager";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface PayrollRun {
  id: string;
  period: string;
  status: "completed" | "pending" | "processing" | "failed" | "scheduled";
  totalAmount: string;
  totalHours: number;
  employeeCount: number;
  approver: string;
  date: string;
  department: string;
  smartContractAddress?: string;
  transactionHash?: string;
  channelId?: string;
}

export default function PayrollRunsPage() {
  const [selectedStatus, setSelectedStatus] = useState<string>("all");
  const [selectedDepartment, setSelectedDepartment] = useState<string>("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [dateRange, setDateRange] = useState<string>("all");
  const [showCreateDialog, setShowCreateDialog] = useState(false);

  // Mock employees data for scheduled payments
  const employees = [
    {
      id: "EMP-001",
      name: "Alice Johnson",
      walletAddress: "0x742d35Cc7567C9E2b8F8C2F6D9bD1f4DdE7e8F9A",
      hourlyRate: 75,
      preferredCurrency: "USDC",
      paymentStatus: "active"
    },
    {
      id: "EMP-002",
      name: "Bob Chen",
      walletAddress: "0x8f4E9C1b2A3D4e5F6789aBcD1e2F3456789aBcDe",
      hourlyRate: 65,
      preferredCurrency: "USDC",
      paymentStatus: "active"
    },
    {
      id: "EMP-003",
      name: "Carol Davis",
      walletAddress: "0x1234567890abcdef1234567890abcdef12345678",
      hourlyRate: 80,
      preferredCurrency: "USDC",
      paymentStatus: "active"
    },
    {
      id: "EMP-004",
      name: "David Wilson",
      walletAddress: "0xabcdef1234567890abcdef1234567890abcdef12",
      hourlyRate: 70,
      preferredCurrency: "USDC",
      paymentStatus: "active"
    }
  ];

  // Mock data - in real app this would come from Yellow Network smart contract
  const payrollRuns: PayrollRun[] = [
    {
      id: "PR-2024-001",
      period: "Weekly - Dec 16-22, 2024",
      status: "completed",
      totalAmount: "₿8.923",
      totalHours: 320,
      employeeCount: 8,
      approver: "Sarah Johnson",
      date: "2024-12-22",
      department: "All Departments",
      smartContractAddress: "0x742d35Cc7567C9E2b8F8C2F6D9bD1f4DdE7e8F9A",
      transactionHash: "0xa1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6q7r8s9t0",
      channelId: "ch_001"
    },
    {
      id: "PR-2024-002",
      period: "Engineering Bonus - Q4 2024",
      status: "processing",
      totalAmount: "₿1.568",
      totalHours: 0,
      employeeCount: 5,
      approver: "Mike Chen",
      date: "2024-12-23",
      department: "Engineering",
      smartContractAddress: "0x742d35Cc7567C9E2b8F8C2F6D9bD1f4DdE7e8F9A",
      channelId: "ch_002"
    },
    {
      id: "PR-2024-003",
      period: "Design Team - Dec 16-22, 2024",
      status: "scheduled",
      totalAmount: "₿0.452",
      totalHours: 152,
      employeeCount: 3,
      approver: "Linda Davis",
      date: "2024-12-25",
      department: "Design"
    },
    {
      id: "PR-2024-004",
      period: "Marketing - Dec 16-22, 2024",
      status: "failed",
      totalAmount: "₿0.789",
      totalHours: 120,
      employeeCount: 2,
      approver: "John Smith",
      date: "2024-12-24",
      department: "Marketing"
    }
  ];

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed":
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case "processing":
        return <Clock className="w-4 h-4 text-blue-500" />;
      case "scheduled":
        return <Calendar className="w-4 h-4 text-purple-500" />;
      case "pending":
        return <AlertTriangle className="w-4 h-4 text-yellow-500" />;
      case "failed":
        return <XCircle className="w-4 h-4 text-red-500" />;
      default:
        return null;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200";
      case "processing":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200";
      case "scheduled":
        return "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200";
      case "pending":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200";
      case "failed":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200";
    }
  };

  const filteredPayrollRuns = payrollRuns.filter((run) => {
    if (selectedStatus !== "all" && run.status !== selectedStatus) return false;
    if (selectedDepartment !== "all" && !run.department.toLowerCase().includes(selectedDepartment.toLowerCase())) return false;
    if (searchTerm && !run.period.toLowerCase().includes(searchTerm.toLowerCase()) && !run.id.toLowerCase().includes(searchTerm.toLowerCase())) return false;
    return true;
  });

  const departments = ["Engineering", "Design", "Marketing", "HR", "Finance", "Operations"];
  const statusOptions = ["completed", "processing", "scheduled", "pending", "failed"];

  return (
    <DashboardLayout>
      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold tracking-tight flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                <Zap className="w-6 h-6 text-white" />
              </div>
              Payroll Automation
            </h1>
            <p className="text-muted-foreground">
              Manage automated crypto payroll runs via Yellow Network smart contracts
            </p>
          </div>
          <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
            <DialogTrigger asChild>
              <Button className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600">
                <Plus className="w-4 h-4 mr-2" />
                Create Payroll Run
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>Create Payroll Run</DialogTitle>
                <DialogDescription>
                  Set up automated crypto payments for employees
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="period">Pay Period</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select period" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="weekly">Weekly</SelectItem>
                      <SelectItem value="biweekly">Bi-weekly</SelectItem>
                      <SelectItem value="monthly">Monthly</SelectItem>
                      <SelectItem value="bonus">One-time Bonus</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="department">Department</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select department" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Departments</SelectItem>
                      {departments.map((dept) => (
                        <SelectItem key={dept} value={dept}>
                          {dept}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="schedule">Payment Schedule</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="When to execute" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="immediate">Execute Now</SelectItem>
                      <SelectItem value="scheduled">Schedule for Later</SelectItem>
                      <SelectItem value="approval">Require Approval First</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <Activity className="w-4 h-4 text-blue-500" />
                    <span className="text-sm font-medium">Smart Contract Deployment</span>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    This will deploy a new smart contract on Yellow Network to handle automated payments
                  </p>
                </div>
                <div className="flex gap-2">
                  <Button className="flex-1">Create & Deploy</Button>
                  <Button variant="outline" onClick={() => setShowCreateDialog(false)}>
                    Cancel
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* Main Content Tabs */}
        <Tabs defaultValue="batch" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="batch">Batch Payroll Runs</TabsTrigger>
            <TabsTrigger value="scheduled">Hourly Payments</TabsTrigger>
          </TabsList>

          <TabsContent value="batch" className="space-y-6">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Card className="border-l-4 border-l-green-500">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Runs</CardTitle>
                  <Calendar className="h-4 w-4 text-green-500" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{payrollRuns.length}</div>
                  <p className="text-xs text-muted-foreground">This month</p>
                </CardContent>
              </Card>

              <Card className="border-l-4 border-l-blue-500">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Active Contracts</CardTitle>
                  <Activity className="h-4 w-4 text-blue-500" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">3</div>
                  <p className="text-xs text-muted-foreground">Smart contracts deployed</p>
                </CardContent>
              </Card>

              <Card className="border-l-4 border-l-purple-500">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Paid</CardTitle>
                  <CheckCircle className="h-4 w-4 text-purple-500" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold font-mono">₿11.491</div>
                  <p className="text-xs text-muted-foreground">Via Yellow Network</p>
                </CardContent>
              </Card>

              <Card className="border-l-4 border-l-orange-500">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Success Rate</CardTitle>
                  <CheckCircle className="h-4 w-4 text-orange-500" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">96.2%</div>
                  <p className="text-xs text-muted-foreground">Payment success rate</p>
                </CardContent>
              </Card>
            </div>

        {/* Filters and Search */}
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
                    placeholder="Search payroll runs..."
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
                  {statusOptions.map((status) => (
                    <SelectItem key={status} value={status}>
                      {status.charAt(0).toUpperCase() + status.slice(1)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={selectedDepartment} onValueChange={setSelectedDepartment}>
                <SelectTrigger className="w-[150px]">
                  <SelectValue placeholder="Department" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Departments</SelectItem>
                  {departments.map((dept) => (
                    <SelectItem key={dept} value={dept}>
                      {dept}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Payroll Runs Table */}
        <Card>
          <CardHeader>
            <CardTitle>Automated Payroll Runs</CardTitle>
            <CardDescription>
              Showing {filteredPayrollRuns.length} of {payrollRuns.length} payroll runs
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Run ID</TableHead>
                    <TableHead>Period</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Employees</TableHead>
                    <TableHead>Hours</TableHead>
                    <TableHead>Smart Contract</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredPayrollRuns.map((run) => (
                    <TableRow key={run.id} className="hover:bg-gray-50 dark:hover:bg-gray-800">
                      <TableCell className="font-medium font-mono text-sm">{run.id}</TableCell>
                      <TableCell>
                        <div>
                          <p className="font-medium">{run.period}</p>
                          <p className="text-sm text-muted-foreground">{run.department}</p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge className={getStatusColor(run.status)}>
                          <div className="flex items-center gap-1">
                            {getStatusIcon(run.status)}
                            {run.status.charAt(0).toUpperCase() + run.status.slice(1)}
                          </div>
                        </Badge>
                      </TableCell>
                      <TableCell className="font-medium font-mono text-purple-600">
                        {run.totalAmount}
                      </TableCell>
                      <TableCell className="font-medium">{run.employeeCount}</TableCell>
                      <TableCell className="font-medium">{run.totalHours}h</TableCell>
                      <TableCell>
                        {run.smartContractAddress ? (
                          <div className="font-mono text-xs">
                            {run.smartContractAddress.slice(0, 6)}...{run.smartContractAddress.slice(-4)}
                          </div>
                        ) : (
                          <span className="text-muted-foreground text-sm">Pending</span>
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
                            {run.status === "scheduled" && (
                              <DropdownMenuItem>
                                <Play className="w-4 h-4 mr-2" />
                                Execute Now
                              </DropdownMenuItem>
                            )}
                            {run.status === "processing" && (
                              <DropdownMenuItem>
                                <Pause className="w-4 h-4 mr-2" />
                                Pause Processing
                              </DropdownMenuItem>
                            )}
                            {run.smartContractAddress && (
                              <DropdownMenuItem>
                                <Activity className="w-4 h-4 mr-2" />
                                View Contract
                              </DropdownMenuItem>
                            )}
                            <DropdownMenuItem>
                              <Download className="w-4 h-4 mr-2" />
                              Download Report
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
          </TabsContent>

          <TabsContent value="scheduled" className="space-y-6">
            <ScheduledPaymentsManager employees={employees} />
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
}