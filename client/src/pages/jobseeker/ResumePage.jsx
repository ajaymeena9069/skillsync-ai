// client/src/pages/ResumePage.jsx
import {
  Upload,
  FileText,
  Check,
  Sparkles,
  Briefcase,
  GraduationCap,
  Code,
  TrendingUp,
  AlertCircle,
  Star,
  Award,
  Clock,
} from "lucide-react";
import { Button } from "../../components/Button";
import { Badge } from "../../components/Badge";
import { ResumeUpload } from "../../components/resume-upload";
import { useGetResumeQuery } from "../../services/resumeApi";
import { PageLoader } from "../../components/PageLoader";

export function ResumePage() {
  const { data: resumeData, isLoading, refetch } = useGetResumeQuery();

  const hasResume = resumeData?.data && resumeData.data.skills?.length > 0;
  const extractedData = resumeData?.data || null;

  const calculateRealisticScore = (data) => {
    if (!data) return 0;
    let score = 0;
    if (data?.skills?.length >= 15) score += 40;
    else if (data?.skills?.length >= 10) score += 35;
    else if (data?.skills?.length >= 5) score += 25;
    else if (data?.skills?.length > 0) score += 15;
    const degreeCount = (data?.education || []).filter(e => e.type !== "school").length;
    if (degreeCount >= 2) score += 25;
    else if (degreeCount === 1) score += 15;
    if (data?.projects?.length >= 2) score += 20;
    else if (data?.projects?.length === 1) score += 10;
    if (
      data?.experience &&
      data.experience !== "0 years" &&
      data.experience !== "Not specified" &&
      data.experience !== "Fresher"
    ) {
      score += 15;
    } else if (data?.experience === "Fresher") {
      score += 5;
    }
    const isFresher =
      data?.experience === "Fresher" || data?.experience === "0 years";
    return isFresher ? Math.min(score, 85) : Math.min(score, 100);
  };

  const finalScore = calculateRealisticScore(extractedData);

  const getScoreColor = (score) => {
    if (score >= 80) return "text-emerald-600";
    if (score >= 60) return "text-amber-600";
    return "text-red-500";
  };

  const getScoreRingColor = (score) => {
    if (score >= 80) return "stroke-emerald-500";
    if (score >= 60) return "stroke-amber-500";
    return "stroke-red-500";
  };

  const getScoreLabel = (score) => {
    if (score >= 80) return "Excellent";
    if (score >= 70) return "Good";
    if (score >= 60) return "Average";
    return "Needs Improvement";
  };

  if (isLoading) {
    return <PageLoader />;
  }

  return (
    <div className="min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Hero Header */}
        <div className="text-center mb-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-100 text-purple-600 text-sm mb-4 dark:bg-purple-900/30 dark:text-purple-400">
            <Sparkles className="w-4 h-4" />
            <span>AI-Powered Analysis</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-3 dark:text-white">
            Resume{" "}
            <span className="bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent">
              Intelligence
            </span>
          </h1>
          <p className="text-gray-500 text-lg max-w-2xl mx-auto dark:text-gray-400">
            {hasResume
              ? "Your resume has been analyzed. Here's what we found."
              : "Upload your resume to unlock AI-powered insights and recommendations"}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            <ResumeUpload onUploadComplete={() => refetch()} />

            {hasResume && (
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-white/30 dark:bg-gray-800/80 dark:border-gray-700/50 shadow-sm overflow-hidden">
                <div className="p-6 border-b border-gray-200 dark:border-gray-800/50 bg-gradient-to-r from-purple-50/50 to-indigo-50/50 dark:from-purple-900/20 dark:to-indigo-900/20">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-600 to-indigo-600 flex items-center justify-center shadow-md">
                      <Sparkles className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                        AI Analysis Complete
                      </h2>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        Based on your uploaded resume
                      </p>
                    </div>
                  </div>
                </div>

                <div className="p-6 space-y-8">
                  {/* Skills Section */}
                  {extractedData.skills?.length > 0 && (
                    <div>
                      <div className="flex items-center gap-2 mb-4">
                        <div className="w-8 h-8 rounded-lg bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center">
                          <Code className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                        </div>
                        <h3 className="font-semibold text-gray-900 dark:text-white">
                          Extracted Skills
                        </h3>
                        <Badge variant="primary" className="text-xs ml-2">
                          {extractedData.skills.length}
                        </Badge>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {extractedData.skills.map((skill) => (
                          <span
                            key={skill}
                            className="text-sm text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-800/50 px-3 py-1.5 rounded-full"
                          >
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Experience Section */}
                  {extractedData.experience &&
                    extractedData.experience !== "Not specified" && (
                      <div className="border-t border-gray-100 dark:border-gray-800/60 pt-6">
                        <div className="flex items-center gap-2 mb-4">
                          <div className="w-8 h-8 rounded-lg bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                            <Briefcase className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                          </div>
                          <h3 className="font-semibold text-gray-900 dark:text-white">
                            Experience Summary
                          </h3>
                        </div>
                        <div className="bg-gray-50 dark:bg-gray-800/60 rounded-xl p-4 border border-gray-100 dark:border-gray-800/60">
                          {extractedData.experience === "Fresher" ||
                          extractedData.experience === "0 years" ? (
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 rounded-full bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center">
                                <GraduationCap className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                              </div>
                              <div>
                                <p className="font-medium text-gray-900 dark:text-white">
                                  Fresher / Entry Level
                                </p>
                                <p className="text-sm text-gray-500 dark:text-gray-400">
                                  You're at the start of your career journey —
                                  focus on building projects and gaining skills!
                                </p>
                              </div>
                            </div>
                          ) : (
                            <p className="text-gray-700 dark:text-gray-300">
                              {extractedData.experience}
                            </p>
                          )}
                        </div>
                      </div>
                    )}

                  {/* Projects Section */}
                  {extractedData.projects?.length > 0 && (
                    <div className="border-t border-gray-100 dark:border-gray-800/60 pt-6">
                      <div className="flex items-center gap-2 mb-4">
                        <div className="w-8 h-8 rounded-lg bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center">
                          <FileText className="w-4 h-4 text-emerald-600 dark:text-emerald-300" />
                        </div>
                        <h3 className="font-semibold text-gray-900 dark:text-white">
                          Projects
                        </h3>
                        <Badge variant="success" className="text-xs ml-2">
                          {extractedData.projects.length}
                        </Badge>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {extractedData.projects.map((project, i) => (
                          <div
                            key={i}
                            className="bg-gray-50 dark:bg-gray-800/60 rounded-xl p-4 border border-gray-100 dark:border-gray-800/60 hover:shadow-md transition-all"
                          >
                            <h4 className="font-medium text-gray-900 dark:text-white mb-1">
                              {project.name}
                            </h4>
                            <p className="text-sm text-gray-500 dark:text-gray-400 line-clamp-2">
                              {project.description}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Degrees Section */}
                  {extractedData.education?.filter(e => e.type !== "school").length > 0 && (
                    <div className="border-t border-gray-100 dark:border-gray-800/60 pt-6">
                      <div className="flex items-center gap-2 mb-4">
                        <div className="w-8 h-8 rounded-lg bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center">
                          <GraduationCap className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                        </div>
                        <h3 className="font-semibold text-gray-900 dark:text-white">
                          Degrees
                        </h3>
                      </div>
                      <div className="space-y-3">
                        {extractedData.education.filter(e => e.type !== "school").map((edu, index) => (
                          <div
                            key={index}
                            className="bg-gray-50 dark:bg-gray-800/60 rounded-xl p-4 border border-gray-100 dark:border-gray-800/60"
                          >
                            <h4 className="font-medium text-gray-900 dark:text-white">
                              {edu.degree}
                            </h4>
                            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                              {edu.institution}
                              {edu.year !== "Not specified" && ` • ${edu.year}`}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* School Education Section */}
                  {extractedData.education?.filter(e => e.type === "school").length > 0 && (
                    <div className="border-t border-gray-100 dark:border-gray-800/60 pt-6">
                      <div className="flex items-center gap-2 mb-4">
                        <div className="w-8 h-8 rounded-lg bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center">
                          <GraduationCap className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                        </div>
                        <h3 className="font-semibold text-gray-900 dark:text-white">
                          School Education
                        </h3>
                      </div>
                      <div className="space-y-3">
                        {extractedData.education.filter(e => e.type === "school").map((edu, index) => (
                          <div
                            key={index}
                            className="bg-amber-50/50 dark:bg-amber-900/10 rounded-xl p-4 border border-amber-100 dark:border-amber-800/30"
                          >
                            <h4 className="font-medium text-gray-900 dark:text-white">
                              {edu.degree}
                            </h4>
                            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                              {edu.institution}
                              {edu.year !== "Not specified" && ` • ${edu.year}`}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {!hasResume && !isLoading && (
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-white/30 p-12 text-center shadow-sm dark:bg-gray-800/80 dark:border-gray-700/50">
                <div className="w-20 h-20 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Upload className="w-10 h-10 text-gray-400 dark:text-gray-300" />
                </div>
                <h3 className="text-xl font-medium text-gray-900 dark:text-white mb-2">
                  No Resume Found
                </h3>
                <p className="text-gray-500 dark:text-gray-400 max-w-md mx-auto">
                  Upload your resume using the form above to get AI-powered
                  insights and recommendations.
                </p>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {hasResume && (
              <>
                {/* Resume Score Card */}
                <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-white/30 p-6 shadow-sm dark:bg-gray-800/80 dark:border-gray-700/50">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                      <Award className="w-5 h-5 text-purple-600" />
                      <h3 className="font-semibold text-gray-900 dark:text-white">
                        Resume Score
                      </h3>
                    </div>
                    <Badge variant="primary" className="text-xs">
                      AI Powered
                    </Badge>
                  </div>

                  <div className="text-center mb-5">
                    <div className="relative inline-flex items-center justify-center">
                      <svg className="w-36 h-36 transform -rotate-90">
                        <circle
                          cx="72"
                          cy="72"
                          r="64"
                          stroke="currentColor"
                          strokeWidth="8"
                          fill="none"
                          className="text-gray-200"
                        />
                        <circle
                          cx="72"
                          cy="72"
                          r="64"
                          stroke="currentColor"
                          strokeWidth="8"
                          fill="none"
                          strokeDasharray={`${2 * Math.PI * 64}`}
                          strokeDashoffset={`${2 * Math.PI * 64 * (1 - finalScore / 100)}`}
                          className={`${getScoreRingColor(finalScore)} transition-all duration-1000`}
                          strokeLinecap="round"
                        />
                      </svg>
                      <div className="absolute text-center">
                        <div
                          className={`text-4xl font-bold ${getScoreColor(finalScore)}`}
                        >
                          {finalScore}
                        </div>
                        <div className="text-xs text-gray-500">/ 100</div>
                      </div>
                    </div>
                    <p
                      className={`text-sm font-medium mt-3 ${getScoreColor(finalScore)}`}
                    >
                      {getScoreLabel(finalScore)}
                    </p>
                  </div>

                  <div className="space-y-3 pt-3 border-t border-gray-100 dark:border-gray-800/60">
                    <div className="flex justify-between items-center">
                      <span className="text-sm flex items-center gap-1.5 text-gray-500 dark:text-gray-400">
                        <Code className="w-3.5 h-3.5 text-gray-400" /> Skills
                      </span>
                      <Badge
                        variant={
                          extractedData.skills?.length > 10
                            ? "success"
                            : "warning"
                        }
                        className="text-xs"
                      >
                        {extractedData.skills?.length || 0} skills
                      </Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm flex items-center gap-1.5">
                        <Briefcase className="w-3.5 h-3.5 text-gray-400" />{" "}
                        Experience
                      </span>
                      <Badge
                        variant={
                          extractedData.experience &&
                          extractedData.experience !== "Not specified"
                            ? "success"
                            : "warning"
                        }
                        className="text-xs"
                      >
                        {extractedData.experience === "Fresher" ||
                        extractedData.experience === "0 years" ||
                        extractedData.experience === "Not specified"
                          ? "Fresher"
                          : extractedData.experience}
                      </Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm flex items-center gap-1.5">
                        <GraduationCap className="w-3.5 h-3.5 text-gray-400" />{" "}
                        Education
                      </span>
                      <Badge
                        variant={
                          extractedData.education?.length > 0
                            ? "success"
                            : "warning"
                        }
                        className="text-xs"
                      >
                        {(extractedData.education || []).filter(e => e.type !== "school").length} degrees
                        {(extractedData.education || []).some(e => e.type === "school") &&
                          ` + school`}
                      </Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm flex items-center gap-1.5">
                        <FileText className="w-3.5 h-3.5 text-gray-400" />{" "}
                        Projects
                      </span>
                      <Badge
                        variant={
                          extractedData.projects?.length > 0
                            ? "success"
                            : "warning"
                        }
                        className="text-xs"
                      >
                        {extractedData.projects?.length || 0} projects
                      </Badge>
                    </div>
                  </div>
                </div>

                {/* AI Recommendations Card */}
                <div className="bg-gradient-to-r from-purple-600 to-indigo-600 rounded-2xl p-6 text-white relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16" />
                  <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/5 rounded-full -ml-12 -mb-12" />
                  <div className="relative z-10">
                    <div className="flex items-center gap-2 mb-4">
                      <Sparkles className="w-6 h-6" />
                      <h3 className="text-lg font-semibold">
                        AI Recommendations
                      </h3>
                    </div>
                    <ul className="space-y-3 text-sm text-white/90">
                      {extractedData.skills?.length < 10 && (
                        <li className="flex items-start gap-2">
                          <Check className="w-4 h-4 mt-0.5 flex-shrink-0" />
                          Add {10 - extractedData.skills.length} more technical
                          skills
                        </li>
                      )}
                      {extractedData.projects?.length < 2 && (
                        <li className="flex items-start gap-2">
                          <Check className="w-4 h-4 mt-0.5 flex-shrink-0" />
                          Add more projects to showcase experience
                        </li>
                      )}
                      {(!extractedData.experience ||
                        extractedData.experience === "Not specified") && (
                        <li className="flex items-start gap-2">
                          <Check className="w-4 h-4 mt-0.5 flex-shrink-0" />
                          Include internships or freelance work
                        </li>
                      )}
                      {extractedData.skills?.length >= 10 &&
                        extractedData.projects?.length >= 1 && (
                          <li className="flex items-start gap-2">
                            <Star className="w-4 h-4 mt-0.5 flex-shrink-0" />
                            Your profile looks strong! Start applying
                          </li>
                        )}
                    </ul>
                  </div>
                </div>

                {/* Quick Actions */}
                <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-white/30 p-5 shadow-sm dark:bg-gray-800/80 dark:border-gray-700/50">
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                    <Clock className="w-4 h-4 text-purple-600" />
                    Quick Actions
                  </h3>
                  <div className="space-y-2">
                    <Button
                      variant="outline"
                      className="w-full justify-start gap-2 text-gray-900 dark:text-white"
                    >
                      <Briefcase className="w-4 h-4" /> Find Matching Jobs
                    </Button>
                    <Button
                      variant="outline"
                      className="w-full justify-start gap-2"
                    >
                      <Sparkles className="w-4 h-4" /> Generate Skill Roadmap
                    </Button>
                    <Button
                      variant="outline"
                      className="w-full justify-start gap-2"
                    >
                      <TrendingUp className="w-4 h-4" /> View Skill Gap Analysis
                    </Button>
                  </div>
                </div>
              </>
            )}

            {!hasResume && (
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-white/30 p-6 shadow-sm dark:bg-gray-800/80 dark:border-gray-700/50">
                <div className="flex items-center gap-2 mb-3">
                  <AlertCircle className="w-5 h-5 text-purple-600" />
                  <h3 className="font-semibold text-gray-900 dark:text-white">Pro Tips</h3>
                </div>
                <ul className="space-y-2 text-sm text-gray-400 dark:text-gray-300">
                  <li className="flex items-start gap-2">
                    <Check className="w-3.5 h-3.5 text-emerald-500 mt-0.5" />
                    Upload PDF or DOC format
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="w-3.5 h-3.5 text-emerald-500 mt-0.5" />
                    Keep file size under 5MB
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="w-3.5 h-3.5 text-emerald-500 mt-0.5" />
                    Include relevant skills and projects
                  </li>
                </ul>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
