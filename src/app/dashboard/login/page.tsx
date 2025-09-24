"use client";

import { useState } from "react";
import { Eye, EyeOff, Lock, Mail, Building2, Loader2, Shield, Users, DollarSign } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
// import { motion } from "framer-motion";
import { useRouter } from "next/navigation";

const features = [
  {
    icon: Users,
    title: "Global Workforce Management",
    description: "Manage employees across 50+ countries with automated compliance"
  },
  {
    icon: DollarSign,
    title: "Instant Payments",
    description: "Real-time wage access with zero-gas transactions"
  },
  {
    icon: Shield,
    title: "Enterprise Security",
    description: "Bank-grade security with full audit trails"
  }
];

const userRoles = [
  { value: "admin", label: "Administrator" },
  { value: "hr", label: "HR Manager" },
  { value: "finance", label: "Finance Manager" },
  { value: "payroll", label: "Payroll Specialist" },
  { value: "employee", label: "Employee" }
];

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [loginType, setLoginType] = useState<"admin" | "employee">("admin");

  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000));

    // Mock authentication logic
    if (email && password) {
      // Store mock user data
      localStorage.setItem("user", JSON.stringify({
        email,
        role,
        name: email.split("@")[0].replace(".", " ").replace(/\b\w/g, l => l.toUpperCase()),
        loginType
      }));

      // Redirect based on role
      if (loginType === "employee") {
        router.push("/dashboard/employee-portal");
      } else {
        router.push("/dashboard");
      }
    }

    setIsLoading(false);
  };

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-neutral-900 via-slate-900 to-black flex items-center justify-center p-4">
      <div className="w-full max-w-6xl grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">

        {/* Left Side - Branding and Features */}
        <div className="hidden lg:block text-white space-y-8 lg:pr-8">
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-br from-yellow-500 to-amber-600 rounded-xl flex items-center justify-center">
                <Building2 className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">Send-AI</h1>
                <p className="text-yellow-200">Hourly Pay, Instant Access</p>
              </div>
            </div>

            <div className="space-y-2">
              <h2 className="text-4xl font-bold leading-tight bg-gradient-to-b from-white to-gray-400 bg-clip-text text-transparent">
                Streamline Your
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-amber-400">
                  {" "}Payroll System
                </span>
              </h2>
              <p className="text-xl text-gray-300 max-w-lg">
                Work by the hour, access your earnings every hour. Powered by advanced protocols for instant settlements.
              </p>
            </div>
          </div>

          <div className="space-y-6">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <div
                  key={index}
                  className="flex items-start gap-4 p-4 rounded-lg bg-white/5 backdrop-blur-sm border border-white/10"
                >
                  <div className="w-10 h-10 bg-gradient-to-br from-yellow-500 to-amber-600 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Icon className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-white mb-1">{feature.title}</h3>
                    <p className="text-gray-300 text-sm">{feature.description}</p>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="flex items-center gap-4 pt-4">
            <Badge variant="secondary" className="bg-green-500/20 text-green-400 border-green-500/30">
              <div className="w-2 h-2 bg-green-400 rounded-full mr-2"></div>
              System Online
            </Badge>
          </div>
        </div>

        {/* Right Side - Login Form */}
        <div>
          <Card className="w-full max-w-md mx-auto shadow-2xl border border-white/10 bg-black/50 backdrop-blur-md">
            <CardHeader className="space-y-4">
              {/* Mobile Brand Header */}
              <div className="lg:hidden text-center mb-4">
                <div className="flex items-center justify-center gap-3 mb-2">
                  <div className="w-10 h-10 bg-gradient-to-br from-yellow-500 to-amber-600 rounded-xl flex items-center justify-center">
                    <Building2 className="w-5 h-5 text-white" />
                  </div>
                  <div className="text-left">
                    <h1 className="text-xl font-bold text-white">Send-AI</h1>
                    <p className="text-sm text-gray-300">Hourly Pay, Instant Access</p>
                  </div>
                </div>
              </div>

              <div className="text-center">
                <CardTitle className="text-2xl font-bold text-white">Welcome Back</CardTitle>
                <CardDescription className="text-gray-300">
                  Sign in to your payroll management system
                </CardDescription>
              </div>

              {/* Login Type Toggle */}
              <div className="flex p-1 bg-white/5 rounded-lg">
                <button
                  type="button"
                  onClick={() => setLoginType("admin")}
                  className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-all ${
                    loginType === "admin"
                      ? "bg-yellow-500 text-black shadow-sm"
                      : "text-gray-300 hover:text-white"
                  }`}
                >
                  Admin Portal
                </button>
                <button
                  type="button"
                  onClick={() => setLoginType("employee")}
                  className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-all ${
                    loginType === "employee"
                      ? "bg-yellow-500 text-black shadow-sm"
                      : "text-gray-300 hover:text-white"
                  }`}
                >
                  Employee Portal
                </button>
              </div>
            </CardHeader>

            <CardContent>
              <form onSubmit={handleLogin} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-white">Email Address</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <Input
                      id="email"
                      type="email"
                      placeholder="john.doe@company.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="pl-10 bg-white/10 border-white/20 text-white placeholder:text-gray-400 focus:border-yellow-500"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password" className="text-white">Password</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="Enter your password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="pl-10 pr-10 bg-white/10 border-white/20 text-white placeholder:text-gray-400 focus:border-yellow-500"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white"
                    >
                      {showPassword ? (
                        <EyeOff className="w-4 h-4" />
                      ) : (
                        <Eye className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                </div>

                {loginType === "admin" && (
                  <div className="space-y-2">
                    <Label htmlFor="role" className="text-white">Role</Label>
                    <Select value={role} onValueChange={setRole} required>
                      <SelectTrigger className="bg-white/10 border-white/20 text-white focus:border-yellow-500">
                        <SelectValue placeholder="Select your role" className="text-gray-400" />
                      </SelectTrigger>
                      <SelectContent className="bg-gray-900 border-white/20">
                        {userRoles.filter(r => r.value !== "employee").map((role) => (
                          <SelectItem key={role.value} value={role.value} className="text-white hover:bg-white/10">
                            {role.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                )}

                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="remember"
                      checked={rememberMe}
                      onCheckedChange={setRememberMe}
                      className="border-white/20 data-[state=checked]:bg-yellow-500"
                    />
                    <Label htmlFor="remember" className="text-sm text-gray-300">Remember me</Label>
                  </div>
                  <Button variant="link" className="px-0 text-sm text-yellow-400 hover:text-yellow-300 hover:underline focus:underline">
                    Forgot password?
                  </Button>
                </div>

                <Button
                  type="submit"
                  className="w-full bg-gradient-to-r from-yellow-500 to-amber-600 hover:from-yellow-600 hover:to-amber-700 text-black font-semibold"
                  disabled={isLoading || !email || !password || (loginType === "admin" && !role)}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Signing in...
                    </>
                  ) : (
                    <>
                      Sign In to {loginType === "admin" ? "Admin Portal" : "Employee Portal"}
                    </>
                  )}
                </Button>

                <div className="text-center pt-4">
                  <p className="text-sm text-gray-300">
                    Need help?{" "}
                    <Button variant="link" className="px-0 text-sm text-yellow-400 hover:text-yellow-300 hover:underline focus:underline">
                      Contact Support
                    </Button>
                  </p>
                </div>
              </form>

              {/* Demo Credentials */}
              <div className="mt-6 p-4 bg-white/5 rounded-lg border border-white/10">
                <h4 className="font-medium text-sm mb-2 text-white">Demo Credentials:</h4>
                <div className="text-xs text-gray-300 space-y-1">
                  <p><strong className="text-yellow-400">Admin:</strong> admin@company.com / admin123</p>
                  <p><strong className="text-yellow-400">HR:</strong> hr@company.com / hr123</p>
                  <p><strong className="text-yellow-400">Employee:</strong> john.doe@company.com / emp123</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}