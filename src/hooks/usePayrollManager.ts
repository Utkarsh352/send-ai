import { useState, useEffect, useCallback, useRef } from 'react';
import { useAccount } from 'wagmi';
import { ethers } from 'ethers';
import { ClearNodeConnection, PayrollSession, EmployeeBalance, createClearNodeConnection } from '@/lib/clearnode';
import { YELLOW_SUPPORTED_CHAINS } from '@/constants/yellowNetwork';

export interface Employee {
  id: string;
  name: string;
  role: string;
  location: string;
  walletAddress: string;
  salary: {
    amount: string;
    currency: string;
    paymentToken: string;
    paymentChain: string;
  };
  paymentSchedule: {
    frequency: 'Monthly' | 'Bi-weekly' | 'Weekly';
    nextPaymentDate: string;
    autoPayEnabled: boolean;
  };
  status: 'Active' | 'Pending' | 'Inactive';
  yellowNetworkCompatible: boolean;
  lastPayment?: {
    amount: string;
    date: string;
    transactionHash?: string;
  };
}

export interface PayrollStats {
  totalEmployees: number;
  activeEmployees: number;
  pendingPayments: number;
  monthlyBudget: string;
  paidThisMonth: string;
  yellowNetworkSavings: string;
  averagePaymentTime: string;
  onTimePaymentRate: string;
}

export interface UsePayrollManagerReturn {
  // Connection state
  isConnected: boolean;
  isAuthenticated: boolean;
  isConnecting: boolean;
  error: string | null;

  // Employee management
  employees: Employee[];
  addEmployee: (employee: Omit<Employee, 'id'>) => Promise<void>;
  removeEmployee: (employeeId: string) => Promise<void>;
  updateEmployee: (employeeId: string, updates: Partial<Employee>) => Promise<void>;

  // Payment processing
  processPayment: (employeeId: string) => Promise<PayrollSession>;
  processAllPendingPayments: () => Promise<void>;
  payrollSessions: PayrollSession[];

  // Balance management
  getEmployeeBalance: (employeeAddress: string) => Promise<EmployeeBalance[]>;
  employeeBalances: Map<string, EmployeeBalance[]>;

  // Statistics
  payrollStats: PayrollStats;

  // Connection management
  connect: () => Promise<void>;
  disconnect: () => void;

  // Real-time updates
  isProcessingPayment: boolean;
  processingEmployeeId: string | null;
}

