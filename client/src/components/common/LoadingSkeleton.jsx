// src/components/common/LoadingSkeleton.jsx
import PropTypes from "prop-types";

export function StatsCardSkeleton() {
  return (
    <div className="bg-white/80 dark:bg-gray-800/80 rounded-2xl border border-white/30 dark:border-gray-700/50 p-5 animate-pulse">
      <div className="flex items-center justify-between mb-3">
        <div className="w-12 h-12 rounded-xl bg-gray-200 dark:bg-gray-700" />
        <div className="w-12 h-5 bg-gray-200 dark:bg-gray-700 rounded-full" />
      </div>
      <div className="w-20 h-8 bg-gray-200 dark:bg-gray-700 rounded mb-2" />
      <div className="w-24 h-4 bg-gray-200 dark:bg-gray-700 rounded" />
    </div>
  );
}

export function CandidateCardSkeleton() {
  return (
    <div className="bg-white/80 dark:bg-gray-800/80 rounded-2xl border border-white/30 dark:border-gray-700/50 p-5 animate-pulse">
      <div className="flex gap-4">
        <div className="w-14 h-14 rounded-full bg-gray-200 dark:bg-gray-700" />
        <div className="flex-1">
          <div className="w-40 h-5 bg-gray-200 dark:bg-gray-700 rounded mb-2" />
          <div className="w-32 h-4 bg-gray-200 dark:bg-gray-700 rounded mb-2" />
          <div className="w-48 h-3 bg-gray-200 dark:bg-gray-700 rounded" />
        </div>
      </div>
    </div>
  );
}

export function TableRowSkeleton({ columns = 4 }) {
  return (
    <div className="flex gap-4 py-3 px-4 animate-pulse">
      {Array(columns)
        .fill()
        .map((_, i) => (
          <div
            key={i}
            className="flex-1 h-4 bg-gray-200 dark:bg-gray-700 rounded"
          />
        ))}
    </div>
  );
}
