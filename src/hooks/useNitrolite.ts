"use client";

import { useState, useEffect, useCallback } from 'react';
import { type Address, type WalletClient } from 'viem';
import {
    createAuthRequestMessage,
    createAuthVerifyMessage,
    createEIP712AuthMessageSigner,
    createECDSAMessageSigner,
    createGetLedgerBalancesMessage,
    createTransferMessage,
    parseAnyRPCResponse,
    RPCMethod,
    type AuthChallengeResponse,
    type AuthRequestParams,
    type GetLedgerBalancesResponse,
    type BalanceUpdateResponse,
    type TransferResponse,
} from '@erc7824/nitrolite';
import { webSocketService, type WsStatus } from '@/lib/websocket';
import {
    generateSessionKey,
    getStoredSessionKey,
    storeSessionKey,
    removeSessionKey,
    storeJWT,
    removeJWT,
    type SessionKey,
} from '@/lib/utils';

const AUTH_SCOPE = 'send-ai.com';
const APP_NAME = 'Send-AI';
const SESSION_DURATION = parseInt(process.env.NEXT_PUBLIC_SESSION_DURATION || '3600');

const getAuthDomain = () => ({
    name: APP_NAME,
});

export interface NitroliteState {
    // Connection
    wsStatus: WsStatus;
    
    // Authentication
    sessionKey: SessionKey | null;
    isAuthenticated: boolean;
    isAuthenticating: boolean;
    
    // Balance
    balances: Record<string, string> | null;
    isLoadingBalances: boolean;
    
    // Transfer
    isTransferring: boolean;
    lastTransferError: string | null;
}

export interface NitroliteActions {
    // Connection
    connect: () => void;
    disconnect: () => void;

    // Authentication
    authenticate: (privateKey: string, signerName?: string) => Promise<void>;

    // Balance
    fetchBalances: (account: Address) => Promise<void>;

    // Transfer
    transfer: (recipient: Address, amount: string, asset?: string) => Promise<{ success: boolean; error?: string }>;
}

