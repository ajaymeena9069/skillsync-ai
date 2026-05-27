// src/components/common/PageHeader.jsx
import { Sparkles } from "lucide-react";
import PropTypes from "prop-types";

export function PageHeader({
  badge,
  title,
  gradientText,
  description,
  className = "",
}) {
  return (
    <div className={`text-center mb-4 ${className}`}>
      <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 text-sm mb-4">
        <Sparkles className="w-4 h-4" />
        <span>{badge}</span>
      </div>
      <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-3">
        {title}{" "}
        {gradientText && (
          <span className="bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent">
            {gradientText}
          </span>
        )}
      </h1>
      <p className="text-gray-500 dark:text-gray-400 text-lg max-w-2xl mx-auto">
        {description}
      </p>
    </div>
  );
}

PageHeader.propTypes = {
  badge: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  gradientText: PropTypes.string,
  description: PropTypes.string.isRequired,
  className: PropTypes.string,
};
