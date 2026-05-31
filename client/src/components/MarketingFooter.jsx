import { useNavigate } from "react-router-dom";
import {
  Sparkles,
  Mail,
  Phone,
  Share2,
  Link,
  GitBranch,
  Camera,
} from "lucide-react";

export function MarketingFooter() {
  const navigate = useNavigate();

  const handleNavigate = (path) => {
    navigate(path);
  };

  return (
    <footer className="bg-white dark:bg-gray-950 border-t border-gray-200 dark:border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
          <div className="lg:col-span-2">
            <div className="flex items-center gap-3 mb-4 cursor-pointer" onClick={() => handleNavigate("/")}>
              <div className="relative">
                <div className="absolute inset-0 bg-purple-500 rounded-xl blur-md opacity-40" />
                <div className="relative w-9 h-9 bg-gradient-to-br from-[#5B2C8F] via-[#7C3AED] to-[#A855F7] rounded-xl flex items-center justify-center shadow-md">
                  <Sparkles className="w-5 h-5 text-white" strokeWidth={1.5} />
                </div>
              </div>
              <div className="flex flex-col">
                <div className="flex items-baseline gap-1">
                  <span className="text-xl font-bold bg-gradient-to-r from-[#5B2C8F] via-[#7C3AED] to-[#A855F7] bg-clip-text text-transparent tracking-tight">
                    SkillSync
                  </span>
                  <span className="text-xl font-bold text-gray-800 dark:text-gray-200">
                    AI
                  </span>
                </div>
                <p className="text-[10px] text-[#7C3AED] dark:text-[#A855F7] -mt-1 font-semibold tracking-wide">
                  Career Intelligence
                </p>
              </div>
            </div>
            <p className="text-gray-600 dark:text-gray-400 mb-6 max-w-sm">
              AI-powered career transformation platform helping job seekers find
              perfect opportunities and bridge skill gaps.
            </p>
            <div className="flex gap-3">
              <a
                href="#"
                className="w-10 h-10 bg-gray-100 dark:bg-gray-800 rounded-lg flex items-center justify-center text-gray-500 dark:text-gray-400 hover:bg-purple-100 hover:text-purple-600 dark:hover:bg-purple-900/40 dark:hover:text-purple-400 transition-colors"
              >
                <Share2 className="w-5 h-5" />
              </a>
              <a
                href="#"
                className="w-10 h-10 bg-gray-100 dark:bg-gray-800 rounded-lg flex items-center justify-center text-gray-500 dark:text-gray-400 hover:bg-purple-100 hover:text-purple-600 dark:hover:bg-purple-900/40 dark:hover:text-purple-400 transition-colors"
              >
                <Link className="w-5 h-5" />
              </a>
              <a
                href="#"
                className="w-10 h-10 bg-gray-100 dark:bg-gray-800 rounded-lg flex items-center justify-center text-gray-500 dark:text-gray-400 hover:bg-purple-100 hover:text-purple-600 dark:hover:bg-purple-900/40 dark:hover:text-purple-400 transition-colors"
              >
                <GitBranch className="w-5 h-5" />
              </a>
              <a
                href="#"
                className="w-10 h-10 bg-gray-100 dark:bg-gray-800 rounded-lg flex items-center justify-center text-gray-500 dark:text-gray-400 hover:bg-purple-100 hover:text-purple-600 dark:hover:bg-purple-900/40 dark:hover:text-purple-400 transition-colors"
              >
                <Camera className="w-5 h-5" />
              </a>
            </div>
          </div>

          <div>
            <h3 className="font-semibold mb-4 text-gray-900 dark:text-white">Product</h3>
            <ul className="space-y-2">
              <li>
                <button
                  onClick={() => handleNavigate("/features")}
                  className="text-gray-500 hover:text-purple-600 dark:text-gray-400 dark:hover:text-purple-400 transition-colors text-sm"
                >
                  Features
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleNavigate("/auth")}
                  className="text-gray-500 hover:text-purple-600 dark:text-gray-400 dark:hover:text-purple-400 transition-colors text-sm"
                >
                  Get Started
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleNavigate("/jobs")}
                  className="text-gray-500 hover:text-purple-600 dark:text-gray-400 dark:hover:text-purple-400 transition-colors text-sm"
                >
                  Browse Jobs
                </button>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold mb-4 text-gray-900 dark:text-white">Company</h3>
            <ul className="space-y-2">
              <li>
                <button
                  onClick={() => handleNavigate("/about")}
                  className="text-gray-500 hover:text-purple-600 dark:text-gray-400 dark:hover:text-purple-400 transition-colors text-sm"
                >
                  About Us
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleNavigate("/contact")}
                  className="text-gray-500 hover:text-purple-600 dark:text-gray-400 dark:hover:text-purple-400 transition-colors text-sm"
                >
                  Contact
                </button>
              </li>
              <li>
                <a
                  href="#"
                  className="text-gray-500 hover:text-purple-600 dark:text-gray-400 dark:hover:text-purple-400 transition-colors text-sm"
                >
                  Privacy Policy
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-gray-500 hover:text-purple-600 dark:text-gray-400 dark:hover:text-purple-400 transition-colors text-sm"
                >
                  Terms of Service
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-gray-200 dark:border-gray-800">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-sm text-gray-500 dark:text-gray-400">
              © 2026 SkillSync AI. All rights reserved.
            </p>
            <div className="flex flex-wrap gap-4 text-sm text-gray-500 dark:text-gray-400">
              <div className="flex items-center gap-1.5">
                <Mail className="w-4 h-4" />
                hello@skillsync.ai
              </div>
              <div className="flex items-center gap-1.5">
                <Phone className="w-4 h-4" />
                +1 (555) 123-4567
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
