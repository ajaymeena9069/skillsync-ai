// client/src/components/common/WelcomeCard.jsx
import { useState, useEffect } from "react";
import { Sparkles, Calendar, Clock, MessageSquarePlus } from "lucide-react";
import { FeedbackModal } from "./FeedbackModal";
import { Button } from "../Button";
import { OptimizedAvatar } from "./OptimizedAvatar";

export function WelcomeCard({ user }) {
  const [greeting, setGreeting] = useState("");
  const [currentDate, setCurrentDate] = useState("");
  const [isFeedbackOpen, setIsFeedbackOpen] = useState(false);
  const firstName = user?.name?.split(" ")[0] || "User";

  useEffect(() => {
    const hour = new Date().getHours();
    if (hour < 12) setGreeting("Good Morning");
    else if (hour < 17) setGreeting("Good Afternoon");
    else setGreeting("Good Evening");

    const date = new Date();
    const options = { weekday: "long", month: "long", day: "numeric" };
    setCurrentDate(date.toLocaleDateString("en-US", options));
  }, []);

  const avatarUrl = user?.avatar || user?.company?.logo || null;
  const userRole =
    user?.role === "recruiter" ? "Recruiter Portal" : "Job Seeker Portal";

  return (
    <div className="relative overflow-hidden bg-white dark:bg-gray-800/80 rounded-2xl border border-gray-200 dark:border-gray-700/50 shadow-sm">
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-purple-600 to-indigo-600" />

      <div className="p-4 sm:p-6">
        {/* Main row: text + avatar */}
        <div className="flex flex-col-reverse sm:flex-row sm:items-center justify-between gap-4">
          {/* Text section */}
          <div className="flex-1 text-center sm:text-left">
            <div className="flex items-center justify-center sm:justify-start gap-2 mb-2">
              <Sparkles className="w-4 h-4 text-purple-500" />
              <span className="text-sm font-medium text-purple-600 dark:text-purple-400">
                {greeting}
              </span>
            </div>
            <h2 className="text-xl md:text-2xl font-bold text-gray-900 dark:text-white">
              Welcome back,{" "}
              <span className="bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent">
                {firstName}
              </span>
            </h2>
            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-3 mt-2 text-sm text-gray-500 dark:text-gray-400">
              <div className="flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5" />
                <span>{currentDate}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5" />
                <span>{userRole}</span>
              </div>
            </div>
          </div>

          {/* Avatar section */}
          <div className="flex justify-center sm:justify-end flex-shrink-0">
            <div className="relative">
              <OptimizedAvatar
                src={avatarUrl}
                alt={firstName}
                fallbackText={firstName.charAt(0).toUpperCase()}
                className="w-14 h-14 border-2 border-white dark:border-gray-700 shadow-md text-xl"
                size={150}
              />
              <div className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 rounded-full bg-green-500 ring-2 ring-white dark:ring-gray-800" />
            </div>
          </div>
        </div>

        {/* Feedback row – stacks on mobile */}
        <div className="mt-6 flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-t border-gray-100 dark:border-gray-700/50 pt-4">
          <p className="text-sm text-gray-500 dark:text-gray-400 text-center sm:text-left">
            Enjoying SkillSync? Let us know what you think!
          </p>
          <Button
            variant="outline"
            size="sm"
            className="gap-2 border-purple-200 hover:bg-purple-50 text-purple-600 hover:text-purple-700 dark:border-purple-900/50 dark:hover:bg-purple-900/20 dark:text-purple-400 w-full sm:w-auto"
            onClick={() => setIsFeedbackOpen(true)}
          >
            <MessageSquarePlus className="w-4 h-4" />
            Leave Feedback
          </Button>
        </div>
      </div>

      <FeedbackModal
        isOpen={isFeedbackOpen}
        onClose={() => setIsFeedbackOpen(false)}
      />
    </div>
  );
}