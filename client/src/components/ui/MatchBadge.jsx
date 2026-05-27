import React from "react";
import { TrendingUp } from "lucide-react";

export const MatchBadge = ({ score, size = "md", showLabel = true }) => {
  const getColorClasses = () => {
    if (score >= 70)
      return "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400";
    if (score >= 40)
      return "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400";
    return "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400";
  };

  const getSizeClasses = () => {
    switch (size) {
      case "sm":
        return "px-2 py-0.5 text-xs";
      case "lg":
        return "px-3 py-1.5 text-base";
      default:
        return "px-2.5 py-1 text-sm";
    }
  };

  const getLabel = () => {
    if (score >= 80) return "Excellent";
    if (score >= 70) return "Great";
    if (score >= 50) return "Good";
    if (score >= 30) return "Fair";
    return "Low";
  };

  return (
    <div
      className={`inline-flex items-center gap-1.5 rounded-full font-medium ${getColorClasses()} ${getSizeClasses()}`}
    >
      <TrendingUp className="w-3 h-3" />
      <span>{score}% Match</span>
      {showLabel && (
        <span className="ml-0.5 text-xs opacity-75">({getLabel()})</span>
      )}
    </div>
  );
};
