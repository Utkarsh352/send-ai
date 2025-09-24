"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Key, Eye, EyeOff } from "lucide-react";
import { useNitroliteContext } from "@/providers/NitroliteProvider";

export function PrivateKeyConnector() {
    const nitrolite = useNitroliteContext();
    const [showDialog, setShowDialog] = useState(false);
    const [inputKey, setInputKey] = useState("");
    const [showKey, setShowKey] = useState(false);

    const handleConnect = () => {
        if (inputKey.trim()) {
            nitrolite.setPrivateKey(inputKey.trim());
            setShowDialog(false);
            setInputKey("");
        }
    };

    const handleDisconnect = () => {
        nitrolite.setPrivateKey(null);
    };

    if (nitrolite.privateKey) {
        return (
            <Button
                variant="outline"
                onClick={handleDisconnect}
                className="flex items-center gap-2"
            >
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span className="hidden sm:inline">
                    {nitrolite.privateKey.slice(0, 6)}...{nitrolite.privateKey.slice(-4)}
                </span>
                <span className="sm:hidden">Connected</span>
            </Button>
        );
    }

    return (
        <Dialog open={showDialog} onOpenChange={setShowDialog}>
            <DialogTrigger asChild>
                <Button variant="outline" className="flex items-center gap-2">
                    <Key className="w-4 h-4" />
                    <span className="hidden sm:inline">Connect Key</span>
                </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md">
                <DialogHeader>
                    <DialogTitle>Connect with Private Key</DialogTitle>
                    <DialogDescription>
                        Enter your private key to connect to Yellow Network (like Cerebro)
                    </DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                    <div>
                        <Label htmlFor="privateKey">Private Key</Label>
                        <div className="relative">
                            <Input
                                id="privateKey"
                                type={showKey ? "text" : "password"}
                                placeholder="Enter your private key..."
                                value={inputKey}
                                onChange={(e) => setInputKey(e.target.value)}
                                className="pr-10"
                            />
                            <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                onClick={() => setShowKey(!showKey)}
                                className="absolute right-0 top-0 h-full px-3"
                            >
                                {showKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                            </Button>
                        </div>
                        <p className="text-xs text-muted-foreground mt-1">
                            Your private key is stored locally and used for authentication only
                        </p>
                    </div>

                    <div className="flex justify-end gap-2">
                        <Button variant="outline" onClick={() => setShowDialog(false)}>
                            Cancel
                        </Button>
                        <Button
                            onClick={handleConnect}
                            disabled={!inputKey.trim()}
                            className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600"
                        >
                            Connect
                        </Button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}