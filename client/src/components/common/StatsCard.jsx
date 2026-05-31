// src/components/common/StatsCard.jsx
import PropTypes from "prop-types";

export function StatsCard({
  label,
  value,
  icon: Icon,
  change,
  color,
  trend = "up", // 'up' or 'down'
}) {
  const isPositive = trend === "up";

  return (
    <div className="group bg-white/90 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl border border-gray-200 dark:border-gray-700/50 p-5 shadow-md hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
      <div className="flex items-center justify-between mb-3">
        <div
          className={`w-12 h-12 rounded-xl bg-gradient-to-r ${color} flex items-center justify-center shadow-md group-hover:scale-110 transition-transform`}
        >
          <Icon className="w-6 h-6 text-white" />
        </div>
        {change && (
          <span
            className={`text-xs font-medium px-2.5 py-1 rounded-full flex items-center gap-1 ${
              isPositive
                ? "text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-900/30"
                : "text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/30"
            }`}
          >
            {change}
          </span>
        )}
      </div>
      <p className="text-3xl font-bold text-gray-900 dark:text-white">
        {value}
      </p>
      <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{label}</p>
    </div>
  );
}

StatsCard.propTypes = {
  label: PropTypes.string.isRequired,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  icon: PropTypes.elementType.isRequired,
  change: PropTypes.string.isRequired,
  color: PropTypes.string.isRequired,
  trend: PropTypes.oneOf(["up", "down"]),
};
