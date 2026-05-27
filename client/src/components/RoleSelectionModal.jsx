// client/src/components/RoleSelectionModal.jsx
import { useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { User, Building2, X, Loader2 } from "lucide-react";
import { Button } from "./Button";
import { useGoogleAuthMutation } from "../services/authApi";
import { setCredentials } from "../features/auth/authSlice";
import {
  saveAccessToken,
  saveUser,
  getRedirectPath,
} from "../features/auth/authUtils";

export default function RoleSelectionModal({ tempData, onClose, darkMode }) {
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
      console.log("Sending to backend:", {
        idToken: tempData?.idToken,
        role: role,
      });

      const result = await googleAuth({
        idToken: tempData?.idToken,
        role: role,
      }).unwrap();

      console.log("Role selection response:", result);

      if (result.token && result.data) {
        saveAccessToken(result.token);
        saveUser(result.data);
        dispatch(
          setCredentials({ user: result.data, accessToken: result.token }),
        );
        navigate(getRedirectPath(result.data?.role));
      } else {
        setError("Something went wrong. Please try again.");
      }
    } catch (err) {
      console.error("Role selection error:", err);
      setError(err?.data?.message || "Failed to complete registration");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 transition-all duration-300"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-md bg-white dark:bg-gray-800 rounded-2xl shadow-2xl z-50 overflow-hidden animate-in fade-in zoom-in duration-300">
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-100 dark:border-gray-800 flex items-center justify-between">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
            Choose Your Role
          </h2>
          <button
            onClick={onClose}
            className="p-1 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          <p className="text-gray-600 dark:text-gray-400 text-center mb-6">
            How would you like to use SkillSync AI?
          </p>

          <div className="space-y-3">
            {/* Job Seeker Option */}
            <button
              onClick={() => handleRoleSelect("jobseeker")}
              disabled={isLoading}
              className={`w-full flex items-center gap-4 p-4 rounded-xl border-2 transition-all duration-200 ${
                selectedRole === "jobseeker"
                  ? "border-purple-500 bg-purple-50 dark:bg-purple-900/20"
                  : "border-gray-200 dark:border-gray-700 hover:border-purple-200 dark:hover:border-purple-800"
              }`}
            >
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-100 to-indigo-100 dark:from-purple-900/30 dark:to-indigo-900/30 flex items-center justify-center">
                <User className="w-6 h-6 text-purple-600 dark:text-purple-400" />
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
                <div className="w-5 h-5 rounded-full bg-purple-600 flex items-center justify-center">
                  <div className="w-2 h-2 bg-white rounded-full" />
                </div>
              )}
            </button>

            {/* Recruiter Option */}
            <button
              onClick={() => handleRoleSelect("recruiter")}
              disabled={isLoading}
              className={`w-full flex items-center gap-4 p-4 rounded-xl border-2 transition-all duration-200 ${
                selectedRole === "recruiter"
                  ? "border-purple-500 bg-purple-50 dark:bg-purple-900/20"
                  : "border-gray-200 dark:border-gray-700 hover:border-purple-200 dark:hover:border-purple-800"
              }`}
            >
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-100 to-indigo-100 dark:from-purple-900/30 dark:to-indigo-900/30 flex items-center justify-center">
                <Building2 className="w-6 h-6 text-purple-600 dark:text-purple-400" />
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
                <div className="w-5 h-5 rounded-full bg-purple-600 flex items-center justify-center">
                  <div className="w-2 h-2 bg-white rounded-full" />
                </div>
              )}
            </button>
          </div>

          {error && (
            <p className="text-sm text-red-500 dark:text-red-400 text-center mt-4">
              {error}
            </p>
          )}

          {isLoading && (
            <div className="flex justify-center mt-4">
              <Loader2 className="w-6 h-6 text-purple-600 animate-spin" />
            </div>
          )}
        </div>
      </div>
    </>
  );
}
