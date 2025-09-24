"use client";

import { useState } from "react";
import { Plus, Search, Filter, MoreHorizontal, User, DollarSign, Calendar, FileText, Archive, Edit, Download, Eye } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { motion } from "framer-motion";

interface Employee {
  id: string;
  name: string;
  email: string;
  department: string;
  role: string;
  status: "Active" | "Inactive" | "On Leave";
  joinDate: string;
  salary: number;
  location: string;
  manager: string;
  avatar?: string;
  phone?: string;
  address?: string;
  bankDetails?: {
    accountNumber: string;
    routingNumber: string;
    bankName: string;
  };
  payrollHistory: Array<{
    month: string;
    amount: number;
    status: string;
    date: string;
  }>;
  leaveBalance: {
    annual: number;
    sick: number;
    personal: number;
  };
  documents: Array<{
    type: string;
    name: string;
    date: string;
    size: string;
  }>;
}

export default function EmployeesPage() {
  const [selectedDepartment, setSelectedDepartment] = useState<string>("all");
  const [selectedStatus, setSelectedStatus] = useState<string>("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);
  const [showAddEmployee, setShowAddEmployee] = useState(false);

  // Mock data - in real app this would come from API
  const employees: Employee[] = [
    {
      id: "EMP001",
      name: "John Doe",
      email: "john.doe@company.com",
      department: "Engineering",
      role: "Senior Developer",
      status: "Active",
      joinDate: "2022-03-15",
      salary: 95000,
      location: "New York, NY",
      manager: "Sarah Johnson",
      phone: "+1 (555) 123-4567",
      address: "123 Main St, New York, NY 10001",
      bankDetails: {
        accountNumber: "****1234",
        routingNumber: "021000021",
        bankName: "Chase Bank"
      },
      payrollHistory: [
        { month: "December 2024", amount: 7916, status: "Paid", date: "2024-12-31" },
        { month: "November 2024", amount: 7916, status: "Paid", date: "2024-11-30" },
        { month: "October 2024", amount: 7916, status: "Paid", date: "2024-10-31" }
      ],
      leaveBalance: {
        annual: 18,
        sick: 5,
        personal: 3
      },
      documents: [
        { type: "Form-16", name: "Form-16_2024.pdf", date: "2024-01-15", size: "245 KB" },
        { type: "Payslip", name: "Payslip_Dec2024.pdf", date: "2024-12-31", size: "128 KB" },
        { type: "Contract", name: "Employment_Contract.pdf", date: "2022-03-15", size: "512 KB" }
      ]
    },
    {
      id: "EMP002",
      name: "Jane Smith",
      email: "jane.smith@company.com",
      department: "Marketing",
      role: "Marketing Manager",
      status: "Active",
      joinDate: "2021-08-22",
      salary: 78000,
      location: "San Francisco, CA",
      manager: "Mike Chen",
      phone: "+1 (555) 987-6543",
      address: "456 Oak Ave, San Francisco, CA 94102",
      payrollHistory: [
        { month: "December 2024", amount: 6500, status: "Paid", date: "2024-12-31" },
        { month: "November 2024", amount: 6500, status: "Paid", date: "2024-11-30" },
        { month: "October 2024", amount: 6500, status: "Paid", date: "2024-10-31" }
      ],
      leaveBalance: {
        annual: 12,
        sick: 8,
        personal: 2
      },
      documents: [
        { type: "Form-16", name: "Form-16_2024.pdf", date: "2024-01-15", size: "245 KB" },
        { type: "Payslip", name: "Payslip_Dec2024.pdf", date: "2024-12-31", size: "128 KB" }
      ]
    },
    {
      id: "EMP003",
      name: "Mike Johnson",
      email: "mike.johnson@company.com",
      department: "Sales",
      role: "Sales Executive",
      status: "On Leave",
      joinDate: "2023-01-10",
      salary: 65000,
      location: "Chicago, IL",
      manager: "Linda Davis",
      phone: "+1 (555) 456-7890",
      address: "789 Elm St, Chicago, IL 60601",
      payrollHistory: [
        { month: "December 2024", amount: 5416, status: "Paid", date: "2024-12-31" },
        { month: "November 2024", amount: 5416, status: "Paid", date: "2024-11-30" }
      ],
      leaveBalance: {
        annual: 20,
        sick: 0,
        personal: 5
      },
      documents: [
        { type: "Payslip", name: "Payslip_Dec2024.pdf", date: "2024-12-31", size: "128 KB" }
      ]
    },
    {
      id: "EMP004",
      name: "Alice Brown",
      email: "alice.brown@company.com",
      department: "HR",
      role: "HR Specialist",
      status: "Active",
      joinDate: "2022-11-05",
      salary: 58000,
      location: "Austin, TX",
      manager: "Robert Wilson",
      phone: "+1 (555) 234-5678",
      address: "321 Pine St, Austin, TX 73301",
      payrollHistory: [
        { month: "December 2024", amount: 4833, status: "Paid", date: "2024-12-31" },
        { month: "November 2024", amount: 4833, status: "Paid", date: "2024-11-30" }
      ],
      leaveBalance: {
        annual: 15,
        sick: 7,
        personal: 4
      },
      documents: [
        { type: "Form-16", name: "Form-16_2024.pdf", date: "2024-01-15", size: "245 KB" },
        { type: "Payslip", name: "Payslip_Dec2024.pdf", date: "2024-12-31", size: "128 KB" }
      ]
    }
  ];

  const departments = ["Engineering", "Marketing", "Sales", "HR", "Finance", "Operations"];
  const statusOptions = ["Active", "Inactive", "On Leave"];

  const filteredEmployees = employees.filter((emp) => {
    if (selectedDepartment !== "all" && emp.department !== selectedDepartment) return false;
    if (selectedStatus !== "all" && emp.status !== selectedStatus) return false;
    if (searchTerm && !emp.name.toLowerCase().includes(searchTerm.toLowerCase()) && !emp.email.toLowerCase().includes(searchTerm.toLowerCase())) return false;
    return true;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Active":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200";
      case "Inactive":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200";
      case "On Leave":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200";
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
            <h1 className="text-3xl font-bold tracking-tight">Employees</h1>
            <p className="text-muted-foreground">
              Manage your workforce and employee information
            </p>
          </div>
          <Button onClick={() => setShowAddEmployee(true)}>
            <Plus className="w-4 h-4 mr-2" />
            Add Employee
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Employees</CardTitle>
              <User className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{employees.length}</div>
              <p className="text-xs text-muted-foreground">Across {departments.length} departments</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Employees</CardTitle>
              <User className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{employees.filter(emp => emp.status === "Active").length}</div>
              <p className="text-xs text-muted-foreground">Currently working</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">On Leave</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{employees.filter(emp => emp.status === "On Leave").length}</div>
              <p className="text-xs text-muted-foreground">Temporary absence</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Avg. Salary</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                ${Math.round(employees.reduce((sum, emp) => sum + emp.salary, 0) / employees.length).toLocaleString()}
              </div>
              <p className="text-xs text-muted-foreground">Per year</p>
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
              <div className="flex-1 min-w-[250px]">
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
              <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                <SelectTrigger className="w-[120px]">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  {statusOptions.map((status) => (
                    <SelectItem key={status} value={status}>
                      {status}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Employees Table */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <Card>
            <CardHeader>
              <CardTitle>Employee Directory</CardTitle>
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
                      <TableHead>Role</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Location</TableHead>
                      <TableHead>Join Date</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredEmployees.map((employee) => (
                      <TableRow key={employee.id}>
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <Avatar className="w-8 h-8">
                              <AvatarImage src={employee.avatar} alt={employee.name} />
                              <AvatarFallback>{getInitials(employee.name)}</AvatarFallback>
                            </Avatar>
                            <div>
                              <p className="font-medium">{employee.name}</p>
                              <p className="text-sm text-muted-foreground">{employee.email}</p>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>{employee.department}</TableCell>
                        <TableCell>{employee.role}</TableCell>
                        <TableCell>
                          <Badge className={getStatusColor(employee.status)}>
                            {employee.status}
                          </Badge>
                        </TableCell>
                        <TableCell>{employee.location}</TableCell>
                        <TableCell>{new Date(employee.joinDate).toLocaleDateString()}</TableCell>
                        <TableCell className="text-right">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="sm">
                                <MoreHorizontal className="w-4 h-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem onClick={() => setSelectedEmployee(employee)}>
                                <Eye className="w-4 h-4 mr-2" />
                                View Profile
                              </DropdownMenuItem>
                              <DropdownMenuItem>
                                <Edit className="w-4 h-4 mr-2" />
                                Edit
                              </DropdownMenuItem>
                              <DropdownMenuItem>
                                <Archive className="w-4 h-4 mr-2" />
                                Archive
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
        </motion.div>
      </div>

      {/* Employee Profile Modal */}
      {selectedEmployee && (
        <Dialog open={!!selectedEmployee} onOpenChange={() => setSelectedEmployee(null)}>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-3">
                <Avatar className="w-10 h-10">
                  <AvatarImage src={selectedEmployee.avatar} alt={selectedEmployee.name} />
                  <AvatarFallback>{getInitials(selectedEmployee.name)}</AvatarFallback>
                </Avatar>
                <div>
                  <h2 className="text-xl font-semibold">{selectedEmployee.name}</h2>
                  <p className="text-sm text-muted-foreground">{selectedEmployee.role} • {selectedEmployee.department}</p>
                </div>
              </DialogTitle>
              <DialogDescription>
                Employee ID: {selectedEmployee.id}
              </DialogDescription>
            </DialogHeader>

            <Tabs defaultValue="overview" className="h-full">
              <TabsList className="grid w-full grid-cols-5">
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="compensation">Compensation</TabsTrigger>
                <TabsTrigger value="attendance">Attendance</TabsTrigger>
                <TabsTrigger value="payroll">Payroll History</TabsTrigger>
                <TabsTrigger value="documents">Documents</TabsTrigger>
              </TabsList>

              <div className="overflow-auto h-[500px] mt-4">
                <TabsContent value="overview" className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Card>
                      <CardHeader>
                        <CardTitle>Personal Information</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        <div>
                          <Label className="text-sm font-medium">Email</Label>
                          <p className="text-sm">{selectedEmployee.email}</p>
                        </div>
                        <div>
                          <Label className="text-sm font-medium">Phone</Label>
                          <p className="text-sm">{selectedEmployee.phone || "Not provided"}</p>
                        </div>
                        <div>
                          <Label className="text-sm font-medium">Address</Label>
                          <p className="text-sm">{selectedEmployee.address || "Not provided"}</p>
                        </div>
                        <div>
                          <Label className="text-sm font-medium">Join Date</Label>
                          <p className="text-sm">{new Date(selectedEmployee.joinDate).toLocaleDateString()}</p>
                        </div>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader>
                        <CardTitle>Employment Details</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        <div>
                          <Label className="text-sm font-medium">Department</Label>
                          <p className="text-sm">{selectedEmployee.department}</p>
                        </div>
                        <div>
                          <Label className="text-sm font-medium">Role</Label>
                          <p className="text-sm">{selectedEmployee.role}</p>
                        </div>
                        <div>
                          <Label className="text-sm font-medium">Manager</Label>
                          <p className="text-sm">{selectedEmployee.manager}</p>
                        </div>
                        <div>
                          <Label className="text-sm font-medium">Status</Label>
                          <Badge className={getStatusColor(selectedEmployee.status)}>
                            {selectedEmployee.status}
                          </Badge>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </TabsContent>

                <TabsContent value="compensation" className="space-y-4">
                  <Card>
                    <CardHeader>
                      <CardTitle>Compensation Details</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <Label className="text-sm font-medium">Annual Salary</Label>
                          <p className="text-2xl font-bold">${selectedEmployee.salary.toLocaleString()}</p>
                        </div>
                        <div>
                          <Label className="text-sm font-medium">Monthly Salary</Label>
                          <p className="text-2xl font-bold">${Math.round(selectedEmployee.salary / 12).toLocaleString()}</p>
                        </div>
                      </div>
                      {selectedEmployee.bankDetails && (
                        <div className="mt-6">
                          <h4 className="font-medium mb-3">Bank Details</h4>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                              <Label className="text-sm font-medium">Bank Name</Label>
                              <p className="text-sm">{selectedEmployee.bankDetails.bankName}</p>
                            </div>
                            <div>
                              <Label className="text-sm font-medium">Account Number</Label>
                              <p className="text-sm">{selectedEmployee.bankDetails.accountNumber}</p>
                            </div>
                          </div>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="attendance" className="space-y-4">
                  <Card>
                    <CardHeader>
                      <CardTitle>Leave Balance</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-3 gap-4">
                        <div className="text-center p-4 rounded-lg bg-muted">
                          <p className="text-2xl font-bold">{selectedEmployee.leaveBalance.annual}</p>
                          <p className="text-sm text-muted-foreground">Annual Leave</p>
                        </div>
                        <div className="text-center p-4 rounded-lg bg-muted">
                          <p className="text-2xl font-bold">{selectedEmployee.leaveBalance.sick}</p>
                          <p className="text-sm text-muted-foreground">Sick Leave</p>
                        </div>
                        <div className="text-center p-4 rounded-lg bg-muted">
                          <p className="text-2xl font-bold">{selectedEmployee.leaveBalance.personal}</p>
                          <p className="text-sm text-muted-foreground">Personal Leave</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="payroll" className="space-y-4">
                  <Card>
                    <CardHeader>
                      <CardTitle>Payroll History</CardTitle>
                      <CardDescription>Recent salary payments and payslips</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        {selectedEmployee.payrollHistory.map((payment, index) => (
                          <div key={index} className="flex items-center justify-between p-3 rounded-lg border">
                            <div>
                              <p className="font-medium">{payment.month}</p>
                              <p className="text-sm text-muted-foreground">{new Date(payment.date).toLocaleDateString()}</p>
                            </div>
                            <div className="text-right">
                              <p className="font-medium">${payment.amount.toLocaleString()}</p>
                              <div className="flex items-center gap-2">
                                <Badge variant="outline" className="text-green-600 border-green-600">
                                  {payment.status}
                                </Badge>
                                <Button variant="ghost" size="sm">
                                  <Download className="w-3 h-3 mr-1" />
                                  Download
                                </Button>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="documents" className="space-y-4">
                  <Card>
                    <CardHeader>
                      <CardTitle>Tax & Compliance Documents</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        {selectedEmployee.documents.map((doc, index) => (
                          <div key={index} className="flex items-center justify-between p-3 rounded-lg border">
                            <div className="flex items-center gap-3">
                              <FileText className="w-5 h-5 text-muted-foreground" />
                              <div>
                                <p className="font-medium">{doc.name}</p>
                                <p className="text-sm text-muted-foreground">{doc.type} • {doc.size} • {new Date(doc.date).toLocaleDateString()}</p>
                              </div>
                            </div>
                            <Button variant="ghost" size="sm">
                              <Download className="w-4 h-4 mr-2" />
                              Download
                            </Button>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
              </div>
            </Tabs>
          </DialogContent>
        </Dialog>
      )}
    </DashboardLayout>
  );
}