"use client";

import { useState } from "react";
import { User, FileText, Download, Upload, Calendar, DollarSign, Clock, CreditCard, Settings, Bell, RefreshCw, Plus } from "lucide-react";
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

interface ReimbursementClaim {
  id: string;
  type: string;
  amount: number;
  description: string;
  status: "Approved" | "Pending" | "Rejected";
  submittedDate: string;
  receipts: string[];
}

export default function EmployeePortalPage() {
  const [showLeaveRequest, setShowLeaveRequest] = useState(false);
  const [showReimbursementClaim, setShowReimbursementClaim] = useState(false);
  const [showTaxDeclaration, setShowTaxDeclaration] = useState(false);

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

  const reimbursementClaims: ReimbursementClaim[] = [
    {
      id: "REIMB001",
      type: "Travel",
      amount: 250.00,
      description: "Client meeting transportation and meals",
      status: "Approved",
      submittedDate: "2024-01-15",
      receipts: ["receipt1.pdf", "receipt2.pdf"]
    },
    {
      id: "REIMB002",
      type: "Professional Development",
      amount: 450.00,
      description: "Online course certification",
      status: "Pending",
      submittedDate: "2024-01-22",
      receipts: ["invoice.pdf"]
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Paid":
      case "Approved":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200";
      case "Pending":
      case "Processing":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200";
      case "Rejected":
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
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
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
              <CardTitle className="text-sm font-medium">Pending Claims</CardTitle>
              <CreditCard className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{reimbursementClaims.filter(claim => claim.status === "Pending").length}</div>
              <p className="text-xs text-muted-foreground">Reimbursement claims</p>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Tabs */}
        <Tabs defaultValue="payslips" className="space-y-6">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="payslips">My Payslips</TabsTrigger>
            <TabsTrigger value="tax">Tax Declarations</TabsTrigger>
            <TabsTrigger value="reimbursements">Reimbursements</TabsTrigger>
            <TabsTrigger value="loans">Loans & Advances</TabsTrigger>
            <TabsTrigger value="leaves">Attendance & Leaves</TabsTrigger>
          </TabsList>

          <TabsContent value="payslips">
            <div
              }
              }
            >
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

          <TabsContent value="tax">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle>Tax Declarations</CardTitle>
                  <CardDescription>
                    Submit tax-saving investment declarations and download tax documents
                  </CardDescription>
                </div>
                <Dialog open={showTaxDeclaration} onOpenChange={setShowTaxDeclaration}>
                  <DialogTrigger asChild>
                    <Button>
                      <Upload className="w-4 h-4 mr-2" />
                      Upload Declaration
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Upload Tax Declaration</DialogTitle>
                      <DialogDescription>
                        Upload your tax-saving investment declarations
                      </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div>
                        <Label>Financial Year</Label>
                        <Select>
                          <SelectTrigger>
                            <SelectValue placeholder="Select financial year" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="2024-25">2024-25</SelectItem>
                            <SelectItem value="2023-24">2023-24</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label>Declaration Type</Label>
                        <Select>
                          <SelectTrigger>
                            <SelectValue placeholder="Select declaration type" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="80c">Section 80C</SelectItem>
                            <SelectItem value="80d">Section 80D</SelectItem>
                            <SelectItem value="hra">HRA Declaration</SelectItem>
                            <SelectItem value="nps">NPS Declaration</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label htmlFor="amount">Amount</Label>
                        <Input id="amount" type="number" placeholder="Enter amount" />
                      </div>
                      <div>
                        <Label htmlFor="document">Supporting Document</Label>
                        <Input id="document" type="file" accept=".pdf,.jpg,.png" />
                      </div>
                      <div className="flex justify-end gap-2">
                        <Button variant="outline" onClick={() => setShowTaxDeclaration(false)}>
                          Cancel
                        </Button>
                        <Button onClick={() => setShowTaxDeclaration(false)}>
                          Submit Declaration
                        </Button>
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Card>
                      <CardHeader className="pb-3">
                        <CardTitle className="text-lg">Form-16 (2024)</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm text-muted-foreground mb-4">
                          Annual tax certificate for financial year 2023-24
                        </p>
                        <Button variant="outline" size="sm">
                          <Download className="w-4 h-4 mr-2" />
                          Download Form-16
                        </Button>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader className="pb-3">
                        <CardTitle className="text-lg">TDS Certificate</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm text-muted-foreground mb-4">
                          Tax deducted at source certificate
                        </p>
                        <Button variant="outline" size="sm">
                          <Download className="w-4 h-4 mr-2" />
                          Download TDS Certificate
                        </Button>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="reimbursements">
            <div className="space-y-6">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <div>
                    <CardTitle>Reimbursement Claims</CardTitle>
                    <CardDescription>
                      Submit and track your expense reimbursement claims
                    </CardDescription>
                  </div>
                  <Dialog open={showReimbursementClaim} onOpenChange={setShowReimbursementClaim}>
                    <DialogTrigger asChild>
                      <Button>
                        <Plus className="w-4 h-4 mr-2" />
                        Submit Claim
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Submit Reimbursement Claim</DialogTitle>
                        <DialogDescription>
                          Submit a new expense claim for reimbursement
                        </DialogDescription>
                      </DialogHeader>
                      <div className="space-y-4">
                        <div>
                          <Label>Expense Type</Label>
                          <Select>
                            <SelectTrigger>
                              <SelectValue placeholder="Select expense type" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="travel">Travel & Transportation</SelectItem>
                              <SelectItem value="meals">Business Meals</SelectItem>
                              <SelectItem value="training">Professional Development</SelectItem>
                              <SelectItem value="office">Office Supplies</SelectItem>
                              <SelectItem value="internet">Internet/Phone Bills</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div>
                          <Label htmlFor="claimAmount">Amount</Label>
                          <Input id="claimAmount" type="number" placeholder="Enter amount" />
                        </div>
                        <div>
                          <Label htmlFor="description">Description</Label>
                          <Textarea id="description" placeholder="Describe your expense..." rows={3} />
                        </div>
                        <div>
                          <Label htmlFor="receipts">Upload Receipts</Label>
                          <Input id="receipts" type="file" multiple accept=".pdf,.jpg,.png" />
                        </div>
                        <div className="flex justify-end gap-2">
                          <Button variant="outline" onClick={() => setShowReimbursementClaim(false)}>
                            Cancel
                          </Button>
                          <Button onClick={() => setShowReimbursementClaim(false)}>
                            Submit Claim
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
                          <TableHead>Description</TableHead>
                          <TableHead>Amount</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead>Submitted</TableHead>
                          <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {reimbursementClaims.map((claim) => (
                          <TableRow key={claim.id}>
                            <TableCell className="font-medium">{claim.type}</TableCell>
                            <TableCell>{claim.description}</TableCell>
                            <TableCell>${claim.amount.toFixed(2)}</TableCell>
                            <TableCell>
                              <Badge className={getStatusColor(claim.status)}>
                                {claim.status}
                              </Badge>
                            </TableCell>
                            <TableCell>{new Date(claim.submittedDate).toLocaleDateString()}</TableCell>
                            <TableCell className="text-right">
                              <Button variant="ghost" size="sm">
                                View Details
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

          <TabsContent value="loans">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle>Loans & Advances</CardTitle>
                  <CardDescription>
                    Request salary advances and track loan repayments
                  </CardDescription>
                </div>
                <Button>
                  <Plus className="w-4 h-4 mr-2" />
                  Request Advance
                </Button>
              </CardHeader>
              <CardContent>
                <div className="text-center py-12">
                  <CreditCard className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="font-medium text-lg mb-2">No Active Loans or Advances</h3>
                  <p className="text-muted-foreground mb-4">
                    You currently have no outstanding loans or advances
                  </p>
                  <Button>Request Salary Advance</Button>
                </div>
              </CardContent>
            </Card>
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