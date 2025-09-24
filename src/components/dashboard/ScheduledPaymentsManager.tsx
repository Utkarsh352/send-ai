"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { 
    Play, 
    Pause, 
    Clock, 
    DollarSign, 
    Users, 
    TrendingUp,
    Calendar,
    CheckCircle,
    XCircle,
    AlertCircle
} from "lucide-react";
import { useScheduledPayments } from "@/hooks/useScheduledPayments";
import { formatCurrency } from "@/lib/utils";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";

interface Employee {
    id: string;
    name: string;
    walletAddress: string;
    hourlyRate: number;
    preferredCurrency: string;
    paymentStatus: string;
}

interface ScheduledPaymentsManagerProps {
    employees: Employee[];
}

export function ScheduledPaymentsManager({ employees }: ScheduledPaymentsManagerProps) {
    const {
        scheduledPayments,
        paymentHistory,
        isLoading,
        startScheduledPayment,
        stopScheduledPayment,
        getActivePaymentsCount,
        getTotalPaidAmount,
        getEmployeePayments,
    } = useScheduledPayments();

    const [selectedEmployee, setSelectedEmployee] = useState<string | null>(null);

    const handleTogglePayment = (employee: Employee) => {
        const paymentId = `payment_${employee.id}`;
        const existingPayment = scheduledPayments.find(p => p.id === paymentId);
        
        if (existingPayment && existingPayment.isActive) {
            stopScheduledPayment(paymentId);
        } else {
            startScheduledPayment(employee);
        }
    };

    const getPaymentStatus = (employeeId: string) => {
        const paymentId = `payment_${employeeId}`;
        const payment = scheduledPayments.find(p => p.id === paymentId);
        return payment && payment.isActive ? 'active' : 'inactive';
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'active':
                return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
            case 'inactive':
                return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
            case 'success':
                return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
            case 'failed':
                return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
            case 'pending':
                return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
            default:
                return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
        }
    };

    const getStatusIcon = (status: string) => {
        switch (status) {
            case 'success':
                return <CheckCircle className="w-4 h-4 text-green-500" />;
            case 'failed':
                return <XCircle className="w-4 h-4 text-red-500" />;
            case 'pending':
                return <AlertCircle className="w-4 h-4 text-yellow-500" />;
            default:
                return null;
        }
    };

    const formatTimeAgo = (date: Date) => {
        const now = new Date();
        const diffMs = now.getTime() - date.getTime();
        const diffMins = Math.floor(diffMs / (1000 * 60));
        const diffHours = Math.floor(diffMins / 60);
        const diffDays = Math.floor(diffHours / 24);

        if (diffMins < 60) {
            return `${diffMins}m ago`;
        } else if (diffHours < 24) {
            return `${diffHours}h ago`;
        } else {
            return `${diffDays}d ago`;
        }
    };

    if (isLoading) {
        return (
            <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {[...Array(3)].map((_, i) => (
                        <Card key={i}>
                            <CardContent className="p-6">
                                <div className="h-4 bg-gray-200 rounded animate-pulse mb-2"></div>
                                <div className="h-8 bg-gray-200 rounded animate-pulse"></div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Active Payments</CardTitle>
                        <Play className="h-4 w-4 text-green-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{getActivePaymentsCount()}</div>
                        <p className="text-xs text-muted-foreground">Hourly payments running</p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Paid</CardTitle>
                        <DollarSign className="h-4 w-4 text-blue-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">${formatCurrency(getTotalPaidAmount().toString())}</div>
                        <p className="text-xs text-muted-foreground">Across all employees</p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Recent Payments</CardTitle>
                        <Clock className="h-4 w-4 text-purple-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{paymentHistory.slice(0, 24).length}</div>
                        <p className="text-xs text-muted-foreground">Last 24 hours</p>
                    </CardContent>
                </Card>
            </div>

            {/* Employee Payment Management */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Users className="w-5 h-5" />
                        Hourly Payment Schedule
                    </CardTitle>
                    <CardDescription>
                        Manage automatic hourly payments for employees
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="overflow-x-auto">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Employee</TableHead>
                                    <TableHead>Hourly Rate</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead>Last Payment</TableHead>
                                    <TableHead>Total Paid</TableHead>
                                    <TableHead className="text-right">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {employees.map((employee) => {
                                    const paymentStatus = getPaymentStatus(employee.id);
                                    const paymentRecord = scheduledPayments.find(p => p.employeeId === employee.id);
                                    const employeePayments = getEmployeePayments(employee.id);
                                    const lastPayment = employeePayments[0];

                                    return (
                                        <TableRow key={employee.id}>
                                            <TableCell className="font-medium">{employee.name}</TableCell>
                                            <TableCell>
                                                <div className="flex items-center gap-2">
                                                    <span className="font-mono">${employee.hourlyRate}</span>
                                                    <Badge variant="outline" className="text-xs">
                                                        {employee.preferredCurrency}
                                                    </Badge>
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <Badge className={getStatusColor(paymentStatus)}>
                                                    {paymentStatus === 'active' ? (
                                                        <>
                                                            <Play className="w-3 h-3 mr-1" />
                                                            Active
                                                        </>
                                                    ) : (
                                                        <>
                                                            <Pause className="w-3 h-3 mr-1" />
                                                            Inactive
                                                        </>
                                                    )}
                                                </Badge>
                                            </TableCell>
                                            <TableCell>
                                                {lastPayment ? (
                                                    <div className="flex items-center gap-2">
                                                        {getStatusIcon(lastPayment.status)}
                                                        <span className="text-sm">
                                                            {formatTimeAgo(lastPayment.timestamp)}
                                                        </span>
                                                    </div>
                                                ) : (
                                                    <span className="text-sm text-muted-foreground">Never</span>
                                                )}
                                            </TableCell>
                                            <TableCell className="font-mono">
                                                ${formatCurrency((paymentRecord?.totalPaid || 0).toString())}
                                            </TableCell>
                                            <TableCell className="text-right">
                                                <div className="flex items-center gap-2 justify-end">
                                                    <Button
                                                        size="sm"
                                                        variant={paymentStatus === 'active' ? 'destructive' : 'default'}
                                                        onClick={() => handleTogglePayment(employee)}
                                                    >
                                                        {paymentStatus === 'active' ? (
                                                            <>
                                                                <Pause className="w-4 h-4 mr-1" />
                                                                Stop
                                                            </>
                                                        ) : (
                                                            <>
                                                                <Play className="w-4 h-4 mr-1" />
                                                                Start
                                                            </>
                                                        )}
                                                    </Button>
                                                    
                                                    <Dialog>
                                                        <DialogTrigger asChild>
                                                            <Button 
                                                                size="sm" 
                                                                variant="outline"
                                                                onClick={() => setSelectedEmployee(employee.id)}
                                                            >
                                                                <Calendar className="w-4 h-4 mr-1" />
                                                                History
                                                            </Button>
                                                        </DialogTrigger>
                                                        <DialogContent className="max-w-2xl">
                                                            <DialogHeader>
                                                                <DialogTitle>
                                                                    Payment History - {employee.name}
                                                                </DialogTitle>
                                                                <DialogDescription>
                                                                    Recent payment transactions for this employee
                                                                </DialogDescription>
                                                            </DialogHeader>
                                                            
                                                            <div className="max-h-96 overflow-y-auto">
                                                                <Table>
                                                                    <TableHeader>
                                                                        <TableRow>
                                                                            <TableHead>Date</TableHead>
                                                                            <TableHead>Amount</TableHead>
                                                                            <TableHead>Status</TableHead>
                                                                        </TableRow>
                                                                    </TableHeader>
                                                                    <TableBody>
                                                                        {employeePayments.slice(0, 20).map((payment) => (
                                                                            <TableRow key={payment.id}>
                                                                                <TableCell>
                                                                                    {payment.timestamp.toLocaleString()}
                                                                                </TableCell>
                                                                                <TableCell className="font-mono">
                                                                                    ${formatCurrency(payment.amount.toString())}
                                                                                </TableCell>
                                                                                <TableCell>
                                                                                    <Badge className={getStatusColor(payment.status)}>
                                                                                        {payment.status}
                                                                                    </Badge>
                                                                                </TableCell>
                                                                            </TableRow>
                                                                        ))}
                                                                        {employeePayments.length === 0 && (
                                                                            <TableRow>
                                                                                <TableCell colSpan={3} className="text-center text-muted-foreground">
                                                                                    No payment history
                                                                                </TableCell>
                                                                            </TableRow>
                                                                        )}
                                                                    </TableBody>
                                                                </Table>
                                                            </div>
                                                        </DialogContent>
                                                    </Dialog>
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    );
                                })}
                            </TableBody>
                        </Table>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}