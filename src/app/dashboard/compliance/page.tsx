"use client";

import { useState } from "react";
import { AlertTriangle, CheckCircle, Clock, FileText, Download, Upload, Calendar, Shield, AlertCircle, TrendingUp } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";


interface ComplianceItem {
  id: string;
  type: string;
  title: string;
  status: "completed" | "pending" | "overdue" | "upcoming";
  dueDate: string;
  description: string;
  priority: "high" | "medium" | "low";
  assignee: string;
  completedDate?: string;
}

interface TaxFiling {
  id: string;
  period: string;
  type: string;
  status: "filed" | "pending" | "in_progress" | "overdue";
  dueDate: string;
  amount: number;
  filedDate?: string;
  jurisdiction: string;
}

export default function CompliancePage() {
  const [selectedTab, setSelectedTab] = useState("dashboard");

  // Mock data - in real app this would come from API
  const complianceItems: ComplianceItem[] = [
    {
      id: "PF001",
      type: "PF Compliance",
      title: "Monthly PF Return Filing",
      status: "pending",
      dueDate: "2024-01-15",
      description: "Submit monthly provident fund return for December 2024",
      priority: "high",
      assignee: "Sarah Johnson"
    },
    {
      id: "ESI001",
      type: "ESI Compliance",
      title: "ESI Monthly Contribution",
      status: "completed",
      dueDate: "2024-01-10",
      description: "ESI contribution filing for December 2024",
      priority: "medium",
      assignee: "Mike Chen",
      completedDate: "2024-01-08"
    },
    {
      id: "TDS001",
      type: "TDS Compliance",
      title: "TDS Quarterly Return",
      status: "upcoming",
      dueDate: "2024-01-31",
      description: "Q3 2024 TDS return filing",
      priority: "high",
      assignee: "Linda Davis"
    },
    {
      id: "AUDIT001",
      type: "Audit",
      title: "Annual Payroll Audit",
      status: "in_progress",
      dueDate: "2024-02-15",
      description: "Annual compliance audit for payroll processes",
      priority: "high",
      assignee: "Robert Wilson"
    }
  ];

  const taxFilings: TaxFiling[] = [
    {
      id: "TAX001",
      period: "Q4 2024",
      type: "Corporate Tax",
      status: "filed",
      dueDate: "2024-01-15",
      amount: 125000,
      filedDate: "2024-01-12",
      jurisdiction: "Federal"
    },
    {
      id: "TAX002",
      period: "December 2024",
      type: "Payroll Tax",
      status: "pending",
      dueDate: "2024-01-31",
      amount: 45000,
      jurisdiction: "State - NY"
    },
    {
      id: "TAX003",
      period: "Q4 2024",
      type: "Unemployment Tax",
      status: "filed",
      dueDate: "2024-01-20",
      amount: 8500,
      filedDate: "2024-01-18",
      jurisdiction: "State - CA"
    }
  ];

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed":
      case "filed":
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case "pending":
      case "upcoming":
        return <Clock className="w-4 h-4 text-yellow-500" />;
      case "overdue":
        return <AlertTriangle className="w-4 h-4 text-red-500" />;
      case "in_progress":
        return <Clock className="w-4 h-4 text-blue-500" />;
      default:
        return <AlertCircle className="w-4 h-4 text-gray-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
      case "filed":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200";
      case "pending":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200";
      case "overdue":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200";
      case "upcoming":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200";
      case "in_progress":
        return "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200";
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200";
      case "medium":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200";
      case "low":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200";
    }
  };

  const upcomingDeadlines = complianceItems
    .filter(item => item.status === "pending" || item.status === "upcoming")
    .sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime())
    .slice(0, 3);

  const complianceRate = Math.round((complianceItems.filter(item => item.status === "completed").length / complianceItems.length) * 100);

  return (
    <DashboardLayout>
      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Compliance & Taxes</h1>
            <p className="text-muted-foreground">
              Monitor compliance status and manage tax filings
            </p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline">
              <Upload className="w-4 h-4 mr-2" />
              Upload Documents
            </Button>
            <Button>
              <FileText className="w-4 h-4 mr-2" />
              Generate Report
            </Button>
          </div>
        </div>

        {/* Alert for Upcoming Deadlines */}
        {upcomingDeadlines.length > 0 && (
          <Alert className="border-yellow-200 bg-yellow-50 dark:border-yellow-800 dark:bg-yellow-900/20">
            <AlertTriangle className="h-4 w-4 text-yellow-600" />
            <AlertTitle className="text-yellow-800 dark:text-yellow-200">Upcoming Deadlines</AlertTitle>
            <AlertDescription className="text-yellow-700 dark:text-yellow-300">
              You have {upcomingDeadlines.length} compliance items due in the next 30 days.
            </AlertDescription>
          </Alert>
        )}

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Compliance Rate</CardTitle>
              <Shield className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{complianceRate}%</div>
              <Progress value={complianceRate} className="h-2 mt-2" />
              <p className="text-xs text-muted-foreground mt-1">This quarter</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pending Items</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{complianceItems.filter(item => item.status === "pending").length}</div>
              <p className="text-xs text-muted-foreground">Requires attention</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Tax Filings</CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{taxFilings.filter(filing => filing.status === "filed").length}</div>
              <p className="text-xs text-muted-foreground">Completed this month</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Tax Paid</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">${taxFilings.reduce((sum, filing) => sum + filing.amount, 0).toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">This quarter</p>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Tabs */}
        <Tabs defaultValue="dashboard" className="space-y-6">
          <TabsList>
            <TabsTrigger value="dashboard">Compliance Dashboard</TabsTrigger>
            <TabsTrigger value="tax-filings">Tax Filings</TabsTrigger>
            <TabsTrigger value="reports">Reports</TabsTrigger>
            <TabsTrigger value="calendar">Calendar</TabsTrigger>
          </TabsList>

          <TabsContent value="dashboard">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Compliance Items */}
              <div
                }
                }
              >
                <Card>
                  <CardHeader>
                    <CardTitle>Compliance Items</CardTitle>
                    <CardDescription>
                      Track all compliance requirements and deadlines
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {complianceItems.map((item) => (
                        <div key={item.id} className="flex items-start justify-between p-4 rounded-lg border">
                          <div className="flex items-start gap-3">
                            {getStatusIcon(item.status)}
                            <div className="space-y-1">
                              <h4 className="font-medium text-sm">{item.title}</h4>
                              <p className="text-xs text-muted-foreground">{item.description}</p>
                              <div className="flex items-center gap-2">
                                <Badge variant="outline" className="text-xs">
                                  {item.type}
                                </Badge>
                                <Badge className={`${getPriorityColor(item.priority)} text-xs`}>
                                  {item.priority}
                                </Badge>
                                <span className="text-xs text-muted-foreground">
                                  Due: {new Date(item.dueDate).toLocaleDateString()}
                                </span>
                              </div>
                            </div>
                          </div>
                          <Badge className={getStatusColor(item.status)}>
                            {item.status.replace('_', ' ')}
                          </Badge>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Upcoming Deadlines */}
              <div
                }
                }
                }
              >
                <Card>
                  <CardHeader>
                    <CardTitle>Upcoming Deadlines</CardTitle>
                    <CardDescription>
                      Next 30 days compliance calendar
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {upcomingDeadlines.map((item) => {
                        const daysUntilDue = Math.ceil(
                          (new Date(item.dueDate).getTime() - new Date().getTime()) / (1000 * 3600 * 24)
                        );

                        return (
                          <div key={item.id} className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                            <div>
                              <p className="font-medium text-sm">{item.title}</p>
                              <p className="text-xs text-muted-foreground">{item.assignee}</p>
                            </div>
                            <div className="text-right">
                              <p className="text-sm font-medium">
                                {daysUntilDue > 0 ? `${daysUntilDue} days` : 'Today'}
                              </p>
                              <p className="text-xs text-muted-foreground">
                                {new Date(item.dueDate).toLocaleDateString()}
                              </p>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="tax-filings">
            <div
              }
              }
            >
              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <div>
                    <CardTitle>Tax Filings</CardTitle>
                    <CardDescription>
                      Manage all tax submissions and payments
                    </CardDescription>
                  </div>
                  <Button>
                    <FileText className="w-4 h-4 mr-2" />
                    File Now
                  </Button>
                </CardHeader>
                <CardContent>
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Period</TableHead>
                          <TableHead>Type</TableHead>
                          <TableHead>Jurisdiction</TableHead>
                          <TableHead>Amount</TableHead>
                          <TableHead>Due Date</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {taxFilings.map((filing) => (
                          <TableRow key={filing.id}>
                            <TableCell className="font-medium">{filing.period}</TableCell>
                            <TableCell>{filing.type}</TableCell>
                            <TableCell>{filing.jurisdiction}</TableCell>
                            <TableCell>${filing.amount.toLocaleString()}</TableCell>
                            <TableCell>{new Date(filing.dueDate).toLocaleDateString()}</TableCell>
                            <TableCell>
                              <Badge className={getStatusColor(filing.status)}>
                                <div className="flex items-center gap-1">
                                  {getStatusIcon(filing.status)}
                                  {filing.status.replace('_', ' ')}
                                </div>
                              </Badge>
                            </TableCell>
                            <TableCell className="text-right">
                              <div className="flex justify-end gap-1">
                                <Button variant="ghost" size="sm">
                                  <Download className="w-4 h-4" />
                                </Button>
                                {filing.status === "pending" && (
                                  <Button variant="ghost" size="sm">
                                    <FileText className="w-4 h-4" />
                                  </Button>
                                )}
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
          </TabsContent>

          <TabsContent value="reports">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Pre-built Reports</CardTitle>
                  <CardDescription>
                    Download compliance and tax reports
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between p-3 rounded-lg border">
                    <div>
                      <p className="font-medium">Monthly Compliance Report</p>
                      <p className="text-sm text-muted-foreground">December 2024</p>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm">
                        <Download className="w-4 h-4 mr-2" />
                        PDF
                      </Button>
                      <Button variant="outline" size="sm">
                        Excel
                      </Button>
                    </div>
                  </div>
                  <div className="flex items-center justify-between p-3 rounded-lg border">
                    <div>
                      <p className="font-medium">Tax Summary Report</p>
                      <p className="text-sm text-muted-foreground">Q4 2024</p>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm">
                        <Download className="w-4 h-4 mr-2" />
                        PDF
                      </Button>
                      <Button variant="outline" size="sm">
                        Excel
                      </Button>
                    </div>
                  </div>
                  <div className="flex items-center justify-between p-3 rounded-lg border">
                    <div>
                      <p className="font-medium">Audit Trail Report</p>
                      <p className="text-sm text-muted-foreground">Full Year 2024</p>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm">
                        <Download className="w-4 h-4 mr-2" />
                        PDF
                      </Button>
                      <Button variant="outline" size="sm">
                        Excel
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Custom Report Builder</CardTitle>
                  <CardDescription>
                    Create custom compliance reports
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="p-4 rounded-lg border-2 border-dashed border-muted-foreground/25 text-center">
                    <FileText className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
                    <p className="font-medium">Build Custom Report</p>
                    <p className="text-sm text-muted-foreground mb-4">
                      Select date range, departments, and compliance types
                    </p>
                    <Button>Create Custom Report</Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="calendar">
            <Card>
              <CardHeader>
                <CardTitle>Compliance Calendar</CardTitle>
                <CardDescription>
                  View all upcoming compliance deadlines
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-7 gap-4">
                  {/* Simple calendar view placeholder */}
                  <div className="col-span-full text-center p-8 border-2 border-dashed border-muted-foreground/25 rounded-lg">
                    <Calendar className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                    <p className="font-medium">Compliance Calendar</p>
                    <p className="text-sm text-muted-foreground">
                      Interactive calendar view coming soon
                    </p>
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