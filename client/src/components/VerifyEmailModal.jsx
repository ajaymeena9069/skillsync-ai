import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { Mail, CheckCircle, AlertCircle, RefreshCw, X } from "lucide-react";
import {
  useVerifyEmailMutation,
  useResendVerificationCodeMutation,
} from "../services/authApi";
import { setCredentials } from "../features/auth/authSlice";
import { saveAccessToken, saveUser } from "../features/auth/authUtils";

const VerifyEmailModal = ({ email, onClose, onSuccess }) => {
  const [verificationCode, setVerificationCode] = useState([
    "",
    "",
    "",
    "",
    "",
    "",
  ]);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [resendCountdown, setResendCountdown] = useState(0);
  const [resendMessage, setResendMessage] = useState("");

  const dispatch = useDispatch();
  const [verifyEmail] = useVerifyEmailMutation();
  const [resendCode] = useResendVerificationCodeMutation();

  // Countdown timer for resend button
  useEffect(() => {
    if (resendCountdown > 0) {
      const timer = setTimeout(
        () => setResendCountdown(resendCountdown - 1),
        1000,
      );
      return () => clearTimeout(timer);
    }
  }, [resendCountdown]);

  const handleCodeChange = (index, value) => {
    if (value.length > 1) return;

    const newCode = [...verificationCode];
    newCode[index] = value;
    setVerificationCode(newCode);

    // Auto-focus next input
    if (value && index < 5) {
      const nextInput = document.getElementById(`code-${index + 1}`);
      if (nextInput) nextInput.focus();
    }
  };

  const handleKeyDown = (index, e) => {
    // Handle backspace to go to previous input
    if (e.key === "Backspace" && !verificationCode[index] && index > 0) {
      const prevInput = document.getElementById(`code-${index - 1}`);
      if (prevInput) prevInput.focus();
    }
  };

  const handleVerify = async (e) => {
    e.preventDefault();
    if (isSubmitting) return;

    const code = verificationCode.join("");
    if (code.length !== 6) {
      setError("Please enter the 6-digit verification code");
      return;
    }

    setIsSubmitting(true);
    setError("");
    setSuccess("");

    try {
      const result = await verifyEmail({
        email,
        verificationCode: code,
      }).unwrap();

      // Save token and user data
      saveAccessToken(result.token);
      saveUser(result.data);
      dispatch(
        setCredentials({ user: result.data, accessToken: result.token }),
      );

      setSuccess(result.message);
      setResendMessage("");

      // Call success callback and close modal after 1.5 seconds
      setTimeout(() => {
        if (onSuccess) onSuccess(result.data);
        onClose();
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
      setResendMessage("✅ New verification code sent to your email!");
      setResendCountdown(60); // 60 seconds cooldown
    } catch (err) {
      setError(
        err?.data?.message || "Failed to resend code. Please try again.",
      );
    } finally {
      setIsResending(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full animate-in fade-in zoom-in duration-200">
        {/* Header */}
        <div className="relative bg-gradient-to-r from-purple-600 to-indigo-600 rounded-t-2xl p-6 text-white">
          <button
            onClick={onClose}
            className="absolute right-4 top-4 text-white/80 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
          <div className="flex justify-center mb-4">
            <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center">
              <Mail className="w-8 h-8" />
            </div>
          </div>
          <h2 className="text-2xl font-bold text-center">Verify Your Email</h2>
          <p className="text-center text-white/80 mt-1">
            Enter the 6-digit code sent to
          </p>
          <p className="text-center font-medium mt-1">{email}</p>
        </div>

        {/* Content */}
        <form onSubmit={handleVerify} className="p-6 space-y-6">
          {/* 6-Digit Code Inputs */}
          <div className="flex justify-center gap-2 sm:gap-3">
            {verificationCode.map((digit, index) => (
              <input
                key={index}
                id={`code-${index}`}
                type="text"
                maxLength={1}
                value={digit}
                onChange={(e) => handleCodeChange(index, e.target.value)}
                onKeyDown={(e) => handleKeyDown(index, e)}
                className="w-12 h-12 sm:w-14 sm:h-14 text-center text-2xl font-bold border-2 rounded-xl focus:border-purple-500 focus:ring-2 focus:ring-purple-200 outline-none transition-all"
                autoFocus={index === 0}
              />
            ))}
          </div>

          {/* Error Message */}
          {error && (
            <div className="flex items-center gap-2 p-3 bg-red-50 text-red-700 rounded-xl">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span className="text-sm">{error}</span>
            </div>
          )}

          {/* Success Message */}
          {success && (
            <div className="flex items-center gap-2 p-3 bg-green-50 text-green-700 rounded-xl">
              <CheckCircle className="w-4 h-4 flex-shrink-0" />
              <span className="text-sm">{success}</span>
            </div>
          )}

          {/* Resend Message */}
          {resendMessage && (
            <div className="text-center text-sm text-green-600">
              {resendMessage}
            </div>
          )}

          {/* Verify Button */}
          <button
            type="submit"
            disabled={isSubmitting || verificationCode.join("").length !== 6}
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

          {/* Resend Link */}
          <div className="text-center">
            <button
              type="button"
              onClick={handleResendCode}
              disabled={isResending || resendCountdown > 0}
              className="text-sm text-purple-600 hover:text-purple-700 disabled:text-gray-400 disabled:cursor-not-allowed inline-flex items-center gap-1"
            >
              <RefreshCw
                className={`w-3 h-3 ${isResending ? "animate-spin" : ""}`}
              />
              {resendCountdown > 0
                ? `Resend code in ${resendCountdown}s`
                : "Resend verification code"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default VerifyEmailModal;
