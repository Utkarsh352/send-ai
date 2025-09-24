"use client";

import { useState } from "react";
import { Building2, Users, Shield, Zap, Bell, Palette, Database, Key, Plus, Edit, Trash2, Save } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { motion } from "framer-motion";

interface UserRole {
  id: string;
  name: string;
  email: string;
  role: string;
  department: string;
  status: "Active" | "Inactive" | "Pending";
  lastLogin: string;
  permissions: string[];
}

interface CompanyInfo {
  name: string;
  address: string;
  phone: string;
  email: string;
  website: string;
  taxId: string;
  logo: string;
  bankDetails: {
    accountName: string;
    accountNumber: string;
    routingNumber: string;
    bankName: string;
  };
}

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState("company");
  const [showAddUser, setShowAddUser] = useState(false);

  // Mock data - in real app this would come from API
  const [companyInfo, setCompanyInfo] = useState<CompanyInfo>({
    name: "PayrollPro Inc.",
    address: "123 Business St, Suite 100, New York, NY 10001",
    phone: "+1 (555) 123-4567",
    email: "contact@payrollpro.com",
    website: "www.payrollpro.com",
    taxId: "12-3456789",
    logo: "/api/placeholder/100/100",
    bankDetails: {
      accountName: "PayrollPro Inc.",
      accountNumber: "****1234",
      routingNumber: "021000021",
      bankName: "Chase Bank"
    }
  });

  const userRoles: UserRole[] = [
    {
      id: "USER001",
      name: "Sarah Johnson",
      email: "sarah.johnson@company.com",
      role: "Administrator",
      department: "IT",
      status: "Active",
      lastLogin: "2024-01-22",
      permissions: ["Full Access", "User Management", "System Settings", "Financial Data"]
    },
    {
      id: "USER002",
      name: "Mike Chen",
      email: "mike.chen@company.com",
      role: "HR Manager",
      department: "HR",
      status: "Active",
      lastLogin: "2024-01-22",
      permissions: ["Employee Management", "Payroll Processing", "Reports"]
    },
    {
      id: "USER003",
      name: "Linda Davis",
      email: "linda.davis@company.com",
      role: "Finance Manager",
      department: "Finance",
      status: "Active",
      lastLogin: "2024-01-21",
      permissions: ["Financial Data", "Tax Management", "Reports", "Compliance"]
    },
    {
      id: "USER004",
      name: "Robert Wilson",
      email: "robert.wilson@company.com",
      role: "Payroll Specialist",
      department: "HR",
      status: "Active",
      lastLogin: "2024-01-22",
      permissions: ["Payroll Processing", "Employee Data", "Basic Reports"]
    },
    {
      id: "USER005",
      name: "Alice Brown",
      email: "alice.brown@company.com",
      role: "Employee",
      department: "Marketing",
      status: "Pending",
      lastLogin: "Never",
      permissions: ["Self-Service Portal"]
    }
  ];

  const roleTemplates = [
    {
      name: "Administrator",
      description: "Full system access with all permissions",
      permissions: ["Full Access", "User Management", "System Settings", "Financial Data", "Payroll Processing", "Employee Management", "Reports", "Compliance", "Tax Management"]
    },
    {
      name: "HR Manager",
      description: "Human resources management and payroll processing",
      permissions: ["Employee Management", "Payroll Processing", "Reports", "Basic Compliance"]
    },
    {
      name: "Finance Manager",
      description: "Financial data access and tax management",
      permissions: ["Financial Data", "Tax Management", "Reports", "Compliance", "Payroll Processing"]
    },
    {
      name: "Payroll Specialist",
      description: "Payroll processing and employee data management",
      permissions: ["Payroll Processing", "Employee Data", "Basic Reports"]
    },
    {
      name: "Employee",
      description: "Self-service access to personal information",
      permissions: ["Self-Service Portal", "Personal Data"]
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Active":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200";
      case "Inactive":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200";
      case "Pending":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200";
    }
  };

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  return (
    <DashboardLayout>
      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
            <p className="text-muted-foreground">
              Manage your company information, user roles, and system preferences
            </p>
          </div>
        </div>

        {/* Main Content Tabs */}
        <Tabs defaultValue="company" className="space-y-6">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="company">Company Info</TabsTrigger>
            <TabsTrigger value="users">User Roles</TabsTrigger>
            <TabsTrigger value="integrations">Integrations</TabsTrigger>
            <TabsTrigger value="notifications">Notifications</TabsTrigger>
            <TabsTrigger value="security">Security</TabsTrigger>
          </TabsList>

          <TabsContent value="company">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Company Information */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Building2 className="w-5 h-5" />
                      Company Information
                    </CardTitle>
                    <CardDescription>
                      Basic company details and contact information
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="companyName">Company Name</Label>
                        <Input
                          id="companyName"
                          value={companyInfo.name}
                          onChange={(e) => setCompanyInfo(prev => ({ ...prev, name: e.target.value }))}
                        />
                      </div>
                      <div>
                        <Label htmlFor="taxId">Tax ID</Label>
                        <Input
                          id="taxId"
                          value={companyInfo.taxId}
                          onChange={(e) => setCompanyInfo(prev => ({ ...prev, taxId: e.target.value }))}
                        />
                      </div>
                    </div>
                    <div>
                      <Label htmlFor="address">Address</Label>
                      <Textarea
                        id="address"
                        value={companyInfo.address}
                        onChange={(e) => setCompanyInfo(prev => ({ ...prev, address: e.target.value }))}
                        rows={3}
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="phone">Phone</Label>
                        <Input
                          id="phone"
                          value={companyInfo.phone}
                          onChange={(e) => setCompanyInfo(prev => ({ ...prev, phone: e.target.value }))}
                        />
                      </div>
                      <div>
                        <Label htmlFor="email">Email</Label>
                        <Input
                          id="email"
                          type="email"
                          value={companyInfo.email}
                          onChange={(e) => setCompanyInfo(prev => ({ ...prev, email: e.target.value }))}
                        />
                      </div>
                    </div>
                    <div>
                      <Label htmlFor="website">Website</Label>
                      <Input
                        id="website"
                        value={companyInfo.website}
                        onChange={(e) => setCompanyInfo(prev => ({ ...prev, website: e.target.value }))}
                      />
                    </div>
                    <Button>
                      <Save className="w-4 h-4 mr-2" />
                      Save Changes
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>

              {/* Bank Details */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
              >
                <Card>
                  <CardHeader>
                    <CardTitle>Bank Details</CardTitle>
                    <CardDescription>
                      Company bank account information for payroll processing
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <Label htmlFor="accountName">Account Name</Label>
                      <Input
                        id="accountName"
                        value={companyInfo.bankDetails.accountName}
                        onChange={(e) => setCompanyInfo(prev => ({
                          ...prev,
                          bankDetails: { ...prev.bankDetails, accountName: e.target.value }
                        }))}
                      />
                    </div>
                    <div>
                      <Label htmlFor="bankName">Bank Name</Label>
                      <Input
                        id="bankName"
                        value={companyInfo.bankDetails.bankName}
                        onChange={(e) => setCompanyInfo(prev => ({
                          ...prev,
                          bankDetails: { ...prev.bankDetails, bankName: e.target.value }
                        }))}
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="accountNumber">Account Number</Label>
                        <Input
                          id="accountNumber"
                          value={companyInfo.bankDetails.accountNumber}
                          onChange={(e) => setCompanyInfo(prev => ({
                            ...prev,
                            bankDetails: { ...prev.bankDetails, accountNumber: e.target.value }
                          }))}
                        />
                      </div>
                      <div>
                        <Label htmlFor="routingNumber">Routing Number</Label>
                        <Input
                          id="routingNumber"
                          value={companyInfo.bankDetails.routingNumber}
                          onChange={(e) => setCompanyInfo(prev => ({
                            ...prev,
                            bankDetails: { ...prev.bankDetails, routingNumber: e.target.value }
                          }))}
                        />
                      </div>
                    </div>
                    <Button>
                      <Save className="w-4 h-4 mr-2" />
                      Save Bank Details
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            </div>
          </TabsContent>

          <TabsContent value="users">
            <div className="space-y-6">
              {/* Users Management Header */}
              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      <Users className="w-5 h-5" />
                      User Roles & Permissions
                    </CardTitle>
                    <CardDescription>
                      Manage user accounts and their access permissions
                    </CardDescription>
                  </div>
                  <Dialog open={showAddUser} onOpenChange={setShowAddUser}>
                    <DialogTrigger asChild>
                      <Button>
                        <Plus className="w-4 h-4 mr-2" />
                        Add User
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Add New User</DialogTitle>
                        <DialogDescription>
                          Create a new user account with appropriate permissions
                        </DialogDescription>
                      </DialogHeader>
                      <div className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <Label htmlFor="firstName">First Name</Label>
                            <Input id="firstName" placeholder="John" />
                          </div>
                          <div>
                            <Label htmlFor="lastName">Last Name</Label>
                            <Input id="lastName" placeholder="Doe" />
                          </div>
                        </div>
                        <div>
                          <Label htmlFor="userEmail">Email</Label>
                          <Input id="userEmail" type="email" placeholder="john.doe@company.com" />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <Label>Role</Label>
                            <Select>
                              <SelectTrigger>
                                <SelectValue placeholder="Select role" />
                              </SelectTrigger>
                              <SelectContent>
                                {roleTemplates.map((role) => (
                                  <SelectItem key={role.name} value={role.name}>
                                    {role.name}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                          <div>
                            <Label>Department</Label>
                            <Select>
                              <SelectTrigger>
                                <SelectValue placeholder="Select department" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="HR">HR</SelectItem>
                                <SelectItem value="Finance">Finance</SelectItem>
                                <SelectItem value="IT">IT</SelectItem>
                                <SelectItem value="Marketing">Marketing</SelectItem>
                                <SelectItem value="Sales">Sales</SelectItem>
                                <SelectItem value="Operations">Operations</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                        </div>
                        <div className="flex justify-end gap-2">
                          <Button variant="outline" onClick={() => setShowAddUser(false)}>
                            Cancel
                          </Button>
                          <Button onClick={() => setShowAddUser(false)}>
                            Create User
                          </Button>
                        </div>
                      </div>
                    </DialogContent>
                  </Dialog>
                </CardHeader>
              </Card>

              {/* Users Table */}
              <Card>
                <CardContent className="p-0">
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>User</TableHead>
                          <TableHead>Role</TableHead>
                          <TableHead>Department</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead>Last Login</TableHead>
                          <TableHead>Permissions</TableHead>
                          <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {userRoles.map((user) => (
                          <TableRow key={user.id}>
                            <TableCell>
                              <div className="flex items-center gap-3">
                                <Avatar className="w-8 h-8">
                                  <AvatarImage src={`/api/placeholder/32/32`} alt={user.name} />
                                  <AvatarFallback>{getInitials(user.name)}</AvatarFallback>
                                </Avatar>
                                <div>
                                  <p className="font-medium">{user.name}</p>
                                  <p className="text-sm text-muted-foreground">{user.email}</p>
                                </div>
                              </div>
                            </TableCell>
                            <TableCell>{user.role}</TableCell>
                            <TableCell>{user.department}</TableCell>
                            <TableCell>
                              <Badge className={getStatusColor(user.status)}>
                                {user.status}
                              </Badge>
                            </TableCell>
                            <TableCell>
                              {user.lastLogin === "Never" ? (
                                <span className="text-muted-foreground">Never</span>
                              ) : (
                                new Date(user.lastLogin).toLocaleDateString()
                              )}
                            </TableCell>
                            <TableCell>
                              <div className="flex flex-wrap gap-1">
                                {user.permissions.slice(0, 2).map((permission) => (
                                  <Badge key={permission} variant="outline" className="text-xs">
                                    {permission}
                                  </Badge>
                                ))}
                                {user.permissions.length > 2 && (
                                  <Badge variant="outline" className="text-xs">
                                    +{user.permissions.length - 2} more
                                  </Badge>
                                )}
                              </div>
                            </TableCell>
                            <TableCell className="text-right">
                              <div className="flex justify-end gap-1">
                                <Button variant="ghost" size="sm">
                                  <Edit className="w-4 h-4" />
                                </Button>
                                <Button variant="ghost" size="sm">
                                  <Trash2 className="w-4 h-4" />
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </CardContent>
              </Card>

              {/* Role Templates */}
              <Card>
                <CardHeader>
                  <CardTitle>Role Templates</CardTitle>
                  <CardDescription>
                    Predefined roles with specific permission sets
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {roleTemplates.map((role) => (
                      <Card key={role.name}>
                        <CardHeader className="pb-3">
                          <CardTitle className="text-lg">{role.name}</CardTitle>
                          <CardDescription className="text-sm">
                            {role.description}
                          </CardDescription>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-3">
                            <div className="flex flex-wrap gap-1">
                              {role.permissions.slice(0, 3).map((permission) => (
                                <Badge key={permission} variant="secondary" className="text-xs">
                                  {permission}
                                </Badge>
                              ))}
                              {role.permissions.length > 3 && (
                                <Badge variant="secondary" className="text-xs">
                                  +{role.permissions.length - 3} more
                                </Badge>
                              )}
                            </div>
                            <Button variant="outline" size="sm" className="w-full">
                              Edit Role
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="integrations">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Zap className="w-5 h-5" />
                    Yellow Network
                  </CardTitle>
                  <CardDescription>
                    State channels for instant payroll disbursements
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Connection Status</p>
                      <p className="text-sm text-muted-foreground">Connected to Yellow Network</p>
                    </div>
                    <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                      Connected
                    </Badge>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Network:</span>
                      <span className="font-medium">Ethereum Mainnet</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Gas Savings:</span>
                      <span className="font-medium">95%</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Settlement Time:</span>
                      <span className="font-medium">&lt; 1 second</span>
                    </div>
                  </div>
                  <Button variant="outline" className="w-full">
                    Configure Settings
                  </Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Database className="w-5 h-5" />
                    Bank Integration
                  </CardTitle>
                  <CardDescription>
                    Connect with your banking systems
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Chase Bank API</p>
                      <p className="text-sm text-muted-foreground">Primary business account</p>
                    </div>
                    <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                      Active
                    </Badge>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Last Sync:</span>
                      <span className="font-medium">2 minutes ago</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Available Balance:</span>
                      <span className="font-medium">$2,450,000</span>
                    </div>
                  </div>
                  <Button variant="outline" className="w-full">
                    Sync Now
                  </Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="notifications">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Bell className="w-5 h-5" />
                  Notification Settings
                </CardTitle>
                <CardDescription>
                  Configure how and when you receive notifications
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <h4 className="font-medium">Email Notifications</h4>
                  <div className="space-y-3">
                    {[
                      { id: "payroll-complete", label: "Payroll completion", description: "Notify when payroll processing is complete" },
                      { id: "compliance-due", label: "Compliance deadlines", description: "Alert for upcoming compliance requirements" },
                      { id: "user-activity", label: "User activity", description: "Notify of important user actions" },
                      { id: "system-updates", label: "System updates", description: "Information about system maintenance and updates" }
                    ].map((notification) => (
                      <div key={notification.id} className="flex items-start justify-between p-3 rounded-lg border">
                        <div>
                          <p className="font-medium">{notification.label}</p>
                          <p className="text-sm text-muted-foreground">{notification.description}</p>
                        </div>
                        <Switch defaultChecked />
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="security">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Key className="w-5 h-5" />
                  Security Settings
                </CardTitle>
                <CardDescription>
                  Manage security policies and access controls
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <h4 className="font-medium">Password Policy</h4>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Minimum length: 8 characters</span>
                        <Badge variant="secondary">Active</Badge>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Require special characters</span>
                        <Switch defaultChecked />
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Password expiration: 90 days</span>
                        <Switch defaultChecked />
                      </div>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <h4 className="font-medium">Session Management</h4>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Session timeout: 30 minutes</span>
                        <Badge variant="secondary">Active</Badge>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Multi-factor authentication</span>
                        <Switch defaultChecked />
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm">IP address restrictions</span>
                        <Switch />
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
}