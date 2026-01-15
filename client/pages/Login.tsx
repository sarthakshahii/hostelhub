import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { Building2, Lock, Mail, Loader } from "lucide-react";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      await login(email, password);
      toast({
        title: "Success",
        description: "Login successful! Redirecting...",
      });
      // Redirect will be handled by the auth flow
      navigate("/");
    } catch (err) {
      const message = err instanceof Error ? err.message : "Login failed";
      toast({
        title: "Login Failed",
        description: message,
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-slate-900 dark:to-slate-800 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Card */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-700 p-8">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500 to-cyan-500 mb-4">
              <Building2 className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">
              HostelHub
            </h1>
            <p className="text-slate-600 dark:text-slate-400">
              Hostel Management System
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Email Field */}
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-slate-900 dark:text-white mb-2"
              >
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-4 top-3.5 w-5 h-5 text-slate-400" />
                <input
                  id="email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="w-full pl-12 pr-4 py-3 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-slate-800 dark:text-white transition-colors"
                  disabled={isSubmitting}
                />
              </div>
            </div>

            {/* Password Field */}
            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-slate-900 dark:text-white mb-2"
              >
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-4 top-3.5 w-5 h-5 text-slate-400" />
                <input
                  id="password"
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-12 pr-4 py-3 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-slate-800 dark:text-white transition-colors"
                  disabled={isSubmitting}
                />
              </div>
            </div>

            {/* Remember Me & Forgot Password */}
            <div className="flex items-center justify-between text-sm">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  className="w-4 h-4 rounded border-slate-300 text-blue-500 focus:ring-blue-500"
                />
                <span className="text-slate-600 dark:text-slate-400">
                  Remember me
                </span>
              </label>
              <a href="#" className="text-blue-600 hover:text-blue-700 dark:text-blue-400">
                Forgot password?
              </a>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-gradient-to-r from-blue-500 to-cyan-500 text-white py-3 rounded-lg font-semibold hover:shadow-lg transition-all disabled:opacity-75 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isSubmitting && <Loader className="w-5 h-5 animate-spin" />}
              {isSubmitting ? "Logging in..." : "Login"}
            </button>
          </form>

          {/* Demo Credentials */}
          <div className="mt-8 pt-8 border-t border-slate-200 dark:border-slate-700">
            <p className="text-xs text-slate-500 dark:text-slate-400 text-center mb-4">
              Demo Credentials
            </p>
            <div className="space-y-2 bg-slate-50 dark:bg-slate-800 rounded-lg p-4">
              <div>
                <p className="text-xs font-medium text-slate-600 dark:text-slate-400">
                  Admin:
                </p>
                <p className="text-xs text-slate-900 dark:text-white">
                  admin@hostel.com / password123
                </p>
              </div>
              <div>
                <p className="text-xs font-medium text-slate-600 dark:text-slate-400">
                  Warden:
                </p>
                <p className="text-xs text-slate-900 dark:text-white">
                  warden@hostel.com / password123
                </p>
              </div>
              <div>
                <p className="text-xs font-medium text-slate-600 dark:text-slate-400">
                  Student:
                </p>
                <p className="text-xs text-slate-900 dark:text-white">
                  student@hostel.com / password123
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <p className="text-center text-slate-600 dark:text-slate-400 text-sm mt-8">
          © 2024 HostelHub. All rights reserved.
        </p>
      </div>
    </div>
  );
}
