"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Bell, Bitcoin, ChevronDown, Wallet, Home, Menu, Search, Settings, Send, TrendingUp, User, Users, History, Activity, TestTube } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ReactNode, useState, useMemo } from "react";
import { PrivateKeyConnector } from "./PrivateKeyConnector";
import { BalanceDisplay } from "./BalanceDisplay";
import { NitroliteStatus } from "./NitroliteStatus";
import { useNitroliteContext } from "@/providers/NitroliteProvider";

interface DashboardLayoutProps {
  children: ReactNode;
}

// Navigation items for different user roles
const employerNavigationItems = [
  { name: "Dashboard", href: "/dashboard", icon: Home, badge: null },
  { name: "Employees", href: "/dashboard/employees", icon: Users, badge: null },
  { name: "Payroll Runs", href: "/dashboard/payroll-runs", icon: Send, badge: null },
  { name: "Payment History", href: "/dashboard/history", icon: History, badge: null },
  { name: "Yellow Network", href: "/dashboard/yellow-network", icon: Activity, badge: null },
  { name: "Testing", href: "/dashboard/testing", icon: TestTube, badge: null },
  { name: "Analytics", href: "/dashboard/analytics", icon: TrendingUp, badge: null },
  { name: "Settings", href: "/dashboard/settings", icon: Settings, badge: null },
];

const employeeNavigationItems = [
  { name: "Dashboard", href: "/dashboard/employee-portal", icon: Home, badge: null },
  { name: "Payment History", href: "/dashboard/history", icon: History, badge: null },
  { name: "Yellow Network", href: "/dashboard/yellow-network", icon: Activity, badge: null },
  { name: "Testing", href: "/dashboard/testing", icon: TestTube, badge: null },
  { name: "Analytics", href: "/dashboard/analytics", icon: TrendingUp, badge: null },
  { name: "Settings", href: "/dashboard/settings", icon: Settings, badge: null },
];

