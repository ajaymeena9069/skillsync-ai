// src/components/common/AIAnalysisModal.jsx
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { createPortal } from "react-dom";
import {
  X,
  Brain,
  Loader2,
  Sparkles,
  CheckCircle2,
  TrendingUp,
  Lightbulb,
  AlertCircle,
  ThumbsUp,
  ThumbsDown,
  Star,
  Code,
  Award,
  Zap,
} from "lucide-react";
import { Button } from "./Button";
import { useGetCandidateMatchAnalysisQuery } from "../services/matchApi";

export function AIAnalysisModal({
  isOpen,
  onClose,
  applicationId,
  candidateName,
  jobTitle,
}) {
  const [shouldFetch, setShouldFetch] = useState(false);
  const { data, isLoading, refetch } = useGetCandidateMatchAnalysisQuery(applicationId, {
    skip: !shouldFetch,
  });

  const analysis = data?.data;

  useEffect(() => {
    if (isOpen && !shouldFetch) {
      setShouldFetch(true);
    }
  }, [isOpen, shouldFetch]);

  if (typeof document === "undefined") return null;

  const getScoreLevel = (score) => {
    if (score >= 80) return { label: "Excellent", color: "emerald", icon: Award };
    if (score >= 60) return { label: "Good", color: "amber", icon: Star };
    return { label: "Low", color: "red", icon: AlertCircle };
  };

  const scoreLevel = analysis ? getScoreLevel(analysis.matchScore) : null;

  return createPortal(
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[9999]"
          />

          {/* Modal Container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 20 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[90vw] max-w-2xl max-h-[85vh] bg-white dark:bg-gray-900 rounded-2xl shadow-2xl overflow-hidden z-[10000] flex flex-col"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 dark:border-gray-800 bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-xl bg-gradient-to-br from-purple-100 to-indigo-100 dark:from-purple-900/40 dark:to-indigo-900/40">
                  <Brain className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                </div>
                <div>
                  <h2 className="text-lg font-semibold text-gray-900 dark:text-white">AI Deep Analysis</h2>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Powered by Gemini AI</p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>

            {/* Scrollable Content */}
            <div className="flex-1 overflow-y-auto px-6 py-6 space-y-6">
              {/* Candidate & Job Info */}
              <div className="bg-gradient-to-r from-purple-50/80 to-indigo-50/80 dark:from-purple-900/20 dark:to-indigo-900/20 rounded-xl p-4 border border-purple-100 dark:border-purple-800/50">
                <p className="text-sm text-gray-700 dark:text-gray-300 text-center">
                  Analyzing <span className="font-semibold text-purple-700 dark:text-purple-300">{candidateName}</span> for{" "}
                  <span className="font-semibold text-purple-700 dark:text-purple-300">{jobTitle}</span>
                </p>
              </div>

              {isLoading ? (
                <div className="flex flex-col items-center justify-center py-12">
                  <div className="relative">
                    <div className="absolute inset-0 rounded-full bg-purple-500/20 blur-xl animate-pulse" />
                    <Loader2 className="w-12 h-12 text-purple-600 animate-spin relative" />
                  </div>
                  <p className="mt-4 text-sm text-gray-500 dark:text-gray-400">AI is analyzing candidate fit...</p>
                </div>
              ) : analysis ? (
                <div className="space-y-6">
                  {/* Score Card */}
                  <div className="bg-gradient-to-br from-purple-600 to-indigo-600 rounded-2xl p-5 text-white shadow-lg">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-purple-100 text-sm font-medium">Overall Match Score</p>
                        <p className="text-4xl font-bold tracking-tight">{analysis.matchScore}%</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-16 h-16 relative">
                          <svg className="w-full h-full transform -rotate-90">
                            <circle
                              cx="32"
                              cy="32"
                              r="28"
                              stroke="rgba(255,255,255,0.2)"
                              strokeWidth="6"
                              fill="none"
                            />
                            <circle
                              cx="32"
                              cy="32"
                              r="28"
                              stroke="white"
                              strokeWidth="6"
                              fill="none"
                              strokeDasharray={`${2 * Math.PI * 28}`}
                              strokeDashoffset={`${2 * Math.PI * 28 * (1 - analysis.matchScore / 100)}`}
                              strokeLinecap="round"
                            />
                          </svg>
                        </div>
                        {scoreLevel && (
                          <div className="flex items-center gap-1.5 bg-white/20 backdrop-blur-sm rounded-full px-3 py-1">
                            <scoreLevel.icon className="w-3.5 h-3.5" />
                            <span className="text-xs font-medium">{scoreLevel.label}</span>
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="mt-3 flex gap-2">
                      <span className="text-xs text-purple-100">Based on skill match & job requirements</span>
                    </div>
                  </div>

                  {/* Skills Analysis */}
                  <div className="bg-white dark:bg-gray-800/50 rounded-xl border border-gray-200 dark:border-gray-700 p-5">
                    <div className="flex items-center gap-2 mb-4">
                      <Code className="w-5 h-5 text-purple-500" />
                      <h3 className="font-semibold text-gray-900 dark:text-white">Skills Analysis</h3>
                    </div>
                    <div className="space-y-4">
                      {analysis.strengthMatches?.length > 0 && (
                        <div>
                          <p className="text-sm font-medium text-green-600 dark:text-green-400 mb-2 flex items-center gap-1">
                            <CheckCircle2 className="w-4 h-4" />
                            Strengths ({analysis.strengthMatches.length})
                          </p>
                          <div className="flex flex-wrap gap-2">
                            {analysis.strengthMatches.map((skill) => (
                              <span
                                key={skill}
                                className="px-3 py-1.5 bg-green-100 text-green-700 rounded-full text-xs font-medium dark:bg-green-900/30 dark:text-green-400"
                              >
                                {skill}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                      {analysis.gapSkills?.length > 0 && (
                        <div>
                          <p className="text-sm font-medium text-red-600 dark:text-red-400 mb-2 flex items-center gap-1">
                            <AlertCircle className="w-4 h-4" />
                            Skill Gaps ({analysis.gapSkills.length})
                          </p>
                          <div className="flex flex-wrap gap-2">
                            {analysis.gapSkills.map((skill) => (
                              <span
                                key={skill}
                                className="px-3 py-1.5 bg-red-100 text-red-700 rounded-full text-xs font-medium dark:bg-red-900/30 dark:text-red-400"
                              >
                                {skill}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Fit Analysis */}
                  <div className="bg-white dark:bg-gray-800/50 rounded-xl border border-gray-200 dark:border-gray-700 p-5">
                    <div className="flex items-center gap-2 mb-3">
                      <TrendingUp className="w-5 h-5 text-purple-500" />
                      <h3 className="font-semibold text-gray-900 dark:text-white">Fit Analysis</h3>
                    </div>
                    <p className="text-gray-700 dark:text-gray-300 text-sm leading-relaxed">{analysis.fitAnalysis}</p>
                  </div>

                  {/* Recommendations */}
                  <div className="bg-white dark:bg-gray-800/50 rounded-xl border border-gray-200 dark:border-gray-700 p-5">
                    <div className="flex items-center gap-2 mb-3">
                      <Lightbulb className="w-5 h-5 text-amber-500" />
                      <h3 className="font-semibold text-gray-900 dark:text-white">Recommendations</h3>
                    </div>
                    <ul className="space-y-2">
                      {analysis.recommendations?.map((rec, i) => (
                        <li key={i} className="flex items-start gap-2 text-sm text-gray-700 dark:text-gray-300">
                          <Zap className="w-4 h-4 text-purple-500 mt-0.5 flex-shrink-0" />
                          <span>{rec}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Final Verdict */}
                  <div
                    className={`rounded-xl p-4 text-center border ${
                      analysis.matchScore >= 80
                        ? "bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800"
                        : analysis.matchScore >= 60
                        ? "bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-800"
                        : "bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800"
                    }`}
                  >
                    <div className="flex items-center justify-center gap-2">
                      {analysis.matchScore >= 80 ? (
                        <>
                          <ThumbsUp className="w-5 h-5 text-green-600" />
                          <span className="font-medium text-green-700 dark:text-green-400">
                            Strong Candidate – Highly Recommended
                          </span>
                        </>
                      ) : analysis.matchScore >= 60 ? (
                        <>
                          <Star className="w-5 h-5 text-yellow-600" />
                          <span className="font-medium text-yellow-700 dark:text-yellow-400">
                            Potential Candidate – Consider for Screening
                          </span>
                        </>
                      ) : (
                        <>
                          <ThumbsDown className="w-5 h-5 text-red-600" />
                          <span className="font-medium text-red-700 dark:text-red-400">
                            Not Recommended for this Role
                          </span>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center py-12">
                  <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
                    <Brain className="w-8 h-8 text-gray-400" />
                  </div>
                  <p className="text-gray-500 dark:text-gray-400">Unable to load analysis.</p>
                  <Button
                    onClick={() => {
                      if (!shouldFetch) setShouldFetch(true);
                      else refetch();
                    }}
                    className="mt-4 bg-gradient-to-r from-purple-600 to-indigo-600"
                  >
                    <Sparkles className="w-4 h-4 mr-2" /> Retry
                  </Button>
                </div>
              )}

              <div className="flex justify-end gap-3 pt-2 pb-2">
                <Button variant="outline" onClick={onClose}>
                  Close
                </Button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>,
    document.body
  );
}