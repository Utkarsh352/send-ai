"use client";

import { useState } from "react";
import { BarChart3, FileText, Download, Filter, Calendar, TrendingUp, Users, DollarSign, PieChart, LineChart } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { DatePickerWithRange } from "@/components/ui/date-range-picker";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { motion } from "framer-motion";

interface ReportTemplate {
  id: string;
  name: string;
  description: string;
  category: string;
  frequency: string;
  lastGenerated: string;
  format: string[];
  icon: any;
}

interface CustomReport {
  id: string;
  name: string;
  createdBy: string;
  createdDate: string;
  lastRun: string;
  parameters: {
    dateRange: string;
    departments: string[];
    employees: string[];
    metrics: string[];
  };
}

export default function ReportsPage() {
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [selectedDepartment, setSelectedDepartment] = useState<string>("all");
  const [dateRange, setDateRange] = useState<string>("last-30");

  // Mock data - in real app this would come from API
  const reportTemplates: ReportTemplate[] = [
    {
      id: "RPT001",
      name: "Payroll Summary Report",
      description: "Comprehensive payroll summary with totals, deductions, and net payments",
      category: "Payroll",
      frequency: "Monthly",
      lastGenerated: "2024-01-15",
      format: ["PDF", "Excel", "CSV"],
      icon: DollarSign
    },
    {
      id: "RPT002",
      name: "Employee Headcount Report",
      description: "Employee count by department, role, and location with trend analysis",
      category: "HR",
      frequency: "Weekly",
      lastGenerated: "2024-01-22",
      format: ["PDF", "Excel"],
      icon: Users
    },
    {
      id: "RPT003",
      name: "Compliance Status Report",
      description: "Track compliance requirements, deadlines, and completion status",
      category: "Compliance",
      frequency: "Monthly",
      lastGenerated: "2024-01-10",
      format: ["PDF", "Excel"],
      icon: FileText
    },
    {
      id: "RPT004",
      name: "Compensation Analysis",
      description: "Salary benchmarking, pay equity analysis, and budget variance",
      category: "Compensation",
      frequency: "Quarterly",
      lastGenerated: "2024-01-01",
      format: ["PDF", "Excel"],
      icon: BarChart3
    },
    {
      id: "RPT005",
      name: "Tax Summary Report",
      description: "Federal, state, and local tax withholdings and payments",
      category: "Tax",
      frequency: "Monthly",
      lastGenerated: "2024-01-20",
      format: ["PDF", "Excel", "CSV"],
      icon: PieChart
    },
    {
      id: "RPT006",
      name: "Benefits Utilization",
      description: "Employee benefits enrollment and utilization rates",
      category: "Benefits",
      frequency: "Quarterly",
      lastGenerated: "2024-01-05",
      format: ["PDF", "Excel"],
      icon: TrendingUp
    }
  ];

  const customReports: CustomReport[] = [
    {
      id: "CUST001",
      name: "Engineering Team Compensation Review",
      createdBy: "Sarah Johnson",
      createdDate: "2024-01-10",
      lastRun: "2024-01-22",
      parameters: {
        dateRange: "Q4 2024",
        departments: ["Engineering"],
        employees: ["All"],
        metrics: ["Base Salary", "Bonuses", "Total Compensation"]
      }
    },
    {
      id: "CUST002",
      name: "Remote Work Impact Analysis",
      createdBy: "Mike Chen",
      createdDate: "2024-01-05",
      lastRun: "2024-01-18",
      parameters: {
        dateRange: "2024",
        departments: ["All"],
        employees: ["Remote Workers"],
        metrics: ["Productivity", "Satisfaction", "Retention"]
      }
    }
  ];

  const categories = ["Payroll", "HR", "Compliance", "Compensation", "Tax", "Benefits"];
  const departments = ["Engineering", "Marketing", "Sales", "HR", "Finance", "Operations"];

  const filteredReports = reportTemplates.filter((report) => {
    if (selectedCategory !== "all" && report.category !== selectedCategory) return false;
    return true;
  });

  const analyticsData = {
    totalReportsGenerated: 156,
    mostRequestedReport: "Payroll Summary Report",
    avgGenerationTime: "2.3s",
    totalDataExported: "1.2GB"
  };

  return (
    <DashboardLayout>
      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Reports & Analytics</h1>
            <p className="text-muted-foreground">
              Generate insights and export data from your payroll system
            </p>
          </div>
          <Button>
            <FileText className="w-4 h-4 mr-2" />
            Create Custom Report
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Reports Generated</CardTitle>
              <BarChart3 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{analyticsData.totalReportsGenerated}</div>
              <p className="text-xs text-muted-foreground">This month</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Most Popular</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-lg font-bold">{analyticsData.mostRequestedReport}</div>
              <p className="text-xs text-muted-foreground">42 requests</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Avg Generation Time</CardTitle>
              <LineChart className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{analyticsData.avgGenerationTime}</div>
              <p className="text-xs text-muted-foreground">95% under 5s</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Data Exported</CardTitle>
              <Download className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{analyticsData.totalDataExported}</div>
              <p className="text-xs text-muted-foreground">All formats</p>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Tabs */}
        <Tabs defaultValue="templates" className="space-y-6">
          <TabsList>
            <TabsTrigger value="templates">Report Templates</TabsTrigger>
            <TabsTrigger value="custom">Custom Reports</TabsTrigger>
            <TabsTrigger value="analytics">Analytics Dashboard</TabsTrigger>
            <TabsTrigger value="scheduled">Scheduled Reports</TabsTrigger>
          </TabsList>

          <TabsContent value="templates">
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
                  <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                    <SelectTrigger className="w-[150px]">
                      <SelectValue placeholder="Category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Categories</SelectItem>
                      {categories.map((category) => (
                        <SelectItem key={category} value={category}>
                          {category}
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
                  <Select value={dateRange} onValueChange={setDateRange}>
                    <SelectTrigger className="w-[150px]">
                      <SelectValue placeholder="Date Range" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="last-30">Last 30 days</SelectItem>
                      <SelectItem value="last-90">Last 90 days</SelectItem>
                      <SelectItem value="this-quarter">This Quarter</SelectItem>
                      <SelectItem value="this-year">This Year</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>

            {/* Report Templates Grid */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              {filteredReports.map((report) => {
                const Icon = report.icon;
                return (
                  <Card key={report.id} className="hover:shadow-md transition-all duration-200">
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-violet-500 rounded-lg flex items-center justify-center">
                            <Icon className="w-5 h-5 text-white" />
                          </div>
                          <div>
                            <CardTitle className="text-lg">{report.name}</CardTitle>
                            <Badge variant="secondary">{report.category}</Badge>
                          </div>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <p className="text-sm text-muted-foreground">{report.description}</p>

                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>Frequency:</span>
                          <span className="font-medium">{report.frequency}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span>Last Generated:</span>
                          <span className="font-medium">{new Date(report.lastGenerated).toLocaleDateString()}</span>
                        </div>
                      </div>

                      <div className="flex flex-wrap gap-1">
                        {report.format.map((format) => (
                          <Badge key={format} variant="outline" className="text-xs">
                            {format}
                          </Badge>
                        ))}
                      </div>

                      <div className="flex gap-2 pt-2">
                        <Button size="sm" className="flex-1">
                          <Download className="w-4 h-4 mr-2" />
                          Generate
                        </Button>
                        <Button variant="outline" size="sm">
                          <FileText className="w-4 h-4 mr-2" />
                          View
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </motion.div>
          </TabsContent>

          <TabsContent value="custom">
            <div className="space-y-6">
              {/* Custom Report Builder */}
              <Card>
                <CardHeader>
                  <CardTitle>Custom Report Builder</CardTitle>
                  <CardDescription>
                    Create personalized reports with specific data points and filters
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="reportName">Report Name</Label>
                        <Input id="reportName" placeholder="My Custom Report" />
                      </div>
                      <div>
                        <Label>Date Range</Label>
                        <Select>
                          <SelectTrigger>
                            <SelectValue placeholder="Select date range" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="last-30">Last 30 days</SelectItem>
                            <SelectItem value="last-90">Last 90 days</SelectItem>
                            <SelectItem value="this-quarter">This Quarter</SelectItem>
                            <SelectItem value="this-year">This Year</SelectItem>
                            <SelectItem value="custom">Custom Range</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label>Departments</Label>
                        <Select>
                          <SelectTrigger>
                            <SelectValue placeholder="Select departments" />
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
                    </div>
                    <div className="space-y-4">
                      <div>
                        <Label>Metrics to Include</Label>
                        <div className="grid grid-cols-2 gap-2 mt-2">
                          {["Base Salary", "Bonuses", "Deductions", "Net Pay", "Hours Worked", "Overtime"].map((metric) => (
                            <div key={metric} className="flex items-center space-x-2">
                              <input type="checkbox" id={metric} className="rounded" />
                              <Label htmlFor={metric} className="text-sm">{metric}</Label>
                            </div>
                          ))}
                        </div>
                      </div>
                      <div>
                        <Label>Export Format</Label>
                        <Select>
                          <SelectTrigger>
                            <SelectValue placeholder="Select format" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="pdf">PDF</SelectItem>
                            <SelectItem value="excel">Excel</SelectItem>
                            <SelectItem value="csv">CSV</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="pt-4">
                        <Button className="w-full">
                          <FileText className="w-4 h-4 mr-2" />
                          Create Report
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Saved Custom Reports */}
              <Card>
                <CardHeader>
                  <CardTitle>Saved Custom Reports</CardTitle>
                  <CardDescription>
                    Your previously created custom reports
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Report Name</TableHead>
                          <TableHead>Created By</TableHead>
                          <TableHead>Created Date</TableHead>
                          <TableHead>Last Run</TableHead>
                          <TableHead>Parameters</TableHead>
                          <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {customReports.map((report) => (
                          <TableRow key={report.id}>
                            <TableCell className="font-medium">{report.name}</TableCell>
                            <TableCell>{report.createdBy}</TableCell>
                            <TableCell>{new Date(report.createdDate).toLocaleDateString()}</TableCell>
                            <TableCell>{new Date(report.lastRun).toLocaleDateString()}</TableCell>
                            <TableCell>
                              <div className="flex flex-wrap gap-1">
                                <Badge variant="outline" className="text-xs">
                                  {report.parameters.dateRange}
                                </Badge>
                                <Badge variant="outline" className="text-xs">
                                  {report.parameters.departments.join(", ")}
                                </Badge>
                              </div>
                            </TableCell>
                            <TableCell className="text-right">
                              <div className="flex justify-end gap-1">
                                <Button variant="ghost" size="sm">
                                  <Download className="w-4 h-4" />
                                </Button>
                                <Button variant="ghost" size="sm">
                                  <FileText className="w-4 h-4" />
                                </Button>
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

          <TabsContent value="analytics">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Report Usage Analytics</CardTitle>
                  <CardDescription>
                    Most generated reports in the last 30 days
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {reportTemplates.slice(0, 5).map((report, index) => {
                      const usage = Math.floor(Math.random() * 50) + 10;
                      return (
                        <div key={report.id} className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 bg-muted rounded-lg flex items-center justify-center">
                              <span className="text-sm font-medium">{index + 1}</span>
                            </div>
                            <div>
                              <p className="font-medium text-sm">{report.name}</p>
                              <p className="text-xs text-muted-foreground">{report.category}</p>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="font-medium">{usage}</p>
                            <p className="text-xs text-muted-foreground">times</p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Export Formats</CardTitle>
                  <CardDescription>
                    Distribution of export formats used
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {[
                      { format: "PDF", count: 85, percentage: 55 },
                      { format: "Excel", count: 52, percentage: 33 },
                      { format: "CSV", count: 19, percentage: 12 }
                    ].map((item) => (
                      <div key={item.format} className="space-y-2">
                        <div className="flex justify-between">
                          <span className="text-sm font-medium">{item.format}</span>
                          <span className="text-sm">{item.count} ({item.percentage}%)</span>
                        </div>
                        <div className="w-full bg-secondary rounded-full h-2">
                          <div
                            className="bg-primary h-2 rounded-full"
                            style={{ width: `${item.percentage}%` }}
                          ></div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="scheduled">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle>Scheduled Reports</CardTitle>
                  <CardDescription>
                    Automatically generated reports delivered to your inbox
                  </CardDescription>
                </div>
                <Button>
                  <Calendar className="w-4 h-4 mr-2" />
                  Schedule New Report
                </Button>
              </CardHeader>
              <CardContent>
                <div className="text-center py-12">
                  <Calendar className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="font-medium text-lg mb-2">No Scheduled Reports</h3>
                  <p className="text-muted-foreground mb-4">
                    Set up automated report delivery to stay informed without manual work
                  </p>
                  <Button>
                    <Calendar className="w-4 h-4 mr-2" />
                    Schedule Your First Report
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
}