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
} from "lucide-react";
import {
  useVerifyEmailMutation,
  useResendVerificationCodeMutation,
} from "../../services/authApi";
import { setCredentials } from "../../features/auth/authSlice";
import { saveAccessToken, saveUser } from "../../features/auth/authUtils";

const VerifyEmailPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const email = location.state?.email || "";

  const [otp, setOtp] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [resendCountdown, setResendCountdown] = useState(0);
  const [resendMessage, setResendMessage] = useState("");

  const inputRef = useRef(null);

  const [verifyEmail] = useVerifyEmailMutation();
  const [resendCode] = useResendVerificationCodeMutation();

  // Countdown timer
  useEffect(() => {
    if (resendCountdown > 0) {
      const timer = setTimeout(
        () => setResendCountdown(resendCountdown - 1),
        1000,
      );
      return () => clearTimeout(timer);
    }
  }, [resendCountdown]);

  // Focus input on mount
  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  // Redirect if no email
  if (!email) {
    navigate("/auth");
    return null;
  }

  const handleOtpChange = (e) => {
    const value = e.target.value.replace(/\D/g, "").slice(0, 6);
    setOtp(value);
    setError("");
  };

  const handleVerify = async (e) => {
    e.preventDefault();
    if (isSubmitting) return;

    if (otp.length !== 6) {
      setError("Please enter the 6-digit verification code");
      return;
    }

    setIsSubmitting(true);
    setError("");
    setSuccess("");

    try {
      const result = await verifyEmail({
        email,
        verificationCode: otp,
      }).unwrap();

      if (result.token) {
        saveAccessToken(result.token);
        saveUser(result.data);
        dispatch(
          setCredentials({ user: result.data, accessToken: result.token }),
        );
      }

      setSuccess(result.message || "Email verified successfully!");

      // Redirect to dashboard after 1.5 seconds
      setTimeout(() => {
        navigate("/app/dashboard");
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
      setOtp("");
    } catch (err) {
      setError(
        err?.data?.message || "Failed to resend code. Please try again.",
      );
    } finally {
      setIsResending(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        {/* Back Button */}
        <button
          onClick={() => navigate("/auth")}
          className="mb-6 flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors group"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          Back to Sign In
        </button>

        {/* Main Card */}
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          {/* Header with Gradient */}
          <div className="bg-gradient-to-r from-purple-600 to-indigo-600 px-6 py-8 text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-white/10 rounded-2xl backdrop-blur-sm mb-4">
              <Shield className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-white mb-2">
              Check Your Email
            </h1>
            <p className="text-purple-100">We've sent a verification code to</p>
            <p className="text-white font-medium mt-1">{email}</p>
          </div>

          {/* Content */}
          <div className="p-6">
            {/* Info Box */}
            <div className="bg-blue-50 rounded-xl p-4 mb-6 flex items-start gap-3">
              <Mail className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
              <div className="text-sm text-blue-800">
                <p className="font-medium mb-1">Can't find the email?</p>
                <p>Check your spam folder or click "Resend Code" below.</p>
              </div>
            </div>

            <form onSubmit={handleVerify}>
              {/* OTP Input */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Verification Code
                </label>
                <input
                  ref={inputRef}
                  type="text"
                  inputMode="numeric"
                  pattern="\d*"
                  value={otp}
                  onChange={handleOtpChange}
                  placeholder="Enter 6-digit code"
                  className="w-full px-4 py-3 text-center text-2xl tracking-[0.5em] font-mono border-2 border-gray-200 rounded-xl focus:border-purple-500 focus:ring-2 focus:ring-purple-200 outline-none transition-all"
                  autoComplete="off"
                />
                <p className="text-xs text-gray-500 mt-2 text-center">
                  Enter the 6-digit code sent to your email
                </p>
              </div>

              {/* Error Message */}
              {error && (
                <div className="mb-4 flex items-center gap-2 p-3 bg-red-50 text-red-700 rounded-xl">
                  <AlertCircle className="w-4 h-4 flex-shrink-0" />
                  <span className="text-sm">{error}</span>
                </div>
              )}

              {/* Success Message */}
              {success && (
                <div className="mb-4 flex items-center gap-2 p-3 bg-green-50 text-green-700 rounded-xl">
                  <CheckCircle className="w-4 h-4 flex-shrink-0" />
                  <span className="text-sm">{success}</span>
                </div>
              )}

              {/* Resend Message */}
              {resendMessage && (
                <div className="mb-4 text-center text-sm text-green-600">
                  {resendMessage}
                </div>
              )}

              {/* Verify Button */}
              <button
                type="submit"
                disabled={isSubmitting || otp.length !== 6}
                className="w-full py-3 bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-semibold rounded-xl hover:from-purple-700 hover:to-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all transform hover:scale-[1.02]"
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
            <div className="mt-6 pt-6 border-t border-gray-100">
              <div className="text-center">
                <button
                  onClick={handleResendCode}
                  disabled={isResending || resendCountdown > 0}
                  className="text-purple-600 hover:text-purple-700 disabled:text-gray-400 disabled:cursor-not-allowed inline-flex items-center gap-2 text-sm font-medium"
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
                <div className="mt-3 flex items-center justify-center gap-2 text-xs text-gray-500">
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

        {/* Help Text */}
        <p className="text-center text-xs text-gray-500 mt-6">
          By verifying your email, you agree to our Terms of Service and Privacy
          Policy
        </p>
      </div>
    </div>
  );
};

export default VerifyEmailPage;
