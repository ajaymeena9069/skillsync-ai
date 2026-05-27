import { useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { GoogleLogin } from "@react-oauth/google";
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
} from "lucide-react";
import { Button } from "../../components/Button";
import { Input } from "../../components/Input";
import {
  useLoginMutation,
  useRegisterMutation,
  useGoogleAuthMutation,
} from "../../services/authApi";
import { setCredentials } from "../../features/auth/authSlice";
import {
  saveAccessToken,
  saveUser,
  getRedirectPath,
} from "../../features/auth/authUtils";
import { USER_ROLES } from "../../features/auth/authConstants";
import RoleSelectionModal from "../../components/RoleSelectionModal";

export function AuthPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [userType, setUserType] = useState(USER_ROLES.USER);
  const [isLogin, setIsLogin] = useState(true);
  const [error, setError] = useState("");
  const [showRoleModal, setShowRoleModal] = useState(false);
  const [tempGoogleData, setTempGoogleData] = useState(null);
  const [darkMode, setDarkMode] = useState(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("darkMode");
      const prefersDark = window.matchMedia(
        "(prefers-color-scheme: dark)",
      ).matches;
      return saved ? JSON.parse(saved) : prefersDark;
    }
    return false;
  });
  const [user, setUser] = useState({
    name: "",
    email: "",
    password: "",
  });

  const [login] = useLoginMutation();
  const [register] = useRegisterMutation();
  const [googleAuth] = useGoogleAuthMutation();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Apply dark mode class
  useState(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
    localStorage.setItem("darkMode", JSON.stringify(darkMode));
  }, [darkMode]);

  const handleOnChange = (e) => {
    const { name, value } = e.target;
    setUser((prev) => ({ ...prev, [name]: value }));
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    if (isSubmitting) return;
    setIsSubmitting(true);
    setError("");

    try {
      const payload = isLogin
        ? { email: user.email, password: user.password }
        : {
            name: user.name,
            email: user.email,
            password: user.password,
            role: userType,
          };

      const response = isLogin
        ? await login(payload).unwrap()
        : await register(payload).unwrap();

      if (response.data?.requiresVerification) {
        navigate("/verify-email", { state: { email: user.email } });
        return;
      }

      saveAccessToken(response.token);
      saveUser(response.data);
      dispatch(
        setCredentials({ user: response.data, accessToken: response.token }),
      );
      navigate(getRedirectPath(response.data?.role));
    } catch (err) {
      if (err?.data?.requiresVerification) {
        navigate("/verify-email", {
          state: { email: err?.data?.email || user.email },
        });
      } else {
        setError(
          err?.data?.message || "Something went wrong. Please try again.",
        );
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleGoogleSuccess = async (credentialResponse) => {
    console.log("Google Credential Response:", credentialResponse);

    setIsSubmitting(true);
    setError("");

    try {
      const result = await googleAuth({
        idToken: credentialResponse.credential,
      }).unwrap();

      console.log("Backend Response:", result);

      if (result.requiresRole) {
        setTempGoogleData({
          ...result.tempData,
          idToken: credentialResponse.credential,
        });
        setShowRoleModal(true);
      } else {
        saveAccessToken(result.token);
        saveUser(result.data);
        dispatch(
          setCredentials({ user: result.data, accessToken: result.token }),
        );
        navigate(getRedirectPath(result.data?.role));
      }
    } catch (err) {
      console.error("Google auth error:", err);
      setError(err?.data?.message || "Google authentication failed");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleGoogleError = () => {
    console.error("Google login failed");
    setError("Google login failed. Please try again.");
    setIsSubmitting(false);
  };

  const handleRoleModalClose = () => {
    setShowRoleModal(false);
    setTempGoogleData(null);
  };

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  return (
    <>
      <div className="min-h-screen flex bg-gradient-to-br from-gray-50 via-white to-gray-50 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950">
        {/* Dark Mode Toggle Button */}
        <button
          onClick={toggleDarkMode}
          className="fixed top-4 right-4 z-50 p-2 rounded-xl bg-white dark:bg-gray-800 shadow-md hover:shadow-lg transition-all duration-300 border border-gray-200 dark:border-gray-700"
        >
          {darkMode ? (
            <Sun className="w-5 h-5 text-amber-500" />
          ) : (
            <Moon className="w-5 h-5 text-slate-700" />
          )}
        </button>

        {/* Left Hero Section */}
        <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-purple-600 via-purple-500 to-indigo-600 p-12 flex-col justify-between relative overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,rgba(255,255,255,0.1),transparent_50%)]" />

          {/* Floating particles effect */}
          <div className="absolute top-20 left-10 w-64 h-64 bg-white/10 rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-white/5 rounded-full blur-3xl animate-pulse delay-1000" />

          <div className="relative z-10">
            <div className="flex items-center gap-2 text-white">
              <div className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center shadow-lg">
                <Briefcase className="w-6 h-6" />
              </div>
              <span className="text-2xl font-bold">SkillSync AI</span>
            </div>
          </div>

          <div className="relative z-10">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/20 backdrop-blur-sm text-white text-sm mb-6">
              <Sparkles className="w-4 h-4" />
              <span>AI-Powered Platform</span>
            </div>
            <h1 className="text-5xl font-bold text-white mb-4">
              Your AI-Powered Career Partner
            </h1>
            <p className="text-xl text-white/90 mb-8">
              Match with perfect opportunities, close skill gaps, and accelerate
              your career growth with AI-driven insights.
            </p>
            <div className="grid grid-cols-2 gap-4">
              {[
                "Smart Job Matching",
                "AI Resume Analysis",
                "Skill Gap Insights",
                "Personalized Roadmaps",
              ].map((feature) => (
                <div
                  key={feature}
                  className="flex items-center gap-2 text-white/90"
                >
                  <div className="w-5 h-5 bg-white/20 rounded-full flex items-center justify-center">
                    <div className="w-2 h-2 bg-white rounded-full" />
                  </div>
                  <span className="text-sm">{feature}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="absolute bottom-0 right-0 w-96 h-96 bg-white/5 rounded-full blur-3xl -mb-48 -mr-48" />
        </div>

        {/* Right Auth Form */}
        <div className="flex-1 flex items-center justify-center p-4 sm:p-8">
          <div className="w-full max-w-md">
            {/* Mobile Logo */}
            <div className="lg:hidden flex justify-center mb-8">
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 bg-gradient-to-br from-purple-600 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg">
                  <Briefcase className="w-6 h-6 text-white" />
                </div>
                <span className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent">
                  SkillSync AI
                </span>
              </div>
            </div>

            <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl border border-gray-100 dark:border-gray-800 p-6 sm:p-8 shadow-xl">
              <div className="mb-6 text-center">
                <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                  {isLogin ? "Welcome Back" : "Get Started"}
                </h2>
                <p className="text-gray-500 dark:text-gray-400">
                  {isLogin
                    ? "Login to continue your journey"
                    : "Create your account and unlock opportunities"}
                </p>
              </div>

              {!isLogin && (
                <div className="mb-6 flex gap-2 p-1 bg-gray-100 dark:bg-gray-800 rounded-xl">
                  <button
                    type="button"
                    onClick={() => setUserType(USER_ROLES.USER)}
                    className={`flex-1 py-2.5 px-4 rounded-lg transition-all duration-200 ${
                      userType === USER_ROLES.USER
                        ? "bg-white dark:bg-gray-800 shadow-sm text-gray-900 dark:text-white font-medium"
                        : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
                    }`}
                  >
                    <User className="w-4 h-4 inline mr-2" />
                    Job Seeker
                  </button>
                  <button
                    type="button"
                    onClick={() => setUserType(USER_ROLES.RECRUITER)}
                    className={`flex-1 py-2.5 px-4 rounded-lg transition-all duration-200 ${
                      userType === USER_ROLES.RECRUITER
                        ? "bg-white dark:bg-gray-800 shadow-sm text-gray-900 dark:text-white font-medium"
                        : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
                    }`}
                  >
                    <Building2 className="w-4 h-4 inline mr-2" />
                    Recruiter
                  </button>
                </div>
              )}

              <form className="space-y-4" onSubmit={handleFormSubmit}>
                {!isLogin && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Full Name
                    </label>
                    <input
                      name="name"
                      value={user.name}
                      onChange={handleOnChange}
                      type="text"
                      placeholder="John Doe"
                      required
                      className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 transition-all"
                    />
                  </div>
                )}

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Email Address
                  </label>
                  <input
                    name="email"
                    value={user.email}
                    onChange={handleOnChange}
                    type="email"
                    placeholder="you@example.com"
                    required
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 transition-all"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Password
                  </label>
                  <input
                    name="password"
                    value={user.password}
                    onChange={handleOnChange}
                    type="password"
                    placeholder="••••••••"
                    required={!isLogin}
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 transition-all"
                  />
                </div>

                {error && (
                  <p className="text-sm text-red-500 dark:text-red-400 text-center">
                    {error}
                  </p>
                )}

                {isLogin && (
                  <div className="flex items-center justify-between text-sm">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        className="rounded border-gray-300 dark:border-gray-600"
                      />
                      <span className="text-gray-600 dark:text-gray-400">
                        Remember me
                      </span>
                    </label>
                    <button
                      type="button"
                      onClick={() => navigate("/forgot-password")}
                      className="text-purple-600 dark:text-purple-400 hover:underline"
                    >
                      Forgot password?
                    </button>
                  </div>
                )}

                <Button
                  type="submit"
                  className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700"
                  size="lg"
                  disabled={isSubmitting}
                >
                  {isSubmitting
                    ? "Please wait..."
                    : isLogin
                      ? "Sign In"
                      : "Create Account"}
                  {!isSubmitting && <ArrowRight className="w-4 h-4 ml-2" />}
                </Button>

                <div className="relative my-6">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-gray-200 dark:border-gray-700" />
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="px-2 bg-white dark:bg-gray-950 text-gray-500 dark:text-gray-400">
                      Or continue with
                    </span>
                  </div>
                </div>

                <div className="flex flex-col gap-4">
                  <div className="w-full">
                    <GoogleLogin
                      onSuccess={handleGoogleSuccess}
                      onError={handleGoogleError}
                      useOneTap
                      theme="outline"
                      size="large"
                      text="continue_with"
                      shape="rectangular"
                      width="100%"
                    />
                  </div>
                </div>
              </form>

              <p className="mt-6 text-center text-sm text-gray-500 dark:text-gray-400">
                {isLogin
                  ? "Don't have an account? "
                  : "Already have an account? "}
                <button
                  onClick={() => {
                    setIsLogin(!isLogin);
                    setError("");
                  }}
                  className="text-purple-600 dark:text-purple-400 hover:underline font-medium"
                >
                  {isLogin ? "Sign up" : "Sign in"}
                </button>
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Role Selection Modal (Google first-time users only) */}
      {showRoleModal && (
        <RoleSelectionModal
          tempData={tempGoogleData}
          onClose={handleRoleModalClose}
          darkMode={darkMode}
        />
      )}
    </>
  );
}
