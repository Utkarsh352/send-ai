"use client";

import { useState } from "react";
import { Users, DollarSign, Calendar, Clock, AlertTriangle, TrendingUp, Play, UserPlus, FileText, CheckCircle, XCircle, Pause } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";

export default function DashboardPage() {
  const [currentDate] = useState(new Date());

  // Mock data - in real app this would come from API/database
  const summaryStats = {
    totalEmployees: 247,
    currentPayrollStatus: "Active",
    pendingApprovals: 3,
    nextDisbursementDate: "2024-01-15",
    payrollProgress: 75,
    monthlyBudget: "$1,234,567",
    disbursedThisMonth: "$925,890",
    pendingAmount: "$308,677"
  };

  const recentActivity = [
    {
      id: 1,
      type: "payroll_run",
      title: "December 2024 Payroll",
      status: "completed",
      amount: "$892,340",
      date: "2024-12-20",
      approver: "Sarah Johnson"
    },
    {
      id: 2,
      type: "payroll_run",
      title: "Engineering Team Bonus",
      status: "pending_approval",
      amount: "$156,780",
      date: "2024-12-22",
      approver: "Mike Chen"
    },
    {
      id: 3,
      type: "employee_added",
      title: "New Employee Onboarded",
      status: "completed",
      employee: "Alice Johnson",
      department: "Marketing",
      date: "2024-12-21"
    },
    {
      id: 4,
      type: "payroll_run",
      title: "Contractor Payments",
      status: "processing",
      amount: "$45,230",
      date: "2024-12-23"
    },
    {
      id: 5,
      type: "compliance",
      title: "Q4 Tax Filing Completed",
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
            <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
            <p className="text-muted-foreground">
              Welcome back! Here's your payroll overview for {currentDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}.
            </p>
          </div>
          <div className="flex gap-2">
            <Button>
              <Play className="w-4 h-4 mr-2" />
              Run Payroll
            </Button>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Employees</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{summaryStats.totalEmployees}</div>
              <p className="text-xs text-muted-foreground">
                Across 12 countries
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Current Payroll Cycle</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{summaryStats.currentPayrollStatus}</div>
              <div className="mt-2">
                <Progress value={summaryStats.payrollProgress} className="h-2" />
                <p className="text-xs text-muted-foreground mt-1">
                  {summaryStats.payrollProgress}% complete
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pending Approvals</CardTitle>
              <AlertTriangle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{summaryStats.pendingApprovals}</div>
              <p className="text-xs text-muted-foreground">
                Requires immediate attention
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Next Disbursement</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {new Date(summaryStats.nextDisbursementDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
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
            <CardDescription>Frequently used actions to manage your payroll</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Button size="lg" className="h-20 flex flex-col items-center justify-center gap-2">
                <Play className="w-6 h-6" />
                <span>Run Payroll</span>
              </Button>
              <Button variant="outline" size="lg" className="h-20 flex flex-col items-center justify-center gap-2">
                <UserPlus className="w-6 h-6" />
                <span>Add Employee</span>
              </Button>
              <Button variant="outline" size="lg" className="h-20 flex flex-col items-center justify-center gap-2">
                <FileText className="w-6 h-6" />
                <span>Generate Report</span>
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Recent Activity</CardTitle>
              <CardDescription>Latest payroll runs and system updates</CardDescription>
            </div>
            <Button variant="outline" size="sm">
              View All
            </Button>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActivity.map((activity) => (
                <div key={activity.id} className="flex items-center justify-between p-4 rounded-lg border">
                  <div className="flex items-center gap-4">
                    {getStatusIcon(activity.status)}
                    <div>
                      <p className="font-medium">{activity.title}</p>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <span>{new Date(activity.date).toLocaleDateString()}</span>
                        {activity.amount && (
                          <>
                            <span>•</span>
                            <span>{activity.amount}</span>
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
          <Card>
            <CardHeader>
              <CardTitle>Monthly Budget Overview</CardTitle>
              <CardDescription>Track your payroll spending for this month</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Total Budget</span>
                  <span className="font-medium">{summaryStats.monthlyBudget}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Disbursed</span>
                  <span className="font-medium text-green-600">{summaryStats.disbursedThisMonth}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Remaining</span>
                  <span className="font-medium">{summaryStats.pendingAmount}</span>
                </div>
                <Progress value={75} className="h-2" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>System Status</CardTitle>
              <CardDescription>Current status of payroll systems</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span className="text-sm">Yellow Network</span>
                </div>
                <Badge variant="outline" className="text-green-600 border-green-600">
                  Connected
                </Badge>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span className="text-sm">Bank Integration</span>
                </div>
                <Badge variant="outline" className="text-green-600 border-green-600">
                  Active
                </Badge>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                  <span className="text-sm">Compliance Engine</span>
                </div>
                <Badge variant="outline" className="text-yellow-600 border-yellow-600">
                  Processing
                </Badge>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span className="text-sm">Notification System</span>
                </div>
                <Badge variant="outline" className="text-green-600 border-green-600">
                  Online
                </Badge>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
}