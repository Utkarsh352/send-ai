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
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";

const features = [
  {
    icon: Users,
    title: "Global Workforce Management",
    description: "Manage employees across 50+ countries with automated compliance"
  },
  {
    icon: DollarSign,
    title: "Yellow Network Integration",
    description: "Instant, gasless payments with 95% cost savings"
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
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center p-4">
      <div className="w-full max-w-6xl grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">

        {/* Left Side - Branding and Features */}
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          className="text-white space-y-8"
        >
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-violet-500 rounded-xl flex items-center justify-center">
                <Building2 className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold">PayrollPro</h1>
                <p className="text-purple-200">Global Payroll Management</p>
              </div>
            </div>

            <div className="space-y-2">
              <h2 className="text-4xl font-bold leading-tight">
                Streamline Your
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-violet-400">
                  {" "}Global Payroll
                </span>
              </h2>
              <p className="text-xl text-purple-100 max-w-lg">
                Manage payroll for your distributed team with instant payments, automated compliance, and zero-gas transactions.
              </p>
            </div>
          </div>

          <div className="space-y-6">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.2 + index * 0.1 }}
                  className="flex items-start gap-4 p-4 rounded-lg bg-white/5 backdrop-blur-sm border border-white/10"
                >
                  <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-violet-500 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Icon className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-white mb-1">{feature.title}</h3>
                    <p className="text-purple-200 text-sm">{feature.description}</p>
                  </div>
                </motion.div>
              );
            })}
          </div>

          <div className="flex items-center gap-4 pt-4">
            <Badge variant="secondary" className="bg-green-500/20 text-green-400 border-green-500/30">
              <div className="w-2 h-2 bg-green-400 rounded-full mr-2"></div>
              System Online
            </Badge>
            <Badge variant="secondary" className="bg-blue-500/20 text-blue-400 border-blue-500/30">
              <div className="w-2 h-2 bg-blue-400 rounded-full mr-2"></div>
              Yellow Network Connected
            </Badge>
          </div>
        </motion.div>

        {/* Right Side - Login Form */}
        <motion.div
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <Card className="w-full max-w-md mx-auto shadow-2xl border-0 bg-white/95 backdrop-blur-sm">
            <CardHeader className="space-y-4">
              <div className="text-center">
                <CardTitle className="text-2xl font-bold">Welcome Back</CardTitle>
                <CardDescription>
                  Sign in to your payroll management system
                </CardDescription>
              </div>

              {/* Login Type Toggle */}
              <div className="flex p-1 bg-muted rounded-lg">
                <button
                  type="button"
                  onClick={() => setLoginType("admin")}
                  className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-all ${
                    loginType === "admin"
                      ? "bg-background text-foreground shadow-sm"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  Admin Portal
                </button>
                <button
                  type="button"
                  onClick={() => setLoginType("employee")}
                  className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-all ${
                    loginType === "employee"
                      ? "bg-background text-foreground shadow-sm"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  Employee Portal
                </button>
              </div>
            </CardHeader>

            <CardContent>
              <form onSubmit={handleLogin} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email Address</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      id="email"
                      type="email"
                      placeholder="john.doe@company.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="pl-10"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="Enter your password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="pl-10 pr-10"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2"
                    >
                      {showPassword ? (
                        <EyeOff className="w-4 h-4 text-muted-foreground" />
                      ) : (
                        <Eye className="w-4 h-4 text-muted-foreground" />
                      )}
                    </button>
                  </div>
                </div>

                {loginType === "admin" && (
                  <div className="space-y-2">
                    <Label htmlFor="role">Role</Label>
                    <Select value={role} onValueChange={setRole} required>
                      <SelectTrigger>
                        <SelectValue placeholder="Select your role" />
                      </SelectTrigger>
                      <SelectContent>
                        {userRoles.filter(r => r.value !== "employee").map((role) => (
                          <SelectItem key={role.value} value={role.value}>
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
                    />
                    <Label htmlFor="remember" className="text-sm">Remember me</Label>
                  </div>
                  <Button variant="link" className="px-0 text-sm">
                    Forgot password?
                  </Button>
                </div>

                <Button
                  type="submit"
                  className="w-full"
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
                  <p className="text-sm text-muted-foreground">
                    Need help?{" "}
                    <Button variant="link" className="px-0 text-sm">
                      Contact Support
                    </Button>
                  </p>
                </div>
              </form>

              {/* Demo Credentials */}
              <div className="mt-6 p-4 bg-muted/50 rounded-lg">
                <h4 className="font-medium text-sm mb-2">Demo Credentials:</h4>
                <div className="text-xs text-muted-foreground space-y-1">
                  <p><strong>Admin:</strong> admin@company.com / admin123</p>
                  <p><strong>HR:</strong> hr@company.com / hr123</p>
                  <p><strong>Employee:</strong> john.doe@company.com / emp123</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}