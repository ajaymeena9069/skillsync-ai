import { Component } from "react";
import { AlertTriangle, RefreshCw, Home } from "lucide-react";

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, info) {
    if (import.meta.env.DEV) {
      console.error("ErrorBoundary caught:", error, info.componentStack);
    }
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null });
    if (this.props.onReset) {
      this.props.onReset();
    }
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback(this.state.error, this.handleReset);
      }

      return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-950 px-4">
          <div className="w-full max-w-md">
            {/* Card */}
            <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-xl overflow-hidden">
              {/* Top gradient bar */}
              <div className="h-1.5 bg-gradient-to-r from-red-500 via-orange-500 to-red-500" />

              <div className="p-8 text-center">
                {/* Icon */}
                <div className="w-16 h-16 rounded-2xl bg-red-100 dark:bg-red-900/30 flex items-center justify-center mx-auto mb-5">
                  <AlertTriangle className="w-8 h-8 text-red-600 dark:text-red-400" />
                </div>

                <h1 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                  Something went wrong
                </h1>
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-6 leading-relaxed">
                  An unexpected error occurred. You can try refreshing this
                  section or go back to the home page.
                </p>

                {/* Error detail in dev */}
                {import.meta.env.DEV && this.state.error && (
                  <div className="mb-6 p-3 bg-red-50 dark:bg-red-900/20 rounded-lg border border-red-200 dark:border-red-800 text-left">
                    <p className="text-xs font-mono text-red-700 dark:text-red-400 break-all">
                      {this.state.error.message}
                    </p>
                  </div>
                )}

                {/* Actions */}
                <div className="flex gap-3 justify-center">
                  <button
                    onClick={this.handleReset}
                    className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white text-sm font-medium shadow-md hover:shadow-lg transition-all"
                  >
                    <RefreshCw className="w-4 h-4" />
                    Try Again
                  </button>
                  <a
                    href="/"
                    className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 text-sm font-medium transition-all"
                  >
                    <Home className="w-4 h-4" />
                    Go Home
                  </a>
                </div>
              </div>
            </div>

            <p className="text-center text-xs text-gray-400 dark:text-gray-600 mt-4">
              SkillSync AI &mdash; We&apos;re working to fix this
            </p>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
