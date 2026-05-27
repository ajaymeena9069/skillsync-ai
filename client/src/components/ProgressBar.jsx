// client/src/components/ProgressBar.jsx
import { useState, useEffect } from "react";

export function ProgressBar({
  value,
  max = 100,
  label,
  showPercentage = true,
  variant = "primary",
  size = "md",
  animated = true,
  showIcon = false,
  className = "",
}) {
  const [width, setWidth] = useState(0);
  const percentage = Math.min(Math.max((value / max) * 100, 0), 100);

  useEffect(() => {
    // Animate on mount and value change
    const timer = setTimeout(() => setWidth(percentage), 100);
    return () => clearTimeout(timer);
  }, [percentage]);

  // Size configurations
  const sizes = {
    sm: "h-1.5",
    md: "h-2.5",
    lg: "h-3.5",
    xl: "h-4",
  };

  // Variant configurations with gradients and dark mode
  const variants = {
    primary: {
      bg: "bg-gray-200 dark:bg-gray-700",
      fill: "bg-gradient-to-r from-purple-500 to-indigo-600",
      text: "text-purple-600 dark:text-purple-400",
      glow: "shadow-[0_0_10px_rgba(139,92,246,0.5)]",
    },
    success: {
      bg: "bg-gray-200 dark:bg-gray-700",
      fill: "bg-gradient-to-r from-emerald-500 to-teal-600",
      text: "text-emerald-600 dark:text-emerald-400",
      glow: "shadow-[0_0_10px_rgba(16,185,129,0.5)]",
    },
    warning: {
      bg: "bg-gray-200 dark:bg-gray-700",
      fill: "bg-gradient-to-r from-amber-500 to-orange-600",
      text: "text-amber-600 dark:text-amber-400",
      glow: "shadow-[0_0_10px_rgba(245,158,11,0.5)]",
    },
    danger: {
      bg: "bg-gray-200 dark:bg-gray-700",
      fill: "bg-gradient-to-r from-red-500 to-rose-600",
      text: "text-red-600 dark:text-red-400",
      glow: "shadow-[0_0_10px_rgba(239,68,68,0.5)]",
    },
    info: {
      bg: "bg-gray-200 dark:bg-gray-700",
      fill: "bg-gradient-to-r from-blue-500 to-cyan-600",
      text: "text-blue-600 dark:text-blue-400",
      glow: "shadow-[0_0_10px_rgba(59,130,246,0.5)]",
    },
  };

  const currentVariant = variants[variant] || variants.primary;

  // Get percentage color for text
  const getPercentageColor = () => {
    if (percentage >= 80) return variants.success.text;
    if (percentage >= 60) return variants.primary.text;
    if (percentage >= 40) return variants.warning.text;
    return variants.danger.text;
  };

  // Get icon based on percentage
  const getIcon = () => {
    if (percentage >= 80) return "🎉";
    if (percentage >= 60) return "📈";
    if (percentage >= 40) return "⚡";
    if (percentage >= 20) return "🌱";
    return "🚀";
  };

  return (
    <div className={`w-full ${className}`}>
      {/* Label and Percentage Row */}
      {(label || showPercentage) && (
        <div className="flex justify-between items-center mb-2">
          <div className="flex items-center gap-2">
            {showIcon && (
              <span
                className="text-base sm:text-lg"
                role="img"
                aria-label="progress-icon"
              >
                {getIcon()}
              </span>
            )}
            {label && (
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                {label}
              </span>
            )}
          </div>
          {showPercentage && (
            <div className="flex items-center gap-1.5">
              <span
                className={`text-sm font-semibold tabular-nums ${getPercentageColor()}`}
              >
                {Math.round(percentage)}%
              </span>
              {percentage >= 100 && (
                <span className="text-xs text-emerald-600 dark:text-emerald-400 font-medium">
                  Complete!
                </span>
              )}
            </div>
          )}
        </div>
      )}

      {/* Progress Bar Track */}
      <div
        className={`relative w-full ${sizes[size]} ${currentVariant.bg} rounded-full overflow-hidden`}
      >
        {/* Animated Fill */}
        <div
          className={`${currentVariant.fill} ${sizes[size]} rounded-full transition-all duration-700 ease-out ${
            animated && width > 0 ? "relative" : ""
          }`}
          style={{ width: `${width}%` }}
        >
          {/* Shimmer Effect on Hover */}
          {animated && width > 0 && width < 100 && (
            <div className="absolute inset-0 w-full h-full animate-pulse bg-white/20 rounded-full" />
          )}
        </div>

        {/* Glow Effect */}
        {width > 0 && (
          <div
            className={`absolute top-0 left-0 ${currentVariant.glow} rounded-full transition-all duration-700 ease-out opacity-30`}
            style={{ width: `${width}%`, height: "100%" }}
          />
        )}
      </div>

      {/* Milestone Markers (Optional) */}
      {percentage > 0 && percentage < 100 && (
        <div className="flex justify-between mt-1.5 px-1">
          <div className="flex items-center gap-0.5">
            <div
              className={`w-1 h-1 rounded-full ${percentage >= 25 ? currentVariant.fill : "bg-gray-300 dark:bg-gray-600"}`}
            />
            <span className="text-[10px] text-gray-400 dark:text-gray-500">
              25%
            </span>
          </div>
          <div className="flex items-center gap-0.5">
            <div
              className={`w-1 h-1 rounded-full ${percentage >= 50 ? currentVariant.fill : "bg-gray-300 dark:bg-gray-600"}`}
            />
            <span className="text-[10px] text-gray-400 dark:text-gray-500">
              50%
            </span>
          </div>
          <div className="flex items-center gap-0.5">
            <div
              className={`w-1 h-1 rounded-full ${percentage >= 75 ? currentVariant.fill : "bg-gray-300 dark:bg-gray-600"}`}
            />
            <span className="text-[10px] text-gray-400 dark:text-gray-500">
              75%
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
