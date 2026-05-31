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
                    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
                        {/* Backdrop with subtle blur */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={onClose}
                            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
                        />

                        {/* Modal Container */}
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 20 }}
                            transition={{ type: "spring", damping: 25, stiffness: 300 }}
                            className="relative w-full max-w-2xl max-h-[85vh] bg-white dark:bg-gray-900 rounded-2xl shadow-2xl overflow-hidden flex flex-col z-10"
                        >
                        {/* Header */}
                        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 dark:border-gray-800 bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm">
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

                        {/* Custom Theme Scrollbar */}
                        <style>
                            {`
                              .theme-scroll::-webkit-scrollbar {
                                width: 6px;
                              }
                              .theme-scroll::-webkit-scrollbar-track {
                                background: transparent;
                                margin-top: 4px;
                                margin-bottom: 4px;
                              }
                              .theme-scroll::-webkit-scrollbar-thumb {
                                background: rgba(168, 85, 247, 0.3);
                                border-radius: 10px;
                              }
                              .theme-scroll::-webkit-scrollbar-thumb:hover {
                                background: rgba(168, 85, 247, 0.6);
                              }
                              .dark .theme-scroll::-webkit-scrollbar-thumb {
                                background: rgba(168, 85, 247, 0.4);
                              }
                              .dark .theme-scroll::-webkit-scrollbar-thumb:hover {
                                background: rgba(168, 85, 247, 0.7);
                              }
                            `}
                        </style>

                        {/* Scrollable Content */}
                        <div className="flex-1 overflow-y-auto theme-scroll px-6 py-6 space-y-6">
                            {/* Candidate & Job Info */}
                            <div className="bg-gradient-to-r from-purple-50/60 to-indigo-50/60 dark:from-purple-900/15 dark:to-indigo-900/15 rounded-xl p-4 border border-purple-100 dark:border-purple-800/30 text-center">
                                <p className="text-sm text-gray-700 dark:text-gray-300">
                                    Analyzing <span className="font-semibold text-purple-700 dark:text-purple-300">{candidateName}</span> for{" "}
                                    <span className="font-semibold text-purple-700 dark:text-purple-300">{jobTitle}</span>
                                </p>
                            </div>

                            {isLoading ? (
                                <div className="flex flex-col items-center justify-center py-12">
                                    <div className="relative">
                                        <div className="absolute inset-0 rounded-full bg-purple-500/20 blur-xl animate-pulse" />
                                        <Loader2 className="w-10 h-10 text-purple-600 animate-spin relative" />
                                    </div>
                                    <p className="mt-4 text-sm text-gray-500 dark:text-gray-400">AI is analyzing candidate fit...</p>
                                </div>
                            ) : analysis ? (
                                <div className="space-y-6">
                                    {/* Score Card – Modern, elegant */}
                                    <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-purple-500/10 via-indigo-500/10 to-transparent dark:from-purple-500/5 dark:via-indigo-500/5 border border-purple-200/50 dark:border-purple-800/30 p-5">
                                        <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/10 rounded-full blur-2xl -mr-16 -mt-16" />
                                        <div className="flex items-center justify-between flex-wrap gap-4">
                                            <div>
                                                <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Match Score</p>
                                                <p className="text-5xl font-bold bg-gradient-to-r from-purple-700 to-indigo-700 dark:from-purple-400 dark:to-indigo-400 bg-clip-text text-transparent">
                                                    {analysis.matchScore}%
                                                </p>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <div className="w-16 h-16 relative">
                                                    <svg className="w-full h-full transform -rotate-90">
                                                        <defs>
                                                            <linearGradient id="scoreGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                                                                <stop offset="0%" stopColor="#8B5CF6" />
                                                                <stop offset="100%" stopColor="#6366F1" />
                                                            </linearGradient>
                                                        </defs>
                                                        <circle
                                                            cx="32"
                                                            cy="32"
                                                            r="28"
                                                            stroke="currentColor"
                                                            strokeWidth="5"
                                                            fill="none"
                                                            className="text-purple-100 dark:text-gray-700/50"
                                                        />
                                                        <motion.circle
                                                            cx="32"
                                                            cy="32"
                                                            r="28"
                                                            stroke="url(#scoreGradient)"
                                                            strokeWidth="5"
                                                            fill="none"
                                                            strokeDasharray={`${2 * Math.PI * 28}`}
                                                            initial={{ strokeDashoffset: `${2 * Math.PI * 28}` }}
                                                            animate={{ strokeDashoffset: `${2 * Math.PI * 28 * (1 - analysis.matchScore / 100)}` }}
                                                            transition={{ duration: 1.5, ease: "easeOut" }}
                                                            strokeLinecap="round"
                                                        />
                                                    </svg>
                                                </div>
                                                {scoreLevel && (
                                                    <div className="flex items-center gap-1.5 bg-white dark:bg-gray-800 shadow-sm rounded-full px-3 py-1">
                                                        <scoreLevel.icon className="w-3.5 h-3.5" style={{ color: scoreLevel.color === "emerald" ? "#10B981" : scoreLevel.color === "amber" ? "#F59E0B" : "#EF4444" }} />
                                                        <span className="text-xs font-medium text-gray-700 dark:text-gray-300">{scoreLevel.label}</span>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                        <div className="mt-4 text-xs text-gray-500 dark:text-gray-400">
                                            Based on skill match & job requirements
                                        </div>
                                    </div>

                                    {/* Skills Analysis – Two columns layout */}
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        {/* Strengths */}
                                        {analysis.strengthMatches?.length > 0 && (
                                            <div className="bg-white dark:bg-gray-800/40 rounded-xl border border-gray-200 dark:border-gray-700 p-4">
                                                <div className="flex items-center gap-2 mb-3">
                                                    <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                                                    <h3 className="font-semibold text-gray-900 dark:text-white">Strengths</h3>
                                                    <span className="ml-auto text-xs font-medium text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-900/30 px-2 py-0.5 rounded-full">
                                                        {analysis.strengthMatches.length}
                                                    </span>
                                                </div>
                                                <div className="flex flex-wrap gap-2">
                                                    {analysis.strengthMatches.map((skill) => (
                                                        <span
                                                            key={skill}
                                                            className="px-3 py-1.5 bg-emerald-50 text-emerald-700 rounded-full text-xs font-medium dark:bg-emerald-900/30 dark:text-emerald-400"
                                                        >
                                                            {skill}
                                                        </span>
                                                    ))}
                                                </div>
                                            </div>
                                        )}

                                        {/* Skill Gaps */}
                                        {analysis.gapSkills?.length > 0 && (
                                            <div className="bg-white dark:bg-gray-800/40 rounded-xl border border-gray-200 dark:border-gray-700 p-4">
                                                <div className="flex items-center gap-2 mb-3">
                                                    <AlertCircle className="w-5 h-5 text-rose-500" />
                                                    <h3 className="font-semibold text-gray-900 dark:text-white">Skill Gaps</h3>
                                                    <span className="ml-auto text-xs font-medium text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-900/30 px-2 py-0.5 rounded-full">
                                                        {analysis.gapSkills.length}
                                                    </span>
                                                </div>
                                                <div className="flex flex-wrap gap-2">
                                                    {analysis.gapSkills.map((skill) => (
                                                        <span
                                                            key={skill}
                                                            className="px-3 py-1.5 bg-rose-50 text-rose-700 rounded-full text-xs font-medium dark:bg-rose-900/30 dark:text-rose-400"
                                                        >
                                                            {skill}
                                                        </span>
                                                    ))}
                                                </div>
                                            </div>
                                        )}
                                    </div>

                                    {/* Fit Analysis */}
                                    <div className="bg-white dark:bg-gray-800/40 rounded-xl border border-gray-200 dark:border-gray-700 p-5">
                                        <div className="flex items-center gap-2 mb-3">
                                            <TrendingUp className="w-5 h-5 text-purple-500" />
                                            <h3 className="font-semibold text-gray-900 dark:text-white">Fit Analysis</h3>
                                        </div>
                                        <p className="text-gray-700 dark:text-gray-300 text-sm leading-relaxed">{analysis.fitAnalysis}</p>
                                    </div>

                                    {/* Recommendations */}
                                    <div className="bg-white dark:bg-gray-800/40 rounded-xl border border-gray-200 dark:border-gray-700 p-5">
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

                                    {/* Final Verdict – subtle callout */}
                                    <div
                                        className={`rounded-xl p-4 text-center border ${analysis.matchScore >= 80
                                                ? "bg-emerald-50/50 dark:bg-emerald-900/10 border-emerald-200 dark:border-emerald-800/30"
                                                : analysis.matchScore >= 60
                                                    ? "bg-amber-50/50 dark:bg-amber-900/10 border-amber-200 dark:border-amber-800/30"
                                                    : "bg-rose-50/50 dark:bg-rose-900/10 border-rose-200 dark:border-rose-800/30"
                                            }`}
                                    >
                                        <div className="flex items-center justify-center gap-2">
                                            {analysis.matchScore >= 80 ? (
                                                <>
                                                    <ThumbsUp className="w-5 h-5 text-emerald-600" />
                                                    <span className="font-medium text-emerald-700 dark:text-emerald-400">
                                                        Strong Candidate – Highly Recommended
                                                    </span>
                                                </>
                                            ) : analysis.matchScore >= 60 ? (
                                                <>
                                                    <Star className="w-5 h-5 text-amber-600" />
                                                    <span className="font-medium text-amber-700 dark:text-amber-400">
                                                        Potential Candidate – Consider for Screening
                                                    </span>
                                                </>
                                            ) : (
                                                <>
                                                    <ThumbsDown className="w-5 h-5 text-rose-600" />
                                                    <span className="font-medium text-rose-700 dark:text-rose-400">
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
                    </div>
                </>
            )}
        </AnimatePresence>,
        document.body
    );
}