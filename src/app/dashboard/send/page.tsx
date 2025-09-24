"use client";

import { useState } from "react";
import { Send, Plus, Upload, Users, Bitcoin, Wallet, ArrowRight, AlertCircle, CheckCircle } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";

export default function SendCryptoPage() {
  const [sendMethod, setSendMethod] = useState<string>("single");
  const [selectedWallet, setSelectedWallet] = useState<string>("");

  const wallets = [
    { id: "main", name: "Main Wallet", balance: "₿12.345", address: "bc1q...7xyz" },
    { id: "cold", name: "Cold Storage", balance: "₿45.678", address: "bc1q...8abc" },
    { id: "hot", name: "Hot Wallet", balance: "₿3.210", address: "bc1q...9def" }
  ];

  const recentRecipients = [
    { name: "Alice Johnson", address: "bc1q...1234", department: "Engineering" },
    { name: "Bob Smith", address: "bc1q...5678", department: "Design" },
    { name: "Carol Davis", address: "bc1q...9012", department: "Marketing" }
  ];

  return (
    <DashboardLayout>
      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold tracking-tight flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-r from-orange-500 to-yellow-500 rounded-full flex items-center justify-center">
                <Send className="w-6 h-6 text-white" />
              </div>
              Send Crypto
            </h1>
            <p className="text-muted-foreground">
              Send Bitcoin to recipients individually or in batches
            </p>
          </div>
        </div>

        <Tabs value={sendMethod} onValueChange={setSendMethod} className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="single">Single Recipient</TabsTrigger>
            <TabsTrigger value="batch">Batch Send</TabsTrigger>
            <TabsTrigger value="csv">CSV Upload</TabsTrigger>
          </TabsList>

          <TabsContent value="single" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Send Form */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Bitcoin className="w-5 h-5 text-orange-500" />
                    Single Transaction
                  </CardTitle>
                  <CardDescription>Send Bitcoin to a single recipient</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="wallet">From Wallet</Label>
                    <Select value={selectedWallet} onValueChange={setSelectedWallet}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select wallet" />
                      </SelectTrigger>
                      <SelectContent>
                        {wallets.map((wallet) => (
                          <SelectItem key={wallet.id} value={wallet.id}>
                            <div className="flex justify-between items-center w-full">
                              <span>{wallet.name}</span>
                              <span className="text-sm text-muted-foreground">{wallet.balance}</span>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="recipient">Recipient Address</Label>
                    <Input id="recipient" placeholder="bc1q..." />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="amount">Amount (BTC)</Label>
                    <Input id="amount" type="number" step="0.00000001" placeholder="0.00000000" />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="note">Note (Optional)</Label>
                    <Textarea id="note" placeholder="Payment for services..." />
                  </div>

                  <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                    <span className="text-sm">Estimated Fee:</span>
                    <span className="font-medium">₿0.00002500</span>
                  </div>

                  <Button className="w-full bg-gradient-to-r from-orange-500 to-yellow-500 hover:from-orange-600 hover:to-yellow-600">
                    <Send className="w-4 h-4 mr-2" />
                    Send Bitcoin
                  </Button>
                </CardContent>
              </Card>

              {/* Quick Recipients */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Users className="w-5 h-5 text-blue-500" />
                    Recent Recipients
                  </CardTitle>
                  <CardDescription>Quick send to recent recipients</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  {recentRecipients.map((recipient, index) => (
                    <div key={index} className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                      <div>
                        <p className="font-medium">{recipient.name}</p>
                        <p className="text-sm text-muted-foreground">{recipient.address}</p>
                        <Badge variant="outline" className="text-xs">{recipient.department}</Badge>
                      </div>
                      <Button size="sm" variant="outline">
                        <ArrowRight className="w-4 h-4" />
                      </Button>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="batch" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="w-5 h-5 text-green-500" />
                  Batch Transaction
                </CardTitle>
                <CardDescription>Send Bitcoin to multiple recipients at once</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-center p-8 border-2 border-dashed border-gray-300 rounded-lg">
                  <Users className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-medium mb-2">Add Recipients</h3>
                  <p className="text-muted-foreground mb-4">Add multiple recipients for batch processing</p>
                  <Button>
                    <Plus className="w-4 h-4 mr-2" />
                    Add Recipients
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="csv" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Upload className="w-5 h-5 text-purple-500" />
                  CSV Upload
                </CardTitle>
                <CardDescription>Upload a CSV file with recipient details</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-center p-8 border-2 border-dashed border-gray-300 rounded-lg">
                  <Upload className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-medium mb-2">Upload CSV File</h3>
                  <p className="text-muted-foreground mb-4">Upload a CSV file with recipient addresses and amounts</p>
                  <Button>
                    <Upload className="w-4 h-4 mr-2" />
                    Choose File
                  </Button>
                </div>

                <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                  <h4 className="font-medium mb-2 flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 text-blue-500" />
                    CSV Format Requirements
                  </h4>
                  <p className="text-sm text-muted-foreground">
                    Your CSV should have columns: Address, Amount, Note (optional)
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
}