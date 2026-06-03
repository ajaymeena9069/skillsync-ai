import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Mail, ArrowLeft, Sparkles, CheckCircle2 } from "lucide-react";
import { Button } from "../../components/Button";
import { Input } from "../../components/Input";
import { useForgotPasswordMutation } from "../../services/authApi";
import { toast } from "sonner";

export function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [forgotPassword, { isLoading }] = useForgotPasswordMutation();
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email) {
      toast.error("Please enter your email");
      return;
    }

    try {
      const response = await forgotPassword({ email }).unwrap();
      setSuccess(true);
      toast.success(response.message || "Reset link sent to your email!");
    } catch (err) {
      toast.error(err.data?.message || "Failed to send reset email");
    }
  };

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-950 dark:to-gray-900 p-6">
        <div className="w-full max-w-md bg-white/80 dark:bg-gray-900/80 backdrop-blur-lg rounded-2xl border border-gray-200/50 dark:border-gray-800/50 shadow-xl p-8 text-center">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-r from-emerald-500 to-teal-600 flex items-center justify-center">
            <CheckCircle2 className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Check your inbox</h2>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            We've sent password reset instructions to <strong>{email}</strong>
          </p>
          <div className="space-y-3">
            <Button
              onClick={() => navigate("/auth")}
              className="w-full bg-gradient-to-r from-purple-600 to-indigo-600"
            >
              Return to login
            </Button>
            <Button
              variant="ghost"
              onClick={() => setSuccess(false)}
              className="w-full"
            >
              Try another email
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-950 dark:to-gray-900 p-6 relative overflow-hidden">
      {/* Animated background blobs */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl -mr-48 -mt-48 animate-pulse" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-indigo-500/20 rounded-full blur-3xl -ml-48 -mb-48 animate-pulse delay-1000" />

      <div className="w-full max-w-md relative z-10">
        {/* Logo + heading (mobile friendly) */}
        <div className="text-center mb-8">
          <Link
            to="/"
            className="inline-flex items-center gap-2 group"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-600 to-indigo-600 flex items-center justify-center shadow-lg group-hover:scale-105 transition-transform">
              <Sparkles className="w-6 h-6 text-white" />
            </div>
            <span className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent">
              SkillSync AI
            </span>
          </Link>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mt-6 mb-2">Forgot password?</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            No worries – we'll send reset instructions to your email
          </p>
        </div>

        {/* Glass card */}
        <div className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-lg rounded-2xl border border-gray-200/50 dark:border-gray-800/50 shadow-xl p-6 sm:p-8 transition-all duration-300">
          <form onSubmit={handleSubmit} className="space-y-6">
            <Input
              type="email"
              label="Email Address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              icon={Mail}
              required
              disabled={isLoading}
              autoFocus
            />

            <Button
              type="submit"
              className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 shadow-md hover:shadow-lg transition-all duration-200"
              disabled={isLoading}
            >
              {isLoading ? (
                <div className="flex items-center justify-center gap-2">
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Sending...</span>
                </div>
              ) : (
                "Send reset link"
              )}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <Link
              to="/auth"
              className="inline-flex items-center text-sm font-medium text-purple-600 dark:text-purple-400 hover:text-purple-700 dark:hover:text-purple-300 transition-colors"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to login
            </Link>
          </div>
        </div>

        {/* Extra security note */}
        <p className="text-xs text-center text-gray-400 dark:text-gray-500 mt-6">
          We'll send a password reset link that expires in 1 hour.
        </p>
      </div>
    </div>
  );
}