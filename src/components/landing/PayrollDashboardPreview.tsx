"use client";

import { motion } from "framer-motion";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { DollarSign, Users, TrendingUp, Clock } from "lucide-react";

export function PayrollDashboardPreview() {
  const mockData = {
    totalEmployees: 47,
    totalPayroll: 284750,
    pendingApprovals: 3,
    lastProcessed: "2 hours ago"
  };

  const recentPayrolls = [
    { id: "PR-001", amount: 284750, employees: 47, status: "completed", date: "2024-01-15" },
    { id: "PR-002", amount: 278900, employees: 45, status: "pending", date: "2024-01-01" },
    { id: "PR-003", amount: 291200, employees: 48, status: "completed", date: "2023-12-15" }
  ];

  return (
    <div className="w-full max-w-6xl mx-auto py-16">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.8 }}
        className="text-center mb-12"
      >
        <h2 className="text-3xl font-bold mb-4">Payroll Dashboard Preview</h2>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Get a glimpse of the comprehensive payroll management system powered by Yellow Network SDK
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.5, duration: 0.8 }}
        className="bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-800 dark:to-slate-900 rounded-2xl p-8 shadow-2xl"
      >
        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <Users className="w-4 h-4" />
                Employees
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">{mockData.totalEmployees}</p>
              <p className="text-xs text-muted-foreground">Active this month</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <DollarSign className="w-4 h-4" />
                Total Payroll
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">${mockData.totalPayroll.toLocaleString()}</p>
              <p className="text-xs text-muted-foreground">This month</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <Clock className="w-4 h-4" />
                Pending
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">{mockData.pendingApprovals}</p>
              <p className="text-xs text-muted-foreground">Awaiting approval</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <TrendingUp className="w-4 h-4" />
                Last Run
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">✓</p>
              <p className="text-xs text-muted-foreground">{mockData.lastProcessed}</p>
            </CardContent>
          </Card>
        </div>

        {/* Recent Payroll Runs */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Payroll Runs</CardTitle>
            <CardDescription>Latest payroll processing history</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentPayrolls.map((payroll) => (
                <div key={payroll.id} className="flex items-center justify-between p-4 bg-background rounded-lg border">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-lg flex items-center justify-center">
                      <DollarSign className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <p className="font-medium">{payroll.id}</p>
                      <p className="text-sm text-muted-foreground">
                        {payroll.employees} employees • {payroll.date}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <p className="font-bold">${payroll.amount.toLocaleString()}</p>
                    <Badge variant={payroll.status === 'completed' ? 'default' : 'secondary'}>
                      {payroll.status}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-6 flex justify-center">
              <Button variant="outline">View All Payroll Runs</Button>
            </div>
          </CardContent>
        </Card>

        {/* Features Highlight */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 p-6 rounded-xl">
            <h3 className="font-bold text-lg mb-2">Yellow Network Integration</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Lightning-fast settlements with 95% lower fees through state channels
            </p>
            <div className="flex gap-2">
              <Badge variant="outline">Instant Settlement</Badge>
              <Badge variant="outline">Low Fees</Badge>
            </div>
          </div>

          <div className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 p-6 rounded-xl">
            <h3 className="font-bold text-lg mb-2">Hourly Earnings</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Track and redeem earnings every hour instead of waiting for payday
            </p>
            <div className="flex gap-2">
              <Badge variant="outline">Hourly Access</Badge>
              <Badge variant="outline">Real-time</Badge>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}