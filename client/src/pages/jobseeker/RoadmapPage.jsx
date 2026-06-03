// client/src/pages/RoadmapPage.jsx
import { useState, useEffect, useRef } from "react";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { AnimatePresence, motion } from "framer-motion";
import {
  Calendar,
  CheckCircle2,
  Circle,
  Clock,
  Target,
  TrendingUp,
  BookOpen,
  Code,
  Award,
  Sparkles,
  ChevronRight,
  Rocket,
  Zap,
  Star,
  Loader2,
  AlertCircle,
  RefreshCw,
  Upload,
  Settings,
  ExternalLink,
  ChevronDown,
  Info,
} from "lucide-react";
import { Card, CardContent } from "../../components/ui/Card";
import { Button } from "../../components/ui/Button";
import { Badge } from "../../components/ui/Badge";
import { PageLoader } from "../../components/PageLoader";
import { useGenerateRoadmapMutation } from "../../services/roadmapApi";
import { useGetAiStatusQuery } from "../../services/aiApi";
import { AiLoadingState } from "../../components/AiLoadingState";

export function RoadmapPage() {
  const navigate = useNavigate();
  const [weeks, setWeeks] = useState(4);
  const [hoursPerWeek, setHoursPerWeek] = useState(10);
  const [showSettings, setShowSettings] = useState(false);
  const [showFullSummary, setShowFullSummary] = useState(false);
  const [showInfo, setShowInfo] = useState(false);

  const resumeSkills = useSelector((state) => state.resume.parsedSkills);
  const hasResume = resumeSkills && resumeSkills.length > 0;

  const { data: statusData, isLoading: isStatusLoading } = useGetAiStatusQuery();
  const [generateRoadmap, { data: roadmapData, isLoading, error }] =
    useGenerateRoadmapMutation();

  const isCachedActive = statusData?.data?.roadmap?.isCached;
  const cachedRoadmap = statusData?.data?.roadmap?.data;
  const cachedMeta = statusData?.data?.roadmap?.meta;
  const lastGeneratedAt = statusData?.data?.roadmap?.lastGeneratedAt;

  let remainingTimeText = "24h";
  if (isCachedActive && lastGeneratedAt) {
    const remainingMs = (24 * 60 * 60 * 1000) - (new Date() - new Date(lastGeneratedAt));
    if (remainingMs > 0) {
      const remainingHours = Math.floor(remainingMs / (1000 * 60 * 60));
      const remainingMinutes = Math.floor((remainingMs % (1000 * 60 * 60)) / (1000 * 60));
      remainingTimeText = remainingHours > 0 ? `${remainingHours}h ${remainingMinutes}m` : `${remainingMinutes}m`;
    }
  }

  const roadmap = roadmapData?.data || cachedRoadmap;
  const weeklyPlan = roadmap?.weeks || [];
  const meta = roadmapData?.meta || cachedMeta;

  useEffect(() => {
    if (roadmapData?.isCached) {
      toast.info(roadmapData.message || "Daily limit reached. Showing latest cached roadmap.");
    }
  }, [roadmapData]);

  const totalWeeks = weeklyPlan.length;
  const totalTasks = weeklyPlan.reduce((acc, w) => acc + (w.tasks?.length || 0), 0);
  const totalHours = weeklyPlan.reduce(
    (acc, w) =>
      acc +
      (w.tasks || []).reduce((sum, t) => sum + parseInt(t.duration || "0", 10), 0),
    0,
  );

  const getTaskTypeIcon = (type) => {
    switch (type) {
      case "Course":
        return BookOpen;
      case "Project":
        return Code;
      case "Practice":
        return Target;
      case "Reading":
        return BookOpen;
      default:
        return Circle;
    }
  };

  const getTaskTypeBadge = (type) => {
    switch (type) {
      case "Course":
        return "primary";
      case "Project":
        return "success";
      case "Practice":
        return "warning";
      case "Reading":
        return "info";
      default:
        return "default";
    }
  };

  const handleGenerate = async (adminKey = null) => {
    try {
      await generateRoadmap({
        weeks,
        hoursPerWeek,
        ...(typeof adminKey === 'string' && { adminKey })
      }).unwrap();
    } catch (err) {
      console.error("Failed to generate roadmap", err);
    }
  };

  // No resume uploaded
  if (!hasResume) {
    return (
      <div className="min-h-screen">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
          <div className="text-center">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-100 text-purple-600 text-sm mb-4 dark:bg-purple-900/30 dark:text-purple-400">
              <Sparkles className="w-4 h-4" />
              <span>AI-Powered Learning Path</span>
            </div>
            <h1 className="text-3xl md:text-5xl font-bold text-gray-900 mb-3 dark:text-white">
              Your{" "}
              <span className="bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent">
                Learning Roadmap
              </span>
            </h1>
          </div>

          <div className="max-w-lg mx-auto">
            <Card className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border border-gray-200/50 dark:border-gray-800/50 shadow-xl text-center p-6 sm:p-8">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-r from-purple-600 to-indigo-600 flex items-center justify-center mx-auto mb-4 shadow-lg">
                <Upload className="w-8 h-8 text-white" />
              </div>
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                Upload Your Resume First
              </h2>
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
                We need your resume to identify skill gaps and generate a personalized learning roadmap.
              </p>
              <Button
                onClick={() => navigate("/app/resume")}
                className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 gap-2"
              >
                <Upload className="w-4 h-4" />
                Go to Resume Page
              </Button>
            </Card>
          </div>
        </div>
      </div>
    );
  }

  if (isStatusLoading || isLoading) {
    return <AiLoadingState type="roadmap" />;
  }

  // Show landing info if no roadmap OR if user explicitly clicks to view info
  if ((!roadmap && !isLoading && !error) || showInfo) {
    return (
      <div className="min-h-screen">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
          {/* Hero Section */}
          <div className="text-center max-w-3xl mx-auto">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-purple-100 text-purple-700 text-sm font-medium mb-6 dark:bg-purple-900/40 dark:text-purple-300 ring-1 ring-purple-200 dark:ring-purple-800">
              <Sparkles className="w-4 h-4" />
              <span>Personalized Learning</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-6 dark:text-white leading-tight">
              Your AI-Powered{" "}
              <span className="bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent">
                Career Roadmap
              </span>
            </h1>
            <p className="text-base sm:text-lg text-gray-600 dark:text-gray-300 mb-10 leading-relaxed">
              We found <span className="font-bold text-purple-600 dark:text-purple-400">{resumeSkills.length} skills</span> in your profile.
              Based on the <span className="font-semibold text-gray-900 dark:text-white">skills required for the jobs you've applied to</span>, our AI will generate a custom week-by-week plan to help you master what's missing.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-16">
            {/* Steps / How it works */}
            <div className="lg:col-span-7 flex flex-col justify-center space-y-6">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">The Process</h2>

              <Card className="bg-white/60 dark:bg-gray-800/60 backdrop-blur-md border border-gray-200/50 dark:border-gray-700/50 p-5 sm:p-6 hover:shadow-xl transition-all duration-300 rounded-2xl group flex items-start gap-4 sm:gap-6">
                <div className="w-12 h-12 rounded-2xl bg-purple-100 dark:bg-purple-900/30 shadow-sm flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
                  <Target className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                </div>
                <div>
                  <h3 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white mb-1">1. Set Your Timeline</h3>
                  <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400 leading-relaxed">
                    Choose how many weeks you want to dedicate to your learning journey and the number of hours you can commit each week.
                  </p>
                </div>
              </Card>

              <Card className="bg-white/60 dark:bg-gray-800/60 backdrop-blur-md border border-gray-200/50 dark:border-gray-700/50 p-5 sm:p-6 hover:shadow-xl transition-all duration-300 rounded-2xl group flex items-start gap-4 sm:gap-6 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-amber-500/10 to-orange-500/10 rounded-bl-full -z-10" />
                <div className="w-12 h-12 rounded-2xl bg-amber-100 dark:bg-amber-900/30 shadow-sm flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
                  <Zap className="w-6 h-6 text-amber-500 dark:text-amber-400" />
                </div>
                <div>
                  <h3 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white mb-1">2. AI Generation</h3>
                  <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400 leading-relaxed">
                    Our AI evaluates your skill gaps against the jobs you applied for and constructs a logical curriculum tailored for you.
                  </p>
                </div>
              </Card>

              <Card className="bg-white/60 dark:bg-gray-800/60 backdrop-blur-md border border-gray-200/50 dark:border-gray-700/50 p-5 sm:p-6 hover:shadow-xl transition-all duration-300 rounded-2xl group flex items-start gap-4 sm:gap-6">
                <div className="w-12 h-12 rounded-2xl bg-emerald-100 dark:bg-emerald-900/30 shadow-sm flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
                  <CheckCircle2 className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
                </div>
                <div>
                  <h3 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white mb-1">3. Weekly Milestones</h3>
                  <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400 leading-relaxed">
                    Follow actionable weekly tasks, projects, and learning resources to achieve clear milestones and track your growth.
                  </p>
                </div>
              </Card>
            </div>

            {/* Generation Card */}
            <div className="lg:col-span-5">
              <Card className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl border border-gray-200/50 dark:border-gray-700/50 shadow-2xl p-6 sm:p-8 rounded-2xl sticky top-24">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-r from-purple-600 to-indigo-600 flex items-center justify-center mb-6 shadow-lg">
                  <Rocket className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                  Configure Roadmap
                </h3>
                <p className="text-gray-500 dark:text-gray-400 mb-6 text-sm">
                  Adjust the parameters below to match your availability and goals.
                </p>

                <div className="space-y-6 mb-8">
                  <div className="space-y-3">
                    <label className="flex flex-wrap items-center justify-between gap-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                      <span>Duration</span>
                      <Badge variant="primary" className="bg-purple-100 text-purple-700 dark:bg-purple-900/40 dark:text-purple-300">
                        {weeks} weeks
                      </Badge>
                    </label>
                    <CustomDropdown
                      value={weeks}
                      onChange={(val) => setWeeks(Number(val))}
                      options={[
                        { value: 2, label: "2 weeks (Crash Course)" },
                        { value: 4, label: "4 weeks (Standard)" },
                        { value: 6, label: "6 weeks (Comprehensive)" },
                        { value: 8, label: "8 weeks (Deep Dive)" },
                      ]}
                      placeholder="Select Duration"
                    />
                  </div>

                  <div className="space-y-3">
                    <label className="flex flex-wrap items-center justify-between gap-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                      <span>Commitment</span>
                      <Badge variant="warning" className="bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300">
                        {hoursPerWeek} hrs/week
                      </Badge>
                    </label>
                    <CustomDropdown
                      value={hoursPerWeek}
                      onChange={(val) => setHoursPerWeek(Number(val))}
                      options={[
                        { value: 5, label: "5 hours/week (Light)" },
                        { value: 10, label: "10 hours/week (Moderate)" },
                        { value: 15, label: "15 hours/week (Intensive)" },
                        { value: 20, label: "20 hours/week (Full-time)" },
                      ]}
                      placeholder="Select Commitment"
                    />
                  </div>
                </div>

                <div className="space-y-4">
                  {roadmap && (
                    <Button
                      onClick={() => setShowInfo(false)}
                      variant="outline"
                      className="w-full border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 gap-2 py-5 text-base rounded-xl hover:bg-gray-50 hover:text-gray-900 dark:hover:bg-gray-800 dark:hover:text-white transition-all shadow-sm"
                    >
                      Back to Results
                    </Button>
                  )}
                  <Button
                    onClick={handleGenerate}
                    disabled={isCachedActive || isLoading}
                    className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white gap-2 py-5 text-base rounded-xl shadow-lg hover:shadow-xl transition-all disabled:opacity-50"
                  >
                    <Sparkles className="w-5 h-5" />
                    {isCachedActive ? `Available in ${remainingTimeText}` : roadmap ? "Regenerate Roadmap" : "Generate AI Roadmap"}
                  </Button>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (isLoading) return <PageLoader />;

  if (error && !roadmap) {
    return (
      <div className="min-h-screen">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
          <div className="text-center">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-100 text-purple-600 text-sm mb-4 dark:bg-purple-900/30 dark:text-purple-400">
              <Sparkles className="w-4 h-4" />
              <span>AI-Powered Learning Path</span>
            </div>
            <h1 className="text-3xl md:text-5xl font-bold text-gray-900 mb-3 dark:text-white">
              Your{" "}
              <span className="bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent">
                Learning Roadmap
              </span>
            </h1>
          </div>

          <div className="max-w-lg mx-auto">
            <Card className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border border-gray-200/50 dark:border-gray-800/50 shadow-xl text-center p-6 sm:p-8">
              <div className="w-16 h-16 rounded-2xl bg-red-100 dark:bg-red-900/30 flex items-center justify-center mx-auto mb-4">
                <AlertCircle className="w-8 h-8 text-red-600 dark:text-red-400" />
              </div>
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                Generation Failed
              </h2>
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
                {error?.data?.message || "Something went wrong. Please try again."}
              </p>
              <Button
                onClick={handleGenerate}
                className="bg-gradient-to-r from-purple-600 to-indigo-600 gap-2"
              >
                <RefreshCw className="w-4 h-4" />
                Try Again
              </Button>
            </Card>
          </div>
        </div>
      </div>
    );
  }

  if (roadmap && weeklyPlan.length === 0) {
    return (
      <div className="min-h-screen">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
          <div className="text-center">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-100 text-purple-600 text-sm mb-4 dark:bg-purple-900/30 dark:text-purple-400">
              <Sparkles className="w-4 h-4" />
              <span>AI-Powered Learning Path</span>
            </div>
            <h1 className="text-3xl md:text-5xl font-bold text-gray-900 mb-3 dark:text-white">
              Your{" "}
              <span className="bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent">
                Learning Roadmap
              </span>
            </h1>
          </div>

          <div className="max-w-lg mx-auto">
            <Card className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border border-gray-200/50 dark:border-gray-800/50 shadow-xl text-center p-6 sm:p-8">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-600 flex items-center justify-center mx-auto mb-4 shadow-lg">
                <Award className="w-8 h-8 text-white" />
              </div>
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                {roadmap.title || "You're All Caught Up!"}
              </h2>
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
                {roadmap.summary ||
                  "Your skills already match the job market demands. Keep building projects to stay sharp!"}
              </p>
              <Button
                onClick={() => navigate("/app/jobs")}
                className="bg-gradient-to-r from-emerald-500 to-teal-600 gap-2"
              >
                Browse Jobs <ChevronRight className="w-4 h-4" />
              </Button>
            </Card>
          </div>
        </div>
      </div>
    );
  }

  // Main roadmap view
  return (
    <div className="min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Hero Header */}
        <div className="text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-100 text-purple-600 text-sm mb-4 dark:bg-purple-900/30 dark:text-purple-400">
            <Sparkles className="w-4 h-4" />
            <span>AI-Powered Learning Path</span>
          </div>
          <h1 className="text-3xl md:text-5xl font-bold text-gray-900 mb-3 dark:text-white">
            Your{" "}
            <span className="bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent">
              Learning Roadmap
            </span>
          </h1>
          <div className="text-gray-500 text-base md:text-lg max-w-3xl mx-auto dark:text-gray-400">
            {roadmap.summary ? (
              <div className="flex flex-col items-center">
                <p className="leading-relaxed">
                  {showFullSummary || roadmap.summary.length <= 200
                    ? roadmap.summary
                    : `${roadmap.summary.substring(0, 200)}...`}
                </p>
                {roadmap.summary.length > 200 && (
                  <button
                    onClick={() => setShowFullSummary(!showFullSummary)}
                    className="mt-4 px-5 py-1.5 bg-purple-100 hover:bg-purple-200 text-purple-700 dark:bg-purple-900/50 dark:hover:bg-purple-900/70 dark:text-purple-300 text-sm font-semibold rounded-full transition-all duration-200 focus:outline-none shadow-sm"
                  >
                    {showFullSummary ? "View less" : "View more"}
                  </button>
                )}
              </div>
            ) : (
              <p>A personalized plan to master in-demand skills</p>
            )}
          </div>
          <div className="flex flex-wrap items-center justify-center gap-3 mt-5">
            <Button
              onClick={() => setShowInfo(true)}
              variant="outline"
              size="sm"
              className="gap-2 border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-purple-50 hover:text-purple-700 dark:hover:bg-purple-900/20 dark:hover:text-purple-300"
            >
              <Info className="w-3.5 h-3.5 text-purple-600 dark:text-purple-400" />
              How it works
            </Button>
            <Button
              onClick={handleGenerate}
              variant="outline"
              size="sm"
              disabled={isCachedActive || isLoading}
              className="gap-2 border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-50 hover:text-gray-900 dark:hover:bg-gray-800 dark:hover:text-white disabled:opacity-50"
            >
              <RefreshCw className={`w-3 h-3 ${isLoading ? "animate-spin" : ""}`} />
              {isCachedActive ? `Available in ${remainingTimeText}` : "Regenerate"}
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
          <Card className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border border-gray-200/50 dark:border-gray-800/50 p-4 sm:p-5 text-center hover:shadow-lg transition-all">
            <div className="w-11 h-11 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 flex items-center justify-center mx-auto mb-3 shadow-md">
              <Calendar className="w-5 h-5 text-white" />
            </div>
            <div className="text-2xl font-bold text-gray-900 dark:text-white">{totalWeeks}</div>
            <div className="text-sm text-gray-500 dark:text-gray-400">Weeks Total</div>
          </Card>

          <Card className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border border-gray-200/50 dark:border-gray-800/50 p-4 sm:p-5 text-center hover:shadow-lg transition-all">
            <div className="w-11 h-11 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 flex items-center justify-center mx-auto mb-3 shadow-md">
              <Target className="w-5 h-5 text-white" />
            </div>
            <div className="text-2xl font-bold text-gray-900 dark:text-white">{totalTasks}</div>
            <div className="text-sm text-gray-500 dark:text-gray-400">Total Tasks</div>
          </Card>

          <Card className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border border-gray-200/50 dark:border-gray-800/50 p-4 sm:p-5 text-center hover:shadow-lg transition-all">
            <div className="w-11 h-11 rounded-xl bg-gradient-to-r from-amber-500 to-orange-600 flex items-center justify-center mx-auto mb-3 shadow-md">
              <Clock className="w-5 h-5 text-white" />
            </div>
            <div className="text-2xl font-bold text-gray-900 dark:text-white">{totalHours}</div>
            <div className="text-sm text-gray-500 dark:text-gray-400">Learning Hours</div>
          </Card>

          <Card className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border border-gray-200/50 dark:border-gray-800/50 p-4 sm:p-5 text-center hover:shadow-lg transition-all">
            <div className="w-11 h-11 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 flex items-center justify-center mx-auto mb-3 shadow-md">
              <TrendingUp className="w-5 h-5 text-white" />
            </div>
            <div className="text-2xl font-bold text-gray-900 dark:text-white">
              {meta?.missingSkillsCount || weeklyPlan.reduce((acc, w) => acc + (w.skills?.length || 0), 0)}
            </div>
            <div className="text-sm text-gray-500 dark:text-gray-400">Skills to Learn</div>
          </Card>
        </div>

        {/* Expected Outcome */}
        {roadmap.expectedOutcome && (
          <Card className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border border-gray-200/50 dark:border-gray-800/50 p-5 sm:p-6">
            <div className="flex items-center gap-2 mb-2">
              <TrendingUp className="w-5 h-5 text-purple-600 dark:text-purple-400" />
              <h3 className="font-semibold text-gray-900 dark:text-white">Expected Outcome</h3>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400">{roadmap.expectedOutcome}</p>
          </Card>
        )}

        {/* Timeline */}
        <div className="relative">
          <div className="absolute left-5 top-8 bottom-8 w-0.5 bg-gradient-to-b from-purple-600/20 via-indigo-600/20 to-transparent rounded-full hidden md:block" />
          <div className="space-y-8 sm:space-y-10">
            {weeklyPlan.map((week, idx) => {
              const weekTasks = week.tasks || [];
              const weekHours = weekTasks.reduce((sum, t) => sum + parseInt(t.duration || "0", 10), 0);
              const isFirst = week.week === 1;

              return (
                <div key={week.week} className="relative group">
                  <div className="flex flex-col md:flex-row gap-5 md:gap-6">
                    {/* Week badge */}
                    <div className="relative z-10 flex-shrink-0 md:w-40">
                      <div className="flex items-center gap-4 md:flex-col md:items-start">
                        <div
                          className={`w-12 h-12 rounded-2xl flex items-center justify-center shadow-md transition-transform group-hover:scale-105 ${isFirst
                            ? "bg-gradient-to-r from-purple-600 to-indigo-600"
                            : "bg-gradient-to-r from-gray-500 to-gray-600 dark:from-gray-600 dark:to-gray-700"
                            }`}
                        >
                          {isFirst ? (
                            <Rocket className="w-6 h-6 text-white" />
                          ) : (
                            <Circle className="w-6 h-6 text-white" />
                          )}
                        </div>
                        <div>
                          <div className="text-xs sm:text-sm text-gray-400 dark:text-gray-500">Week {week.week}</div>
                          <div className="font-semibold text-gray-900 dark:text-white text-base sm:text-lg">
                            {week.title}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Week content */}
                    <Card className="flex-1 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border border-gray-200/50 dark:border-gray-800/50 p-5 sm:p-6 shadow-sm hover:shadow-xl transition-all">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
                        <div className="flex flex-wrap items-center gap-3">
                          <Badge variant={isFirst ? "primary" : "default"} className="capitalize">
                            {isFirst ? "Start Here" : "Upcoming"}
                          </Badge>
                          <div className="flex items-center gap-1 text-xs sm:text-sm text-gray-500 dark:text-gray-400">
                            <Clock className="w-3.5 h-3.5" />
                            <span>{weekHours}h total</span>
                          </div>
                        </div>
                        <div className="flex items-center gap-1 text-xs sm:text-sm text-gray-500 dark:text-gray-400">
                          <Target className="w-3.5 h-3.5" />
                          <span>{weekTasks.length} tasks</span>
                        </div>
                      </div>

                      {week.description && (
                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                          {week.description}
                        </p>
                      )}

                      {/* Tasks */}
                      <div className="space-y-2 mb-5">
                        {weekTasks.map((task, i) => {
                          const TaskIcon = getTaskTypeIcon(task.type);
                          return (
                            <div
                              key={i}
                              className="flex flex-wrap items-center gap-2 p-3 rounded-xl bg-gray-50/50 dark:bg-gray-800/50 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                            >
                              <TaskIcon className="w-4 h-4 text-gray-400 dark:text-gray-500 flex-shrink-0" />
                              <span className="flex-1 text-xs sm:text-sm text-gray-700 dark:text-gray-300">
                                {task.title}
                              </span>
                              <div className="flex flex-wrap items-center gap-2 flex-shrink-0">
                                <Badge variant={getTaskTypeBadge(task.type)} className="text-[10px] sm:text-xs">
                                  {task.type}
                                </Badge>
                                {task.resource && (
                                  <span className="text-xs text-gray-400 dark:text-gray-500 hidden sm:inline">
                                    {task.resource}
                                  </span>
                                )}
                                <span className="text-xs text-gray-400 dark:text-gray-500 flex items-center gap-1">
                                  <Clock className="w-3 h-3" /> {task.duration}
                                </span>
                                {task.url && (
                                  <a
                                    href={task.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-purple-600 hover:text-purple-700 dark:text-purple-400 p-1.5 rounded-md hover:bg-purple-100 dark:hover:bg-purple-900/50 transition-colors"
                                  >
                                    <ExternalLink className="w-3.5 h-3.5" />
                                  </a>
                                )}
                              </div>
                            </div>
                          );
                        })}
                      </div>

                      {/* Milestone */}
                      {week.milestone && (
                        <div className="flex items-start gap-2 p-3 rounded-xl bg-purple-50/50 dark:bg-purple-950/20 border border-purple-100 dark:border-purple-900/30 mb-4">
                          <Award className="w-4 h-4 text-purple-600 dark:text-purple-400 mt-0.5 flex-shrink-0" />
                          <div>
                            <span className="text-xs font-medium text-purple-600 dark:text-purple-400">
                              Milestone:
                            </span>
                            <p className="text-sm text-gray-700 dark:text-gray-300">{week.milestone}</p>
                          </div>
                        </div>
                      )}

                      {/* Skills */}
                      {week.skills?.length > 0 && (
                        <div className="flex flex-wrap gap-2 pt-3 border-t border-gray-200 dark:border-gray-800">
                          <BookOpen className="w-4 h-4 text-gray-400 dark:text-gray-500 mt-0.5" />
                          {week.skills.map((skill) => (
                            <Badge key={skill} variant="primary" className="text-xs gap-1">
                              <Code className="w-3 h-3" /> {skill}
                            </Badge>
                          ))}
                        </div>
                      )}
                    </Card>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* CTA Banner */}
        <div className="bg-gradient-to-r from-purple-600 via-indigo-600 to-purple-600 rounded-2xl p-6 sm:p-8 relative overflow-hidden shadow-lg">
          <div className="absolute top-0 right-0 w-40 h-40 bg-white/10 rounded-full -mr-20 -mt-20" />
          <div className="absolute bottom-0 left-0 w-32 h-32 bg-white/5 rounded-full -ml-16 -mb-16" />
          <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="flex items-start gap-5">
              <div className="w-14 h-14 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center shadow-lg">
                <Zap className="w-7 h-7 text-white" />
              </div>
              <div>
                <h3 className="text-xl font-semibold text-white mb-2 flex flex-wrap items-center gap-2">
                  Start Your Journey Today
                  <Sparkles className="w-5 h-5" />
                </h3>
                <p className="text-white/90 max-w-md text-sm sm:text-base">
                  Follow this roadmap consistently and you'll be ready for your dream job in {totalWeeks} weeks!
                </p>
              </div>
            </div>
            <Button
              onClick={() => navigate("/app/skill-gap")}
              className="bg-white text-purple-600 hover:bg-gray-100 shadow-lg hover:shadow-xl gap-2 group"
            >
              <Target className="w-4 h-4 group-hover:scale-110 transition-transform" />
              View Skill Gap
            </Button>
          </div>
        </div>

        {/* Motivational Tip */}
        <Card className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border border-gray-200/50 dark:border-gray-800/50 p-5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-yellow-100 to-amber-100 dark:from-yellow-900/30 dark:to-amber-900/30 flex items-center justify-center">
              <Star className="w-5 h-5 text-amber-600 dark:text-amber-400" />
            </div>
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                💡{" "}
                <span className="font-medium text-gray-900 dark:text-white">
                  Pro Tip:
                </span>{" "}
                Consistency is key! Dedicate {roadmap.hoursPerWeek || hoursPerWeek} hours per week and
                you'll complete this roadmap right on schedule.
              </p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}

// Custom Dropdown Component (Animated) – improved responsiveness and visibility
function CustomDropdown({ value, options, onChange, placeholder, className = "" }) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    if (isOpen) document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen]);

  const selectedOption = options.find((opt) => opt.value === value) || null;

  return (
    <div className="relative w-full" ref={dropdownRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={`w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white focus:outline-none focus:border-purple-500 transition-all flex items-center justify-between text-left shadow-sm hover:bg-gray-100 dark:hover:bg-gray-800/80 ${className}`}
      >
        <span className={selectedOption ? "font-medium" : "text-gray-500"}>
          {selectedOption ? selectedOption.label : placeholder}
        </span>
        <ChevronDown
          className={`w-4 h-4 text-gray-400 transition-transform duration-200 ${isOpen ? "rotate-180 text-purple-500" : ""
            }`}
        />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -8, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.95 }}
            transition={{ duration: 0.15 }}
            className="absolute z-[100] w-full mt-2 bg-white dark:bg-gray-800 rounded-xl shadow-xl border border-gray-200 dark:border-gray-700 py-1 overflow-hidden max-h-60 overflow-y-auto custom-scrollbar"
          >
            {options.map((opt) => (
              <button
                key={opt.value}
                type="button"
                onClick={() => {
                  onChange(opt.value);
                  setIsOpen(false);
                }}
                className={`w-full flex items-center gap-2.5 px-4 py-3 text-sm text-left transition-all ${value === opt.value
                  ? "text-purple-700 dark:text-purple-400 font-semibold bg-purple-50 dark:bg-purple-900/20"
                  : "text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700/50 font-medium"
                  }`}
              >
                <span>{opt.label}</span>
                {value === opt.value && (
                  <div className="ml-auto w-1.5 h-1.5 rounded-full bg-purple-500 shadow-sm" />
                )}
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}