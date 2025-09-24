"use client";

import { useState, useEffect, useCallback } from 'react';
import { type Address } from 'viem';
import { useNitroliteContext } from '@/providers/NitroliteProvider';

interface ScheduledPayment {
    id: string;
    employeeId: string;
    employeeName: string;
    recipientAddress: string;
    hourlyRate: number;
    asset: string;
    isActive: boolean;
    lastPayment?: Date;
    nextPayment?: Date;
    totalPaid: number;
    intervalId?: NodeJS.Timer;
}

interface PaymentHistory {
    id: string;
    employeeId: string;
    amount: number;
    asset: string;
    timestamp: Date;
    status: 'success' | 'failed' | 'pending';
    transactionId?: string;
}

const PAYMENT_INTERVAL_MS = 60 * 60 * 1000; // 1 hour in milliseconds
const STORAGE_KEY = 'scheduled_payments';
const HISTORY_KEY = 'payment_history';

export function useScheduledPayments() {
    const nitrolite = useNitroliteContext();
    const [scheduledPayments, setScheduledPayments] = useState<ScheduledPayment[]>([]);
    const [paymentHistory, setPaymentHistory] = useState<PaymentHistory[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    // Load scheduled payments from localStorage on mount
    useEffect(() => {
        try {
            const stored = localStorage.getItem(STORAGE_KEY);
            if (stored) {
                const payments = JSON.parse(stored) as ScheduledPayment[];
                setScheduledPayments(payments);
            }
            
            const storedHistory = localStorage.getItem(HISTORY_KEY);
            if (storedHistory) {
                const history = JSON.parse(storedHistory).map((h: any) => ({
                    ...h,
                    timestamp: new Date(h.timestamp)
                }));
                setPaymentHistory(history);
            }
        } catch (error) {
            console.error('Failed to load scheduled payments:', error);
        } finally {
            setIsLoading(false);
        }
    }, []);

    // Save to localStorage whenever scheduledPayments changes
    const saveToStorage = useCallback((payments: ScheduledPayment[]) => {
        try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(payments));
        } catch (error) {
            console.error('Failed to save scheduled payments:', error);
        }
    }, []);

    // Save payment history
    const saveHistoryToStorage = useCallback((history: PaymentHistory[]) => {
        try {
            localStorage.setItem(HISTORY_KEY, JSON.stringify(history));
        } catch (error) {
            console.error('Failed to save payment history:', error);
        }
    }, []);

    // Execute a single payment
    const executePayment = useCallback(async (payment: ScheduledPayment): Promise<boolean> => {
        try {
            console.log(`Executing hourly payment for ${payment.employeeName}: $${payment.hourlyRate}`);
            
            const result = await nitrolite.transfer(
                payment.recipientAddress as Address,
                payment.hourlyRate.toString(),
                payment.asset
            );

            const historyEntry: PaymentHistory = {
                id: `${payment.employeeId}_${Date.now()}`,
                employeeId: payment.employeeId,
                amount: payment.hourlyRate,
                asset: payment.asset,
                timestamp: new Date(),
                status: result.success ? 'success' : 'failed'
            };

            setPaymentHistory(prev => {
                const updated = [historyEntry, ...prev].slice(0, 100); // Keep last 100 entries
                saveHistoryToStorage(updated);
                return updated;
            });

            if (result.success) {
                // Update the payment record
                setScheduledPayments(prev => {
                    const updated = prev.map(p => 
                        p.id === payment.id 
                            ? { 
                                ...p, 
                                lastPayment: new Date(),
                                nextPayment: new Date(Date.now() + PAYMENT_INTERVAL_MS),
                                totalPaid: p.totalPaid + p.hourlyRate
                            }
                            : p
                    );
                    saveToStorage(updated);
                    return updated;
                });
                return true;
            } else {
                console.error('Payment failed:', result.error);
                return false;
            }
        } catch (error) {
            console.error('Error executing payment:', error);
            return false;
        }
    }, [nitrolite, saveToStorage, saveHistoryToStorage]);

    // Start scheduled payment for an employee
    const startScheduledPayment = useCallback((employee: {
        id: string;
        name: string;
        walletAddress: string;
        hourlyRate: number;
        preferredCurrency: string;
    }) => {
        const paymentId = `payment_${employee.id}`;
        
        // Check if already exists
        const existing = scheduledPayments.find(p => p.id === paymentId);
        if (existing && existing.isActive) {
            console.log(`Payment already scheduled for ${employee.name}`);
            return;
        }

        const newPayment: ScheduledPayment = {
            id: paymentId,
            employeeId: employee.id,
            employeeName: employee.name,
            recipientAddress: employee.walletAddress,
            hourlyRate: employee.hourlyRate,
            asset: employee.preferredCurrency.toLowerCase(),
            isActive: true,
            nextPayment: new Date(Date.now() + PAYMENT_INTERVAL_MS),
            totalPaid: 0
        };

        // Set up the interval
        const intervalId = setInterval(() => {
            if (nitrolite.isAuthenticated) {
                executePayment(newPayment);
            } else {
                console.log('Skipping payment - not authenticated');
            }
        }, PAYMENT_INTERVAL_MS);

        newPayment.intervalId = intervalId;

        setScheduledPayments(prev => {
            const filtered = prev.filter(p => p.id !== paymentId); // Remove existing
            const updated = [...filtered, newPayment];
            saveToStorage(updated);
            return updated;
        });

        console.log(`Started hourly payments for ${employee.name}`);
    }, [scheduledPayments, nitrolite.isAuthenticated, executePayment, saveToStorage]);

    // Stop scheduled payment
    const stopScheduledPayment = useCallback((paymentId: string) => {
        setScheduledPayments(prev => {
            const updated = prev.map(payment => {
                if (payment.id === paymentId) {
                    if (payment.intervalId) {
                        clearInterval(payment.intervalId);
                    }
                    return { ...payment, isActive: false, intervalId: undefined };
                }
                return payment;
            });
            saveToStorage(updated);
            return updated;
        });

        console.log(`Stopped scheduled payment: ${paymentId}`);
    }, [saveToStorage]);

    // Restart intervals on component mount (in case of page refresh)
    useEffect(() => {
        if (scheduledPayments.length > 0 && nitrolite.isAuthenticated) {
            scheduledPayments.forEach(payment => {
                if (payment.isActive && !payment.intervalId) {
                    const intervalId = setInterval(() => {
                        executePayment(payment);
                    }, PAYMENT_INTERVAL_MS);

                    setScheduledPayments(prev => prev.map(p => 
                        p.id === payment.id ? { ...p, intervalId } : p
                    ));
                }
            });
        }

        // Cleanup intervals on unmount
        return () => {
            scheduledPayments.forEach(payment => {
                if (payment.intervalId) {
                    clearInterval(payment.intervalId);
                }
            });
        };
    }, [scheduledPayments.length, nitrolite.isAuthenticated]);

    // Get active payments count
    const getActivePaymentsCount = useCallback(() => {
        return scheduledPayments.filter(p => p.isActive).length;
    }, [scheduledPayments]);

    // Get total paid amount
    const getTotalPaidAmount = useCallback(() => {
        return scheduledPayments.reduce((total, payment) => total + payment.totalPaid, 0);
    }, [scheduledPayments]);

    // Get payments for a specific employee
    const getEmployeePayments = useCallback((employeeId: string) => {
        return paymentHistory.filter(h => h.employeeId === employeeId);
    }, [paymentHistory]);

    return {
        scheduledPayments,
        paymentHistory,
        isLoading,
        startScheduledPayment,
        stopScheduledPayment,
        getActivePaymentsCount,
        getTotalPaidAmount,
        getEmployeePayments,
    };
}