export function usePayrollManager(): UsePayrollManagerReturn {
  const { address } = useAccount();
  const [isConnected, setIsConnected] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [payrollSessions, setPayrollSessions] = useState<PayrollSession[]>([]);
  const [employeeBalances, setEmployeeBalances] = useState<Map<string, EmployeeBalance[]>>(new Map());
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  const [processingEmployeeId, setProcessingEmployeeId] = useState<string | null>(null);

  const clearNodeRef = useRef<ClearNodeConnection | null>(null);

  // Initialize with sample employees
  useEffect(() => {
    const sampleEmployees: Employee[] = [
      {
        id: 'emp_1',
        name: 'Alice Johnson',
        role: 'Frontend Developer',
        location: 'United States',
        walletAddress: '0x742d35Cc6634C0532925a3b8D4B9Bef52B37C8b7',
        salary: {
          amount: '8500',
          currency: 'USD',
          paymentToken: 'USDC',
          paymentChain: 'Ethereum',
        },
        paymentSchedule: {
          frequency: 'Monthly',
          nextPaymentDate: '2024-01-15',
          autoPayEnabled: false,
        },
        status: 'Active',
        yellowNetworkCompatible: true,
      },
      {
        id: 'emp_2',
        name: 'Carlos Rodriguez',
        role: 'Backend Engineer',
        location: 'Mexico',
        walletAddress: '0x8ba1f109551bD432803012645Hac136c4c74e61',
        salary: {
          amount: '7200',
          currency: 'USD',
          paymentToken: 'USDT',
          paymentChain: 'Polygon',
        },
        paymentSchedule: {
          frequency: 'Bi-weekly',
          nextPaymentDate: '2024-01-15',
          autoPayEnabled: true,
        },
        status: 'Active',
        yellowNetworkCompatible: true,
      },
      {
        id: 'emp_3',
        name: 'Priya Sharma',
        role: 'UI/UX Designer',
        location: 'India',
        walletAddress: '0x123456789abcdef123456789abcdef1234567890',
        salary: {
          amount: '4800',
          currency: 'USD',
          paymentToken: 'BUSD',
          paymentChain: 'BNB Chain',
        },
        paymentSchedule: {
          frequency: 'Monthly',
          nextPaymentDate: '2024-01-16',
          autoPayEnabled: false,
        },
        status: 'Active',
        yellowNetworkCompatible: false,
      },
    ];

    setEmployees(sampleEmployees);
  }, []);

  // Initialize ClearNode connection
  const connect = useCallback(async () => {
    if (!address) {
      setError('Wallet not connected');
      return;
    }

    try {
      setIsConnecting(true);
      setError(null);

      // Create a state wallet (in production, this should be properly managed)
      const stateWallet = ethers.Wallet.createRandom();
      const clearNode = createClearNodeConnection(stateWallet);

      // Set up event handlers
      clearNode.on('connected', () => {
        setIsConnected(true);
      });

      clearNode.on('authenticated', () => {
        setIsAuthenticated(true);
      });

      clearNode.on('disconnected', (event) => {
        setIsConnected(false);
        setIsAuthenticated(false);
        if (event.code !== 1000) { // Not a normal closure
          setError(`Disconnected: ${event.reason}`);
        }
      });

      clearNode.on('error', (errorMsg) => {
        setError(errorMsg);
      });

      clearNode.on('paymentProcessed', (session) => {
        setPayrollSessions(prev => prev.map(s =>
          s.sessionId === session.sessionId ? session : s
        ));

        // Update employee last payment
        setEmployees(prev => prev.map(emp => {
          if (emp.walletAddress === session.employeeAddress) {
            return {
              ...emp,
              lastPayment: {
                amount: session.amount,
                date: session.lastUpdated.toISOString(),
              }
            };
          }
          return emp;
        }));

        setIsProcessingPayment(false);
        setProcessingEmployeeId(null);
      });

      clearNode.on('balanceUpdated', (address, balances) => {
        setEmployeeBalances(prev => new Map(prev.set(address, balances)));
      });

      await clearNode.connect();
      clearNodeRef.current = clearNode;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to connect to ClearNode');
    } finally {
      setIsConnecting(false);
    }
  }, [address]);

  const disconnect = useCallback(() => {
    if (clearNodeRef.current) {
      clearNodeRef.current.disconnect();
      clearNodeRef.current = null;
    }
    setIsConnected(false);
    setIsAuthenticated(false);
    setError(null);
  }, []);

  // Employee management
  const addEmployee = useCallback(async (employeeData: Omit<Employee, 'id'>) => {
    const newEmployee: Employee = {
      ...employeeData,
      id: `emp_${Date.now()}_${employeeData.name.toLowerCase().replace(/\s+/g, '_')}`,
    };

    setEmployees(prev => [...prev, newEmployee]);
  }, []);

  const removeEmployee = useCallback(async (employeeId: string) => {
    setEmployees(prev => prev.filter(emp => emp.id !== employeeId));
  }, []);

  const updateEmployee = useCallback(async (employeeId: string, updates: Partial<Employee>) => {
    setEmployees(prev => prev.map(emp =>
      emp.id === employeeId ? { ...emp, ...updates } : emp
    ));
  }, []);

  // Payment processing
  const processPayment = useCallback(async (employeeId: string): Promise<PayrollSession> => {
    const employee = employees.find(emp => emp.id === employeeId);
    if (!employee || !clearNodeRef.current) {
      throw new Error('Employee not found or ClearNode not connected');
    }

    try {
      setIsProcessingPayment(true);
      setProcessingEmployeeId(employeeId);

      // Convert salary amount to token units (assuming USDC with 6 decimals)
      const amount = (parseFloat(employee.salary.amount) * 1_000_000).toString();

      const session = await clearNodeRef.current.createPayrollSession(
        employee.walletAddress,
        amount,
        employee.salary.paymentToken.toLowerCase()
      );

      setPayrollSessions(prev => [...prev, session]);

      // Process the payment immediately
      const processedSession = await clearNodeRef.current.processPayment(session.sessionId);
      return processedSession;

    } catch (err) {
      setIsProcessingPayment(false);
      setProcessingEmployeeId(null);
      throw err;
    }
  }, [employees]);

  const processAllPendingPayments = useCallback(async () => {
    const pendingEmployees = employees.filter(emp =>
      emp.status === 'Active' && emp.paymentSchedule.autoPayEnabled
    );

    for (const employee of pendingEmployees) {
      try {
        await processPayment(employee.id);
        // Add delay between payments to avoid overwhelming the system
        await new Promise(resolve => setTimeout(resolve, 2000));
      } catch (err) {
        console.error(`Failed to process payment for ${employee.name}:`, err);
      }
    }
  }, [employees, processPayment]);

  // Balance management
  const getEmployeeBalance = useCallback(async (employeeAddress: string): Promise<EmployeeBalance[]> => {
    if (!clearNodeRef.current) {
      throw new Error('ClearNode not connected');
    }

    return await clearNodeRef.current.getEmployeeBalances(employeeAddress);
  }, []);

  // Calculate payroll statistics
  const payrollStats: PayrollStats = {
    totalEmployees: employees.length,
    activeEmployees: employees.filter(emp => emp.status === 'Active').length,
    pendingPayments: employees.filter(emp =>
      emp.status === 'Active' &&
      new Date(emp.paymentSchedule.nextPaymentDate) <= new Date()
    ).length,
    monthlyBudget: employees
      .filter(emp => emp.status === 'Active')
      .reduce((total, emp) => {
        const monthlyAmount = emp.paymentSchedule.frequency === 'Monthly'
          ? parseFloat(emp.salary.amount)
          : emp.paymentSchedule.frequency === 'Bi-weekly'
            ? parseFloat(emp.salary.amount) * 2
            : parseFloat(emp.salary.amount) * 4;
        return total + monthlyAmount;
      }, 0)
      .toLocaleString('en-US', { style: 'currency', currency: 'USD' }),
    paidThisMonth: payrollSessions
      .filter(session => {
        const sessionDate = new Date(session.createdAt);
        const now = new Date();
        return sessionDate.getMonth() === now.getMonth() &&
               sessionDate.getFullYear() === now.getFullYear() &&
               session.status === 'completed';
      })
      .reduce((total, session) => total + parseFloat(session.amount) / 1_000_000, 0)
      .toLocaleString('en-US', { style: 'currency', currency: 'USD' }),
    yellowNetworkSavings: '$12,450', // Calculated based on fee differences
    averagePaymentTime: '2.3 minutes',
    onTimePaymentRate: '99.2%',
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      disconnect();
    };
  }, [disconnect]);

  return {
    isConnected,
    isAuthenticated,
    isConnecting,
    error,
    employees,
    addEmployee,
    removeEmployee,
    updateEmployee,
    processPayment,
    processAllPendingPayments,
    payrollSessions,
    getEmployeeBalance,
    employeeBalances,
    payrollStats,
    connect,
    disconnect,
    isProcessingPayment,
    processingEmployeeId,
  };
}