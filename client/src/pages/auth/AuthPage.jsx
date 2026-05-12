import { useState } from "react";
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
import { useLoginMutation, useRegisterMutation } from "../../services/authApi";
import { useDispatch } from "react-redux";
import { setCredentials } from "../../features/auth/authSlice";
import { saveAccessToken, saveUser } from "../../features/auth/authUtils";
import { useNavigate } from "react-router-dom";
import { USER_ROLES } from "../../features/auth/authConstants";
import { useGoogleLogin } from "@react-oauth/google";

export function AuthPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [userType, setUserType] = useState(USER_ROLES.USER);
  const [isLogin, setIsLogin] = useState(true);
  const [error, setError] = useState("");
  const [user, setUser] = useState({
    name: "",
    email: "",
    password: "",
  });

  const [login] = useLoginMutation();
  const [register] = useRegisterMutation();
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

      saveAccessToken(response.token);
      saveUser(response.data);

      dispatch(
        setCredentials({ user: response.data, accessToken: response.token }),
      );

      navigate("/app/dashboard");
    } catch (err) {
      setError(err?.data?.message || "Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const googleLogin = useGoogleLogin({
    onSuccess: (tokenResponse) => {
      console.log(tokenResponse);
    },
    onError: () => {
      console.log("Google Login Failed");
    },
  });

  return (
    <div className="min-h-screen flex">
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

          {/* Role Selector — only shown on register */}
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
              required
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

            <div className="grid grid-cols-2 gap-3">
              <Button
                type="button"
                variant="outline"
                onClick={() => googleLogin()}
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path
                    fill="currentColor"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="currentColor"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="currentColor"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  />
                  <path
                    fill="currentColor"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  />
                </svg>
                Google
              </Button>
              <Button type="button" variant="outline">
                <svg
                  className="w-5 h-5"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
                </svg>
                GitHub
              </Button>
            </div>
          </form>

          <p className="mt-6 text-center text-sm text-muted-foreground">
            {isLogin ? "Don't have an account? " : "Already have an account? "}
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
  );
}
