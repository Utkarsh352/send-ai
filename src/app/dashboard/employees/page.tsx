"use client";

import { useState } from "react";
import { Plus, Search, Filter, MoreHorizontal, User, Clock, Wallet, DollarSign, Edit, Trash2, Play, Pause, CheckCircle, XCircle, AlertTriangle } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { TransferButton } from "@/components/dashboard/TransferButton";

interface Employee {
  id: string;
  name: string;
  email: string;
  department: string;
  role: string;
  status: "Active" | "Inactive" | "Pending";
  startDate: string;
  hourlyRate: number;
  preferredCurrency: "BTC" | "ETH" | "USDC" | "YELLOW";
  walletAddress: string;
  hoursThisWeek: number;
  totalEarned: string;
  paymentStatus: "active" | "paused" | "pending";
  avatar?: string;
  lastPayment?: string;
}

export default function EmployeesPage() {
  const [selectedDepartment, setSelectedDepartment] = useState<string>("all");
  const [selectedStatus, setSelectedStatus] = useState<string>("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [showAddEmployeeDialog, setShowAddEmployeeDialog] = useState(false);

  // Mock data - in real app this would come from API/Yellow Network
  const employees: Employee[] = [
    {
      id: "EMP-001",
      name: "Alice Johnson",
      email: "alice@company.com",
      department: "Engineering",
      role: "Senior Developer",
      status: "Active",
      startDate: "2023-01-15",
      hourlyRate: 75,
      preferredCurrency: "BTC",
      walletAddress: "bc1qw508d6qejxtdg4y5r3zarvary0c5xw7kv8f3t4",
      hoursThisWeek: 40,
      totalEarned: "₿2.450",
      paymentStatus: "active",
      lastPayment: "2024-12-20"
    },
    {
      id: "EMP-002",
      name: "Bob Chen",
      email: "bob@company.com",
      department: "Design",
      role: "UI/UX Designer",
      status: "Active",
      startDate: "2023-03-22",
      hourlyRate: 65,
      preferredCurrency: "ETH",
      walletAddress: "0x742d35Cc7567C9E2b8F8C2F6D9bD1f4DdE7e8F9A",
      hoursThisWeek: 38,
      totalEarned: "15.67 ETH",
      paymentStatus: "active",
      lastPayment: "2024-12-19"
    },
    {
      id: "EMP-003",
      name: "Carol Davis",
      email: "carol@company.com",
      department: "Marketing",
      role: "Marketing Manager",
      status: "Active",
      startDate: "2022-11-10",
      hourlyRate: 80,
      preferredCurrency: "USDC",
      walletAddress: "0x8f4E9C1b2A3D4e5F6789aBcD1e2F3456789aBcDe",
      hoursThisWeek: 42,
      totalEarned: "12,450 USDC",
      paymentStatus: "active",
      lastPayment: "2024-12-18"
    },
    {
      id: "EMP-004",
      name: "David Wilson",
      email: "david@company.com",
      department: "Engineering",
      role: "DevOps Engineer",
      status: "Pending",
      startDate: "2024-01-08",
      hourlyRate: 70,
      preferredCurrency: "YELLOW",
      walletAddress: "yellow1qx2tsj6qz7n37x2j6qz5n7r3l9k5m6q2w1e5t7y",
      hoursThisWeek: 0,
      totalEarned: "2,850 YEL",
      paymentStatus: "pending",
      lastPayment: "2024-12-15"
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Active":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200";
      case "Inactive":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200";
      case "Pending":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200";
    }
  };

  const getPaymentStatusIcon = (status: string) => {
    switch (status) {
      case "active":
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case "paused":
        return <Pause className="w-4 h-4 text-yellow-500" />;
      case "pending":
        return <AlertTriangle className="w-4 h-4 text-orange-500" />;
      default:
        return <XCircle className="w-4 h-4 text-red-500" />;
    }
  };

  const getCurrencyColor = (currency: string) => {
    switch (currency) {
      case "BTC":
        return "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200";
      case "ETH":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200";
      case "USDC":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200";
      case "YELLOW":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200";
    }
  };

  const filteredEmployees = employees.filter((employee) => {
    if (selectedDepartment !== "all" && employee.department !== selectedDepartment) return false;
    if (selectedStatus !== "all" && employee.status !== selectedStatus) return false;
    if (searchTerm && !employee.name.toLowerCase().includes(searchTerm.toLowerCase()) && !employee.email.toLowerCase().includes(searchTerm.toLowerCase())) return false;
    return true;
  });

  const departments = ["Engineering", "Design", "Marketing", "HR", "Finance", "Operations"];
  const totalHoursThisWeek = employees.reduce((sum, emp) => sum + emp.hoursThisWeek, 0);
  const totalPayrollValue = employees.length * 2500; // Rough estimate

  return (
    <DashboardLayout>
      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold tracking-tight flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center">
                <User className="w-6 h-6 text-white" />
              </div>
              Employee Management
            </h1>
            <p className="text-muted-foreground">
              Manage employees, set hourly rates, and automate crypto payments
            </p>
          </div>
          <Dialog open={showAddEmployeeDialog} onOpenChange={setShowAddEmployeeDialog}>
            <DialogTrigger asChild>
              <Button className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700">
                <Plus className="w-4 h-4 mr-2" />
                Add Employee
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>Add New Employee</DialogTitle>
                <DialogDescription>
                  Add a new employee with their crypto wallet and hourly rate
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name</Label>
                  <Input id="name" placeholder="John Doe" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" type="email" placeholder="john@company.com" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="department">Department</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select department" />
                    </SelectTrigger>
                    <SelectContent>
                      {departments.map((dept) => (
                        <SelectItem key={dept} value={dept}>
                          {dept}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="role">Role</Label>
                  <Input id="role" placeholder="Software Engineer" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="hourlyRate">Hourly Rate ($)</Label>
                  <Input id="hourlyRate" type="number" placeholder="75" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="currency">Preferred Cryptocurrency</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select currency" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="BTC">Bitcoin (BTC)</SelectItem>
                      <SelectItem value="ETH">Ethereum (ETH)</SelectItem>
                      <SelectItem value="USDC">USD Coin (USDC)</SelectItem>
                      <SelectItem value="YELLOW">Yellow Token (YEL)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="wallet">Wallet Address</Label>
                  <Input id="wallet" placeholder="0x... or bc1q..." />
                </div>
                <div className="flex gap-2">
                  <Button className="flex-1">Add Employee</Button>
                  <Button variant="outline" onClick={() => setShowAddEmployeeDialog(false)}>
                    Cancel
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="border-l-4 border-l-green-500">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Employees</CardTitle>
              <User className="h-4 w-4 text-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{employees.length}</div>
              <p className="text-xs text-muted-foreground">+2 from last month</p>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-blue-500">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Payments</CardTitle>
              <CheckCircle className="h-4 w-4 text-blue-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{employees.filter(e => e.paymentStatus === "active").length}</div>
              <p className="text-xs text-muted-foreground">Auto-payments running</p>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-orange-500">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Hours This Week</CardTitle>
              <Clock className="h-4 w-4 text-orange-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalHoursThisWeek}</div>
              <p className="text-xs text-muted-foreground">Across all employees</p>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-purple-500">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Est. Weekly Payroll</CardTitle>
              <DollarSign className="h-4 w-4 text-purple-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">${(totalHoursThisWeek * 72).toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">Based on logged hours</p>
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
                    placeholder="Search employees..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              <Select value={selectedDepartment} onValueChange={setSelectedDepartment}>
                <SelectTrigger className="w-[180px]">
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
              <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                <SelectTrigger className="w-[150px]">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="Active">Active</SelectItem>
                  <SelectItem value="Inactive">Inactive</SelectItem>
                  <SelectItem value="Pending">Pending</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Employees Table */}
        <Card>
          <CardHeader>
            <CardTitle>Employees</CardTitle>
            <CardDescription>
              Showing {filteredEmployees.length} of {employees.length} employees
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Employee</TableHead>
                    <TableHead>Department</TableHead>
                    <TableHead>Hourly Rate</TableHead>
                    <TableHead>Currency</TableHead>
                    <TableHead>Hours This Week</TableHead>
                    <TableHead>Payment Status</TableHead>
                    <TableHead>Total Earned</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredEmployees.map((employee) => (
                    <TableRow key={employee.id} className="hover:bg-gray-50 dark:hover:bg-gray-800">
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <Avatar className="w-8 h-8">
                            <AvatarImage src={employee.avatar} alt={employee.name} />
                            <AvatarFallback>
                              {employee.name.split(" ").map(n => n[0]).join("")}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-medium">{employee.name}</p>
                            <p className="text-sm text-muted-foreground">{employee.role}</p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">{employee.department}</Badge>
                      </TableCell>
                      <TableCell className="font-bold">
                        ${employee.hourlyRate}/hr
                      </TableCell>
                      <TableCell>
                        <Badge className={getCurrencyColor(employee.preferredCurrency)}>
                          {employee.preferredCurrency}
                        </Badge>
                      </TableCell>
                      <TableCell className="font-medium">
                        {employee.hoursThisWeek}h
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          {getPaymentStatusIcon(employee.paymentStatus)}
                          <span className="capitalize">{employee.paymentStatus}</span>
                        </div>
                      </TableCell>
                      <TableCell className="font-mono font-medium">
                        {employee.totalEarned}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center gap-2 justify-end">
                          <TransferButton
                            recipientAddress={employee.walletAddress}
                            recipientName={employee.name}
                            amount={(employee.hourlyRate * 1).toString()} // 1 hour pay
                            asset="usdc"
                            size="sm"
                            variant="outline"
                          />
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="sm">
                                <MoreHorizontal className="w-4 h-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem>
                                <Edit className="w-4 h-4 mr-2" />
                                Edit Details
                              </DropdownMenuItem>
                              {employee.paymentStatus === "active" ? (
                                <DropdownMenuItem>
                                  <Pause className="w-4 h-4 mr-2" />
                                  Pause Payments
                                </DropdownMenuItem>
                              ) : (
                                <DropdownMenuItem>
                                  <Play className="w-4 h-4 mr-2" />
                                  Start Payments
                                </DropdownMenuItem>
                              )}
                              <DropdownMenuItem>
                                <Wallet className="w-4 h-4 mr-2" />
                                View Wallet
                              </DropdownMenuItem>
                              <DropdownMenuItem className="text-red-600">
                                <Trash2 className="w-4 h-4 mr-2" />
                                Remove Employee
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
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