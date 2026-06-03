// client/src/pages/SkillGapPage.jsx
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import {
  TrendingUp,
  Target,
  BookOpen,
  Video,
  FileText,
  ExternalLink,
  CheckCircle2,
  Sparkles,
  ChevronRight,
  Clock,
  AlertCircle,
  Zap,
  Loader2,
  RefreshCw,
  Upload,
  Info,
} from "lucide-react";
import { Button } from "../../components/Button";
import { Card } from "../../components/Card";
import { PageLoader } from "../../components/PageLoader";
import { Badge } from "../../components/Badge";
import { ProgressBar } from "../../components/ProgressBar";
import { useGetSkillGapAnalysisMutation } from "../../services/skillGapApi";
import { useGetAiStatusQuery } from "../../services/aiApi";
import { AiLoadingState } from "../../components/AiLoadingState";

export function SkillGapPage() {
  const navigate = useNavigate();
  const [selectedSkill, setSelectedSkill] = useState(null);
  const [showFullSummary, setShowFullSummary] = useState(false);
  const [showInfo, setShowInfo] = useState(false);

  const resumeSkills = useSelector((state) => state.resume.parsedSkills);
  const hasResume = resumeSkills && resumeSkills.length > 0;

  const { data: statusData, isLoading: isStatusLoading } = useGetAiStatusQuery();
  const [triggerAnalysis, { data: analysisData, isLoading, error }] =
    useGetSkillGapAnalysisMutation();

  const isCachedActive = statusData?.data?.skillGap?.isCached;
  const cachedAnalysis = statusData?.data?.skillGap?.data;
  const lastAnalyzedAt = statusData?.data?.skillGap?.lastAnalyzedAt;

  let remainingTimeText = "24h";
  if (isCachedActive && lastAnalyzedAt) {
    const remainingMs = (24 * 60 * 60 * 1000) - (new Date() - new Date(lastAnalyzedAt));
    if (remainingMs > 0) {
      const remainingHours = Math.floor(remainingMs / (1000 * 60 * 60));
      const remainingMinutes = Math.floor((remainingMs % (1000 * 60 * 60)) / (1000 * 60));
      remainingTimeText = remainingHours > 0 ? `${remainingHours}h ${remainingMinutes}m` : `${remainingMinutes}m`;
    }
  }

  const analysis = analysisData?.data || cachedAnalysis;

  useEffect(() => {
    if (analysisData?.isCached) {
      toast.info(analysisData.message || "Daily limit reached. Showing latest cached analysis.");
    }
  }, [analysisData]);

  const currentSkills = analysis?.currentSkills || [];
  const missingSkills = analysis?.missingSkills || [];
  const recommendations = analysis?.recommendations || [];
  const marketReadiness = analysis?.marketReadiness || 0;
  const summary = analysis?.summary || "";

  const getImportanceColor = (importance) => {
    switch (importance) {
      case "High":
        return "from-red-500 to-rose-600";
      case "Medium":
        return "from-amber-500 to-orange-600";
      default:
        return "from-emerald-500 to-teal-600";
    }
  };

  const handleAnalyze = (adminKey = null) => {
    triggerAnalysis(typeof adminKey === 'string' ? { adminKey } : undefined);
  };

  // No resume uploaded - improved responsive layout
  if (!hasResume) {
    return (
      <div className="min-h-screen">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
          <div className="text-center mb-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-100 text-purple-600 text-sm mb-4 dark:bg-purple-900/30 dark:text-purple-400">
              <Sparkles className="w-4 h-4" />
              <span>AI-Powered Analysis</span>
            </div>
            <h1 className="text-3xl md:text-5xl font-bold text-gray-900 mb-3 dark:text-white">
              Skill Gap{" "}
              <span className="bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent">
                Analysis
              </span>
            </h1>
          </div>

          <div className="max-w-lg mx-auto bg-white/80 backdrop-blur-sm rounded-2xl border border-white/30 p-6 sm:p-8 shadow-sm dark:bg-gray-800/80 dark:border-gray-700/50 text-center">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-r from-purple-600 to-indigo-600 flex items-center justify-center mx-auto mb-4 shadow-lg">
              <Upload className="w-8 h-8 text-white" />
            </div>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              Upload Your Resume First
            </h2>
            <p className="text-gray-500 dark:text-gray-400 mb-6">
              We need your resume to analyze your skills and identify gaps.
              Upload your resume to get started with AI-powered skill gap
              analysis.
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

  if (isStatusLoading) {
    return <PageLoader />;
  }

  // Landing info screen - improved responsive
  if ((!analysis && !isLoading && !error) || showInfo) {
    return (
      <div className="min-h-screen">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
          <div className="text-center max-w-3xl mx-auto">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-purple-100 text-purple-700 text-sm font-medium mb-6 dark:bg-purple-900/40 dark:text-purple-300 ring-1 ring-purple-200 dark:ring-purple-800">
              <Sparkles className="w-4 h-4" />
              <span>AI-Powered Insights</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-6 dark:text-white leading-tight">
              Discover Your{" "}
              <span className="bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent">
                True Potential
              </span>
            </h1>
            <p className="text-lg text-gray-600 dark:text-gray-300 mb-10 leading-relaxed">
              We found <span className="font-bold text-purple-600 dark:text-purple-400">{resumeSkills.length} skills</span> in your resume.
              Our advanced AI will cross-reference them specifically against the <span className="font-semibold text-gray-900 dark:text-white">jobs you have recently applied to</span>, helping you find exactly what you're missing to get hired.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              {analysis && (
                <Button
                  onClick={() => setShowInfo(false)}
                  variant="outline"
                  size="lg"
                  className="w-full sm:w-auto border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 gap-2 px-6 py-3 rounded-xl hover:bg-gray-50 hover:text-gray-900 dark:hover:bg-gray-800 dark:hover:text-white transition-all shadow-sm"
                >
                  Back to Results
                </Button>
              )}
              <Button
                onClick={handleAnalyze}
                disabled={isCachedActive || isLoading}
                size="lg"
                className="w-full sm:w-auto bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white gap-2 px-8 py-3 text-lg rounded-xl shadow-xl hover:shadow-2xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Zap className="w-5 h-5" />
                {isCachedActive ? `Available in ${remainingTimeText}` : analysis ? "Re-analyze Skills" : "Run AI Skill Gap Analysis"}
              </Button>
            </div>
          </div>

          <div className="mb-16">
            <h2 className="text-2xl font-bold text-center text-gray-900 dark:text-white mb-10">
              How It Works
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
              <Card className="bg-white/60 dark:bg-gray-800/60 backdrop-blur-md border border-gray-200/50 dark:border-gray-700/50 p-6 md:p-8 hover:shadow-xl transition-all duration-300 rounded-2xl group">
                <div className="w-14 h-14 rounded-2xl bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <FileText className="w-7 h-7 text-blue-600 dark:text-blue-400" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">1. Resume Parsing</h3>
                <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                  We start by extracting all the hard and soft skills you already possess directly from your uploaded resume.
                </p>
              </Card>

              <Card className="bg-white/60 dark:bg-gray-800/60 backdrop-blur-md border border-gray-200/50 dark:border-gray-700/50 p-6 md:p-8 hover:shadow-xl transition-all duration-300 rounded-2xl group relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-purple-500/10 to-indigo-500/10 rounded-bl-full -z-10" />
                <div className="w-14 h-14 rounded-2xl bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <TrendingUp className="w-7 h-7 text-purple-600 dark:text-purple-400" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">2. Applied Jobs Analysis</h3>
                <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                  You apply to jobs you love, and our AI scans the exact requirements and preferred skills of those specific jobs.
                </p>
              </Card>

              <Card className="bg-white/60 dark:bg-gray-800/60 backdrop-blur-md border border-gray-200/50 dark:border-gray-700/50 p-6 md:p-8 hover:shadow-xl transition-all duration-300 rounded-2xl group">
                <div className="w-14 h-14 rounded-2xl bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <Target className="w-7 h-7 text-emerald-600 dark:text-emerald-400" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">3. Gap Identification</h3>
                <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                  We compare your profile directly against the jobs you applied for to highlight exactly what you need to learn.
                </p>
              </Card>
            </div>
          </div>

          <div className="bg-gradient-to-r from-gray-900 to-gray-800 dark:from-gray-950 dark:to-gray-900 rounded-3xl p-8 lg:p-12 text-center lg:text-left shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-purple-500/20 rounded-full filter blur-3xl -mr-20 -mt-20" />
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-indigo-500/20 rounded-full filter blur-3xl -ml-20 -mb-20" />

            <div className="relative z-10 flex flex-col lg:flex-row items-center gap-8">
              <div className="flex-1">
                <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">What You'll Get</h2>
                <p className="text-gray-300 text-base md:text-lg mb-6 leading-relaxed">
                  The analysis provides a comprehensive breakdown of your professional standing.
                </p>
                <div className="grid sm:grid-cols-2 gap-5">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center flex-shrink-0">
                      <Target className="w-5 h-5 text-purple-400" />
                    </div>
                    <div>
                      <h4 className="text-white font-semibold mb-1">Priority Skills</h4>
                      <p className="text-gray-400 text-sm">Ranked list of missing skills based on market demand.</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center flex-shrink-0">
                      <TrendingUp className="w-5 h-5 text-emerald-400" />
                    </div>
                    <div>
                      <h4 className="text-white font-semibold mb-1">Market Readiness</h4>
                      <p className="text-gray-400 text-sm">A clear score indicating how ready you are for your dream job.</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center flex-shrink-0">
                      <BookOpen className="w-5 h-5 text-blue-400" />
                    </div>
                    <div>
                      <h4 className="text-white font-semibold mb-1">Learning Resources</h4>
                      <p className="text-gray-400 text-sm">Curated courses and tutorials to bridge your skill gaps.</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return <AiLoadingState type="skillgap" />;
  }

  if (error) {
    return (
      <div className="min-h-screen">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
          <div className="text-center mb-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-100 text-purple-600 text-sm mb-4 dark:bg-purple-900/30 dark:text-purple-400">
              <Sparkles className="w-4 h-4" />
              <span>AI-Powered Analysis</span>
            </div>
            <h1 className="text-3xl md:text-5xl font-bold text-gray-900 mb-3 dark:text-white">
              Skill Gap{" "}
              <span className="bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent">
                Analysis
              </span>
            </h1>
          </div>

          <div className="max-w-lg mx-auto bg-white/80 backdrop-blur-sm rounded-2xl border border-white/30 p-6 sm:p-8 shadow-sm dark:bg-gray-800/80 dark:border-gray-700/50 text-center">
            <div className="w-16 h-16 rounded-2xl bg-red-100 dark:bg-red-900/30 flex items-center justify-center mx-auto mb-4">
              <AlertCircle className="w-8 h-8 text-red-600 dark:text-red-400" />
            </div>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              Analysis Failed
            </h2>
            <p className="text-gray-500 dark:text-gray-400 mb-6">
              {error?.data?.message || "Something went wrong. Please try again."}
            </p>
            <Button
              onClick={handleAnalyze}
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

  // Analysis results - improved responsiveness, spacing, and dark mode consistency
  return (
    <div className="min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Hero Header */}
        <div className="text-center mb-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-100 text-purple-600 text-sm mb-4 dark:bg-purple-900/30 dark:text-purple-400">
            <Sparkles className="w-4 h-4" />
            <span>AI-Powered Analysis</span>
          </div>
          <h1 className="text-3xl md:text-5xl font-bold text-gray-900 mb-3 dark:text-white">
            Skill Gap{" "}
            <span className="bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent">
              Analysis
            </span>
          </h1>
          <div className="text-gray-500 text-base md:text-lg max-w-3xl mx-auto dark:text-gray-400">
            {summary ? (
              <div className="flex flex-col items-center">
                <p className="leading-relaxed">
                  {showFullSummary || summary.length <= 200
                    ? summary
                    : `${summary.substring(0, 200)}...`}
                </p>
                {summary.length > 200 && (
                  <button
                    onClick={() => setShowFullSummary(!showFullSummary)}
                    className="mt-4 px-5 py-1.5 bg-purple-100 hover:bg-purple-200 text-purple-700 dark:bg-purple-900/50 dark:hover:bg-purple-900/70 dark:text-purple-300 text-sm font-semibold rounded-full transition-all duration-200 focus:outline-none shadow-sm"
                  >
                    {showFullSummary ? "View less" : "View more"}
                  </button>
                )}
              </div>
            ) : (
              <p>Identify and bridge the gaps between your current skills and market demands</p>
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
              onClick={handleAnalyze}
              variant="outline"
              size="sm"
              disabled={isCachedActive || isLoading}
              className="gap-2 border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-50 hover:text-gray-900 dark:hover:bg-gray-800 dark:hover:text-white disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <RefreshCw className={`w-3 h-3 ${isLoading ? "animate-spin" : ""}`} />
              {isCachedActive ? `Available in ${remainingTimeText}` : "Re-analyze"}
            </Button>
          </div>
        </div>

        {/* Stats Cards - improved responsive grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          <div className="group bg-white/80 backdrop-blur-sm rounded-2xl border border-white/30 p-5 sm:p-6 shadow-sm dark:bg-gray-800/80 dark:border-gray-700/50 hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
            <div className="flex items-center justify-between mb-3">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 flex items-center justify-center shadow-md group-hover:scale-110 transition-transform">
                <CheckCircle2 className="w-6 h-6 text-white" />
              </div>
              <Badge variant="success" className="text-xs">Mastered</Badge>
            </div>
            <div className="text-3xl font-bold text-gray-900 dark:text-white">{currentSkills.length}</div>
            <div className="text-sm text-gray-500 dark:text-gray-400 mt-1">Current Skills</div>
          </div>

          <div className="group bg-white/80 backdrop-blur-sm rounded-2xl border border-white/30 p-5 sm:p-6 shadow-sm dark:bg-gray-800/80 dark:border-gray-700/50 hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
            <div className="flex items-center justify-between mb-3">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-r from-amber-500 to-orange-600 flex items-center justify-center shadow-md group-hover:scale-110 transition-transform">
                <Target className="w-6 h-6 text-white" />
              </div>
              <Badge variant="warning" className="text-xs">To Learn</Badge>
            </div>
            <div className="text-3xl font-bold text-gray-900 dark:text-white">{missingSkills.length}</div>
            <div className="text-sm text-gray-500 dark:text-gray-400 mt-1">Skills to Learn</div>
          </div>

          <div className="group bg-white/80 backdrop-blur-sm rounded-2xl border border-white/30 p-5 sm:p-6 shadow-sm dark:bg-gray-800/80 dark:border-gray-700/50 hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
            <div className="flex items-center justify-between mb-3">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 flex items-center justify-center shadow-md group-hover:scale-110 transition-transform">
                <TrendingUp className="w-6 h-6 text-white" />
              </div>
              <Badge variant="primary" className="text-xs">Ready</Badge>
            </div>
            <div className="text-3xl font-bold text-gray-900 dark:text-white">{marketReadiness}%</div>
            <div className="text-sm text-gray-500 dark:text-gray-400 mt-1">Market Readiness</div>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Current Skills Card */}
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-white/30 shadow-sm overflow-hidden dark:bg-gray-800/80 dark:border-gray-700/50">
            <div className="p-5 sm:p-6 border-b border-gray-200 dark:border-gray-800 bg-gradient-to-r from-emerald-50/30 to-teal-50/30 dark:from-emerald-950/20 dark:to-teal-950/20">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 flex items-center justify-center shadow-md">
                    <CheckCircle2 className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                      Your Current Skills
                    </h2>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Skills you've already mastered
                    </p>
                  </div>
                </div>
                <Badge variant="success" className="text-sm px-3 py-1 self-start sm:self-center">
                  {currentSkills.length} Skills
                </Badge>
              </div>
            </div>
            <div className="p-5 sm:p-6 space-y-5">
              {currentSkills.length === 0 ? (
                <p className="text-sm text-gray-500 dark:text-gray-400 text-center py-4">
                  No matching skills found
                </p>
              ) : (
                currentSkills.map((skill, index) => (
                  <div
                    key={skill.name}
                    className="group animate-in fade-in slide-in-from-bottom duration-500"
                    style={{ animationDelay: `${index * 100}ms` }}
                  >
                    <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-emerald-500 dark:bg-emerald-400"></div>
                        <span className="font-medium text-gray-900 dark:text-white">
                          {skill.name}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge
                          variant="default"
                          className="text-xs bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400"
                        >
                          {skill.category}
                        </Badge>
                        <span className="text-sm font-semibold text-emerald-600 dark:text-emerald-400">
                          {skill.level}%
                        </span>
                      </div>
                    </div>
                    <ProgressBar
                      value={skill.level}
                      showPercentage={false}
                      variant="success"
                    />
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Skills Gap Card */}
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-white/30 shadow-sm overflow-hidden dark:bg-gray-800/80 dark:border-gray-700/50">
            <div className="p-5 sm:p-6 border-b border-gray-200 dark:border-gray-800 bg-gradient-to-r from-amber-50/30 to-orange-50/30 dark:from-amber-950/20 dark:to-orange-950/20">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-r from-amber-500 to-orange-600 flex items-center justify-center shadow-md">
                    <Target className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                      Skills Gap Identified
                    </h2>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Skills to focus on for career growth
                    </p>
                  </div>
                </div>
                <Badge variant="warning" className="text-sm px-3 py-1 self-start sm:self-center">
                  {missingSkills.length} Missing
                </Badge>
              </div>
            </div>
            <div className="p-5 sm:p-6 space-y-4">
              {missingSkills.length === 0 ? (
                <p className="text-sm text-gray-500 dark:text-gray-400 text-center py-4">
                  No skill gaps found — great job!
                </p>
              ) : (
                missingSkills.map((skill) => (
                  <div
                    key={skill.name}
                    className="group cursor-pointer"
                    onClick={() => setSelectedSkill(skill.name)}
                  >
                    <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-amber-500 dark:bg-amber-400"></div>
                        <span className="font-medium text-gray-900 dark:text-white">
                          {skill.name}
                        </span>
                      </div>
                      <Badge
                        className={`bg-gradient-to-r ${getImportanceColor(skill.importance)} text-white text-xs px-2 py-1`}
                      >
                        {skill.importance} Priority
                      </Badge>
                    </div>
                    <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-gray-500 dark:text-gray-400 mb-2">
                      <span>{skill.category}</span>
                      <span>Market Demand: {skill.demand}%</span>
                    </div>
                    <ProgressBar
                      value={skill.demand}
                      showPercentage={false}
                      variant="warning"
                    />
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Learning Resources Section - improved responsiveness */}
        {recommendations.length > 0 && (
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-white/30 shadow-sm overflow-hidden dark:bg-gray-800/80 dark:border-gray-700/50">
            <div className="p-5 sm:p-6 border-b border-gray-200 dark:border-gray-800 bg-gradient-to-r from-blue-50/30 to-cyan-50/30 dark:from-blue-950/20 dark:to-cyan-950/20">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-r from-blue-500 to-cyan-600 flex items-center justify-center shadow-md">
                  <BookOpen className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                    Recommended Learning Resources
                  </h2>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Curated courses and materials to bridge your skill gaps
                  </p>
                </div>
              </div>
            </div>
            <div className="p-5 sm:p-6 space-y-8">
              {recommendations.map((rec) => (
                <div key={rec.skill} className="space-y-4">
                  <div className="flex flex-wrap items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center">
                      <Target className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                    </div>
                    <h3 className="font-semibold text-gray-900 dark:text-white text-lg">
                      {rec.skill}
                    </h3>
                    <Badge variant="primary" className="text-xs">Focus Area</Badge>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {rec.resources.map((resource, i) => (
                      <div
                        key={i}
                        className="group bg-gray-50 dark:bg-gray-800/50 rounded-xl p-4 border border-gray-200 dark:border-gray-700 hover:shadow-md transition-all duration-300 hover:-translate-y-1"
                      >
                        <div className="flex items-start gap-3">
                          <div className="w-10 h-10 rounded-lg bg-white dark:bg-gray-700 shadow-sm flex items-center justify-center flex-shrink-0">
                            {resource.type === "Course" && (
                              <BookOpen className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                            )}
                            {resource.type === "Video" && (
                              <Video className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                            )}
                            {(resource.type === "Article" ||
                              resource.type === "Practice") && (
                                <FileText className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                              )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <Badge
                              variant="primary"
                              className="mb-2 text-xs bg-purple-100 text-purple-700 dark:bg-purple-900/50 dark:text-purple-400"
                            >
                              {resource.type}
                            </Badge>
                            <h4 className="font-medium text-sm text-gray-900 dark:text-white mb-1 line-clamp-2">
                              {resource.title}
                            </h4>
                            <p className="text-xs text-gray-500 dark:text-gray-400">
                              {resource.platform}
                            </p>
                            <div className="flex items-center gap-1 mt-1">
                              <Clock className="w-3 h-3 text-gray-400 dark:text-gray-500" />
                              <p className="text-xs text-gray-400 dark:text-gray-500">
                                {resource.duration}
                              </p>
                            </div>
                          </div>
                        </div>
                        {resource.url ? (
                          <a
                            href={resource.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="block mt-3"
                          >
                            <Button
                              variant="outline"
                              size="sm"
                              className="w-full gap-1 border-gray-200 dark:border-gray-700 hover:border-purple-200 dark:hover:border-purple-700 hover:bg-purple-50 hover:text-purple-700 dark:hover:bg-purple-900/20 dark:hover:text-purple-300 transition-colors"
                            >
                              Start Learning{" "}
                              <ExternalLink className="w-3 h-3" />
                            </Button>
                          </a>
                        ) : (
                          <Button
                            variant="outline"
                            size="sm"
                            className="w-full mt-3 gap-1 border-gray-200 dark:border-gray-700 hover:border-purple-200 dark:hover:border-purple-700 hover:bg-purple-50 hover:text-purple-700 dark:hover:bg-purple-900/20 dark:hover:text-purple-300 transition-colors"
                          >
                            Start Learning{" "}
                            <ExternalLink className="w-3 h-3" />
                          </Button>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* AI Roadmap CTA - improved responsive */}
        <div className="bg-gradient-to-r from-purple-600 to-indigo-600 rounded-2xl p-6 sm:p-8 relative overflow-hidden shadow-lg">
          <div className="absolute top-0 right-0 w-40 h-40 bg-white/10 rounded-full -mr-20 -mt-20" />
          <div className="absolute bottom-0 left-0 w-32 h-32 bg-white/5 rounded-full -ml-16 -mb-16" />
          <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="flex items-start gap-4">
              <div className="w-14 h-14 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center flex-shrink-0">
                <Zap className="w-7 h-7 text-white" />
              </div>
              <div>
                <h3 className="text-xl font-semibold text-white mb-2">
                  Ready to Start Learning?
                </h3>
                <p className="text-white/90 max-w-md">
                  We've created a personalized 30-day roadmap to help you
                  master these skills and accelerate your career.
                </p>
              </div>
            </div>
            <Button
              onClick={() => navigate("/app/roadmap")}
              className="bg-white text-purple-600 hover:bg-gray-100 shadow-lg hover:shadow-xl transition-all px-6 gap-2 whitespace-nowrap"
            >
              View AI Roadmap <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Pro Tips Section - improved responsive grid */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-white/30 p-5 sm:p-6 shadow-sm dark:bg-gray-800/80 dark:border-gray-700/50">
          <div className="flex items-center gap-2 mb-4">
            <AlertCircle className="w-5 h-5 text-purple-600 dark:text-purple-400" />
            <h3 className="font-semibold text-gray-900 dark:text-white">
              Pro Tips for Skill Development
            </h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex items-start gap-3 p-3 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
              <div className="w-8 h-8 rounded-lg bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center shrink-0">
                <span className="text-purple-600 dark:text-purple-400 text-sm font-bold">1</span>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-900 dark:text-white">Focus on High Demand Skills</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">Prioritize skills with 80%+ market demand</p>
              </div>
            </div>
            <div className="flex items-start gap-3 p-3 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
              <div className="w-8 h-8 rounded-lg bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center shrink-0">
                <span className="text-purple-600 dark:text-purple-400 text-sm font-bold">2</span>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-900 dark:text-white">Learn by Doing</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">Build projects to reinforce learning</p>
              </div>
            </div>
            <div className="flex items-start gap-3 p-3 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
              <div className="w-8 h-8 rounded-lg bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center shrink-0">
                <span className="text-purple-600 dark:text-purple-400 text-sm font-bold">3</span>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-900 dark:text-white">Track Your Progress</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">Set weekly learning goals</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}