"use client";

import "@rainbow-me/rainbowkit/styles.css";
import { RainbowKitProvider, darkTheme, lightTheme } from "@rainbow-me/rainbowkit";
import { WagmiProvider } from "wagmi";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { config } from "@/providers/config";
import { NitroliteProvider } from "@/providers/NitroliteProvider";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

export function ClientProviders({ children }: { children: React.ReactNode }) {
  const queryClient = new QueryClient();
  const { theme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const rainbowTheme = theme === "dark" ? darkTheme() : lightTheme();

  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        {mounted ? (
          <RainbowKitProvider theme={rainbowTheme}>
            <NitroliteProvider>
              {children}
            </NitroliteProvider>
          </RainbowKitProvider>
        ) : (
          <NitroliteProvider>
            {children}
          </NitroliteProvider>
        )}
      </QueryClientProvider>
    </WagmiProvider>
  );
}