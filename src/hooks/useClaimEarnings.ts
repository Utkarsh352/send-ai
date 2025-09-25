"use client";

import { useState, useCallback } from 'react';
import { type Address } from 'viem';
import { useNitroliteContext } from '@/providers/NitroliteProvider';

export interface ClaimResult {
    success: boolean;
    error?: string;
    amount?: string;
    txHash?: string;
}

export interface EarningsData {
    availableAmount: string;
    asset: string;
    lastUpdated: Date;
    totalEarned: string;
    claimedAmount: string;
}

export function useClaimEarnings() {
    const nitrolite = useNitroliteContext();
    const [isClaiming, setIsClaiming] = useState(false);
    const [earnings, setEarnings] = useState<EarningsData | null>(null);
    const [isLoadingEarnings, setIsLoadingEarnings] = useState(false);

    // Fetch available earnings for employee
    const fetchEarnings = useCallback(async (employeeWallet: Address): Promise<void> => {
        if (!nitrolite.isAuthenticated) {
            console.log('Cannot fetch earnings: not authenticated');
            return;
        }

        try {
            setIsLoadingEarnings(true);

            // In a real implementation, this would query the employer's system or smart contract
            // For now, we'll simulate earnings data based on the balance
            const balance = nitrolite.balances?.['ytest.usd'] || nitrolite.balances?.['usdc'] || '0';
            const availableAmount = parseFloat(balance);

            // Mock earnings data - in real app this would come from API/database
            const mockEarnings: EarningsData = {
                availableAmount: availableAmount.toString(),
                asset: 'ytest.usd',
                lastUpdated: new Date(),
                totalEarned: (availableAmount + 100).toString(), // Mock total earned
                claimedAmount: '100' // Mock previously claimed amount
            };

            setEarnings(mockEarnings);
        } catch (error) {
            console.error('Failed to fetch earnings:', error);
        } finally {
            setIsLoadingEarnings(false);
        }
    }, [nitrolite.isAuthenticated, nitrolite.balances]);

    // Claim available earnings
    const claimEarnings = useCallback(async (
        employeeWallet: Address,
        amount?: string
    ): Promise<ClaimResult> => {
        if (!nitrolite.isAuthenticated) {
            return { success: false, error: 'Please authenticate first' };
        }

        if (!earnings || parseFloat(earnings.availableAmount) <= 0) {
            return { success: false, error: 'No earnings available to claim' };
        }

        try {
            setIsClaiming(true);

            // Determine amount to claim
            const claimAmount = amount || earnings.availableAmount;
            const claimAmountFloat = parseFloat(claimAmount);

            if (claimAmountFloat <= 0) {
                return { success: false, error: 'Invalid claim amount' };
            }

            if (claimAmountFloat > parseFloat(earnings.availableAmount)) {
                return { success: false, error: 'Cannot claim more than available amount' };
            }

            // In a real implementation, this would:
            // 1. Call the employer's system to release the funds
            // 2. Transfer from employer's account to employee's account
            // 3. Update the earnings records

            // For demo purposes, we'll simulate a successful claim
            console.log(`Claiming ${claimAmount} ${earnings.asset} for employee ${employeeWallet}`);

            // Simulate network delay
            await new Promise(resolve => setTimeout(resolve, 2000));

            // Update earnings data to reflect the claim
            setEarnings(prev => prev ? {
                ...prev,
                availableAmount: (parseFloat(prev.availableAmount) - claimAmountFloat).toString(),
                claimedAmount: (parseFloat(prev.claimedAmount) + claimAmountFloat).toString(),
                lastUpdated: new Date()
            } : null);

            // Refresh balances to reflect the new funds
            if (nitrolite.fetchBalances) {
                nitrolite.fetchBalances(employeeWallet);
            }

            return {
                success: true,
                amount: claimAmount,
                txHash: `0x${Math.random().toString(16).substr(2, 64)}` // Mock transaction hash
            };

        } catch (error) {
            console.error('Failed to claim earnings:', error);
            const errorMsg = error instanceof Error ? error.message : 'Failed to claim earnings';
            return { success: false, error: errorMsg };
        } finally {
            setIsClaiming(false);
        }
    }, [nitrolite.isAuthenticated, earnings, nitrolite.fetchBalances]);

    // Claim all available earnings
    const claimAllEarnings = useCallback(async (employeeWallet: Address): Promise<ClaimResult> => {
        return claimEarnings(employeeWallet);
    }, [claimEarnings]);

    return {
        // State
        isClaiming,
        earnings,
        isLoadingEarnings,

        // Actions
        fetchEarnings,
        claimEarnings,
        claimAllEarnings
    };
}