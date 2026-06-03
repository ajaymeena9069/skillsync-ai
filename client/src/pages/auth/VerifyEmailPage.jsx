// client/src/pages/auth/VerifyEmailPage.jsx
import React, { useState, useEffect, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useDispatch } from "react-redux";
import {
  Mail,
  CheckCircle,
  AlertCircle,
  RefreshCw,
  ArrowLeft,
  Shield,
  Clock,
  Sparkles,
} from "lucide-react";
import {
  useVerifyEmailMutation,
  useResendVerificationCodeMutation,
} from "../../services/authApi";
import { setCredentials } from "../../features/auth/authSlice";
import { getRedirectPath } from "../../features/auth/authUtils";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "../../components/Button";

const VerifyEmailPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const email = location.state?.email || "";

  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [resendCountdown, setResendCountdown] = useState(0);
  const [resendMessage, setResendMessage] = useState("");

  const inputRefs = useRef([]);

  const [verifyEmail] = useVerifyEmailMutation();
  const [resendCode] = useResendVerificationCodeMutation();

  useEffect(() => {
    if (resendCountdown > 0) {
      const timer = setTimeout(() => setResendCountdown(resendCountdown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [resendCountdown]);

  useEffect(() => {
    if (inputRefs.current[0]) inputRefs.current[0].focus();
  }, []);

  if (!email) {
    navigate("/auth");
    return null;
  }

  const handleOtpChange = (index, value) => {
    const newOtp = [...otp];
    newOtp[index] = value.replace(/\D/g, "").slice(0, 1);
    setOtp(newOtp);
    setError("");

    if (value && index < 5) {
      inputRefs.current[index + 1].focus();
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1].focus();
    }
  };

  const handleVerify = async (e) => {
    e.preventDefault();
    if (isSubmitting) return;

    const otpValue = otp.join("");
    if (otpValue.length !== 6) {
      setError("Please enter the 6-digit verification code");
      return;
    }

    setIsSubmitting(true);
    setError("");
    setSuccess("");

    try {
      const result = await verifyEmail({ email, verificationCode: otpValue }).unwrap();
      if (result.token) {
        dispatch(setCredentials({ user: result.user, token: result.token }));
      }
      setSuccess(result.message || "Email verified successfully!");
      setTimeout(() => navigate(result.redirectUrl || getRedirectPath(result.user?.role)), 1500);
    } catch (err) {
      setError(err?.data?.message || "Verification failed. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleResendCode = async () => {
    if (isResending || resendCountdown > 0) return;
    setIsResending(true);
    setError("");
    setResendMessage("");
    try {
      await resendCode({ email }).unwrap();
      setResendMessage("New verification code sent to your email!");
      setResendCountdown(60);
      setOtp(["", "", "", "", "", ""]);
      if (inputRefs.current[0]) inputRefs.current[0].focus();
    } catch (err) {
      setError(err?.data?.message || "Failed to resend code. Please try again.");
    } finally {
      setIsResending(false);
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6);
    const pastedArray = pastedData.split("");
    const newOtp = [...otp];
    for (let i = 0; i < 6; i++) newOtp[i] = pastedArray[i] || "";
    setOtp(newOtp);
    if (pastedArray.length === 6) inputRefs.current[5].focus();
    else inputRefs.current[pastedArray.length].focus();
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-950 dark:to-gray-900 p-6 relative overflow-hidden">
      {/* Animated background blobs */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl -mr-48 -mt-48 animate-pulse" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-indigo-500/20 rounded-full blur-3xl -ml-48 -mb-48 animate-pulse delay-1000" />

      <div className="w-full max-w-md relative z-10">
        {/* Back button */}
        <button
          onClick={() => navigate("/auth")}
          className="group mb-6 inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-md hover:border-purple-300 dark:hover:border-purple-700 transition-all duration-200"
        >
          <ArrowLeft className="w-4 h-4 text-gray-500 group-hover:text-purple-500 group-hover:-translate-x-0.5 transition-all" />
          <span className="text-sm font-medium text-gray-600 dark:text-gray-400 group-hover:text-purple-600">Back to sign in</span>
        </button>

        {/* Glass card */}
        <div className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-lg rounded-2xl border border-gray-200/50 dark:border-gray-800/50 shadow-xl overflow-hidden">
          {/* Header */}
          <div className="relative px-6 pt-8 pb-6 text-center border-b border-gray-200/50 dark:border-gray-800/50">
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-purple-600 to-indigo-600" />
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-purple-100 to-indigo-100 dark:from-purple-900/50 dark:to-indigo-900/50 mb-4 shadow-md">
              <Shield className="w-8 h-8 text-purple-600 dark:text-purple-400" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Verify Your Email</h1>
            <p className="text-sm text-gray-500 dark:text-gray-400">We've sent a verification code to</p>
            <p className="text-sm font-medium text-purple-600 dark:text-purple-400 mt-1">{email}</p>
          </div>

          {/* Content */}
          <div className="p-6">
            {/* Info box */}
            <div className="bg-purple-50/50 dark:bg-purple-900/20 rounded-xl p-4 mb-6 flex items-start gap-3 border border-purple-100 dark:border-purple-800/30">
              <Mail className="w-5 h-5 text-purple-600 dark:text-purple-400 flex-shrink-0 mt-0.5" />
              <div className="text-sm">
                <p className="font-medium text-purple-700 dark:text-purple-300 mb-1">Can't find the email?</p>
                <p className="text-purple-600 dark:text-purple-400">Check your spam folder or click "Resend Code" below.</p>
              </div>
            </div>

            <form onSubmit={handleVerify}>
              {/* OTP Input - 6 boxes, responsive */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3 text-center">
                  Enter 6‑digit code
                </label>
                <div className="flex justify-center gap-2 sm:gap-3" onPaste={handlePaste}>
                  {otp.map((digit, index) => (
                    <input
                      key={index}
                      ref={(el) => (inputRefs.current[index] = el)}
                      type="text"
                      inputMode="numeric"
                      pattern="\d*"
                      maxLength={1}
                      value={digit}
                      onChange={(e) => handleOtpChange(index, e.target.value)}
                      onKeyDown={(e) => handleKeyDown(index, e)}
                      className="w-12 h-14 sm:w-14 sm:h-16 text-center text-2xl font-bold bg-white dark:bg-gray-800/50 text-gray-900 dark:text-white border-2 border-gray-200 dark:border-gray-700 rounded-xl focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 outline-none transition-all"
                      autoComplete="off"
                    />
                  ))}
                </div>
              </div>

              <AnimatePresence mode="wait">
                {error && (
                  <motion.div
                    initial={{ opacity: 0, y: -5 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -5 }}
                    className="mb-4 flex items-center gap-2 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800/30 rounded-xl"
                  >
                    <AlertCircle className="w-4 h-4 text-red-600 dark:text-red-400 flex-shrink-0" />
                    <span className="text-sm text-red-700 dark:text-red-400">{error}</span>
                  </motion.div>
                )}
                {success && (
                  <motion.div
                    initial={{ opacity: 0, y: -5 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -5 }}
                    className="mb-4 flex items-center gap-2 p-3 bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800/30 rounded-xl"
                  >
                    <CheckCircle className="w-4 h-4 text-emerald-600 dark:text-emerald-400 flex-shrink-0" />
                    <span className="text-sm text-emerald-700 dark:text-emerald-400">{success}</span>
                  </motion.div>
                )}
              </AnimatePresence>

              {resendMessage && (
                <div className="mb-4 text-center text-sm text-emerald-600 dark:text-emerald-400">
                  {resendMessage}
                </div>
              )}

              <Button
                type="submit"
                disabled={isSubmitting || otp.some((d) => !d)}
                className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white shadow-md hover:shadow-lg transition-all"
              >
                {isSubmitting ? (
                  <div className="flex items-center justify-center gap-2">
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Verifying...</span>
                  </div>
                ) : (
                  "Verify Email"
                )}
              </Button>
            </form>

            {/* Resend section */}
            <div className="mt-6 pt-6 border-t border-gray-200/50 dark:border-gray-800/50">
              <div className="text-center">
                <button
                  onClick={handleResendCode}
                  disabled={isResending || resendCountdown > 0}
                  className="text-purple-600 dark:text-purple-400 hover:text-purple-700 dark:hover:text-purple-300 disabled:text-gray-400 dark:disabled:text-gray-500 disabled:cursor-not-allowed inline-flex items-center gap-2 text-sm font-medium transition-colors"
                >
                  <RefreshCw className={`w-4 h-4 ${isResending ? "animate-spin" : ""}`} />
                  {resendCountdown > 0 ? `Resend code in ${resendCountdown}s` : "Resend verification code"}
                </button>
              </div>

              {resendCountdown > 0 && (
                <div className="mt-3 flex items-center justify-center gap-2 text-xs text-gray-500 dark:text-gray-400">
                  <Clock className="w-3 h-3" />
                  <span>
                    Code expires in {Math.floor(resendCountdown / 60)}:{String(resendCountdown % 60).padStart(2, "0")}
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Footer note */}
        <p className="text-center text-xs text-gray-400 dark:text-gray-500 mt-6">
          By verifying your email, you agree to our Terms of Service and Privacy Policy
        </p>
      </div>
    </div>
  );
};

export default VerifyEmailPage;