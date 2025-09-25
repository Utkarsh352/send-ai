"use client";

import { useState, useEffect, useCallback } from 'react';
import { type Address, type WalletClient } from 'viem';
import { ethers } from 'ethers';
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
    type MessageSigner,
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
    const [currentWallet, setCurrentWallet] = useState<ethers.Wallet | null>(null);
    const [messageSigner, setMessageSigner] = useState<MessageSigner | null>(null);

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

    // Proper Nitrolite authentication using the protocol
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

            // Create wallet from private key
            const wallet = new ethers.Wallet(privateKey);
            setCurrentWallet(wallet);

            // Create message signer
            const signer: MessageSigner = async (payload) => {
                try {
                    const message = JSON.stringify(payload);
                    const digestHex = ethers.utils.id(message);
                    const messageBytes = ethers.utils.arrayify(digestHex);
                    const signature = wallet._signingKey().signDigest(messageBytes);
                    return ethers.utils.joinSignature(signature) as `0x${string}`;
                } catch (error) {
                    console.error('Error signing message:', error);
                    throw error;
                }
            };
            setMessageSigner(signer);

            // Create proper Nitrolite auth request message
            const authRequest = await createAuthRequestMessage({
                wallet: wallet.address,
                participant: wallet.address,
                app_name: APP_NAME,
                expire: (Math.floor(Date.now() / 1000) + SESSION_DURATION).toString(),
                scope: AUTH_SCOPE,
                application: '0x0000000000000000000000000000000000000000',
                allowances: [],
            });

            console.log('Sending Nitrolite auth request');
            webSocketService.send(authRequest);
        } catch (error) {
            console.error('Authentication failed:', error);
            setIsAuthenticating(false);
        }
    }, [wsStatus, isAuthenticating]);

    // Balance fetching using Nitrolite protocol
    const fetchBalances = useCallback(async (account: Address) => {
        if (!isAuthenticated || !messageSigner) {
            console.log('Cannot fetch balances: not authenticated or no signer');
            return;
        }

        try {
            setIsLoadingBalances(true);

            // Create proper Nitrolite get ledger balances message
            const balanceMessage = await createGetLedgerBalancesMessage(messageSigner, account);
            console.log('Sending Nitrolite balance request');

            webSocketService.send(balanceMessage);
        } catch (error) {
            console.error('Failed to fetch balances:', error);
            setIsLoadingBalances(false);
        }
    }, [isAuthenticated, messageSigner]);

    // Transfer using Nitrolite protocol
    const transfer = useCallback(async (
        recipient: Address,
        amount: string,
        asset: string = 'usdc'
    ): Promise<{ success: boolean; error?: string }> => {
        if (!isAuthenticated || !messageSigner) {
            return { success: false, error: 'Please authenticate first' };
        }

        try {
            setIsTransferring(true);
            setLastTransferError(null);

            // Create proper Nitrolite transfer message
            const transferMessage = await createTransferMessage(messageSigner, {
                destination: recipient,
                allocations: [
                    {
                        asset: asset.toLowerCase(),
                        amount: amount,
                    }
                ],
            });

            console.log('Sending Nitrolite transfer request');
            webSocketService.send(transferMessage);

            return { success: true };
        } catch (error) {
            console.error('Failed to create transfer:', error);
            const errorMsg = error instanceof Error ? error.message : 'Failed to create transfer';
            setLastTransferError(errorMsg);
            setIsTransferring(false);
            return { success: false, error: errorMsg };
        }
    }, [isAuthenticated, messageSigner]);

    // Message handling for Nitrolite protocol
    useEffect(() => {
        const handleMessage = async (data: any) => {
            console.log('Nitrolite message:', data);

            try {
                // Parse the Nitrolite RPC response
                const message = parseAnyRPCResponse(data);
                console.log('Parsed message:', message);

                switch (message.method) {
                    case RPCMethod.AuthChallenge:
                        console.log('Received auth challenge, verifying...');
                        if (messageSigner) {
                            try {
                                const authVerify = await createAuthVerifyMessage(messageSigner, message);
                                webSocketService.send(authVerify);
                            } catch (error) {
                                console.error('Auth verify failed:', error);
                                setIsAuthenticating(false);
                                setLastTransferError('Authentication verification failed');
                            }
                        }
                        break;

                    case RPCMethod.AuthVerify:
                        console.log('Received auth verify response:', message.params);
                        if (message.params?.success) {
                            setIsAuthenticated(true);
                            setIsAuthenticating(false);
                            setAuthAttemptCount(0);
                            console.log('Authentication successful!');

                            if (message.params.jwtToken) {
                                storeJWT(message.params.jwtToken);
                            }
                        } else {
                            setIsAuthenticating(false);
                            setLastTransferError('Authentication failed');
                        }
                        break;

                    case RPCMethod.GetLedgerBalances:
                        if (message.params && Array.isArray(message.params)) {
                            const balancesMap: Record<string, string> = {};
                            message.params.forEach((balance: any) => {
                                if (balance.asset && balance.amount !== undefined) {
                                    balancesMap[balance.asset] = balance.amount.toString();
                                }
                            });
                            setBalances(balancesMap);
                            setIsLoadingBalances(false);
                        }
                        break;

                    case RPCMethod.Transfer:
                        if (message.params?.success) {
                            console.log('Transfer completed successfully');
                            setIsTransferring(false);
                        } else {
                            console.log('Transfer failed:', message.params);
                            setIsTransferring(false);
                            setLastTransferError(message.params?.error || 'Transfer failed');
                        }
                        break;

                    default:
                        console.log('Unhandled message method:', message.method);

                        // Handle error responses
                        if (data.error || (Array.isArray(data) && data[1] === 'error')) {
                            const error = data.error || (Array.isArray(data) ? data[2]?.error : 'Unknown error');
                            console.error('Error from server:', error);
                            if (isAuthenticating) {
                                setIsAuthenticating(false);
                                setLastTransferError('Authentication failed: ' + error);
                            } else if (isTransferring) {
                                setIsTransferring(false);
                                setLastTransferError('Transfer failed: ' + error);
                            }
                        }
                        break;
                }
            } catch (error) {
                console.error('Error parsing message:', error, 'Raw data:', data);

                // Handle raw error responses that can't be parsed
                if (data.error || (Array.isArray(data) && data[1] === 'error')) {
                    const errorMsg = data.error || (Array.isArray(data) ? data[2]?.error : 'Unknown error');
                    console.error('Raw error from server:', errorMsg);
                    if (isAuthenticating) {
                        setIsAuthenticating(false);
                        setLastTransferError('Authentication failed: ' + errorMsg);
                    } else if (isTransferring) {
                        setIsTransferring(false);
                        setLastTransferError('Transfer failed: ' + errorMsg);
                    }
                }
            }
        };

        webSocketService.addMessageListener(handleMessage);
        return () => webSocketService.removeMessageListener(handleMessage);
    }, [messageSigner, isTransferring, isAuthenticating]);

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