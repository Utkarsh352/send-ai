"use client";

import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight, Upload, Users, DollarSign, Minus, Plus, FileText, CreditCard, AlertTriangle, CheckCircle, X } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { motion, AnimatePresence } from "framer-motion";

interface Employee {
  id: string;
  name: string;
  department: string;
  role: string;
  baseSalary: number;
  hoursWorked: number;
  overtime: number;
  allowances: number;
  bonuses: number;
  taxDeductions: number;
  pfContribution: number;
  insurance: number;
  loans: number;
  netPay: number;
}

interface PayrollWizardProps {
  isOpen: boolean;
  onClose: () => void;
  onComplete: (data: any) => void;
}

const steps = [
  { id: 1, title: "Employee Data", icon: Users, description: "Import or review employee attendance and overtime data" },
  { id: 2, title: "Salary & Benefits", icon: DollarSign, description: "Configure basic salary, allowances, and bonuses" },
  { id: 3, title: "Deductions", icon: Minus, description: "Set up tax, PF, insurance, and loan deductions" },
  { id: 4, title: "Preview", icon: FileText, description: "Review complete payroll summary before approval" },
  { id: 5, title: "Approval & Disbursement", icon: CreditCard, description: "Approve and disburse payments via Yellow Network" }
];

export function PayrollWizard({ isOpen, onClose, onComplete }: PayrollWizardProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const [employees, setEmployees] = useState<Employee[]>([
    {
      id: "EMP001",
      name: "John Doe",
      department: "Engineering",
      role: "Senior Developer",
      baseSalary: 8000,
      hoursWorked: 160,
      overtime: 20,
      allowances: 1200,
      bonuses: 500,
      taxDeductions: 1500,
      pfContribution: 960,
      insurance: 200,
      loans: 0,
      netPay: 7040
    },
    {
      id: "EMP002",
      name: "Jane Smith",
      department: "Marketing",
      role: "Marketing Manager",
      baseSalary: 6500,
      hoursWorked: 160,
      overtime: 10,
      allowances: 800,
      bonuses: 750,
      taxDeductions: 1200,
      pfContribution: 780,
      insurance: 200,
      loans: 500,
      netPay: 6370
    },
    {
      id: "EMP003",
      name: "Mike Johnson",
      department: "Sales",
      role: "Sales Executive",
      baseSalary: 5500,
      hoursWorked: 160,
      overtime: 25,
      allowances: 600,
      bonuses: 1200,
      taxDeductions: 1000,
      pfContribution: 660,
      insurance: 150,
      loans: 0,
      netPay: 6490
    }
  ]);

  const [validationErrors, setValidationErrors] = useState<string[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);

  const calculateNetPay = (employee: Employee) => {
    const grossPay = employee.baseSalary + (employee.overtime * 50) + employee.allowances + employee.bonuses;
    const totalDeductions = employee.taxDeductions + employee.pfContribution + employee.insurance + employee.loans;
    return grossPay - totalDeductions;
  };

  const updateEmployee = (id: string, field: keyof Employee, value: number) => {
    setEmployees(prev => prev.map(emp => {
      if (emp.id === id) {
        const updated = { ...emp, [field]: value };
        updated.netPay = calculateNetPay(updated);
        return updated;
      }
      return emp;
    }));
  };

  const validateCurrentStep = () => {
    const errors: string[] = [];

    switch (currentStep) {
      case 1:
        if (employees.some(emp => emp.hoursWorked <= 0)) {
          errors.push("All employees must have valid hours worked");
        }
        break;
      case 2:
        if (employees.some(emp => emp.baseSalary <= 0)) {
          errors.push("All employees must have valid base salary");
        }
        break;
      case 3:
        if (employees.some(emp => emp.taxDeductions < 0 || emp.pfContribution < 0)) {
          errors.push("Deductions cannot be negative");
        }
        break;
    }

    setValidationErrors(errors);
    return errors.length === 0;
  };

  const nextStep = () => {
    if (validateCurrentStep() && currentStep < steps.length) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleComplete = async () => {
    setIsProcessing(true);

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000));

    const payrollData = {
      employees,
      totalAmount: employees.reduce((sum, emp) => sum + emp.netPay, 0),
      timestamp: new Date().toISOString()
    };

    onComplete(payrollData);
    setIsProcessing(false);
    onClose();
  };

  const totalGross = employees.reduce((sum, emp) => sum + emp.baseSalary + (emp.overtime * 50) + emp.allowances + emp.bonuses, 0);
  const totalDeductions = employees.reduce((sum, emp) => sum + emp.taxDeductions + emp.pfContribution + emp.insurance + emp.loans, 0);
  const totalNet = employees.reduce((sum, emp) => sum + emp.netPay, 0);

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">Employee Data</h3>
              <Button variant="outline" size="sm">
                <Upload className="w-4 h-4 mr-2" />
                Upload CSV/Import Data
              </Button>
            </div>

            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Employee</TableHead>
                    <TableHead>Department</TableHead>
                    <TableHead>Hours Worked</TableHead>
                    <TableHead>Overtime (hrs)</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {employees.map((employee) => (
                    <TableRow key={employee.id}>
                      <TableCell>
                        <div>
                          <p className="font-medium">{employee.name}</p>
                          <p className="text-sm text-muted-foreground">{employee.role}</p>
                        </div>
                      </TableCell>
                      <TableCell>{employee.department}</TableCell>
                      <TableCell>
                        <Input
                          type="number"
                          value={employee.hoursWorked}
                          onChange={(e) => updateEmployee(employee.id, 'hoursWorked', parseInt(e.target.value) || 0)}
                          className="w-20"
                        />
                      </TableCell>
                      <TableCell>
                        <Input
                          type="number"
                          value={employee.overtime}
                          onChange={(e) => updateEmployee(employee.id, 'overtime', parseInt(e.target.value) || 0)}
                          className="w-20"
                        />
                      </TableCell>
                      <TableCell>
                        <Badge variant={employee.hoursWorked >= 160 ? "default" : "secondary"}>
                          {employee.hoursWorked >= 160 ? "Complete" : "Incomplete"}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <h3 className="text-lg font-semibold">Salary & Benefits</h3>

            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Employee</TableHead>
                    <TableHead>Base Salary</TableHead>
                    <TableHead>Allowances</TableHead>
                    <TableHead>Bonuses</TableHead>
                    <TableHead>Gross Pay</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {employees.map((employee) => (
                    <TableRow key={employee.id}>
                      <TableCell>
                        <div>
                          <p className="font-medium">{employee.name}</p>
                          <p className="text-sm text-muted-foreground">{employee.department}</p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Input
                          type="number"
                          value={employee.baseSalary}
                          onChange={(e) => updateEmployee(employee.id, 'baseSalary', parseInt(e.target.value) || 0)}
                          className="w-24"
                        />
                      </TableCell>
                      <TableCell>
                        <Input
                          type="number"
                          value={employee.allowances}
                          onChange={(e) => updateEmployee(employee.id, 'allowances', parseInt(e.target.value) || 0)}
                          className="w-24"
                        />
                      </TableCell>
                      <TableCell>
                        <Input
                          type="number"
                          value={employee.bonuses}
                          onChange={(e) => updateEmployee(employee.id, 'bonuses', parseInt(e.target.value) || 0)}
                          className="w-24"
                        />
                      </TableCell>
                      <TableCell className="font-medium">
                        ${(employee.baseSalary + (employee.overtime * 50) + employee.allowances + employee.bonuses).toLocaleString()}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <h3 className="text-lg font-semibold">Deductions</h3>

            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Employee</TableHead>
                    <TableHead>Tax</TableHead>
                    <TableHead>PF Contribution</TableHead>
                    <TableHead>Insurance</TableHead>
                    <TableHead>Loans</TableHead>
                    <TableHead>Total Deductions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {employees.map((employee) => (
                    <TableRow key={employee.id}>
                      <TableCell>
                        <div>
                          <p className="font-medium">{employee.name}</p>
                          <p className="text-sm text-muted-foreground">{employee.department}</p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Input
                          type="number"
                          value={employee.taxDeductions}
                          onChange={(e) => updateEmployee(employee.id, 'taxDeductions', parseInt(e.target.value) || 0)}
                          className="w-24"
                        />
                      </TableCell>
                      <TableCell>
                        <Input
                          type="number"
                          value={employee.pfContribution}
                          onChange={(e) => updateEmployee(employee.id, 'pfContribution', parseInt(e.target.value) || 0)}
                          className="w-24"
                        />
                      </TableCell>
                      <TableCell>
                        <Input
                          type="number"
                          value={employee.insurance}
                          onChange={(e) => updateEmployee(employee.id, 'insurance', parseInt(e.target.value) || 0)}
                          className="w-24"
                        />
                      </TableCell>
                      <TableCell>
                        <Input
                          type="number"
                          value={employee.loans}
                          onChange={(e) => updateEmployee(employee.id, 'loans', parseInt(e.target.value) || 0)}
                          className="w-24"
                        />
                      </TableCell>
                      <TableCell className="font-medium">
                        ${(employee.taxDeductions + employee.pfContribution + employee.insurance + employee.loans).toLocaleString()}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>

            {validationErrors.length > 0 && (
              <div className="p-4 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800">
                <div className="flex items-center gap-2 mb-2">
                  <AlertTriangle className="w-4 h-4 text-red-500" />
                  <h4 className="font-medium text-red-700 dark:text-red-400">Validation Errors</h4>
                </div>
                <ul className="text-sm text-red-600 dark:text-red-300 space-y-1">
                  {validationErrors.map((error, index) => (
                    <li key={index}>• {error}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        );

      case 4:
        return (
          <div className="space-y-6">
            <h3 className="text-lg font-semibold">Payroll Summary Preview</h3>

            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium">Total Gross Pay</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-2xl font-bold">${totalGross.toLocaleString()}</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium">Total Deductions</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-2xl font-bold text-red-600">${totalDeductions.toLocaleString()}</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium">Net Disbursement</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-2xl font-bold text-green-600">${totalNet.toLocaleString()}</p>
                </CardContent>
              </Card>
            </div>

            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Employee</TableHead>
                    <TableHead>Gross Pay</TableHead>
                    <TableHead>Deductions</TableHead>
                    <TableHead>Net Pay</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {employees.map((employee) => {
                    const grossPay = employee.baseSalary + (employee.overtime * 50) + employee.allowances + employee.bonuses;
                    const deductions = employee.taxDeductions + employee.pfContribution + employee.insurance + employee.loans;

                    return (
                      <TableRow key={employee.id}>
                        <TableCell>
                          <div>
                            <p className="font-medium">{employee.name}</p>
                            <p className="text-sm text-muted-foreground">{employee.department} • {employee.role}</p>
                          </div>
                        </TableCell>
                        <TableCell>${grossPay.toLocaleString()}</TableCell>
                        <TableCell className="text-red-600">${deductions.toLocaleString()}</TableCell>
                        <TableCell className="font-medium text-green-600">${employee.netPay.toLocaleString()}</TableCell>
                        <TableCell>
                          <Badge variant="outline" className="text-green-600 border-green-600">
                            <CheckCircle className="w-3 h-3 mr-1" />
                            Ready
                          </Badge>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>
          </div>
        );

      case 5:
        return (
          <div className="space-y-6">
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Ready for Approval & Disbursement</h3>
              <p className="text-muted-foreground">
                Review the final payroll details and approve to disburse payments via Yellow Network
              </p>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Final Payroll Summary</CardTitle>
                <CardDescription>
                  This payroll run will process payments for {employees.length} employees
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="flex justify-between">
                    <span>Total Employees:</span>
                    <span className="font-medium">{employees.length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Total Net Amount:</span>
                    <span className="font-medium">${totalNet.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Payment Method:</span>
                    <span className="font-medium">Yellow Network</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Estimated Fees:</span>
                    <span className="font-medium">$45.20</span>
                  </div>
                </div>

                <Separator />

                <div className="flex justify-between font-medium">
                  <span>Total Disbursement:</span>
                  <span>${(totalNet + 45.20).toLocaleString()}</span>
                </div>
              </CardContent>
            </Card>

            <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg border border-blue-200 dark:border-blue-800">
              <div className="flex items-start gap-3">
                <div className="w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center mt-0.5">
                  <CheckCircle className="w-3 h-3 text-white" />
                </div>
                <div>
                  <h4 className="font-medium text-blue-900 dark:text-blue-100 mb-1">
                    Yellow Network Benefits
                  </h4>
                  <ul className="text-sm text-blue-700 dark:text-blue-200 space-y-1">
                    <li>• Instant settlement via state channels</li>
                    <li>• 95% lower transaction fees compared to traditional methods</li>
                    <li>• Multi-chain support for global payments</li>
                    <li>• Full compliance and audit trail</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-hidden">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-violet-500 rounded-lg flex items-center justify-center">
              <DollarSign className="w-4 h-4 text-white" />
            </div>
            Payroll Wizard
          </DialogTitle>
          <DialogDescription>
            Complete payroll processing in 5 simple steps
          </DialogDescription>
        </DialogHeader>

        <div className="flex gap-6 h-full">
          {/* Step Navigation */}
          <div className="w-64 space-y-2">
            {steps.map((step, index) => {
              const isActive = currentStep === step.id;
              const isCompleted = currentStep > step.id;
              const Icon = step.icon;

              return (
                <div
                  key={step.id}
                  className={`flex items-start gap-3 p-3 rounded-lg transition-all ${
                    isActive ? 'bg-primary text-primary-foreground' : isCompleted ? 'bg-green-100 dark:bg-green-900' : 'bg-muted/50'
                  }`}
                >
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                    isCompleted ? 'bg-green-500' : isActive ? 'bg-primary-foreground text-primary' : 'bg-background'
                  }`}>
                    {isCompleted ? <CheckCircle className="w-4 h-4 text-white" /> : <Icon className="w-4 h-4" />}
                  </div>
                  <div>
                    <h4 className="font-medium text-sm">{step.title}</h4>
                    <p className="text-xs opacity-75 mt-1">{step.description}</p>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Step Content */}
          <div className="flex-1 overflow-auto">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentStep}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.2 }}
              >
                {renderStepContent()}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>

        {/* Navigation Buttons */}
        <div className="flex justify-between items-center pt-4 border-t">
          <Button
            variant="outline"
            onClick={prevStep}
            disabled={currentStep === 1}
          >
            <ChevronLeft className="w-4 h-4 mr-2" />
            Back
          </Button>

          <div className="flex gap-2">
            {currentStep < steps.length ? (
              <Button onClick={nextStep} disabled={validationErrors.length > 0}>
                Next
                <ChevronRight className="w-4 h-4 ml-2" />
              </Button>
            ) : (
              <Button onClick={handleComplete} disabled={isProcessing}>
                {isProcessing ? (
                  <>Processing...</>
                ) : (
                  <>
                    <CreditCard className="w-4 h-4 mr-2" />
                    Approve & Disburse
                  </>
                )}
              </Button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}