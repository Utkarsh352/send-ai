"use client";

import { useState } from "react";
import { Plus, Edit, Trash2, Copy, DollarSign, Users, TrendingUp, Gift } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { motion } from "framer-motion";

interface SalaryStructure {
  id: string;
  name: string;
  department: string;
  level: string;
  baseSalary: number;
  allowances: {
    housing: number;
    transport: number;
    meal: number;
    medical: number;
    communication: number;
  };
  benefits: {
    healthInsurance: boolean;
    dentalInsurance: boolean;
    visionInsurance: boolean;
    retirement401k: number;
    paidTimeOff: number;
    sickLeave: number;
  };
  bonuses: {
    performance: number;
    annual: number;
    retention: number;
  };
  totalPackage: number;
  employeeCount: number;
  createdDate: string;
  status: "Active" | "Draft" | "Archived";
}

export default function CompensationPage() {
  const [showCreateStructure, setShowCreateStructure] = useState(false);
  const [selectedTab, setSelectedTab] = useState("structures");

  // Mock data - in real app this would come from API
  const salaryStructures: SalaryStructure[] = [
    {
      id: "SS001",
      name: "Senior Developer",
      department: "Engineering",
      level: "Senior",
      baseSalary: 95000,
      allowances: {
        housing: 1200,
        transport: 500,
        meal: 300,
        medical: 800,
        communication: 200
      },
      benefits: {
        healthInsurance: true,
        dentalInsurance: true,
        visionInsurance: true,
        retirement401k: 6,
        paidTimeOff: 20,
        sickLeave: 10
      },
      bonuses: {
        performance: 5000,
        annual: 8000,
        retention: 0
      },
      totalPackage: 111000,
      employeeCount: 12,
      createdDate: "2024-01-15",
      status: "Active"
    },
    {
      id: "SS002",
      name: "Marketing Manager",
      department: "Marketing",
      level: "Manager",
      baseSalary: 78000,
      allowances: {
        housing: 1000,
        transport: 400,
        meal: 250,
        medical: 600,
        communication: 150
      },
      benefits: {
        healthInsurance: true,
        dentalInsurance: true,
        visionInsurance: false,
        retirement401k: 5,
        paidTimeOff: 18,
        sickLeave: 8
      },
      bonuses: {
        performance: 4000,
        annual: 6000,
        retention: 0
      },
      totalPackage: 90400,
      employeeCount: 8,
      createdDate: "2024-02-20",
      status: "Active"
    },
    {
      id: "SS003",
      name: "Sales Executive",
      department: "Sales",
      level: "Mid-Level",
      baseSalary: 65000,
      allowances: {
        housing: 800,
        transport: 600,
        meal: 200,
        medical: 500,
        communication: 300
      },
      benefits: {
        healthInsurance: true,
        dentalInsurance: false,
        visionInsurance: false,
        retirement401k: 4,
        paidTimeOff: 15,
        sickLeave: 6
      },
      bonuses: {
        performance: 8000,
        annual: 5000,
        retention: 2000
      },
      totalPackage: 81400,
      employeeCount: 15,
      createdDate: "2024-01-10",
      status: "Active"
    }
  ];

  const departments = ["Engineering", "Marketing", "Sales", "HR", "Finance", "Operations"];
  const levels = ["Entry", "Mid-Level", "Senior", "Manager", "Director", "VP"];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Active":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200";
      case "Draft":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200";
      case "Archived":
        return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200";
    }
  };

  const totalCompensationBudget = salaryStructures.reduce((sum, structure) =>
    sum + (structure.totalPackage * structure.employeeCount), 0
  );

  const totalEmployees = salaryStructures.reduce((sum, structure) => sum + structure.employeeCount, 0);
  const averagePackage = totalEmployees > 0 ? totalCompensationBudget / totalEmployees : 0;

  return (
    <DashboardLayout>
      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Compensation & Benefits</h1>
            <p className="text-muted-foreground">
              Manage salary structures, allowances, bonuses, and reimbursements
            </p>
          </div>
          <Button onClick={() => setShowCreateStructure(true)}>
            <Plus className="w-4 h-4 mr-2" />
            Create Salary Structure
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Compensation Budget</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">${(totalCompensationBudget / 1000000).toFixed(1)}M</div>
              <p className="text-xs text-muted-foreground">Annual budget</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Salary Structures</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{salaryStructures.length}</div>
              <p className="text-xs text-muted-foreground">Active structures</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Average Package</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">${Math.round(averagePackage).toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">Per employee</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Benefits Coverage</CardTitle>
              <Gift className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">98%</div>
              <p className="text-xs text-muted-foreground">Employees covered</p>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Tabs */}
        <Tabs defaultValue="structures" className="space-y-6">
          <TabsList>
            <TabsTrigger value="structures">Salary Structures</TabsTrigger>
            <TabsTrigger value="allowances">Allowances</TabsTrigger>
            <TabsTrigger value="benefits">Benefits</TabsTrigger>
            <TabsTrigger value="reimbursements">Reimbursements</TabsTrigger>
          </TabsList>

          <TabsContent value="structures">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle>Salary Structures</CardTitle>
                  <CardDescription>
                    Manage compensation packages for different roles and levels
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Structure Name</TableHead>
                          <TableHead>Department</TableHead>
                          <TableHead>Level</TableHead>
                          <TableHead>Base Salary</TableHead>
                          <TableHead>Total Package</TableHead>
                          <TableHead>Employees</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {salaryStructures.map((structure) => (
                          <TableRow key={structure.id}>
                            <TableCell className="font-medium">{structure.name}</TableCell>
                            <TableCell>{structure.department}</TableCell>
                            <TableCell>{structure.level}</TableCell>
                            <TableCell>${structure.baseSalary.toLocaleString()}</TableCell>
                            <TableCell className="font-medium">${structure.totalPackage.toLocaleString()}</TableCell>
                            <TableCell>{structure.employeeCount}</TableCell>
                            <TableCell>
                              <Badge className={getStatusColor(structure.status)}>
                                {structure.status}
                              </Badge>
                            </TableCell>
                            <TableCell className="text-right">
                              <div className="flex justify-end gap-2">
                                <Button variant="ghost" size="sm">
                                  <Edit className="w-4 h-4" />
                                </Button>
                                <Button variant="ghost" size="sm">
                                  <Copy className="w-4 h-4" />
                                </Button>
                                <Button variant="ghost" size="sm">
                                  <Trash2 className="w-4 h-4" />
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
            </motion.div>
          </TabsContent>

          <TabsContent value="allowances">
            <Card>
              <CardHeader>
                <CardTitle>Allowance Categories</CardTitle>
                <CardDescription>
                  Configure different allowance types and amounts
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  <Card>
                    <CardHeader className="pb-3">
                      <CardTitle className="text-lg">Housing Allowance</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-2xl font-bold">$800-$1,200</p>
                      <p className="text-sm text-muted-foreground">Based on location and level</p>
                      <Button variant="outline" size="sm" className="mt-3">
                        <Edit className="w-4 h-4 mr-2" />
                        Edit
                      </Button>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader className="pb-3">
                      <CardTitle className="text-lg">Transport Allowance</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-2xl font-bold">$400-$600</p>
                      <p className="text-sm text-muted-foreground">Monthly commute support</p>
                      <Button variant="outline" size="sm" className="mt-3">
                        <Edit className="w-4 h-4 mr-2" />
                        Edit
                      </Button>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader className="pb-3">
                      <CardTitle className="text-lg">Medical Allowance</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-2xl font-bold">$500-$800</p>
                      <p className="text-sm text-muted-foreground">Healthcare coverage supplement</p>
                      <Button variant="outline" size="sm" className="mt-3">
                        <Edit className="w-4 h-4 mr-2" />
                        Edit
                      </Button>
                    </CardContent>
                  </Card>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="benefits">
            <Card>
              <CardHeader>
                <CardTitle>Employee Benefits</CardTitle>
                <CardDescription>
                  Manage health insurance, retirement plans, and other benefits
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-lg">Health Insurance</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        <div className="flex justify-between">
                          <span>Health Coverage</span>
                          <Badge className="bg-green-100 text-green-800">100% Covered</Badge>
                        </div>
                        <div className="flex justify-between">
                          <span>Dental Coverage</span>
                          <Badge className="bg-green-100 text-green-800">85% Covered</Badge>
                        </div>
                        <div className="flex justify-between">
                          <span>Vision Coverage</span>
                          <Badge className="bg-yellow-100 text-yellow-800">65% Covered</Badge>
                        </div>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader>
                        <CardTitle className="text-lg">Retirement Plans</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        <div className="flex justify-between">
                          <span>401(k) Match</span>
                          <span className="font-medium">Up to 6%</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Vesting Period</span>
                          <span className="font-medium">3 Years</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Participation Rate</span>
                          <Badge className="bg-green-100 text-green-800">94%</Badge>
                        </div>
                      </CardContent>
                    </Card>
                  </div>

                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Time Off Benefits</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="text-center p-4 rounded-lg bg-muted">
                          <p className="text-2xl font-bold">15-25</p>
                          <p className="text-sm text-muted-foreground">Paid Time Off (Days)</p>
                        </div>
                        <div className="text-center p-4 rounded-lg bg-muted">
                          <p className="text-2xl font-bold">6-12</p>
                          <p className="text-sm text-muted-foreground">Sick Leave (Days)</p>
                        </div>
                        <div className="text-center p-4 rounded-lg bg-muted">
                          <p className="text-2xl font-bold">10</p>
                          <p className="text-sm text-muted-foreground">Company Holidays</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="reimbursements">
            <Card>
              <CardHeader>
                <CardTitle>Reimbursement Categories</CardTitle>
                <CardDescription>
                  Manage expense reimbursement policies and limits
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Card>
                      <CardHeader className="pb-3">
                        <CardTitle className="text-lg">Travel & Entertainment</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-2">
                        <div className="flex justify-between">
                          <span>Daily Meal Allowance</span>
                          <span className="font-medium">$75</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Hotel Per Night</span>
                          <span className="font-medium">$200</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Domestic Flight</span>
                          <span className="font-medium">$500</span>
                        </div>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader className="pb-3">
                        <CardTitle className="text-lg">Professional Development</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-2">
                        <div className="flex justify-between">
                          <span>Annual Training Budget</span>
                          <span className="font-medium">$2,000</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Conference Attendance</span>
                          <span className="font-medium">$3,000</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Certification Fees</span>
                          <span className="font-medium">$1,000</span>
                        </div>
                      </CardContent>
                    </Card>
                  </div>

                  <Card>
                    <CardHeader className="pb-3">
                      <CardTitle className="text-lg">Work From Home</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="text-center p-4 rounded-lg bg-muted">
                          <p className="text-xl font-bold">$500</p>
                          <p className="text-sm text-muted-foreground">Office Setup</p>
                        </div>
                        <div className="text-center p-4 rounded-lg bg-muted">
                          <p className="text-xl font-bold">$50/month</p>
                          <p className="text-sm text-muted-foreground">Internet Allowance</p>
                        </div>
                        <div className="text-center p-4 rounded-lg bg-muted">
                          <p className="text-xl font-bold">$200</p>
                          <p className="text-sm text-muted-foreground">Equipment Annual</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      {/* Create Salary Structure Modal */}
      <Dialog open={showCreateStructure} onOpenChange={setShowCreateStructure}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Create Salary Structure</DialogTitle>
            <DialogDescription>
              Define a new compensation package for a role or department
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="structureName">Structure Name</Label>
                <Input id="structureName" placeholder="e.g., Senior Developer" />
              </div>
              <div>
                <Label htmlFor="department">Department</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select department" />
                  </SelectTrigger>
                  <SelectContent>
                    {departments.map((dept) => (
                      <SelectItem key={dept} value={dept}>{dept}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="level">Level</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select level" />
                  </SelectTrigger>
                  <SelectContent>
                    {levels.map((level) => (
                      <SelectItem key={level} value={level}>{level}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="baseSalary">Base Salary ($)</Label>
                <Input id="baseSalary" type="number" placeholder="85000" />
              </div>
            </div>
            <div>
              <Label htmlFor="description">Description</Label>
              <Textarea id="description" placeholder="Brief description of the role and compensation structure..." />
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setShowCreateStructure(false)}>
                Cancel
              </Button>
              <Button onClick={() => setShowCreateStructure(false)}>
                Create Structure
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
}