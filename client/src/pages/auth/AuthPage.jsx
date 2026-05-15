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
} from "lucide-react";
import { Button } from "../../components/Button";
import { Input } from "../../components/Input";
import {
  useLoginMutation,
  useRegisterMutation,
  useGoogleAuthMutation,
} from "../../services/authApi";
import { setCredentials } from "../../features/auth/authSlice";
import { saveAccessToken, saveUser } from "../../features/auth/authUtils";
import { USER_ROLES } from "../../features/auth/authConstants";
import RoleSelectionModal from "../../components/RoleSelectionModal";
// REMOVE: import VerifyEmailModal from "../../components/VerifyEmailModal";

export function AuthPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [userType, setUserType] = useState(USER_ROLES.USER);
  const [isLogin, setIsLogin] = useState(true);
  const [error, setError] = useState("");
  const [showRoleModal, setShowRoleModal] = useState(false);
  // REMOVE: const [showVerifyModal, setShowVerifyModal] = useState(false);
  // REMOVE: const [pendingEmail, setPendingEmail] = useState("");
  const [tempGoogleData, setTempGoogleData] = useState(null);
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

      // ✅ UPDATED: Navigate to OTP page instead of showing modal
      if (response.data?.requiresVerification) {
        navigate("/verify-email", { state: { email: user.email } });
        return;
      }

      saveAccessToken(response.token);
      saveUser(response.data);
      dispatch(
        setCredentials({ user: response.data, accessToken: response.token }),
      );
      navigate("/app/dashboard");
    } catch (err) {
      // ✅ UPDATED: Handle unverified email error - navigate to OTP page
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

  // Google Login Handler
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
        navigate("/app/dashboard");
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

  return (
    <>
      <div className="min-h-screen flex">
        {/* Left Hero Section */}
        <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-primary via-primary/90 to-secondary p-12 flex-col justify-between relative overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,rgba(255,255,255,0.1),transparent_50%)]" />
          <div className="relative z-10">
            <div className="flex items-center gap-2 text-white">
              <div className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
                <Briefcase className="w-6 h-6" />
              </div>
              <span className="text-2xl font-bold">SkillSync AI</span>
            </div>
          </div>

          <div className="relative z-10">
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
        <div className="flex-1 flex items-center justify-center p-8 bg-background">
          <div className="w-full max-w-md">
            <div className="mb-8 text-center">
              <h2 className="text-3xl font-bold mb-2">
                {isLogin ? "Welcome Back" : "Get Started"}
              </h2>
              <p className="text-muted-foreground">
                {isLogin
                  ? "Login to continue your journey"
                  : "Create your account and unlock opportunities"}
              </p>
            </div>

            {!isLogin && (
              <div className="mb-6 flex gap-2 p-1 bg-muted rounded-xl">
                <button
                  type="button"
                  onClick={() => setUserType(USER_ROLES.USER)}
                  className={`flex-1 py-2.5 px-4 rounded-lg transition-all duration-200 ${
                    userType === USER_ROLES.USER
                      ? "bg-card shadow-sm text-foreground"
                      : "text-muted-foreground hover:text-foreground"
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
                      ? "bg-card shadow-sm text-foreground"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  <Building2 className="w-4 h-4 inline mr-2" />
                  Recruiter
                </button>
              </div>
            )}

            <form className="space-y-4" onSubmit={handleFormSubmit}>
              {!isLogin && (
                <Input
                  label="Full Name"
                  name="name"
                  value={user.name}
                  onChange={handleOnChange}
                  type="text"
                  placeholder="John Doe"
                  required
                />
              )}
              <Input
                label="Email Address"
                name="email"
                value={user.email}
                onChange={handleOnChange}
                type="email"
                placeholder="you@example.com"
                required
              />
              <Input
                label="Password"
                name="password"
                value={user.password}
                onChange={handleOnChange}
                type="password"
                placeholder="••••••••"
                required={!isLogin}
              />

              {error && (
                <p className="text-sm text-destructive text-center">{error}</p>
              )}

              {isLogin && (
                <div className="flex items-center justify-between text-sm">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" className="rounded" />
                    <span className="text-muted-foreground">Remember me</span>
                  </label>
                  <button
                    type="button"
                    onClick={() => navigate("/forgot-password")}
                    className="text-primary hover:underline"
                  >
                    Forgot password?
                  </button>
                </div>
              )}

              <Button
                type="submit"
                className="w-full"
                size="lg"
                disabled={isSubmitting}
              >
                {isSubmitting
                  ? "Please wait..."
                  : isLogin
                    ? "Sign In"
                    : "Create Account"}
                {!isSubmitting && <ArrowRight className="w-4 h-4" />}
              </Button>

              <div className="relative my-6">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-border" />
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-background text-muted-foreground">
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

            <p className="mt-6 text-center text-sm text-muted-foreground">
              {isLogin
                ? "Don't have an account? "
                : "Already have an account? "}
              <button
                onClick={() => {
                  setIsLogin(!isLogin);
                  setError("");
                }}
                className="text-primary hover:underline font-medium"
              >
                {isLogin ? "Sign up" : "Sign in"}
              </button>
            </p>
          </div>
        </div>
      </div>

      {/* Role Selection Modal (Google first-time users only) */}
      {showRoleModal && (
        <RoleSelectionModal
          tempData={tempGoogleData}
          onClose={handleRoleModalClose}
        />
      )}
    </>
  );
}
