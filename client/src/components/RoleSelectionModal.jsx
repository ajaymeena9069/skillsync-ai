import { useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { User, Building2, X, Loader2 } from "lucide-react";
import { Button } from "./Button";
import { useGoogleAuthMutation } from "../services/authApi";
import { setCredentials } from "../features/auth/authSlice";
import { getRedirectPath } from "../features/auth/authUtils";
import { AnimatePresence, motion } from "framer-motion";

export default function RoleSelectionModal({ isOpen, tempData, onClose, darkMode }) {
  const [selectedRole, setSelectedRole] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [googleAuth] = useGoogleAuthMutation();

  const handleRoleSelect = async (role) => {
    setSelectedRole(role);
    setIsLoading(true);
    setError("");

    try {
      // Map frontend role names to backend enum values
      const backendRole = role === "jobseeker" ? "user" : "recruiter";

      const result = await googleAuth({
        credential: tempData?.credential,
        role: backendRole,
      }).unwrap();

      if (result.success && result.user && result.token) {
        dispatch(setCredentials({ user: result.user, token: result.token }));
        navigate(result.redirectUrl || getRedirectPath(result.user.role));
      } else {
        setError(result.message || "Something went wrong. Please try again.");
      }
    } catch (err) {
      setError(err?.data?.message || "Failed to complete registration");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop with blur */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-md z-50"
            onClick={onClose}
          />

          {/* Modal Container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 20 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-md bg-white/90 dark:bg-gray-900/90 backdrop-blur-lg rounded-2xl shadow-2xl z-50 overflow-hidden border border-gray-200/50 dark:border-gray-800/50"
          >
            {/* Header */}
            <div className="px-6 py-4 border-b border-gray-200/50 dark:border-gray-800/50 flex items-center justify-between">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                Choose Your Role
              </h2>
              <button
                onClick={onClose}
                className="p-1.5 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>

            {/* Content */}
            <div className="p-6">
              <p className="text-gray-600 dark:text-gray-400 text-center mb-6 text-sm">
                How would you like to use SkillSync AI?
              </p>

              <div className="space-y-3">
                {/* Job Seeker Option */}
                <button
                  onClick={() => handleRoleSelect("jobseeker")}
                  disabled={isLoading}
                  className={`
                    w-full flex items-center gap-4 p-4 rounded-xl transition-all duration-200 group
                    ${selectedRole === "jobseeker"
                      ? "bg-gradient-to-r from-purple-50 to-indigo-50 dark:from-purple-900/30 dark:to-indigo-900/30 border-purple-500 shadow-sm"
                      : "bg-white dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 hover:border-purple-300 dark:hover:border-purple-700 hover:shadow-md"
                    }
                  `}
                >
                  <div className={`
                    w-12 h-12 rounded-xl flex items-center justify-center transition-all
                    ${selectedRole === "jobseeker"
                      ? "bg-gradient-to-br from-purple-100 to-indigo-100 dark:from-purple-900/50 dark:to-indigo-900/50"
                      : "bg-gray-100 dark:bg-gray-800 group-hover:bg-purple-50 dark:group-hover:bg-purple-900/20"
                    }
                  `}>
                    <User className={`
                      w-6 h-6 transition-colors
                      ${selectedRole === "jobseeker"
                        ? "text-purple-600 dark:text-purple-400"
                        : "text-gray-500 dark:text-gray-400 group-hover:text-purple-500"
                      }
                    `} />
                  </div>
                  <div className="flex-1 text-left">
                    <h3 className="font-semibold text-gray-900 dark:text-white">
                      Job Seeker
                    </h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Find jobs, upload resume, get AI recommendations
                    </p>
                  </div>
                  {selectedRole === "jobseeker" && !isLoading && (
                    <div className="w-5 h-5 rounded-full bg-purple-600 flex items-center justify-center shadow-sm">
                      <div className="w-2 h-2 bg-white rounded-full" />
                    </div>
                  )}
                </button>

                {/* Recruiter Option */}
                <button
                  onClick={() => handleRoleSelect("recruiter")}
                  disabled={isLoading}
                  className={`
                    w-full flex items-center gap-4 p-4 rounded-xl transition-all duration-200 group
                    ${selectedRole === "recruiter"
                      ? "bg-gradient-to-r from-purple-50 to-indigo-50 dark:from-purple-900/30 dark:to-indigo-900/30 border-purple-500 shadow-sm"
                      : "bg-white dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 hover:border-purple-300 dark:hover:border-purple-700 hover:shadow-md"
                    }
                  `}
                >
                  <div className={`
                    w-12 h-12 rounded-xl flex items-center justify-center transition-all
                    ${selectedRole === "recruiter"
                      ? "bg-gradient-to-br from-purple-100 to-indigo-100 dark:from-purple-900/50 dark:to-indigo-900/50"
                      : "bg-gray-100 dark:bg-gray-800 group-hover:bg-purple-50 dark:group-hover:bg-purple-900/20"
                    }
                  `}>
                    <Building2 className={`
                      w-6 h-6 transition-colors
                      ${selectedRole === "recruiter"
                        ? "text-purple-600 dark:text-purple-400"
                        : "text-gray-500 dark:text-gray-400 group-hover:text-purple-500"
                      }
                    `} />
                  </div>
                  <div className="flex-1 text-left">
                    <h3 className="font-semibold text-gray-900 dark:text-white">
                      Recruiter
                    </h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Post jobs, find candidates, track applications
                    </p>
                  </div>
                  {selectedRole === "recruiter" && !isLoading && (
                    <div className="w-5 h-5 rounded-full bg-purple-600 flex items-center justify-center shadow-sm">
                      <div className="w-2 h-2 bg-white rounded-full" />
                    </div>
                  )}
                </button>
              </div>

              {error && (
                <motion.div
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-4 p-3 bg-red-50 dark:bg-red-900/20 rounded-xl text-red-600 dark:text-red-400 text-sm text-center border border-red-200 dark:border-red-800"
                >
                  {error}
                </motion.div>
              )}

              {isLoading && (
                <div className="flex justify-center mt-6">
                  <Loader2 className="w-6 h-6 text-purple-600 animate-spin" />
                </div>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}