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
import {
  setToken,
  setUser,
  getRedirectPath,
} from "../../features/auth/authUtils";

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
      const timer = setTimeout(
        () => setResendCountdown(resendCountdown - 1),
        1000,
      );
      return () => clearTimeout(timer);
    }
  }, [resendCountdown]);

  useEffect(() => {
    if (inputRefs.current[0]) {
      inputRefs.current[0].focus();
    }
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
      const result = await verifyEmail({
        email,
        verificationCode: otpValue,
      }).unwrap();

      if (result.token) {
        setToken(result.token);
        setUser(result.data);
        dispatch(
          setCredentials({ user: result.data, accessToken: result.token }),
        );
      }

      setSuccess(result.message || "Email verified successfully!");

      setTimeout(() => {
        navigate(getRedirectPath(result.data?.role));
      }, 1500);
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
      setError(
        err?.data?.message || "Failed to resend code. Please try again.",
      );
    } finally {
      setIsResending(false);
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pastedData = e.clipboardData
      .getData("text")
      .replace(/\D/g, "")
      .slice(0, 6);
    const pastedArray = pastedData.split("");
    const newOtp = [...otp];
    for (let i = 0; i < 6; i++) {
      newOtp[i] = pastedArray[i] || "";
    }
    setOtp(newOtp);
    if (pastedArray.length === 6) {
      inputRefs.current[5].focus();
    } else {
      inputRefs.current[pastedArray.length].focus();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        {/* ✅ Fixed Back Button - Proper Button Design */}
        <button
          onClick={() => navigate("/auth")}
          className="group mb-6 inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white dark:bg-gray-800/80 border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:border-purple-200 dark:hover:border-purple-700 hover:bg-purple-50 dark:hover:bg-purple-900/20 transition-all duration-200 shadow-sm hover:shadow-md"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform duration-200" />
          <span className="text-sm font-medium">Back to Sign In</span>
        </button>

        {/* Main Card */}
        <div className="bg-white dark:bg-gray-800/80 rounded-2xl border border-gray-200 dark:border-gray-700/50 shadow-sm overflow-hidden">
          {/* Header */}
          <div className="relative px-6 pt-8 pb-6 text-center border-b border-gray-200 dark:border-gray-700/50">
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-purple-600 to-indigo-600" />
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-purple-100 to-indigo-100 dark:from-purple-900/50 dark:to-indigo-900/50 mb-4 shadow-md">
              <Shield className="w-8 h-8 text-purple-600 dark:text-purple-400" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
              Verify Your Email
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              We've sent a verification code to
            </p>
            <p className="text-sm font-medium text-purple-600 dark:text-purple-400 mt-1">
              {email}
            </p>
          </div>

          {/* Content */}
          <div className="p-6">
            {/* Info Box */}
            <div className="bg-purple-50 dark:bg-purple-900/20 rounded-xl p-4 mb-6 flex items-start gap-3 border border-purple-100 dark:border-purple-800/30">
              <Mail className="w-5 h-5 text-purple-600 dark:text-purple-400 flex-shrink-0 mt-0.5" />
              <div className="text-sm">
                <p className="font-medium text-purple-700 dark:text-purple-300 mb-1">
                  Can't find the email?
                </p>
                <p className="text-purple-600 dark:text-purple-400">
                  Check your spam folder or click "Resend Code" below.
                </p>
              </div>
            </div>

            <form onSubmit={handleVerify}>
              {/* OTP Input - 6 separate boxes */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3 text-center">
                  Enter 6-Digit Code
                </label>
                <div
                  className="flex justify-center gap-2 sm:gap-3"
                  onPaste={handlePaste}
                >
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
                      className="w-12 h-14 sm:w-14 sm:h-16 text-center text-2xl font-bold border-2 border-gray-200 dark:border-gray-700 rounded-xl focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 outline-none transition-all dark:bg-gray-800 dark:text-white"
                      autoComplete="off"
                    />
                  ))}
                </div>
              </div>

              {/* Error Message */}
              {error && (
                <div className="mb-4 flex items-center gap-2 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800/30 rounded-xl">
                  <AlertCircle className="w-4 h-4 text-red-600 dark:text-red-400 flex-shrink-0" />
                  <span className="text-sm text-red-700 dark:text-red-400">
                    {error}
                  </span>
                </div>
              )}

              {/* Success Message */}
              {success && (
                <div className="mb-4 flex items-center gap-2 p-3 bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800/30 rounded-xl animate-in fade-in slide-in-from-top duration-300">
                  <CheckCircle className="w-4 h-4 text-emerald-600 dark:text-emerald-400 flex-shrink-0" />
                  <span className="text-sm text-emerald-700 dark:text-emerald-400">
                    {success}
                  </span>
                </div>
              )}

              {/* Resend Message */}
              {resendMessage && (
                <div className="mb-4 text-center text-sm text-emerald-600 dark:text-emerald-400">
                  {resendMessage}
                </div>
              )}

              {/* Verify Button */}
              <button
                type="submit"
                disabled={isSubmitting || otp.some((d) => !d)}
                className="w-full py-3 bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-semibold rounded-xl hover:from-purple-700 hover:to-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all transform hover:scale-[1.02] shadow-md"
              >
                {isSubmitting ? (
                  <div className="flex items-center justify-center gap-2">
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Verifying...
                  </div>
                ) : (
                  "Verify Email"
                )}
              </button>
            </form>

            {/* Resend Section */}
            <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700/50">
              <div className="text-center">
                <button
                  onClick={handleResendCode}
                  disabled={isResending || resendCountdown > 0}
                  className="text-purple-600 dark:text-purple-400 hover:text-purple-700 dark:hover:text-purple-300 disabled:text-gray-400 dark:disabled:text-gray-500 disabled:cursor-not-allowed inline-flex items-center gap-2 text-sm font-medium transition-colors"
                >
                  <RefreshCw
                    className={`w-4 h-4 ${isResending ? "animate-spin" : ""}`}
                  />
                  {resendCountdown > 0
                    ? `Resend code in ${resendCountdown}s`
                    : "Resend verification code"}
                </button>
              </div>

              {/* Timer Indicator */}
              {resendCountdown > 0 && (
                <div className="mt-3 flex items-center justify-center gap-2 text-xs text-gray-500 dark:text-gray-400">
                  <Clock className="w-3 h-3" />
                  <span>
                    Code expires in {Math.floor(resendCountdown / 60)}:
                    {(resendCountdown % 60).toString().padStart(2, "0")}
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Footer */}
        <p className="text-center text-xs text-gray-400 dark:text-gray-500 mt-6">
          By verifying your email, you agree to our Terms of Service and Privacy
          Policy
        </p>
      </div>
    </div>
  );
};

export default VerifyEmailPage;
