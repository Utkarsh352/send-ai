import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"
import { generatePrivateKey, privateKeyToAccount } from 'viem/accounts'
import { type Address } from 'viem'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function generateUUID(): string {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

// Session Key and JWT Management for Nitrolite Protocol
export interface SessionKey {
    privateKey: `0x${string}`;
    address: Address;
}

// Session key management
const SESSION_KEY_STORAGE = 'send_ai_session_key';

export const generateSessionKey = (): SessionKey => {
    const privateKey = generatePrivateKey();
    const account = privateKeyToAccount(privateKey);
    return { privateKey, address: account.address };
};

export const getStoredSessionKey = (): SessionKey | null => {
    try {
        const stored = localStorage.getItem(SESSION_KEY_STORAGE);
        if (!stored) return null;

        const parsed = JSON.parse(stored);
        if (!parsed.privateKey || !parsed.address) return null;

        return parsed as SessionKey;
    } catch {
        return null;
    }
};

export const storeSessionKey = (sessionKey: SessionKey): void => {
    try {
        localStorage.setItem(SESSION_KEY_STORAGE, JSON.stringify(sessionKey));
    } catch {
        // Storage failed - continue without caching
    }
};

export const removeSessionKey = (): void => {
    try {
        localStorage.removeItem(SESSION_KEY_STORAGE);
    } catch {
        // Removal failed - not critical
    }
};

// JWT helpers
const JWT_KEY = 'send_ai_jwt_token';

export const getStoredJWT = (): string | null => {
    try {
        return localStorage.getItem(JWT_KEY);
    } catch {
        return null;
    }
};

export const storeJWT = (token: string): void => {
    try {
        localStorage.setItem(JWT_KEY, token);
    } catch {}
};

export const removeJWT = (): void => {
    try {
        localStorage.removeItem(JWT_KEY);
    } catch {}
};

// Utility function to format addresses
export const formatAddress = (address: Address) => `${address.slice(0, 6)}...${address.slice(-4)}`;

// Utility function to format currency amounts
export const formatCurrency = (amount: string, decimals: number = 2): string => {
    const num = parseFloat(amount);
    return isNaN(num) ? '0.00' : num.toFixed(decimals);
};