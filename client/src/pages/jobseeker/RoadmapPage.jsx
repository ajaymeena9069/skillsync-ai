// client/src/pages/RoadmapPage.jsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
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
} from "lucide-react";
import { Card } from "../../components/Card";
import { PageLoader } from "../../components/PageLoader";
import { Button } from "../../components/Button";
import { Badge } from "../../components/Badge";
import { useGenerateRoadmapMutation } from "../../services/roadmapApi";

export function RoadmapPage() {
  const navigate = useNavigate();
  const [weeks, setWeeks] = useState(4);
  const [hoursPerWeek, setHoursPerWeek] = useState(10);
  const [showSettings, setShowSettings] = useState(false);

  const resumeSkills = useSelector((state) => state.resume.parsedSkills);
  const hasResume = resumeSkills && resumeSkills.length > 0;

  const [generateRoadmap, { data: roadmapData, isLoading, error }] =
    useGenerateRoadmapMutation();

  const roadmap = roadmapData?.data;
  const weeklyPlan = roadmap?.weeks || [];
  const meta = roadmapData?.meta;

  const totalWeeks = weeklyPlan.length;
  const totalTasks = weeklyPlan.reduce((acc, w) => acc + (w.tasks?.length || 0), 0);
  const totalHours = weeklyPlan.reduce(
    (acc, w) =>
      acc +
      (w.tasks || []).reduce((sum, t) => sum + parseInt(t.duration || "0"), 0),
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

  const handleGenerate = () => {
    generateRoadmap({ weeks, hoursPerWeek });
  };

  // No resume uploaded - show upload prompt
  if (!hasResume) {
    return (
      <div className="min-h-screen">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
          <div className="text-center mb-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-100 text-purple-600 text-sm mb-4 dark:bg-purple-900/30 dark:text-purple-400">
              <Sparkles className="w-4 h-4" />
              <span>AI-Powered Learning Path</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-3 dark:text-white">
              Your{" "}
              <span className="bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent">
                Learning Roadmap
              </span>
            </h1>
          </div>

          <div className="max-w-lg mx-auto bg-white/80 backdrop-blur-sm rounded-2xl border border-white/30 p-8 shadow-sm dark:bg-gray-800/80 dark:border-gray-700/50 text-center">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-r from-purple-600 to-indigo-600 flex items-center justify-center mx-auto mb-4 shadow-lg">
              <Upload className="w-8 h-8 text-white" />
            </div>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              Upload Your Resume First
            </h2>
            <p className="text-gray-500 dark:text-gray-400 mb-6">
              We need your resume to identify skill gaps and generate a
              personalized learning roadmap for you.
            </p>
            <Button
              onClick={() => navigate("/app/resume")}
              className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white gap-2 px-6"
            >
              <Upload className="w-4 h-4" />
              Go to Resume Page
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // Has resume but hasn't triggered generation yet
  if (!roadmap && !isLoading && !error) {
    return (
      <div className="min-h-screen">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
          <div className="text-center mb-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-100 text-purple-600 text-sm mb-4 dark:bg-purple-900/30 dark:text-purple-400">
              <Sparkles className="w-4 h-4" />
              <span>AI-Powered Learning Path</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-3 dark:text-white">
              Your{" "}
              <span className="bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent">
                Learning Roadmap
              </span>
            </h1>
            <p className="text-gray-500 text-lg max-w-2xl mx-auto dark:text-gray-400">
              Generate a personalized learning plan based on your skill gaps and
              career goals
            </p>
          </div>

          <div className="max-w-lg mx-auto bg-white/80 backdrop-blur-sm rounded-2xl border border-white/30 p-8 shadow-sm dark:bg-gray-800/80 dark:border-gray-700/50 text-center">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-r from-purple-600 to-indigo-600 flex items-center justify-center mx-auto mb-4 shadow-lg">
              <Rocket className="w-8 h-8 text-white" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
              Ready to Build Your Roadmap
            </h2>
            <p className="text-gray-700 dark:text-gray-300 mb-2 font-medium">
              We found{" "}
              <span className="font-semibold text-purple-600 dark:text-purple-400">
                {resumeSkills.length} skills
              </span>{" "}
              from your resume.
            </p>
            <p className="text-gray-500 dark:text-gray-400 mb-8 text-sm max-w-sm mx-auto">
              Our AI will analyze job market demands and create a week-by-week
              learning plan to fill your skill gaps.
            </p>

            {showSettings && (
              <div className="mb-6 p-4 bg-gray-50 dark:bg-gray-800/50 rounded-xl space-y-4 text-left animate-in fade-in zoom-in duration-200">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Duration (weeks)
                  </label>
                  <select
                    value={weeks}
                    onChange={(e) => setWeeks(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm focus:ring-2 focus:ring-purple-500/30 focus:border-purple-500"
                  >
                    <option value={2}>2 weeks</option>
                    <option value={4}>4 weeks</option>
                    <option value={6}>6 weeks</option>
                    <option value={8}>8 weeks</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Hours per week
                  </label>
                  <select
                    value={hoursPerWeek}
                    onChange={(e) => setHoursPerWeek(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm focus:ring-2 focus:ring-purple-500/30 focus:border-purple-500"
                  >
                    <option value={5}>5 hours/week</option>
                    <option value={10}>10 hours/week</option>
                    <option value={15}>15 hours/week</option>
                    <option value={20}>20 hours/week</option>
                  </select>
                </div>
              </div>
            )}

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button
                variant="outline"
                onClick={() => setShowSettings(!showSettings)}
                className="w-full sm:w-auto border-gray-200 dark:border-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 gap-2"
              >
                <Settings className="w-4 h-4" />
                {showSettings ? "Hide settings" : "Customize settings"}
              </Button>
              <Button
                onClick={handleGenerate}
                className="w-full sm:w-auto bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white gap-2 shadow-md hover:shadow-lg transition-all"
              >
                <Sparkles className="w-4 h-4" />
                Generate AI Roadmap
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return <PageLoader />;
  }

  // Error state
  if (error && !roadmap) {
    return (
      <div className="min-h-screen">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
          <div className="text-center mb-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-100 text-purple-600 text-sm mb-4 dark:bg-purple-900/30 dark:text-purple-400">
              <Sparkles className="w-4 h-4" />
              <span>AI-Powered Learning Path</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-3 dark:text-white">
              Your{" "}
              <span className="bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent">
                Learning Roadmap
              </span>
            </h1>
          </div>

          <div className="max-w-lg mx-auto bg-white/80 backdrop-blur-sm rounded-2xl border border-white/30 p-8 shadow-sm dark:bg-gray-800/80 dark:border-gray-700/50 text-center">
            <div className="w-16 h-16 rounded-2xl bg-red-100 dark:bg-red-900/30 flex items-center justify-center mx-auto mb-4">
              <AlertCircle className="w-8 h-8 text-red-600 dark:text-red-400" />
            </div>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              Generation Failed
            </h2>
            <p className="text-gray-500 dark:text-gray-400 mb-6">
              {error?.data?.message ||
                "Something went wrong. Please try again."}
            </p>
            <Button
              onClick={handleGenerate}
              className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white gap-2 px-6"
            >
              <RefreshCw className="w-4 h-4" />
              Try Again
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // Empty roadmap (user already has all skills)
  if (roadmap && weeklyPlan.length === 0) {
    return (
      <div className="min-h-screen">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
          <div className="text-center mb-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-100 text-purple-600 text-sm mb-4 dark:bg-purple-900/30 dark:text-purple-400">
              <Sparkles className="w-4 h-4" />
              <span>AI-Powered Learning Path</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-3 dark:text-white">
              Your{" "}
              <span className="bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent">
                Learning Roadmap
              </span>
            </h1>
          </div>

          <div className="max-w-lg mx-auto bg-white/80 backdrop-blur-sm rounded-2xl border border-white/30 p-8 shadow-sm dark:bg-gray-800/80 dark:border-gray-700/50 text-center">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-600 flex items-center justify-center mx-auto mb-4 shadow-lg">
              <Award className="w-8 h-8 text-white" />
            </div>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              {roadmap.title || "You're All Caught Up!"}
            </h2>
            <p className="text-gray-500 dark:text-gray-400 mb-6">
              {roadmap.summary ||
                "Your skills already match the job market demands. Keep building projects to stay sharp!"}
            </p>
            <Button
              onClick={() => navigate("/app/jobs")}
              className="bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white gap-2 px-6"
            >
              Browse Jobs <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // Roadmap results
  return (
    <div className="min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Hero Header */}
        <div className="text-center mb-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-100 text-purple-600 text-sm mb-4 dark:bg-purple-900/30 dark:text-purple-400">
            <Sparkles className="w-4 h-4" />
            <span>AI-Powered Learning Path</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-3 dark:text-white">
            Your{" "}
            <span className="bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent">
              Learning Roadmap
            </span>
          </h1>
          <p className="text-gray-500 text-lg max-w-2xl mx-auto dark:text-gray-400">
            {roadmap.summary ||
              "A personalized plan to master in-demand skills and accelerate your career"}
          </p>
          <Button
            onClick={handleGenerate}
            variant="outline"
            size="sm"
            className="mt-3 gap-2 border-gray-200 dark:border-gray-700 dark:text-gray-300"
          >
            <RefreshCw className={`w-3 h-3 ${isLoading ? "animate-spin" : ""}`} />
            Regenerate
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-5">
          <div className="group bg-white/80 backdrop-blur-sm rounded-2xl border border-white/30 p-5 shadow-sm dark:bg-gray-800/80 dark:border-gray-700/50 hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
            <div className="flex items-center justify-between mb-3">
              <div className="w-11 h-11 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 flex items-center justify-center shadow-md group-hover:scale-110 transition-transform">
                <Calendar className="w-5 h-5 text-white" />
              </div>
              <Badge variant="primary" className="text-xs">
                Plan
              </Badge>
            </div>
            <div className="text-2xl font-bold text-gray-900 dark:text-white">
              {totalWeeks}
            </div>
            <div className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              Weeks Total
            </div>
          </div>

          <div className="group bg-white/80 backdrop-blur-sm rounded-2xl border border-white/30 p-5 shadow-sm dark:bg-gray-800/80 dark:border-gray-700/50 hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
            <div className="flex items-center justify-between mb-3">
              <div className="w-11 h-11 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 flex items-center justify-center shadow-md group-hover:scale-110 transition-transform">
                <Target className="w-5 h-5 text-white" />
              </div>
              <Badge variant="success" className="text-xs">
                Tasks
              </Badge>
            </div>
            <div className="text-2xl font-bold text-gray-900 dark:text-white">
              {totalTasks}
            </div>
            <div className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              Total Tasks
            </div>
          </div>

          <div className="group bg-white/80 backdrop-blur-sm rounded-2xl border border-white/30 p-5 shadow-sm dark:bg-gray-800/80 dark:border-gray-700/50 hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
            <div className="flex items-center justify-between mb-3">
              <div className="w-11 h-11 rounded-xl bg-gradient-to-r from-amber-500 to-orange-600 flex items-center justify-center shadow-md group-hover:scale-110 transition-transform">
                <Clock className="w-5 h-5 text-white" />
              </div>
              <Badge variant="warning" className="text-xs">
                {totalHours}h
              </Badge>
            </div>
            <div className="text-2xl font-bold text-gray-900 dark:text-white">
              {totalHours}
            </div>
            <div className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              Learning Hours
            </div>
          </div>

          <div className="group bg-white/80 backdrop-blur-sm rounded-2xl border border-white/30 p-5 shadow-sm dark:bg-gray-800/80 dark:border-gray-700/50 hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
            <div className="flex items-center justify-between mb-3">
              <div className="w-11 h-11 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 flex items-center justify-center shadow-md group-hover:scale-110 transition-transform">
                <TrendingUp className="w-5 h-5 text-white" />
              </div>
              <Badge variant="info" className="text-xs">
                Skills
              </Badge>
            </div>
            <div className="text-2xl font-bold text-gray-900 dark:text-white">
              {meta?.missingSkillsCount || weeklyPlan.reduce((acc, w) => acc + (w.skills?.length || 0), 0)}
            </div>
            <div className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              Skills to Learn
            </div>
          </div>
        </div>

        {/* Expected Outcome */}
        {roadmap.expectedOutcome && (
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-white/30 p-6 shadow-sm dark:bg-gray-800/80 dark:border-gray-700/50">
            <div className="flex items-center gap-2 mb-2">
              <TrendingUp className="w-5 h-5 text-purple-600 dark:text-purple-400" />
              <h3 className="font-semibold text-gray-900 dark:text-white">
                Expected Outcome
              </h3>
            </div>
            <p className="text-gray-600 dark:text-gray-400">
              {roadmap.expectedOutcome}
            </p>
          </div>
        )}

        {/* Timeline */}
        <div className="relative">
          <div className="absolute left-7 lg:left-9 top-0 bottom-0 w-0.5 bg-gradient-to-b from-purple-600/20 via-indigo-600/20 to-transparent rounded-full" />

          <div className="space-y-8">
            {weeklyPlan.map((week) => {
              const weekTasks = week.tasks || [];
              const weekHours = weekTasks.reduce(
                (sum, t) => sum + parseInt(t.duration || "0"),
                0,
              );
              const isFirstWeek = week.week === 1;

              return (
                <div key={week.week} className="relative group">
                  <div className="flex flex-col lg:flex-row gap-5">
                    {/* Week Badge */}
                    <div className="relative z-10 flex-shrink-0 lg:w-48">
                      <div className="flex items-center gap-4 lg:flex-col lg:items-start">
                        <div
                          className={`
                          w-14 h-14 rounded-2xl flex items-center justify-center shadow-lg transition-all duration-300 group-hover:scale-105
                          ${isFirstWeek ? "bg-gradient-to-r from-purple-600 to-indigo-600" : "bg-gradient-to-r from-gray-500 to-gray-600 dark:from-gray-600 dark:to-gray-700"}
                        `}
                        >
                          {isFirstWeek ? (
                            <Rocket className="w-7 h-7 text-white" />
                          ) : (
                            <Circle className="w-7 h-7 text-white" />
                          )}
                        </div>
                        <div className="text-left">
                          <div className="text-sm text-gray-400 dark:text-gray-500">
                            Week {week.week}
                          </div>
                          <div className="font-semibold text-gray-900 dark:text-white text-lg">
                            {week.title}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Week Content */}
                    <div className="flex-1">
                      <Card className="p-6 border-0 shadow-sm hover:shadow-lg transition-all duration-300 bg-white/80 backdrop-blur-sm dark:bg-gray-800/80">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
                          <div className="flex items-center gap-3">
                            <Badge
                              variant={isFirstWeek ? "primary" : "default"}
                              className="capitalize"
                            >
                              {isFirstWeek ? "Start Here" : "Upcoming"}
                            </Badge>
                            <div className="flex items-center gap-1 text-sm text-gray-500 dark:text-gray-400">
                              <Clock className="w-4 h-4" />
                              <span>{weekHours} hours total</span>
                            </div>
                          </div>
                          <div className="flex items-center gap-1 text-sm text-gray-500 dark:text-gray-400">
                            <Target className="w-4 h-4" />
                            <span>{weekTasks.length} tasks</span>
                          </div>
                        </div>

                        {/* Description */}
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
                                className="flex items-center gap-3 p-3 rounded-xl bg-gray-50 dark:bg-gray-800/50 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                              >
                                <TaskIcon className="w-5 h-5 text-gray-400 dark:text-gray-500 flex-shrink-0" />
                                <span className="flex-1 text-sm text-gray-700 dark:text-gray-300">
                                  {task.title}
                                </span>
                                <div className="flex items-center gap-2 flex-shrink-0">
                                  <Badge
                                    variant={getTaskTypeBadge(task.type)}
                                    className="text-xs"
                                  >
                                    {task.type}
                                  </Badge>
                                  {task.resource && (
                                    <span className="text-xs text-gray-400 dark:text-gray-500 hidden sm:inline">
                                      {task.resource}
                                    </span>
                                  )}
                                  <span className="text-xs text-gray-400 dark:text-gray-500 flex items-center gap-1">
                                    <Clock className="w-3 h-3" />{" "}
                                    {task.duration}
                                  </span>
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
                              <p className="text-sm text-gray-700 dark:text-gray-300">
                                {week.milestone}
                              </p>
                            </div>
                          </div>
                        )}

                        {/* Skills */}
                        <div className="flex flex-wrap items-center gap-3 pt-3 border-t border-gray-200 dark:border-gray-800">
                          <div className="flex flex-wrap gap-2">
                            <BookOpen className="w-4 h-4 text-gray-400 dark:text-gray-500 mt-0.5" />
                            {(week.skills || []).map((skill) => (
                              <Badge
                                key={skill}
                                variant="primary"
                                className="text-xs gap-1"
                              >
                                <Code className="w-3 h-3" /> {skill}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      </Card>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Completion Reward Card */}
        <div className="bg-gradient-to-r from-purple-600 via-indigo-600 to-purple-600 rounded-2xl p-8 relative overflow-hidden shadow-lg">
          <div className="absolute top-0 right-0 w-40 h-40 bg-white/10 rounded-full -mr-20 -mt-20" />
          <div className="absolute bottom-0 left-0 w-32 h-32 bg-white/5 rounded-full -ml-16 -mb-16" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-white/5 rounded-full blur-3xl" />

          <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="flex items-start gap-5">
              <div className="w-16 h-16 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center shadow-lg">
                <Zap className="w-8 h-8 text-white" />
              </div>
              <div>
                <h3 className="text-xl font-semibold text-white mb-2 flex items-center gap-2">
                  Start Your Journey Today
                  <Sparkles className="w-5 h-5" />
                </h3>
                <p className="text-white/90 max-w-md">
                  Follow this roadmap consistently and you'll be ready for your
                  dream job in {totalWeeks} weeks!
                </p>
              </div>
            </div>
            <Button
              onClick={() => navigate("/app/skill-gap")}
              className="bg-white text-purple-600 hover:bg-gray-100 shadow-lg hover:shadow-xl transition-all px-6 gap-2 group"
            >
              <Target className="w-4 h-4 group-hover:scale-110 transition-transform" />
              View Skill Gap
            </Button>
          </div>
        </div>

        {/* Motivational Tip */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-white/30 p-5 shadow-sm dark:bg-gray-800/80 dark:border-gray-700/50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-yellow-100 to-amber-100 flex items-center justify-center dark:from-yellow-900/30 dark:to-amber-900/30">
              <Star className="w-5 h-5 text-amber-600 dark:text-amber-400" />
            </div>
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                💡{" "}
                <span className="font-medium text-gray-900 dark:text-white">
                  Pro Tip:
                </span>{" "}
                Consistency is key! Dedicate {roadmap.hoursPerWeek || hoursPerWeek} hours
                per week and you'll complete this roadmap right on schedule.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
