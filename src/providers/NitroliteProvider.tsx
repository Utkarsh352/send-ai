"use client";

import React, { createContext, useContext, useEffect, useState } from 'react';
import { type Address } from 'viem';
import { useNitrolite, type NitroliteState, type NitroliteActions } from '@/hooks/useNitrolite';

interface NitroliteContextType extends NitroliteState, NitroliteActions {
    // Private key auth
    privateKey: string | null;
    setPrivateKey: (key: string | null) => void;
}

const NitroliteContext = createContext<NitroliteContextType | undefined>(undefined);

interface NitroliteProviderProps {
    children: React.ReactNode;
}

export function NitroliteProvider({ children }: NitroliteProviderProps) {
    const nitrolite = useNitrolite();

    // Private key state
    const [privateKey, setPrivateKey] = useState<string | null>(null);

    // Auto-authenticate when WebSocket connects and private key is available
    useEffect(() => {
        if (nitrolite.wsStatus === 'Connected' && privateKey && !nitrolite.isAuthenticated && !nitrolite.isAuthenticating) {
            // Add a small delay to prevent rapid successive calls
            const authTimer = setTimeout(() => {
                nitrolite.authenticate(privateKey, 'utk_signer');
            }, 500);

            return () => clearTimeout(authTimer);
        }
    }, [nitrolite.wsStatus, privateKey, nitrolite.isAuthenticated, nitrolite.isAuthenticating]);

    // Auto-fetch balances when authenticated (using a dummy address since we don't need wallet for balance)
    useEffect(() => {
        if (nitrolite.isAuthenticated && privateKey && !nitrolite.balances) {
            // Use the private key as a dummy address for balance fetching
            const address = `0x${privateKey.replace('0x', '').slice(0, 40)}` as Address;
            nitrolite.fetchBalances(address);
        }
    }, [nitrolite.isAuthenticated, privateKey, nitrolite.balances]);

    // Initialize connection on mount
    useEffect(() => {
        nitrolite.connect();
        return () => nitrolite.disconnect();
    }, []);

    const contextValue: NitroliteContextType = {
        ...nitrolite,

        // Private key auth
        privateKey,
        setPrivateKey,
    };

    return (
        <NitroliteContext.Provider value={contextValue}>
            {children}
        </NitroliteContext.Provider>
    );
}

export function useNitroliteContext() {
    const context = useContext(NitroliteContext);
    if (context === undefined) {
        throw new Error('useNitroliteContext must be used within a NitroliteProvider');
    }
    return context;
}