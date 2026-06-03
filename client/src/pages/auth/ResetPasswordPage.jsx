import { useState } from "react";
import { useNavigate, useSearchParams, Link } from "react-router-dom";
import { Lock, ArrowLeft, Sparkles, CheckCircle2, AlertCircle } from "lucide-react";
import { Button } from "../../components/Button";
import { Input } from "../../components/Input";
import { useResetPasswordMutation } from "../../services/authApi";
import { toast } from "sonner";

export function ResetPasswordPage() {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");
  const navigate = useNavigate();

  const [resetPassword, { isLoading }] = useResetPasswordMutation();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!token) {
      toast.error("Invalid or missing reset token");
      return;
    }

    if (password !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    if (password.length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }

    try {
      const response = await resetPassword({ token, newPassword: password }).unwrap();
      toast.success(response.message || "Password reset successfully");
      setIsSuccess(true);
    } catch (err) {
      toast.error(err.data?.message || "Failed to reset password");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-950 dark:to-gray-900 p-6 relative overflow-hidden">
      {/* Animated background blobs */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl -mr-48 -mt-48 animate-pulse" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-indigo-500/20 rounded-full blur-3xl -ml-48 -mb-48 animate-pulse delay-1000" />

      <div className="w-full max-w-md relative z-10">
        {/* Logo + heading */}
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-2 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-600 to-indigo-600 flex items-center justify-center shadow-lg group-hover:scale-105 transition-transform">
              <Sparkles className="w-6 h-6 text-white" />
            </div>
            <span className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent">
              SkillSync AI
            </span>
          </Link>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mt-6 mb-2">
            {isSuccess ? "Password reset" : "Set new password"}
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            {isSuccess
              ? "Your password has been successfully updated"
              : "Create a strong password for your account"}
          </p>
        </div>

        {/* Glass card */}
        <div className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-lg rounded-2xl border border-gray-200/50 dark:border-gray-800/50 shadow-xl p-6 sm:p-8 transition-all duration-300">
          {isSuccess ? (
            <div className="text-center py-4">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-r from-emerald-500 to-teal-600 flex items-center justify-center">
                <CheckCircle2 className="w-8 h-8 text-white" />
              </div>
              <p className="text-gray-600 dark:text-gray-300 mb-8">
                You can now log in with your new password.
              </p>
              <Button
                onClick={() => navigate("/auth")}
                className="w-full bg-gradient-to-r from-purple-600 to-indigo-600"
              >
                Go to login
              </Button>
            </div>
          ) : (
            <>
              {!token ? (
                <div className="rounded-xl bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 p-4 flex items-start gap-3 mb-6">
                  <AlertCircle className="w-5 h-5 text-amber-600 dark:text-amber-400 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-amber-800 dark:text-amber-300">Invalid reset link</p>
                    <p className="text-xs text-amber-700 dark:text-amber-400 mt-0.5">
                      The token is missing from the URL. Please request a new password reset.
                    </p>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  <Input
                    type="password"
                    label="New Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    icon={Lock}
                    required
                    disabled={isLoading}
                    autoFocus
                  />
                  <Input
                    type="password"
                    label="Confirm password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="••••••••"
                    icon={Lock}
                    required
                    disabled={isLoading}
                  />
                  <Button
                    type="submit"
                    className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 shadow-md hover:shadow-lg transition-all duration-200"
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <div className="flex items-center justify-center gap-2">
                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        <span>Updating...</span>
                      </div>
                    ) : (
                      "Update password"
                    )}
                  </Button>
                </form>
              )}

              <div className="mt-6 text-center">
                <Link
                  to="/auth"
                  className="inline-flex items-center text-sm font-medium text-purple-600 dark:text-purple-400 hover:text-purple-700 dark:hover:text-purple-300 transition-colors"
                >
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back to login
                </Link>
              </div>
            </>
          )}
        </div>

        {/* Password hint */}
        {!isSuccess && token && (
          <p className="text-xs text-center text-gray-400 dark:text-gray-500 mt-6">
            Password must be at least 6 characters long.
          </p>
        )}
      </div>
    </div>
  );
}