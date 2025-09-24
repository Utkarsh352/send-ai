"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Loader2, CheckCircle, AlertTriangle } from "lucide-react";
import { YELLOW_SUPPORTED_CHAINS, isYellowCompatible } from "@/constants/yellowNetwork";
import { Employee } from "@/hooks/usePayrollManager";

interface EmployeeFormData {
  name: string;
  role: string;
  location: string;
  walletAddress: string;
  salaryAmount: string;
  currency: string;
  paymentToken: string;
  paymentChain: string;
  frequency: 'Monthly' | 'Bi-weekly' | 'Weekly';
  autoPayEnabled: boolean;
}

interface EmployeeManagementProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (employee: Omit<Employee, 'id'>) => Promise<void>;
  employee?: Employee;
  isLoading?: boolean;
}

export function EmployeeManagement({
  isOpen,
  onClose,
  onSubmit,
  employee,
  isLoading = false
}: EmployeeManagementProps) {
  const [formData, setFormData] = useState<EmployeeFormData>(() => ({
    name: employee?.name || '',
    role: employee?.role || '',
    location: employee?.location || '',
    walletAddress: employee?.walletAddress || '',
    salaryAmount: employee?.salary.amount || '',
    currency: employee?.salary.currency || 'USD',
    paymentToken: employee?.salary.paymentToken || 'USDC',
    paymentChain: employee?.salary.paymentChain || 'Ethereum',
    frequency: employee?.paymentSchedule.frequency || 'Monthly',
    autoPayEnabled: employee?.paymentSchedule.autoPayEnabled || false,
  }));

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Validation
  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }

    if (!formData.role.trim()) {
      newErrors.role = 'Role is required';
    }

    if (!formData.location.trim()) {
      newErrors.location = 'Location is required';
    }

    if (!formData.walletAddress.trim()) {
      newErrors.walletAddress = 'Wallet address is required';
    } else if (!formData.walletAddress.match(/^0x[a-fA-F0-9]{40}$/)) {
      newErrors.walletAddress = 'Invalid Ethereum address format';
    }

    if (!formData.salaryAmount.trim()) {
      newErrors.salaryAmount = 'Salary amount is required';
    } else if (isNaN(parseFloat(formData.salaryAmount)) || parseFloat(formData.salaryAmount) <= 0) {
      newErrors.salaryAmount = 'Salary must be a positive number';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Get chain info
  const selectedChain = YELLOW_SUPPORTED_CHAINS.find(
    chain => chain.displayName === formData.paymentChain
  );
  const isYellowNetworkCompatible = selectedChain ? isYellowCompatible(selectedChain.id) : false;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      const nextPaymentDate = getNextPaymentDate(formData.frequency);

      const employeeData: Omit<Employee, 'id'> = {
        name: formData.name.trim(),
        role: formData.role.trim(),
        location: formData.location.trim(),
        walletAddress: formData.walletAddress.trim(),
        salary: {
          amount: formData.salaryAmount,
          currency: formData.currency,
          paymentToken: formData.paymentToken,
          paymentChain: formData.paymentChain,
        },
        paymentSchedule: {
          frequency: formData.frequency,
          nextPaymentDate,
          autoPayEnabled: formData.autoPayEnabled,
        },
        status: 'Active',
        yellowNetworkCompatible: isYellowNetworkCompatible,
      };

      await onSubmit(employeeData);
      onClose();

      // Reset form
      setFormData({
        name: '',
        role: '',
        location: '',
        walletAddress: '',
        salaryAmount: '',
        currency: 'USD',
        paymentToken: 'USDC',
        paymentChain: 'Ethereum',
        frequency: 'Monthly',
        autoPayEnabled: false,
      });
    } catch (error) {
      console.error('Failed to save employee:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const getNextPaymentDate = (frequency: string): string => {
    const now = new Date();
    const nextPayment = new Date(now);

    switch (frequency) {
      case 'Weekly':
        nextPayment.setDate(now.getDate() + 7);
        break;
      case 'Bi-weekly':
        nextPayment.setDate(now.getDate() + 14);
        break;
      case 'Monthly':
      default:
        nextPayment.setMonth(now.getMonth() + 1);
        break;
    }

    return nextPayment.toISOString().split('T')[0];
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[525px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{employee ? 'Edit Employee' : 'Add New Employee'}</DialogTitle>
          <DialogDescription>
            {employee
              ? 'Update employee information and payment settings.'
              : 'Add a new employee to your payroll system with cross-chain payment configuration.'
            }
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Information */}
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="name">Full Name</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="John Doe"
                  className={errors.name ? 'border-red-500' : ''}
                />
                {errors.name && (
                  <p className="text-sm text-red-500 mt-1">{errors.name}</p>
                )}
              </div>

              <div>
                <Label htmlFor="role">Role</Label>
                <Input
                  id="role"
                  value={formData.role}
                  onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                  placeholder="Software Engineer"
                  className={errors.role ? 'border-red-500' : ''}
                />
                {errors.role && (
                  <p className="text-sm text-red-500 mt-1">{errors.role}</p>
                )}
              </div>
            </div>

            <div>
              <Label htmlFor="location">Location</Label>
              <Input
                id="location"
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                placeholder="United States"
                className={errors.location ? 'border-red-500' : ''}
              />
              {errors.location && (
                <p className="text-sm text-red-500 mt-1">{errors.location}</p>
              )}
            </div>

            <div>
              <Label htmlFor="walletAddress">Wallet Address</Label>
              <Input
                id="walletAddress"
                value={formData.walletAddress}
                onChange={(e) => setFormData({ ...formData, walletAddress: e.target.value })}
                placeholder="0x742d35Cc6634C0532925a3b8D4B9Bef52B37C8b7"
                className={errors.walletAddress ? 'border-red-500' : ''}
              />
              {errors.walletAddress && (
                <p className="text-sm text-red-500 mt-1">{errors.walletAddress}</p>
              )}
            </div>
          </div>

          {/* Salary Information */}
          <div className="space-y-4">
            <h4 className="font-medium">Salary Information</h4>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="salaryAmount">Salary Amount</Label>
                <Input
                  id="salaryAmount"
                  type="number"
                  value={formData.salaryAmount}
                  onChange={(e) => setFormData({ ...formData, salaryAmount: e.target.value })}
                  placeholder="5000"
                  className={errors.salaryAmount ? 'border-red-500' : ''}
                />
                {errors.salaryAmount && (
                  <p className="text-sm text-red-500 mt-1">{errors.salaryAmount}</p>
                )}
              </div>

              <div>
                <Label htmlFor="currency">Currency</Label>
                <Select
                  value={formData.currency}
                  onValueChange={(value) => setFormData({ ...formData, currency: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select currency" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="USD">USD</SelectItem>
                    <SelectItem value="EUR">EUR</SelectItem>
                    <SelectItem value="GBP">GBP</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div>
              <Label htmlFor="frequency">Payment Frequency</Label>
              <Select
                value={formData.frequency}
                onValueChange={(value: 'Monthly' | 'Bi-weekly' | 'Weekly') =>
                  setFormData({ ...formData, frequency: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select frequency" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Monthly">Monthly</SelectItem>
                  <SelectItem value="Bi-weekly">Bi-weekly</SelectItem>
                  <SelectItem value="Weekly">Weekly</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Payment Configuration */}
          <div className="space-y-4">
            <h4 className="font-medium">Payment Configuration</h4>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="paymentChain">Payment Chain</Label>
                <Select
                  value={formData.paymentChain}
                  onValueChange={(value) => setFormData({ ...formData, paymentChain: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select chain" />
                  </SelectTrigger>
                  <SelectContent>
                    {YELLOW_SUPPORTED_CHAINS.map((chain) => (
                      <SelectItem key={chain.id} value={chain.displayName}>
                        <div className="flex items-center gap-2">
                          {chain.displayName}
                          {isYellowCompatible(chain.id) && (
                            <Badge variant="outline" className="text-yellow-500 text-xs">
                              Yellow
                            </Badge>
                          )}
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="paymentToken">Payment Token</Label>
                <Select
                  value={formData.paymentToken}
                  onValueChange={(value) => setFormData({ ...formData, paymentToken: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select token" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="USDC">USDC</SelectItem>
                    <SelectItem value="USDT">USDT</SelectItem>
                    <SelectItem value="BUSD">BUSD</SelectItem>
                    <SelectItem value="ETH">ETH</SelectItem>
                    <SelectItem value="MATIC">MATIC</SelectItem>
                    <SelectItem value="BNB">BNB</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Yellow Network Compatibility */}
            <div className="p-3 border rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                {isYellowNetworkCompatible ? (
                  <CheckCircle className="w-4 h-4 text-green-500" />
                ) : (
                  <AlertTriangle className="w-4 h-4 text-yellow-500" />
                )}
                <span className="text-sm font-medium">
                  Yellow Network {isYellowNetworkCompatible ? 'Compatible' : 'Not Available'}
                </span>
              </div>
              <p className="text-xs text-muted-foreground">
                {isYellowNetworkCompatible
                  ? 'This employee can receive payments via Yellow Network state channels with instant settlement and lower fees.'
                  : `${formData.paymentChain} is not yet supported by Yellow Network. Payments will use traditional cross-chain bridges.`
                }
              </p>
            </div>

            {/* Auto-pay Setting */}
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="autoPayEnabled">Auto-pay Enabled</Label>
                <p className="text-sm text-muted-foreground">
                  Automatically process payments on due dates
                </p>
              </div>
              <Switch
                id="autoPayEnabled"
                checked={formData.autoPayEnabled}
                onCheckedChange={(checked) =>
                  setFormData({ ...formData, autoPayEnabled: checked })}
              />
            </div>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting || isLoading}>
              {isSubmitting || isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  {employee ? 'Updating...' : 'Adding...'}
                </>
              ) : (
                employee ? 'Update Employee' : 'Add Employee'
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}