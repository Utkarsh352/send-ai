"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Clock, Play, Pause, Stop, DollarSign, Users, Calendar, Trash2 } from "lucide-react";
import { useNitroliteContext } from "@/providers/NitroliteProvider";

interface Employee {
  id: string;
  name: string;
  email: string;
  department: string;
  walletAddress: string;
  hourlyRate?: number;
}

interface HourlyPayment {
  id: string;
  employeeId: string;
  employeeName: string;
  hourlyRate: number;
  asset: string;
  status: 'active' | 'paused' | 'stopped';
  startTime: Date;
  nextPayment: Date;
  totalPaid: number;
  hoursWorked: number;
  walletAddress: string;
}

export function HourlyPaymentManager() {
  const nitrolite = useNitroliteContext();
  const [showNewPayment, setShowNewPayment] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState("");
  const [hourlyRate, setHourlyRate] = useState("");
  const [paymentAsset, setPaymentAsset] = useState("ytest.usd");
  const [payments, setPayments] = useState<HourlyPayment[]>([]);
  const [isCreating, setIsCreating] = useState(false);

  // Mock employee data - in real app this would come from API/database
  const employees: Employee[] = [
    {
      id: "EMP001",
      name: "John Doe",
      email: "john.doe@company.com",
      department: "Engineering",
      walletAddress: "0x1234567890123456789012345678901234567890",
      hourlyRate: 50
    },
    {
      id: "EMP002",
      name: "Jane Smith",
      email: "jane.smith@company.com",
      department: "Marketing",
      walletAddress: "0x2345678901234567890123456789012345678901",
      hourlyRate: 45
    },
    {
      id: "EMP003",
      name: "Bob Johnson",
      email: "bob.johnson@company.com",
      department: "Sales",
      walletAddress: "0x3456789012345678901234567890123456789012",
      hourlyRate: 40
    },
    {
      id: "EMP004",
      name: "Alice Brown",
      email: "alice.brown@company.com",
      department: "HR",
      walletAddress: "0x4567890123456789012345678901234567890123",
      hourlyRate: 35
    }
  ];

  const handleCreateHourlyPayment = async () => {
    if (!nitrolite.isAuthenticated) {
      alert('Please authenticate first');
      return;
    }

    if (!selectedEmployee || !hourlyRate) {
      alert('Please select an employee and set hourly rate');
      return;
    }

    const employee = employees.find(emp => emp.id === selectedEmployee);
    if (!employee) {
      alert('Employee not found');
      return;
    }

    const rate = parseFloat(hourlyRate);
    if (rate <= 0) {
      alert('Please enter a valid hourly rate');
      return;
    }

    try {
      setIsCreating(true);

      // Create new hourly payment record
      const newPayment: HourlyPayment = {
        id: `HP${Date.now()}`,
        employeeId: employee.id,
        employeeName: employee.name,
        hourlyRate: rate,
        asset: paymentAsset,
        status: 'active',
        startTime: new Date(),
        nextPayment: new Date(Date.now() + 60 * 60 * 1000), // Next hour
        totalPaid: 0,
        hoursWorked: 0,
        walletAddress: employee.walletAddress
      };

      setPayments(prev => [...prev, newPayment]);

      // Start the hourly payment timer
      startHourlyPayments(newPayment);

      // Reset form
      setSelectedEmployee("");
      setHourlyRate("");
      setShowNewPayment(false);

      alert(`Hourly payment setup complete for ${employee.name}! Payment will start in 1 hour.`);

    } catch (error) {
      console.error('Failed to create hourly payment:', error);
      alert('Failed to setup hourly payment. Please try again.');
    } finally {
      setIsCreating(false);
    }
  };

  const startHourlyPayments = (payment: HourlyPayment) => {
    // Store timer ID for cleanup
    const timerId = setInterval(async () => {
      try {
        // Check if payment is still active
        const currentPayment = payments.find(p => p.id === payment.id && p.status === 'active');
        if (!currentPayment) {
          clearInterval(timerId);
          return;
        }

        console.log(`Processing hourly payment for ${payment.employeeName}`);

        // Send payment using Nitrolite
        const transferResult = await nitrolite.transfer(
          payment.walletAddress as any,
          payment.hourlyRate.toString(),
          payment.asset
        );

        if (transferResult.success) {
          // Update payment record
          setPayments(prev => prev.map(p =>
            p.id === payment.id
              ? {
                  ...p,
                  totalPaid: p.totalPaid + payment.hourlyRate,
                  hoursWorked: p.hoursWorked + 1,
                  nextPayment: new Date(Date.now() + 60 * 60 * 1000)
                }
              : p
          ));

          console.log(`Successfully paid ${payment.hourlyRate} ${payment.asset} to ${payment.employeeName}`);
        } else {
          console.error(`Failed to pay ${payment.employeeName}:`, transferResult.error);
          // You might want to pause the payment or notify admin here
        }

      } catch (error) {
        console.error('Error processing hourly payment:', error);
      }
    }, 60 * 60 * 1000); // 1 hour interval

    // Store timer reference (in a real app, you'd store this in a more persistent way)
    (window as any)[`timer_${payment.id}`] = timerId;
  };

  const togglePaymentStatus = (paymentId: string, newStatus: 'active' | 'paused' | 'stopped') => {
    setPayments(prev => prev.map(payment =>
      payment.id === paymentId
        ? { ...payment, status: newStatus }
        : payment
    ));

    // Handle timer management
    if (newStatus === 'stopped' || newStatus === 'paused') {
      const timerId = (window as any)[`timer_${paymentId}`];
      if (timerId) {
        clearInterval(timerId);
        delete (window as any)[`timer_${paymentId}`];
      }
    } else if (newStatus === 'active') {
      const payment = payments.find(p => p.id === paymentId);
      if (payment) {
        startHourlyPayments(payment);
      }
    }
  };

  const deletePayment = (paymentId: string) => {
    // Clear timer
    const timerId = (window as any)[`timer_${paymentId}`];
    if (timerId) {
      clearInterval(timerId);
      delete (window as any)[`timer_${paymentId}`];
    }

    // Remove from list
    setPayments(prev => prev.filter(p => p.id !== paymentId));
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'paused':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
      case 'stopped':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active':
        return <Play className="w-4 h-4" />;
      case 'paused':
        return <Pause className="w-4 h-4" />;
      case 'stopped':
        return <Stop className="w-4 h-4" />;
      default:
        return <Clock className="w-4 h-4" />;
    }
  };

  // Cleanup timers on unmount
  useEffect(() => {
    return () => {
      payments.forEach(payment => {
        const timerId = (window as any)[`timer_${payment.id}`];
        if (timerId) {
          clearInterval(timerId);
        }
      });
    };
  }, []);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Hourly Payments</h2>
          <p className="text-muted-foreground">
            Setup and manage automated hourly payments for employees
          </p>
        </div>
        <Dialog open={showNewPayment} onOpenChange={setShowNewPayment}>
          <DialogTrigger asChild>
            <Button className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600">
              <Clock className="w-4 h-4 mr-2" />
              Setup Hourly Payment
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Setup Hourly Payment</DialogTitle>
              <DialogDescription>
                Configure automated hourly payments for an employee
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              {/* Authentication Status */}
              <div className="p-4 rounded-lg border bg-gray-50 dark:bg-gray-800">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium">Authentication Status</p>
                    <p className="text-xs text-muted-foreground">
                      {nitrolite.isAuthenticated ? 'Ready to setup payments' :
                       nitrolite.isAuthenticating ? 'Authenticating...' :
                       'Connect your private key first'}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    {nitrolite.isAuthenticated ? (
                      <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                    ) : nitrolite.isAuthenticating ? (
                      <div className="w-2 h-2 bg-yellow-500 rounded-full animate-pulse"></div>
                    ) : (
                      <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                    )}
                  </div>
                </div>
              </div>

              {/* Employee Selection */}
              <div>
                <Label htmlFor="employee">Select Employee</Label>
                <Select value={selectedEmployee} onValueChange={setSelectedEmployee}>
                  <SelectTrigger>
                    <SelectValue placeholder="Choose an employee" />
                  </SelectTrigger>
                  <SelectContent>
                    {employees.map((employee) => (
                      <SelectItem key={employee.id} value={employee.id}>
                        <div className="flex flex-col text-left">
                          <span>{employee.name}</span>
                          <span className="text-xs text-muted-foreground">
                            {employee.department} • Suggested: ${employee.hourlyRate}/hour
                          </span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Hourly Rate */}
              <div className="grid grid-cols-3 gap-2">
                <div className="col-span-2">
                  <Label htmlFor="rate">Hourly Rate</Label>
                  <Input
                    id="rate"
                    type="number"
                    placeholder="0.00"
                    value={hourlyRate}
                    onChange={(e) => setHourlyRate(e.target.value)}
                    step="0.01"
                    min="0"
                  />
                </div>
                <div>
                  <Label htmlFor="asset">Asset</Label>
                  <Select value={paymentAsset} onValueChange={setPaymentAsset}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="ytest.usd">ytest.usd</SelectItem>
                      <SelectItem value="usdc">USDC</SelectItem>
                      <SelectItem value="usdt">USDT</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex justify-end gap-2 pt-4">
                <Button variant="outline" onClick={() => setShowNewPayment(false)} disabled={isCreating}>
                  Cancel
                </Button>
                <Button
                  onClick={handleCreateHourlyPayment}
                  disabled={isCreating || !nitrolite.isAuthenticated || !selectedEmployee || !hourlyRate}
                  className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600"
                >
                  {isCreating ? 'Creating...' : 'Setup Payment'}
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Payments</CardTitle>
            <Play className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{payments.filter(p => p.status === 'active').length}</div>
            <p className="text-xs text-muted-foreground">Running hourly payments</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Employees</CardTitle>
            <Users className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{new Set(payments.map(p => p.employeeId)).size}</div>
            <p className="text-xs text-muted-foreground">Receiving payments</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Paid Today</CardTitle>
            <DollarSign className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {payments.reduce((sum, p) => sum + p.totalPaid, 0).toFixed(2)}
            </div>
            <p className="text-xs text-muted-foreground">ytest.usd equivalent</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Next Payment</CardTitle>
            <Calendar className="h-4 w-4 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {payments.filter(p => p.status === 'active').length > 0 ? '< 1h' : '-'}
            </div>
            <p className="text-xs text-muted-foreground">Until next batch</p>
          </CardContent>
        </Card>
      </div>

      {/* Active Payments Table */}
      <Card>
        <CardHeader>
          <CardTitle>Active Hourly Payments</CardTitle>
          <CardDescription>
            Manage and monitor all hourly payment schedules
          </CardDescription>
        </CardHeader>
        <CardContent>
          {payments.length === 0 ? (
            <div className="text-center py-8">
              <Clock className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">No Hourly Payments Setup</h3>
              <p className="text-muted-foreground mb-4">
                Setup your first hourly payment to get started with automated payroll
              </p>
              <Button onClick={() => setShowNewPayment(true)}>
                Setup First Payment
              </Button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Employee</TableHead>
                    <TableHead>Rate/Hour</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Hours Worked</TableHead>
                    <TableHead>Total Paid</TableHead>
                    <TableHead>Next Payment</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {payments.map((payment) => (
                    <TableRow key={payment.id}>
                      <TableCell>
                        <div>
                          <p className="font-medium">{payment.employeeName}</p>
                          <p className="text-xs text-muted-foreground font-mono">
                            {payment.walletAddress.slice(0, 10)}...{payment.walletAddress.slice(-8)}
                          </p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <span className="font-medium">{payment.hourlyRate}</span>
                          <span className="text-xs text-muted-foreground">{payment.asset}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge className={getStatusColor(payment.status)}>
                          <div className="flex items-center gap-1">
                            {getStatusIcon(payment.status)}
                            {payment.status}
                          </div>
                        </Badge>
                      </TableCell>
                      <TableCell>{payment.hoursWorked}</TableCell>
                      <TableCell className="font-medium">
                        {payment.totalPaid.toFixed(2)} {payment.asset}
                      </TableCell>
                      <TableCell className="text-sm">
                        {payment.status === 'active'
                          ? payment.nextPayment.toLocaleTimeString()
                          : '-'
                        }
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          {payment.status === 'active' ? (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => togglePaymentStatus(payment.id, 'paused')}
                            >
                              <Pause className="w-3 h-3" />
                            </Button>
                          ) : payment.status === 'paused' ? (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => togglePaymentStatus(payment.id, 'active')}
                            >
                              <Play className="w-3 h-3" />
                            </Button>
                          ) : null}

                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => togglePaymentStatus(payment.id, 'stopped')}
                          >
                            <Stop className="w-3 h-3" />
                          </Button>

                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => deletePayment(payment.id)}
                          >
                            <Trash2 className="w-3 h-3" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}