"use client";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Activity, Wifi, WifiOff, Shield, ShieldCheck, Loader2 } from "lucide-react";
import { type WsStatus } from "@/lib/websocket";

interface NitroliteStatusProps {
    wsStatus: WsStatus;
    isAuthenticated: boolean;
    isAuthenticating: boolean;
    className?: string;
}

export function NitroliteStatus({ 
    wsStatus, 
    isAuthenticated, 
    isAuthenticating,
    className = ""
}: NitroliteStatusProps) {
    const getConnectionIcon = () => {
        switch (wsStatus) {
            case 'Connected':
                return <Wifi className="w-4 h-4 text-green-500" />;
            case 'Connecting':
                return <Loader2 className="w-4 h-4 text-yellow-500 animate-spin" />;
            case 'Disconnected':
            default:
                return <WifiOff className="w-4 h-4 text-red-500" />;
        }
    };

    const getConnectionColor = () => {
        switch (wsStatus) {
            case 'Connected':
                return 'border-green-200 dark:border-green-800';
            case 'Connecting':
                return 'border-yellow-200 dark:border-yellow-800';
            case 'Disconnected':
            default:
                return 'border-red-200 dark:border-red-800';
        }
    };

    const getAuthIcon = () => {
        if (isAuthenticating) {
            return <Loader2 className="w-4 h-4 text-blue-500 animate-spin" />;
        }
        return isAuthenticated ? 
            <ShieldCheck className="w-4 h-4 text-green-500" /> : 
            <Shield className="w-4 h-4 text-gray-400" />;
    };

    const getAuthStatus = () => {
        if (isAuthenticating) return 'Authenticating';
        return isAuthenticated ? 'Authenticated' : 'Not Authenticated';
    };

    const getAuthColor = () => {
        if (isAuthenticating) return 'text-blue-600';
        return isAuthenticated ? 'text-green-600' : 'text-gray-500';
    };

    return (
        <Card className={`${getConnectionColor()} ${className}`}>
            <CardContent className="p-3">
                <div className="space-y-2">
                    {/* Connection Status */}
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            {getConnectionIcon()}
                            <span className="text-sm font-medium">Nitrolite</span>
                        </div>
                        <Badge 
                            variant="outline" 
                            className={wsStatus === 'Connected' ? 'border-green-300 text-green-700' : 
                                      wsStatus === 'Connecting' ? 'border-yellow-300 text-yellow-700' : 
                                      'border-red-300 text-red-700'}
                        >
                            {wsStatus}
                        </Badge>
                    </div>
                    
                    {/* Authentication Status */}
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            {getAuthIcon()}
                            <span className="text-xs text-muted-foreground">Auth</span>
                        </div>
                        <span className={`text-xs ${getAuthColor()}`}>
                            {getAuthStatus()}
                        </span>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}