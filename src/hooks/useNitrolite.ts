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

            // Simple authentication message like Cerebro
            const authMessage = {
                method: 'authenticate',
                params: {
                    user: privateKey.startsWith('0x') ? privateKey.slice(2) : privateKey,
                    signer: signerName
                }
            };

            webSocketService.send(authMessage);
        } catch (error) {
            console.error('Authentication failed:', error);
            setIsAuthenticating(false);
        }
    }, [wsStatus, isAuthenticating]);

    // Balance fetching
    const fetchBalances = useCallback(async (account: Address) => {
        if (!isAuthenticated || !sessionKey) {
            console.log('Cannot fetch balances: not authenticated or missing session key');
            return;
        }

        try {
            setIsLoadingBalances(true);
            
            const sessionSigner = createECDSAMessageSigner(sessionKey.privateKey);
            const getBalancesPayload = await createGetLedgerBalancesMessage(sessionSigner, account);
            
            webSocketService.send(getBalancesPayload);
        } catch (error) {
            console.error('Failed to fetch balances:', error);
            setIsLoadingBalances(false);
        }
    }, [isAuthenticated, sessionKey]);

    // Transfer
    const transfer = useCallback(async (
        recipient: Address, 
        amount: string, 
        asset: string = 'usdc'
    ): Promise<{ success: boolean; error?: string }> => {
        if (!isAuthenticated || !sessionKey) {
            return { success: false, error: 'Please authenticate first' };
        }

        try {
            setIsTransferring(true);
            setLastTransferError(null);

            const sessionSigner = createECDSAMessageSigner(sessionKey.privateKey);
            const transferPayload = await createTransferMessage(sessionSigner, {
                destination: recipient,
                allocations: [
                    {
                        asset: asset.toLowerCase(),
                        amount: amount,
                    }
                ],
            });

            webSocketService.send(transferPayload);
            return { success: true };
        } catch (error) {
            console.error('Failed to create transfer:', error);
            const errorMsg = error instanceof Error ? error.message : 'Failed to create transfer';
            setLastTransferError(errorMsg);
            setIsTransferring(false);
            return { success: false, error: errorMsg };
        }
    }, [isAuthenticated, sessionKey]);

    // Message handling
    useEffect(() => {
        const handleMessage = async (data: any) => {
            console.log('Nitrolite message:', data);

            // Handle direct auth success (like Cerebro)
            if (data.method === 'authenticated' || (data.result && data.result.includes('Authentication successful'))) {
                setIsAuthenticated(true);
                setIsAuthenticating(false);
                setAuthAttemptCount(0);
                console.log('Authentication successful!');
                return;
            }

            // Try to parse as RPC response for other messages
            try {
                const response = parseAnyRPCResponse(JSON.stringify(data));

                // Handle auth success
                if (response.method === RPCMethod.AuthVerify && response.params?.success) {
                    setIsAuthenticated(true);
                    setIsAuthenticating(false);
                    setAuthAttemptCount(0);
                    if (response.params.jwtToken) {
                        storeJWT(response.params.jwtToken);
                    }
                }

                // Handle balance responses
                if (response.method === RPCMethod.GetLedgerBalances) {
                    const balanceResponse = response as GetLedgerBalancesResponse;
                    const balances = balanceResponse.params.ledgerBalances;

                    if (balances && balances.length > 0) {
                        const balancesMap = Object.fromEntries(
                            balances.map((balance) => [balance.asset, balance.amount])
                        );
                        setBalances(balancesMap);
                    } else {
                        setBalances({});
                    }
                    setIsLoadingBalances(false);
                }

                // Handle live balance updates
                if (response.method === RPCMethod.BalanceUpdate) {
                    const balanceUpdate = response as BalanceUpdateResponse;
                    const balances = balanceUpdate.params.balanceUpdates;

                    const balancesMap = Object.fromEntries(
                        balances.map((balance) => [balance.asset, balance.amount])
                    );
                    setBalances(balancesMap);
                }

                // Handle transfer completion
                if (response.method === RPCMethod.Transfer) {
                    const transferResponse = response as TransferResponse;
                    console.log('Transfer completed:', transferResponse.params);
                    setIsTransferring(false);
                }

                // Handle errors
                if (response.method === RPCMethod.Error) {
                    console.error('RPC Error:', response.params);

                    if (isTransferring) {
                        setIsTransferring(false);
                        setLastTransferError(response.params.error);
                    } else if (isAuthenticating) {
                        setIsAuthenticating(false);
                        setLastTransferError('Authentication failed');
                    } else {
                        setLastTransferError(response.params.error);
                    }
                }
            } catch (parseError) {
                console.log('Could not parse as RPC response, might be direct auth response');

                // Handle auth failure
                if (data.error && isAuthenticating) {
                    setIsAuthenticating(false);
                    setLastTransferError('Authentication failed');
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