export function DashboardLayout({ children }: DashboardLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const pathname = usePathname();
  const nitrolite = useNitroliteContext();

  // Determine if current user is an employee based on the current route
  const isEmployeePortal = pathname?.includes('/employee-portal') || pathname?.startsWith('/dashboard/employee');

  // Get appropriate navigation items based on user role
  const navigationItems = useMemo(() => {
    return isEmployeePortal ? employeeNavigationItems : employerNavigationItems;
  }, [isEmployeePortal]);

  const Sidebar = ({ mobile = false }: { mobile?: boolean }) => (
    <div className={`flex flex-col h-full bg-background border-r ${mobile ? 'w-full' : 'w-64'}`}>
      {/* Logo */}
      <div className="p-6 border-b">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-gradient-to-br from-orange-500 to-yellow-500 rounded-lg flex items-center justify-center">
            <Bitcoin className="w-4 h-4 text-white" />
          </div>
          <div>
            <h1 className="font-bold text-lg bg-gradient-to-r from-orange-500 to-yellow-500 bg-clip-text text-transparent">Send-ai</h1>
            <p className="text-xs text-muted-foreground">Web3 Payroll Platform</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-2">
        {navigationItems.map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;

          return (
            <Link key={item.name} href={item.href} onClick={() => mobile && setSidebarOpen(false)}>
              <div
                className={`flex items-center justify-between p-3 rounded-lg transition-all duration-200 hover:translate-x-1 ${isActive
                    ? "bg-primary text-primary-foreground shadow-md"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted"
                  }`}
              >
                <div className="flex items-center gap-3">
                  <Icon className="w-5 h-5" />
                  <span className="font-medium">{item.name}</span>
                </div>
                {item.badge && (
                  <Badge variant={isActive ? "secondary" : "default"} className="text-xs">
                    {item.badge}
                  </Badge>
                )}
              </div>
            </Link>
          );
        })}
      </nav>

      {/* User Section */}
      <div className="p-4 border-t">
        <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
          <Avatar className="w-8 h-8">
            <AvatarImage src="/api/placeholder/32/32" alt="User" />
            <AvatarFallback>JD</AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium truncate">John Doe</p>
            <p className="text-xs text-muted-foreground truncate">
              {isEmployeePortal ? "Employee" : "Payroll Manager"}
            </p>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="flex h-screen bg-background">
      {/* Desktop Sidebar */}
      <div className="hidden lg:flex">
        <Sidebar />
      </div>

      {/* Mobile Sidebar */}
      <Sheet open={sidebarOpen} onOpenChange={setSidebarOpen}>
        <SheetContent side="left" className="p-0 w-64">
          <Sidebar mobile />
        </SheetContent>
      </Sheet>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Bar */}
        <header className="bg-background border-b px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            {/* Mobile Menu Button */}
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="sm" className="lg:hidden">
                  <Menu className="w-4 h-4" />
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="p-0 w-64">
                <Sidebar mobile />
              </SheetContent>
            </Sheet>

            {/* Search */}
            <div className="relative w-96 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder={isEmployeePortal ? "Search transactions, payslips..." : "Search employees, payrolls..."}
                className="pl-10"
              />
            </div>
          </div>

          <div className="flex items-center gap-4">
            {/* Balance Display */}
            {nitrolite.isAuthenticated && nitrolite.balances && (
              <BalanceDisplay
                balance={nitrolite.balances['usdc'] ?? nitrolite.balances['USDC'] ?? null}
                symbol="USDC"
                isLoading={nitrolite.isLoadingBalances}
                className="hidden lg:block"
              />
            )}

            {/* Nitrolite Status */}
            <NitroliteStatus
              wsStatus={nitrolite.wsStatus}
              isAuthenticated={nitrolite.isAuthenticated}
              isAuthenticating={nitrolite.isAuthenticating}
              className="hidden md:block"
            />

            {/* Private Key Connector */}
            <PrivateKeyConnector />

            {/* Notifications */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="relative">
                  <Bell className="w-4 h-4" />
                  <Badge className="absolute -top-1 -right-1 w-5 h-5 text-xs flex items-center justify-center p-0">
                    3
                  </Badge>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-80">
                <div className="p-3 border-b">
                  <h4 className="font-medium">Notifications</h4>
                  <p className="text-sm text-muted-foreground">You have 3 new notifications</p>
                </div>
                <div className="p-2">
                  <div className="p-3 rounded-lg bg-muted/50 mb-2">
                    <p className="text-sm font-medium">Payroll Ready</p>
                    <p className="text-xs text-muted-foreground">Weekly payroll for 15 employees ready for processing</p>
                  </div>
                  <div className="p-3 rounded-lg bg-muted/50 mb-2">
                    <p className="text-sm font-medium">Yellow Network Status</p>
                    <p className="text-xs text-muted-foreground">Connected to Yellow Network with optimal routing</p>
                  </div>
                  <div className="p-3 rounded-lg bg-muted/50">
                    <p className="text-sm font-medium">New Employee</p>
                    <p className="text-xs text-muted-foreground">Alice Johnson added with $75/hour rate</p>
                  </div>
                </div>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* User Menu */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="flex items-center gap-2">
                  <Avatar className="w-8 h-8">
                    <AvatarImage src="/api/placeholder/32/32" alt="User" />
                    <AvatarFallback>JD</AvatarFallback>
                  </Avatar>
                  <div className="hidden sm:block text-left">
                    <p className="text-sm font-medium">John Doe</p>
                    <p className="text-xs text-muted-foreground">
                      {isEmployeePortal ? "Employee" : "Payroll Manager"}
                    </p>
                  </div>
                  <ChevronDown className="w-4 h-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuItem>
                  <User className="w-4 h-4 mr-2" />
                  Profile
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Settings className="w-4 h-4 mr-2" />
                  Settings
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="text-red-600">
                  Log out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-auto">
          {children}
        </main>
      </div>
    </div>
  );
}