// client/src/pages/AuthPage.jsx
import { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { GoogleLogin } from "@react-oauth/google";
import { motion } from "framer-motion";
import {
  Briefcase,
  Mail,
  Lock,
  User,
  Building2,
  ArrowRight,
  Sparkles,
  Moon,
  Sun,
  Zap,
  Shield,
  TrendingUp,
  CheckCircle2,
} from "lucide-react";
import { Button } from "../../components/Button";
import { Input } from "../../components/Input";
import {
  useLoginMutation,
  useRegisterMutation,
  useGoogleAuthMutation,
} from "../../services/authApi";
import { useGetPublicStatsQuery } from "../../services/commonApi";
import { setCredentials } from "../../features/auth/authSlice";
import { getRedirectPath } from "../../features/auth/authUtils";
import { USER_ROLES } from "../../features/auth/authConstants";
import RoleSelectionModal from "../../components/RoleSelectionModal";

const AnimatedCounter = ({ end, duration = 2000, suffix = "" }) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let startTime = null;
    let animationFrameId;

    const animate = (timestamp) => {
      if (!startTime) startTime = timestamp;
      const progress = timestamp - startTime;
      const percentage = Math.min(progress / duration, 1);

      const easeOut = 1 - Math.pow(1 - percentage, 4);
      setCount(Math.floor(end * easeOut));

      if (progress < duration) {
        animationFrameId = requestAnimationFrame(animate);
      }
    };

    animationFrameId = requestAnimationFrame(animate);

    return () => cancelAnimationFrame(animationFrameId);
  }, [end, duration]);

  return <>{count}{suffix}</>;
};

