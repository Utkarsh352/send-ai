"use client";

import dynamic from 'next/dynamic';
import { ReactNode } from 'react';

// Create a dynamic import for Header that only loads on client side
const DynamicHeader = dynamic(
  () => import('./Header'),
  {
    ssr: false,
    loading: () => (
      <header className="sticky left-0 top-0 z-50 w-full bg-background/80 text-foreground backdrop-blur-lg transition-all duration-300 border-b-0 py-4">
        <div className="container mx-auto flex items-center justify-between 2xl:px-0">
          {/* Logo placeholder */}
          <a href="/" className="flex items-center space-x-3">
            <div className="flex items-center space-x-3">
              <div className="relative">
                <div className="w-8 h-8 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-lg flex items-center justify-center shadow-lg">
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                    <path d="M2 8L8 2L14 8L8 14L2 8Z" fill="white"/>
                    <path d="M8 4L12 8L8 12L4 8L8 4Z" fill="rgba(0,0,0,0.2)"/>
                  </svg>
                </div>
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-blue-500 rounded-full border-2 border-white"></div>
              </div>
              <h1 className="text-lg font-bold text-foreground">Send-AI <span className="text-muted-foreground font-light ml-2">Cross-Chain</span></h1>
            </div>
          </a>
          {/* Loading placeholder for connect button area */}
          <div className="flex items-center space-x-4">
            <div className="w-20 h-8 bg-muted rounded animate-pulse"></div>
          </div>
        </div>
      </header>
    )
  }
);

export default function HeaderWrapper() {
  return <DynamicHeader />;
}