export function useNitrolite(): NitroliteState & NitroliteActions {
    // State
    const [wsStatus, setWsStatus] = useState<WsStatus>('Disconnected');
    const [sessionKey, setSessionKey] = useState<SessionKey | null>(null);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [isAuthenticating, setIsAuthenticating] = useState(false);
    const [balances, setBalances] = useState<Record<string, string> | null>(null);
    const [isLoadingBalances, setIsLoadingBalances] = useState(false);
    const [isTransferring, setIsTransferring] = useState(false);
    const [lastTransferError, setLastTransferError] = useState<string | null>(null);
    const [sessionExpireTimestamp, setSessionExpireTimestamp] = useState<string>('');
    const [authAttemptCount, setAuthAttemptCount] = useState(0);

    // Initialize session key on mount
    useEffect(() => {
        const existingSessionKey = getStoredSessionKey();
        if (existingSessionKey) {
            setSessionKey(existingSessionKey);
        } else {
            const newSessionKey = generateSessionKey();
            storeSessionKey(newSessionKey);
            setSessionKey(newSessionKey);
        }
    }, []);

    // WebSocket connection management
    const connect = useCallback(() => {
        webSocketService.addStatusListener(setWsStatus);
        webSocketService.connect();
    }, []);

    const disconnect = useCallback(() => {
        webSocketService.removeStatusListener(setWsStatus);
        webSocketService.disconnect();
        setIsAuthenticated(false);
        setIsAuthenticating(false);
    }, []);

    // Simplified authentication using private key (like Cerebro)
    const authenticate = useCallback(async (privateKey: string, signerName: string = 'utk_signer') => {
        if (wsStatus !== 'Connected') {
            console.log('Cannot authenticate: not connected to WebSocket');
            return;
        }

        // Prevent multiple simultaneous authentication attempts
        if (isAuthenticating) {
            console.log('Authentication already in progress, skipping');
            return;
        }

        try {
            setIsAuthenticating(true);
            setLastTransferError(null);

            // Format user without 0x prefix, exactly like Cerebro expects
            const user = privateKey.startsWith('0x') ? privateKey.slice(2) : privateKey;

            // Simple authentication message like Cerebro - send as string
            const authCommand = `authenticate ${user} ${signerName}`;
            console.log('Sending auth command:', authCommand);

            webSocketService.send(authCommand);
        } catch (error) {
            console.error('Authentication failed:', error);
            setIsAuthenticating(false);
        }
    }, [wsStatus, isAuthenticating]);

    // Balance fetching - Simple like Cerebro "list channels" command
    const fetchBalances = useCallback(async (account: Address) => {
        if (!isAuthenticated) {
            console.log('Cannot fetch balances: not authenticated');
            return;
        }

        try {
            setIsLoadingBalances(true);

            // Simple balance request like Cerebro - send as string command
            const balanceCommand = 'list channels';
            console.log('Sending balance command:', balanceCommand);

            webSocketService.send(balanceCommand);
        } catch (error) {
            console.error('Failed to fetch balances:', error);
            setIsLoadingBalances(false);
        }
    }, [isAuthenticated]);

    // Transfer - Simple Yellow Network transfer like Cerebro
    const transfer = useCallback(async (
        recipient: Address,
        amount: string,
        asset: string = 'ytest.usd'
    ): Promise<{ success: boolean; error?: string }> => {
        if (!isAuthenticated) {
            return { success: false, error: 'Please authenticate first' };
        }

        try {
            setIsTransferring(true);
            setLastTransferError(null);

            // Simple transfer command like Cerebro "transfer <to> <amount> <asset>"
            const transferCommand = `transfer ${recipient} ${amount} ${asset}`;
            console.log('Sending transfer command:', transferCommand);

            webSocketService.send(transferCommand);

            return { success: true };
        } catch (error) {
            console.error('Failed to create transfer:', error);
            const errorMsg = error instanceof Error ? error.message : 'Failed to create transfer';
            setLastTransferError(errorMsg);
            setIsTransferring(false);
            return { success: false, error: errorMsg };
        }
    }, [isAuthenticated]);

    // Message handling for Cerebro-style responses
    useEffect(() => {
        const handleMessage = async (data: any) => {
            console.log('Nitrolite message:', data);

            // Handle string responses from Cerebro
            if (typeof data === 'string') {
                const message = data.toLowerCase();

                // Handle authentication success
                if (message.includes('authentication successful') || message.includes('welcome')) {
                    setIsAuthenticated(true);
                    setIsAuthenticating(false);
                    setAuthAttemptCount(0);
                    console.log('Authentication successful!');
                    return;
                }

                // Handle authentication failure
                if (message.includes('authentication failed') || message.includes('invalid')) {
                    setIsAuthenticating(false);
                    setLastTransferError('Authentication failed');
                    return;
                }

                // Handle transfer success
                if (message.includes('transfer successful') || message.includes('sent')) {
                    console.log('Transfer completed:', data);
                    setIsTransferring(false);
                    return;
                }

                // Handle transfer failure
                if (message.includes('transfer failed') || message.includes('insufficient')) {
                    console.log('Transfer failed:', data);
                    setIsTransferring(false);
                    setLastTransferError(data);
                    return;
                }

                return;
            }

            // Handle object responses (channels list, etc.)
            if (typeof data === 'object') {
                // Handle channels response (for balance info)
                if (data.channels && Array.isArray(data.channels)) {
                    const channels = data.channels;
                    const balancesMap: Record<string, string> = {};

                    channels.forEach((channel: any) => {
                        if (channel.asset && channel.balance !== undefined) {
                            balancesMap[channel.asset] = channel.balance.toString();
                        }
                    });

                    setBalances(balancesMap);
                    setIsLoadingBalances(false);
                    return;
                }

                // Handle welcome message with authentication
                if (data.message && data.message.includes('Authentication successful')) {
                    setIsAuthenticated(true);
                    setIsAuthenticating(false);
                    setAuthAttemptCount(0);
                    console.log('Authentication successful!');
                    return;
                }

                // Handle error messages
                if (data.error) {
                    console.error('Error from server:', data.error);
                    if (isAuthenticating) {
                        setIsAuthenticating(false);
                        setLastTransferError('Authentication failed: ' + data.error);
                    } else if (isTransferring) {
                        setIsTransferring(false);
                        setLastTransferError('Transfer failed: ' + data.error);
                    }
                    return;
                }
            }
        };

        webSocketService.addMessageListener(handleMessage);
        return () => webSocketService.removeMessageListener(handleMessage);
    }, [sessionExpireTimestamp, isTransferring, isAuthenticating]);

    return {
        // State
        wsStatus,
        sessionKey,
        isAuthenticated,
        isAuthenticating,
        balances,
        isLoadingBalances,
        isTransferring,
        lastTransferError,
        
        // Actions
        connect,
        disconnect,
        authenticate,
        fetchBalances,
        transfer,
    };
}