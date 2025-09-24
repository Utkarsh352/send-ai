"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { 
    TestTube, 
    Wallet, 
    Send, 
    RefreshCw, 
    CheckCircle, 
    XCircle,
    AlertTriangle,
    Info
} from "lucide-react";
import { useNitroliteContext } from "@/providers/NitroliteProvider";
import { formatAddress, formatCurrency } from "@/lib/utils";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface TestingPanelProps {
    className?: string;
}

export function TestingPanel({ className = "" }: TestingPanelProps) {
    const nitrolite = useNitroliteContext();
    const [testResults, setTestResults] = useState<string[]>([]);
    const [isRunningTests, setIsRunningTests] = useState(false);
    const [manualTestAddress, setManualTestAddress] = useState('');
    const [manualTestAmount, setManualTestAmount] = useState('1');

    const addTestResult = (message: string, type: 'success' | 'error' | 'info' = 'info') => {
        const timestamp = new Date().toLocaleTimeString();
        const formattedMessage = `[${timestamp}] ${type.toUpperCase()}: ${message}`;
        setTestResults(prev => [formattedMessage, ...prev].slice(0, 20)); // Keep last 20 results
    };

    const runConnectionTests = async () => {
        setIsRunningTests(true);
        addTestResult('Starting connection tests...');

        try {
            // Test WebSocket connection
            addTestResult(`WebSocket Status: ${nitrolite.wsStatus}`, 
                nitrolite.wsStatus === 'Connected' ? 'success' : 'error');

            // Test authentication
            addTestResult(`Authentication Status: ${nitrolite.isAuthenticated ? 'Authenticated' : 'Not authenticated'}`,
                nitrolite.isAuthenticated ? 'success' : 'error');

            // Test wallet connection
            addTestResult(`Wallet Status: ${nitrolite.account ? 'Connected' : 'Not connected'}`,
                nitrolite.account ? 'success' : 'error');

            if (nitrolite.account) {
                addTestResult(`Wallet Address: ${formatAddress(nitrolite.account)}`, 'info');
            }

            // Test balance fetching
            if (nitrolite.balances) {
                const usdcBalance = nitrolite.balances['usdc'] || nitrolite.balances['USDC'] || '0';
                addTestResult(`USDC Balance: ${formatCurrency(usdcBalance)}`, 'info');
            } else {
                addTestResult('No balance data available', 'error');
            }

            addTestResult('Connection tests completed', 'success');
        } catch (error) {
            addTestResult(`Connection test error: ${error}`, 'error');
        } finally {
            setIsRunningTests(false);
        }
    };

    const testManualTransfer = async () => {
        if (!manualTestAddress || !manualTestAmount) {
            addTestResult('Please provide test address and amount', 'error');
            return;
        }

        if (!nitrolite.isAuthenticated) {
            addTestResult('Please authenticate first', 'error');
            return;
        }

        try {
            setIsRunningTests(true);
            addTestResult(`Testing transfer of ${manualTestAmount} USDC to ${formatAddress(manualTestAddress as any)}...`);
            
            const result = await nitrolite.transfer(
                manualTestAddress as any,
                manualTestAmount,
                'usdc'
            );

            if (result.success) {
                addTestResult('Transfer test successful!', 'success');
            } else {
                addTestResult(`Transfer test failed: ${result.error}`, 'error');
            }
        } catch (error) {
            addTestResult(`Transfer test error: ${error}`, 'error');
        } finally {
            setIsRunningTests(false);
        }
    };

    const clearResults = () => {
        setTestResults([]);
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'Connected':
            case 'Authenticated':
                return 'text-green-600';
            case 'Connecting':
            case 'Authenticating':
                return 'text-yellow-600';
            case 'Disconnected':
            case 'Not authenticated':
                return 'text-red-600';
            default:
                return 'text-gray-600';
        }
    };

    return (
        <Card className={className}>
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <TestTube className="w-5 h-5" />
                    Nitrolite Testing Panel
                </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
                {/* Connection Status */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="p-3 border rounded-lg">
                        <div className="flex items-center gap-2 mb-1">
                            <Wallet className="w-4 h-4" />
                            <span className="text-sm font-medium">WebSocket</span>
                        </div>
                        <Badge className={getStatusColor(nitrolite.wsStatus)}>
                            {nitrolite.wsStatus}
                        </Badge>
                    </div>
                    <div className="p-3 border rounded-lg">
                        <div className="flex items-center gap-2 mb-1">
                            <CheckCircle className="w-4 h-4" />
                            <span className="text-sm font-medium">Authentication</span>
                        </div>
                        <Badge className={getStatusColor(nitrolite.isAuthenticated ? 'Authenticated' : 'Not authenticated')}>
                            {nitrolite.isAuthenticated ? 'Authenticated' : 'Not authenticated'}
                        </Badge>
                    </div>
                    <div className="p-3 border rounded-lg">
                        <div className="flex items-center gap-2 mb-1">
                            <Wallet className="w-4 h-4" />
                            <span className="text-sm font-medium">Wallet</span>
                        </div>
                        <Badge className={getStatusColor(nitrolite.account ? 'Connected' : 'Not connected')}>
                            {nitrolite.account ? 'Connected' : 'Not connected'}
                        </Badge>
                    </div>
                </div>

                {/* Environment Info */}
                <Alert>
                    <Info className="h-4 w-4" />
                    <AlertDescription>
                        <strong>Environment:</strong> Sandbox (wss://clearnet-sandbox.yellow.com/ws)<br/>
                        <strong>Test Addresses:</strong><br/>
                        • Wallet: 0x2B946eEA702a43604E302a3E515434090dF07380<br/>
                        • Signer: 0x55f5B88c5eF00439628cC3bC31F39ad68f6cF71C<br/>
                        <strong>Supported Chains:</strong> 80002, 11155111, 59141, 84532, 1449000
                    </AlertDescription>
                </Alert>

                {/* Test Actions */}
                <div className="space-y-4">
                    <div className="flex gap-2">
                        <Button 
                            onClick={runConnectionTests}
                            disabled={isRunningTests}
                            className="flex-1"
                        >
                            {isRunningTests ? (
                                <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                            ) : (
                                <TestTube className="w-4 h-4 mr-2" />
                            )}
                            Run Connection Tests
                        </Button>
                        <Button 
                            variant="outline"
                            onClick={clearResults}
                        >
                            Clear Results
                        </Button>
                    </div>

                    {/* Manual Transfer Test */}
                    <div className="border rounded-lg p-4 space-y-3">
                        <h4 className="font-medium">Manual Transfer Test</h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            <div>
                                <Label htmlFor="test-address">Test Address</Label>
                                <Input
                                    id="test-address"
                                    placeholder="0x..."
                                    value={manualTestAddress}
                                    onChange={(e) => setManualTestAddress(e.target.value)}
                                />
                            </div>
                            <div>
                                <Label htmlFor="test-amount">Amount (USDC)</Label>
                                <Input
                                    id="test-amount"
                                    placeholder="1.0"
                                    value={manualTestAmount}
                                    onChange={(e) => setManualTestAmount(e.target.value)}
                                />
                            </div>
                        </div>
                        <Button 
                            onClick={testManualTransfer}
                            disabled={isRunningTests || !nitrolite.isAuthenticated}
                            size="sm"
                        >
                            <Send className="w-4 h-4 mr-2" />
                            Test Transfer
                        </Button>
                    </div>
                </div>

                {/* Test Results */}
                {testResults.length > 0 && (
                    <div className="space-y-2">
                        <h4 className="font-medium">Test Results:</h4>
                        <Textarea
                            value={testResults.join('\n')}
                            readOnly
                            className="h-64 text-xs font-mono"
                        />
                    </div>
                )}
            </CardContent>
        </Card>
    );
}