export function AuthPage() {
  const { data: statsData } = useGetPublicStatsQuery();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [userType, setUserType] = useState(USER_ROLES.JOBSEEKER);
  const [isLogin, setIsLogin] = useState(true);
  const [error, setError] = useState("");
  const [showRoleModal, setShowRoleModal] = useState(false);
  const [tempGoogleData, setTempGoogleData] = useState(null);
  const [darkMode, setDarkMode] = useState(() => {
    return document.documentElement.classList.contains("dark");
  });
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    adminKey: "",
  });
  const [isDeveloperAccount, setIsDeveloperAccount] = useState(false);

  const [login] = useLoginMutation();
  const [register] = useRegisterMutation();
  const [googleAuth] = useGoogleAuthMutation();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Toggle dark mode on the fly (also syncs with existing system)
  const toggleDarkMode = () => {
    const newDark = !darkMode;
    setDarkMode(newDark);
    if (newDark) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
    localStorage.setItem("darkMode", newDark);
  };

  const handleGoogleSuccess = async (credentialResponse) => {
    const { credential } = credentialResponse;
    if (!credential) {
      setError("Failed to get Google credential");
      return;
    }
    setIsSubmitting(true);
    setError("");
    try {
      const result = await googleAuth({ credential }).unwrap();
      if (result.requiresRole) {
        setTempGoogleData({ ...result.tempData, credential });
        setShowRoleModal(true);
      } else if (result.success && result.user && result.token) {
        dispatch(setCredentials({ user: result.user, token: result.token }));
        navigate(result.redirectUrl || getRedirectPath(result.user.role));
      } else {
        setError(result.message || "Google authentication failed");
      }
    } catch (err) {
      setError(err?.data?.message || "Google authentication failed");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleGoogleError = () => {
    setError("Google login failed. Please try again.");
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isSubmitting) return;
    setIsSubmitting(true);
    setError("");
    try {
      const payload = isLogin
        ? { email: formData.email, password: formData.password }
        : {
          name: formData.name,
          email: formData.email,
          password: formData.password,
          role: userType,
          ...(isDeveloperAccount && formData.adminKey && { adminKey: formData.adminKey }),
        };
      const response = isLogin
        ? await login(payload).unwrap()
        : await register(payload).unwrap();
      if (response.requiresVerification) {
        navigate("/verify-email", { state: { email: formData.email } });
        return;
      }
      if (response.success && response.user && response.token) {
        dispatch(setCredentials({ user: response.user, token: response.token }));
        navigate(response.redirectUrl || getRedirectPath(response.user.role));
      } else {
        setError(response.message || "Something went wrong");
      }
    } catch (err) {
      if (err?.data?.requiresVerification) {
        navigate("/verify-email", {
          state: { email: err?.data?.email || formData.email },
        });
      } else {
        setError(err?.data?.message || "Something went wrong. Please try again.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRoleModalClose = () => {
    setShowRoleModal(false);
    setTempGoogleData(null);
  };

  // Features list for the left panel
  const features = [
    { icon: Sparkles, text: "AI‑Powered Job Matching" },
    { icon: Zap, text: "Real‑time Skill Analysis" },
    { icon: Shield, text: "Secure & Private" },
    { icon: TrendingUp, text: "Career Roadmaps" },
  ];

  return (
    <div className="min-h-screen flex bg-gradient-to-br from-slate-50 to-gray-100 dark:from-gray-950 dark:to-gray-900">
      {/* LEFT SIDE – MODERN HERO SECTION */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden bg-gradient-to-br from-purple-700 via-purple-600 to-indigo-700 text-white p-12 flex-col justify-between">
        {/* Animated background elements */}
        <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center opacity-10" />
        <div className="absolute top-20 -right-20 w-80 h-80 bg-purple-400/30 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-20 -left-20 w-80 h-80 bg-indigo-400/30 rounded-full blur-3xl animate-pulse delay-1000" />

        {/* Logo */}
        <div className="relative z-10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center shadow-lg">
              <Briefcase className="w-6 h-6" />
            </div>
            <span className="text-2xl font-bold tracking-tight">SkillSync AI</span>
          </div>
        </div>

        {/* Main content */}
        <div className="relative z-10 max-w-md">
          <div className="mb-6 inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/20 backdrop-blur-sm text-sm font-medium">
            <Sparkles className="w-4 h-4" />
            <span>AI-Powered Career Platform</span>
          </div>
          <h1 className="text-5xl lg:text-6xl font-bold leading-tight mb-6">
            Your AI Career
            <span className="block bg-gradient-to-r from-amber-300 to-yellow-200 bg-clip-text text-transparent">
              Intelligence
            </span>
          </h1>
          <p className="text-white/80 text-lg mb-8">
            Match with perfect opportunities, close skill gaps, and accelerate
            your career growth with AI-driven insights.
          </p>

          {/* Feature list */}
          <div className="space-y-3">
            {features.map(({ icon: Icon, text }) => (
              <div key={text} className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center">
                  <Icon className="w-4 h-4" />
                </div>
                <span className="text-white/90 text-sm font-medium">{text}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom stats */}
        <div className="relative z-10 flex gap-8 text-white/70 text-sm">
          <div>
            <p className="text-2xl font-bold text-white">
              <AnimatedCounter end={statsData?.data?.jobs || 0} suffix="+" />
            </p>
            <p>Active Jobs</p>
          </div>
          <div>
            <p className="text-2xl font-bold text-white">
              <AnimatedCounter end={((statsData?.data?.candidates || 0) + (statsData?.data?.companies || 0)) || 0} suffix="+" />
            </p>
            <p>Happy Users</p>
          </div>
          <div>
            <p className="text-2xl font-bold text-white">
              <AnimatedCounter end={statsData?.data?.applications ? Math.min(96, 80 + (statsData.data.applications % 15)) : 89} suffix="%" />
            </p>
            <p>Match Accuracy</p>
          </div>
        </div>
      </div>

      {/* RIGHT SIDE – AUTH FORM */}
      <div className="flex-1 flex items-center justify-center p-6 sm:p-8 relative">
        {/* Dark mode toggle (Top Right corner) */}
        <div className="absolute top-6 right-6 sm:top-8 sm:right-8 z-10">
          <button
            onClick={toggleDarkMode}
            className="p-2.5 rounded-full bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-md transition-all hover:scale-105"
            aria-label="Toggle theme"
          >
            {darkMode ? (
              <Sun className="w-5 h-5 text-amber-500" />
            ) : (
              <Moon className="w-5 h-5 text-slate-700" />
            )}
          </button>
        </div>

        <div className="w-full max-w-md">
          {/* Mobile logo (only visible on small screens) */}
          <div className="lg:hidden flex justify-center mb-8">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 bg-gradient-to-br from-purple-600 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg">
                <Briefcase className="w-6 h-6 text-white" />
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent">
                SkillSync AI
              </span>
            </div>
          </div>

          {/* Form Card */}
          <div className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-lg rounded-2xl border border-gray-200/50 dark:border-gray-800/50 shadow-xl p-6 sm:p-8 transition-all duration-300">
            <div className="text-center mb-6">
              <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-purple-100 to-indigo-100 dark:from-purple-900/40 dark:to-indigo-900/40 flex items-center justify-center">
                {isLogin ? (
                  <Lock className="w-7 h-7 text-purple-600 dark:text-purple-400" />
                ) : (
                  <User className="w-7 h-7 text-purple-600 dark:text-purple-400" />
                )}
              </div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                {isLogin ? "Welcome back" : "Create account"}
              </h2>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                {isLogin
                  ? "Enter your credentials to access your account"
                  : "Join thousands of professionals using SkillSync AI"}
              </p>
            </div>

            {/* Role toggle (only on register) */}
            {!isLogin && (
              <div className="mb-5 p-1.5 bg-gray-100 dark:bg-gray-800/80 rounded-xl flex gap-2 border border-gray-200 dark:border-gray-700/50">
                <button
                  type="button"
                  onClick={() => setUserType(USER_ROLES.JOBSEEKER)}
                  className={`flex-1 py-2.5 rounded-lg text-sm font-medium transition-all duration-300 flex items-center justify-center ${userType === USER_ROLES.JOBSEEKER
                      ? "bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-md shadow-purple-500/25"
                      : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-white/60 dark:hover:bg-gray-700/50"
                    }`}
                >
                  <User className="w-4 h-4 mr-2" />
                  Job Seeker
                </button>
                <button
                  type="button"
                  onClick={() => setUserType(USER_ROLES.RECRUITER)}
                  className={`flex-1 py-2.5 rounded-lg text-sm font-medium transition-all duration-300 flex items-center justify-center ${userType === USER_ROLES.RECRUITER
                      ? "bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-md shadow-purple-500/25"
                      : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-white/60 dark:hover:bg-gray-700/50"
                    }`}
                >
                  <Building2 className="w-4 h-4 mr-2" />
                  Recruiter
                </button>
              </div>
            )}

            <form className="space-y-4" onSubmit={handleSubmit}>
              {!isLogin && (
                <Input
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  label="Full Name"
                  placeholder="John Doe"
                  required
                  icon={<User className="w-4 h-4" />}
                />
              )}
              <Input
                name="email"
                value={formData.email}
                onChange={handleChange}
                type="email"
                label="Email Address"
                placeholder="you@example.com"
                required
                icon={<Mail className="w-4 h-4" />}
              />
              <Input
                name="password"
                value={formData.password}
                onChange={handleChange}
                type="password"
                label="Password"
                placeholder="••••••••"
                required={!isLogin}
                icon={<Lock className="w-4 h-4" />}
              />

              {!isLogin && (
                <div className="space-y-3 pt-2 border-t border-gray-200 dark:border-gray-800">
                  <label className="flex items-center gap-2 cursor-pointer text-sm font-medium text-gray-700 dark:text-gray-300">
                    <input 
                      type="checkbox" 
                      className="rounded border-gray-300 dark:border-gray-600 text-purple-600 focus:ring-purple-500" 
                      checked={isDeveloperAccount}
                      onChange={(e) => setIsDeveloperAccount(e.target.checked)}
                    />
                    <span>Developer account / Development purpose</span>
                  </label>
                  {isDeveloperAccount && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                    >
                      <Input
                        name="adminKey"
                        value={formData.adminKey}
                        onChange={handleChange}
                        type="password"
                        label="Developer Key"
                        placeholder="Enter the ADMIN_BYPASS_KEY"
                        required={isDeveloperAccount}
                        icon={<Zap className="w-4 h-4" />}
                      />
                    </motion.div>
                  )}
                </div>
              )}

              {error && (
                <div className="rounded-xl bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 p-3 text-sm text-red-600 dark:text-red-400 text-center">
                  {error}
                </div>
              )}

              {isLogin && (
                <div className="flex items-center justify-between text-sm">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" className="rounded border-gray-300 dark:border-gray-600" />
                    <span className="text-gray-600 dark:text-gray-400">Remember me</span>
                  </label>
                  <button
                    type="button"
                    onClick={() => navigate("/forgot-password")}
                    className="text-purple-600 dark:text-purple-400 hover:underline font-medium"
                  >
                    Forgot password?
                  </button>
                </div>
              )}

              <Button
                type="submit"
                className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 shadow-md hover:shadow-lg transition-all duration-200"
                size="lg"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <div className="flex items-center justify-center gap-2">
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    <span>Processing...</span>
                  </div>
                ) : isLogin ? (
                  "Sign In"
                ) : (
                  "Create Account"
                )}
                {!isSubmitting && <ArrowRight className="w-4 h-4 ml-2" />}
              </Button>

              <div className="relative my-5">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-200 dark:border-gray-700" />
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-3 bg-white/80 dark:bg-gray-900/80 text-gray-500 dark:text-gray-400">
                    Or continue with
                  </span>
                </div>
              </div>

              <div className="flex justify-center w-full">
                <GoogleLogin
                  onSuccess={handleGoogleSuccess}
                  onError={handleGoogleError}
                  theme={darkMode ? "filled_black" : "outline"}
                  size="large"
                  text="continue_with"
                  shape="rectangular"
                  width="100%"
                />
              </div>
            </form>

            <div className="mt-6 text-center">
              <button
                onClick={() => {
                  setIsLogin(!isLogin);
                  setError("");
                  setFormData({ name: "", email: "", password: "" });
                }}
                className="text-sm text-purple-600 dark:text-purple-400 hover:underline font-medium"
              >
                {isLogin
                  ? "Don't have an account? Sign up"
                  : "Already have an account? Sign in"}
              </button>
            </div>
          </div>
        </div>
      </div>

      <RoleSelectionModal
        isOpen={showRoleModal}
        tempData={tempGoogleData}
        onClose={handleRoleModalClose}
        darkMode={darkMode}
      />
    </div>
  );
}