"use client";

import dynamic from 'next/dynamic';
import { ReactNode } from 'react';

// Loading component to show while dynamic import loads
const LoadingComponent = ({ children }: { children: ReactNode }) => (
  <>{children}</>
);

// Dynamically import Web3Provider with no SSR
const Web3Provider = dynamic(
  () => import('./web3-provider').then((mod) => ({ default: mod.Web3Provider })),
  {
    loading: LoadingComponent,
    ssr: false, // This ensures the component never renders on server
  }
);

export function ClientOnlyWeb3Provider({ children }: { children: ReactNode }) {
  return <Web3Provider>{children}</Web3Provider>;
}