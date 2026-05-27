// client/src/components/LoadingPage.jsx
import { Sparkles } from "lucide-react";

export function LoadingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950 flex items-center justify-center">
      <div className="text-center">
        {/* Spinner */}
        <div className="relative w-12 h-12 mx-auto mb-6">
          <div className="absolute inset-0 rounded-full border-2 border-purple-200 dark:border-purple-900/30" />
          <div className="absolute inset-0 rounded-full border-2 border-purple-600 border-t-transparent animate-spin" />
        </div>

        {/* Logo */}
        <div className="flex items-center justify-center gap-1 mb-2">
          <Sparkles className="w-5 h-5 text-purple-600" />
          <span className="text-lg font-semibold text-gray-900 dark:text-white">
            SkillSync
          </span>
          <span className="text-lg font-semibold bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent">
            AI
          </span>
        </div>

        {/* Loading Text */}
        <p className="text-xs text-gray-400 dark:text-gray-500">Loading</p>
      </div>
    </div>
  );
}
