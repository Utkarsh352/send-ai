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
            console.log('Auto-authenticating with private key');
            nitrolite.authenticate(privateKey, 'utk_signer');
        }
    }, [nitrolite.wsStatus, privateKey]);

    // Auto-fetch balances when authenticated
    useEffect(() => {
        if (nitrolite.isAuthenticated && !nitrolite.isLoadingBalances && !nitrolite.balances) {
            console.log('Auto-fetching balances');
            // Use a dummy address since Cerebro doesn't need it for list channels
            const dummyAddress = '0x0000000000000000000000000000000000000000' as Address;
            nitrolite.fetchBalances(dummyAddress);
        }
    }, [nitrolite.isAuthenticated]);

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