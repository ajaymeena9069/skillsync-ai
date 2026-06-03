import React, { useState, useEffect } from "react";
import { Sparkles, Brain, Search, Map, FileCode2 } from "lucide-react";

export function AiLoadingState({ type = "analysis" }) {
  const [step, setStep] = useState(0);

  const messages =
    type === "roadmap"
      ? [
          { text: "Scanning your skills profile...", icon: <FileCode2 className="w-5 h-5" /> },
          { text: "Analyzing job market demands...", icon: <Search className="w-5 h-5" /> },
          { text: "Synthesizing learning path...", icon: <Brain className="w-5 h-5" /> },
          { text: "Generating weekly milestones...", icon: <Map className="w-5 h-5" /> },
          { text: "Almost ready...", icon: <Sparkles className="w-5 h-5" /> },
        ]
      : [
          { text: "Scanning your resume...", icon: <FileCode2 className="w-5 h-5" /> },
          { text: "Fetching live job postings...", icon: <Search className="w-5 h-5" /> },
          { text: "Comparing skill overlap...", icon: <Brain className="w-5 h-5" /> },
          { text: "Finding learning resources...", icon: <Map className="w-5 h-5" /> },
          { text: "Finalizing recommendations...", icon: <Sparkles className="w-5 h-5" /> },
        ];

  useEffect(() => {
    const interval = setInterval(() => {
      setStep((prev) => (prev < messages.length - 1 ? prev + 1 : prev));
    }, 5000); // Change message every 5 seconds since it takes ~30-40s

    return () => clearInterval(interval);
  }, [messages.length]);

  return (
    <div className="flex flex-col items-center justify-center py-20 px-4 min-h-[400px]">
      <div className="relative mb-8">
        <div className="absolute inset-0 bg-purple-500 blur-xl opacity-20 dark:opacity-40 rounded-full animate-pulse"></div>
        <div className="w-20 h-20 bg-gradient-to-tr from-purple-600 to-indigo-600 rounded-2xl flex items-center justify-center shadow-2xl relative z-10 animate-bounce">
          <Brain className="w-10 h-10 text-white" />
        </div>
        
        {/* Animated Orbits */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 border border-purple-200 dark:border-purple-800 rounded-full animate-spin-slow" style={{ animationDuration: '4s' }}>
          <div className="absolute -top-1.5 left-1/2 w-3 h-3 bg-purple-400 rounded-full"></div>
        </div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 border border-indigo-200 dark:border-indigo-800/50 rounded-full animate-spin-reverse-slow" style={{ animationDuration: '6s' }}>
          <div className="absolute -bottom-1.5 left-1/2 w-3 h-3 bg-indigo-400 rounded-full"></div>
        </div>
      </div>

      <div className="max-w-md w-full">
        <div className="text-center mb-6">
          <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
            SkillSync AI is working...
          </h3>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Please wait while we perform deep analysis. This usually takes 15-30 seconds.
          </p>
        </div>

        <div className="space-y-3">
          {messages.map((msg, idx) => {
            const isActive = idx === step;
            const isCompleted = idx < step;
            const isFuture = idx > step;

            return (
              <div
                key={idx}
                className={`flex items-center gap-4 p-3 rounded-xl transition-all duration-500 ${
                  isActive
                    ? "bg-purple-50 dark:bg-purple-900/30 border border-purple-100 dark:border-purple-800 shadow-sm transform scale-105"
                    : isCompleted
                    ? "opacity-50"
                    : "opacity-30"
                }`}
              >
                <div
                  className={`w-10 h-10 rounded-lg flex items-center justify-center transition-colors ${
                    isActive
                      ? "bg-white dark:bg-gray-800 text-purple-600 dark:text-purple-400 shadow-sm"
                      : isCompleted
                      ? "bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400"
                      : "bg-gray-100 dark:bg-gray-800 text-gray-400 dark:text-gray-500"
                  }`}
                >
                  {isCompleted ? (
                    <Sparkles className="w-5 h-5" />
                  ) : isActive ? (
                    <div className="animate-pulse">{msg.icon}</div>
                  ) : (
                    msg.icon
                  )}
                </div>
                <div className="flex-1">
                  <p
                    className={`text-sm font-medium transition-colors ${
                      isActive
                        ? "text-purple-900 dark:text-purple-300"
                        : isCompleted
                        ? "text-gray-700 dark:text-gray-400"
                        : "text-gray-400 dark:text-gray-600"
                    }`}
                  >
                    {msg.text}
                  </p>
                  {isActive && (
                    <div className="w-full bg-purple-100 dark:bg-purple-900/50 h-1 mt-2 rounded-full overflow-hidden">
                      <div className="h-full bg-purple-500 w-full animate-[progress_5s_ease-in-out_infinite]" style={{ transformOrigin: 'left' }}></div>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
      
      <style>{`
        @keyframes progress {
          0% { transform: scaleX(0); }
          50% { transform: scaleX(0.7); }
          100% { transform: scaleX(1); }
        }
        .animate-spin-slow {
          animation: spin 4s linear infinite;
        }
        .animate-spin-reverse-slow {
          animation: spin 6s linear infinite reverse;
        }
      `}</style>
    </div>
  );
}
