"use client";

import "@rainbow-me/rainbowkit/styles.css";
import { RainbowKitProvider, darkTheme, lightTheme } from "@rainbow-me/rainbowkit";
import { WagmiProvider } from "wagmi";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { config } from "./config";

const queryClient = new QueryClient();

export function Web3Provider({ children }: { children: React.ReactNode }) {
  const { theme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true); // ✅ Marquer que le thème est chargé
  }, []);

  // Always provide WagmiProvider context, but conditionally render RainbowKit
  const rainbowTheme = theme === "dark" ? darkTheme() : lightTheme();

  try {
    return (
      <WagmiProvider config={config}>
        <QueryClientProvider client={queryClient}>
          {mounted && typeof window !== 'undefined' ? (
            <RainbowKitProvider theme={rainbowTheme}>{children}</RainbowKitProvider>
          ) : (
            children
          )}
        </QueryClientProvider>
      </WagmiProvider>
    );
  } catch (error) {
    console.error("Error initializing Web3 providers:", error);
    // Fallback: still provide WagmiProvider context
    return (
      <WagmiProvider config={config}>
        <QueryClientProvider client={queryClient}>
          {children}
        </QueryClientProvider>
      </WagmiProvider>
    );
  }
}