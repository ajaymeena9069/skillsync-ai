// client/src/pages/marketing/LandingPage.jsx
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import {
  ArrowRight,
  CheckCircle2,
  Star,
  Sparkles,
  Upload,
  Target,
  TrendingUp,
  Award,
  MessageSquare,
  Users,
  Clock,
  Zap,
  Shield,
  BarChart3,
  Briefcase,
  Brain,
  Rocket,
  Building2,
} from "lucide-react";
import { Button } from "../../components/Button";
import { Card } from "../../components/Card";
import { OptimizedAvatar } from "../../components/common/OptimizedAvatar";
import { Badge } from "../../components/Badge";
import { useGetPublicStatsQuery } from "../../features/landing/landingApi";
import { useGetPublicTestimonialsQuery } from "../../services/testimonialApi";

export function LandingPage() {
  const navigate = useNavigate();
  const { data: statsRes } = useGetPublicStatsQuery();
  const publicStats = statsRes?.data;
  
  const { data: testimonialsRes } = useGetPublicTestimonialsQuery();
  const dynamicTestimonials = testimonialsRes?.data || [];

  const { isAuthenticated, user } = useSelector((state) => state.auth);
  const isRecruiter = user?.role === 'recruiter';

  const stats = [
    {
      value: publicStats ? publicStats.jobs : "...",
      label: "Active Jobs",
      icon: Briefcase,
      color: "from-purple-500 to-indigo-500",
    },
    {
      value: publicStats ? publicStats.candidates : "...",
      label: "Candidates",
      icon: Users,
      color: "from-blue-500 to-cyan-500",
    },
    {
      value: publicStats ? publicStats.applications : "...",
      label: "Applications Processed",
      icon: CheckCircle2,
      color: "from-emerald-500 to-teal-500",
    },
    {
      value: publicStats ? publicStats.companies : "...",
      label: "Companies Hiring",
      icon: Building2,
      color: "from-amber-500 to-orange-500",
    },
  ];

  const features = [
    {
      icon: Sparkles,
      title: "AI Resume Parsing",
      description:
        "Upload your resume and our AI extracts skills, experience, and qualifications instantly.",
      color: "from-purple-500 to-indigo-500",
    },
    {
      icon: Target,
      title: "Smart Job Matching",
      description:
        "Get personalized job matches with AI-powered match scores based on your skills.",
      color: "from-blue-500 to-cyan-500",
    },
    {
      icon: TrendingUp,
      title: "Skill Gap Analysis",
      description:
        "Compare your skills with job requirements and identify what to learn next.",
      color: "from-emerald-500 to-teal-500",
    },
    {
      icon: Users,
      title: "Recruiter Dashboard",
      description:
        "Manage candidates, review applications, and track hiring pipeline.",
      color: "from-amber-500 to-orange-500",
    },
    {
      icon: MessageSquare,
      title: "Real-time Updates",
      description:
        "Get instant notifications for job matches and application status changes.",
      color: "from-pink-500 to-rose-500",
    },
    {
      icon: Shield,
      title: "Secure Authentication",
      description:
        "Email verification, JWT tokens, and Google OAuth for secure access.",
      color: "from-sky-500 to-blue-500",
    },
  ];

  const steps = [
    {
      number: "01",
      title: "Upload Resume",
      description: "Upload your resume in PDF or DOC format",
      icon: Upload,
    },
    {
      number: "02",
      title: "AI Analysis",
      description: "AI extracts your skills and experience",
      icon: Sparkles,
    },
    {
      number: "03",
      title: "Find Matches",
      description: "Get personalized job recommendations",
      icon: Target,
    },
    {
      number: "04",
      title: "Apply & Track",
      description: "Apply to jobs and track application status",
      icon: CheckCircle2,
    },
  ];

  const testimonials = [
    {
      name: "Sarah Chen",
      role: "Full Stack Developer",
      avatar: "👩",
      content:
        "The AI resume parsing instantly identified my skills. The match score helped me find relevant jobs quickly.",
      rating: 5,
    },
    {
      name: "Michael Rodriguez",
      role: "Frontend Developer",
      avatar: "👨",
      content:
        "The skill gap analysis showed me exactly what technologies I need to learn. Very helpful!",
      rating: 5,
    },
    {
      name: "Emily Thompson",
      role: "Tech Recruiter",
      avatar: "👩",
      content:
        "The recruiter dashboard saves me hours. I can review applications and rank candidates efficiently.",
      rating: 5,
    },
  ];

  const displayTestimonials = dynamicTestimonials.length > 0 ? dynamicTestimonials : testimonials;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950">
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-20 pb-32">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 via-transparent to-indigo-500/10" />
        <div className="absolute top-20 right-10 w-72 h-72 bg-purple-500/20 rounded-full blur-3xl" />
        <div className="absolute bottom-20 left-10 w-72 h-72 bg-indigo-500/20 rounded-full blur-3xl" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-4xl mx-auto mb-16">
            <Badge variant="primary" className="mb-6 px-4 py-2 text-sm gap-2">
              <Sparkles className="w-4 h-4" />
              Powered by Gemini AI
            </Badge>
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-gray-900 dark:text-white mb-6 leading-tight">
              AI-Powered
              <br />
              <span className="bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent">
                Career Growth Platform
              </span>
            </h1>
            <p className="text-lg md:text-xl text-gray-600 dark:text-gray-400 mb-8 max-w-3xl mx-auto">
              Upload your resume, get AI-powered job matches, analyze skill
              gaps, and track your applications — all in one place.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                onClick={() => navigate(isAuthenticated ? (isRecruiter ? "/app/recruiter-dashboard" : "/app/dashboard") : "/auth")}
                size="lg"
                className="gap-2"
              >
                {isAuthenticated ? "Go to Dashboard" : "Get Started Free"} <ArrowRight className="w-5 h-5" />
              </Button>
              {!isRecruiter && (
                <Button
                  variant="outline"
                  size="lg"
                  className="gap-2"
                  onClick={() => navigate("/app/jobs")}
                >
                  Browse Jobs <ArrowRight className="w-5 h-5" />
                </Button>
              )}
            </div>
            

            <p className="text-sm text-gray-500 dark:text-gray-500 mt-6">
              Free to use • AI-powered insights • MERN Stack Project
            </p>
          </div>

          <div className="relative max-w-5xl mx-auto">
            <div className="absolute inset-0 bg-gradient-to-r from-purple-500/20 to-indigo-500/20 blur-3xl" />
            <Card className="relative overflow-hidden border border-gray-200 dark:border-gray-700/50 shadow-xl">
              <div className="bg-gradient-to-br from-gray-50 to-white dark:from-gray-800/80 dark:to-gray-900/80 p-8 text-center">
                <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-purple-600 to-indigo-600 flex items-center justify-center mx-auto mb-4 shadow-lg">
                  <BarChart3 className="w-10 h-10 text-white" />
                </div>
                <p className="text-gray-500 dark:text-gray-400">
                  Recruiter Dashboard Preview
                </p>
              </div>
            </Card>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 border-t border-b border-gray-200 dark:border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {stats.map((stat, i) => {
              const Icon = stat.icon;
              return (
                <div key={i} className="text-center">
                  <div
                    className={`w-12 h-12 rounded-xl bg-gradient-to-r ${stat.color} flex items-center justify-center mx-auto mb-3 shadow-md`}
                  >
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  <div className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
                    {stat.value}
                  </div>
                  <div className="text-sm text-gray-500 dark:text-gray-400">
                    {stat.label}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="relative py-24 overflow-hidden">
        {/* Ambient background for light mode glass effect */}
        <div className="absolute top-1/4 left-0 w-[500px] h-[500px] bg-purple-200/40 dark:bg-purple-900/10 rounded-full blur-3xl -z-10" />
        <div className="absolute bottom-1/4 right-0 w-[500px] h-[500px] bg-indigo-200/40 dark:bg-indigo-900/10 rounded-full blur-3xl -z-10" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 z-10">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <Badge variant="primary" className="mb-4">
              Features
            </Badge>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Everything You Need to
              <span className="bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent">
                {" "}
                Advance Your Career
              </span>
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-400">
              Powerful AI-driven features for job seekers and recruiters
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, i) => {
              const Icon = feature.icon;
              return (
                <Card key={i} className="p-6 hover:shadow-2xl transition-all duration-300 border border-white/60 dark:border-purple-900/50 bg-white/60 dark:bg-gray-900/50 backdrop-blur-2xl hover:-translate-y-1 shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-none group">
                  <div
                    className={`w-12 h-12 rounded-xl bg-gradient-to-r ${feature.color} flex items-center justify-center mb-4 shadow-md`}
                  >
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {feature.description}
                  </p>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-24 bg-white/50 dark:bg-gray-800/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <Badge variant="primary" className="mb-4">
              How It Works
            </Badge>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Simple Steps to
              <span className="bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent">
                {" "}
                Career Success
              </span>
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-400">
              Four simple steps to find your next job opportunity
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {steps.map((step, i) => {
              const Icon = step.icon;
              return (
                <div key={i} className="text-center">

                  <div className="w-12 h-12 rounded-full bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center mx-auto mb-3">
                    <Icon className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                  </div>
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-1">
                    {step.title}
                  </h3>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {step.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="relative py-24 overflow-hidden">
        {/* Ambient background for light mode glass effect */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-3/4 h-3/4 bg-purple-200/30 dark:bg-purple-900/10 rounded-full blur-3xl -z-10" />
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 z-10">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <Badge variant="primary" className="mb-4">
              Testimonials
            </Badge>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Trusted by Job Seekers
              <span className="bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent">
                {" "}
                & Recruiters
              </span>
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-400">
              Real feedback from our users
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {displayTestimonials.map((testimonial, i) => (
              <Card key={i} className="p-6 hover:shadow-2xl transition-all duration-300 border border-white/60 dark:border-purple-900/50 bg-white/60 dark:bg-gray-900/50 backdrop-blur-2xl hover:-translate-y-1 shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-none">
                <div className="flex gap-1 mb-4">
                  {[...Array(testimonial.rating || 5)].map((_, i) => (
                    <Star
                      key={i}
                      className="w-5 h-5 fill-amber-500 text-amber-500"
                    />
                  ))}
                </div>
                <p className="text-gray-600 dark:text-gray-400 mb-6">
                  {testimonial.content}
                </p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full">
                    <OptimizedAvatar 
                      src={testimonial.avatar?.startsWith("http") ? testimonial.avatar : null} 
                      alt={testimonial.name} 
                      fallbackText={testimonial.avatar && !testimonial.avatar.startsWith("http") ? testimonial.avatar : testimonial.name?.charAt(0)?.toUpperCase() || "👩"}
                      className="w-full h-full border border-gray-200 dark:border-gray-700"
                      size={100}
                    />
                  </div>
                  <div>
                    <div className="font-semibold text-gray-900 dark:text-white">
                      {testimonial.name}
                    </div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">
                      {testimonial.role}
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <Card className="relative overflow-hidden p-12 text-center border border-purple-100 dark:border-purple-900/50 shadow-xl bg-white/50 dark:bg-gray-900/50 backdrop-blur-xl">
            {/* Background glowing orbs */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-purple-500/20 rounded-full blur-3xl -z-10" />
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-indigo-500/20 rounded-full blur-3xl -z-10" />

            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gray-900 dark:text-white">
              Start Your Career Journey Today
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-400 mb-8 max-w-2xl mx-auto">
              Experience AI-powered job matching and skill analysis — completely
              free.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center relative z-10">
              <Button
                onClick={() => navigate(isAuthenticated ? (isRecruiter ? "/app/recruiter-dashboard" : "/app/dashboard") : "/auth")}
                size="lg"
                className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-purple-500/25 border-transparent gap-2"
              >
                {isAuthenticated ? "Go to Dashboard" : "Get Started Free"} <ArrowRight className="w-5 h-5" />
              </Button>
              {!isRecruiter && (
                <Button
                  variant="outline"
                  size="lg"
                  className="border-purple-200 text-purple-700 hover:bg-purple-50 dark:border-purple-800/50 dark:text-purple-300 dark:hover:bg-purple-900/20 hover:scale-105 transition-all duration-300 gap-2"
                  onClick={() => navigate("/app/jobs")}
                >
                  Explore Jobs <ArrowRight className="w-5 h-5" />
                </Button>
              )}
            </div>
            <div className="flex flex-wrap items-center justify-center gap-6 mt-8 text-sm text-gray-500 dark:text-gray-400">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-purple-500" /> Free to use
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-purple-500" /> AI-powered matching
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-purple-500" /> Instant results
              </div>
            </div>
          </Card>
        </div>
      </section>
    </div>
  );
}
