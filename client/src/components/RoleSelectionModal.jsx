// components/RoleSelectionModal.jsx
import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useGoogleAuthMutation } from "../services/authApi";
import { setCredentials } from "../features/auth/authSlice";
import { saveAccessToken, saveUser } from "../features/auth/authUtils";
import { User, Building2 } from "lucide-react";

const RoleSelectionModal = ({ tempData, onClose }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [googleAuth] = useGoogleAuthMutation();
  const [selectedRole, setSelectedRole] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  const handleRoleSelect = async (role) => {
    setSelectedRole(role);
    setIsSubmitting(true);
    setError("");

    try {
      // We need to store the idToken temporarily
      // In your AuthPage, you'll pass the idToken along with tempData
      const response = await googleAuth({
        tokenId: tempData.tokenId,
        role: role,
      }).unwrap();

      // Save token and user data (matching your existing pattern)
      saveAccessToken(response.token);
      saveUser(response.data);

      dispatch(
        setCredentials({
          user: response.data,
          accessToken: response.token,
        }),
      );

      onClose();
      navigate("/app/dashboard");
    } catch (err) {
      setError(err?.data?.message || "Failed to complete registration");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl p-8 max-w-md w-full mx-4 shadow-xl">
        <h2 className="text-2xl font-bold text-center mb-2">
          Welcome to SkillSync AI!
        </h2>
        <p className="text-gray-600 text-center mb-6">
          How would you like to use the platform?
        </p>

        {error && (
          <div className="mb-4 p-3 bg-red-50 text-red-600 rounded-lg text-sm">
            {error}
          </div>
        )}

        <div className="space-y-4">
          <button
            onClick={() => handleRoleSelect("user")}
            disabled={isSubmitting}
            className={`w-full p-4 border-2 rounded-lg text-left transition-all ${
              selectedRole === "user"
                ? "border-blue-500 bg-blue-50"
                : "border-gray-200 hover:border-blue-300"
            }`}
          >
            <div className="flex items-center gap-3">
              <User className="w-6 h-6 text-blue-600" />
              <div>
                <div className="font-semibold">Job Seeker</div>
                <div className="text-sm text-gray-500">
                  Find jobs, get AI recommendations, and grow your career
                </div>
              </div>
            </div>
          </button>

          <button
            onClick={() => handleRoleSelect("recruiter")}
            disabled={isSubmitting}
            className={`w-full p-4 border-2 rounded-lg text-left transition-all ${
              selectedRole === "recruiter"
                ? "border-blue-500 bg-blue-50"
                : "border-gray-200 hover:border-blue-300"
            }`}
          >
            <div className="flex items-center gap-3">
              <Building2 className="w-6 h-6 text-green-600" />
              <div>
                <div className="font-semibold">Recruiter</div>
                <div className="text-sm text-gray-500">
                  Post jobs, find candidates, and manage hiring
                </div>
              </div>
            </div>
          </button>
        </div>

        {isSubmitting && (
          <div className="mt-4 text-center text-gray-500">
            Creating your account...
          </div>
        )}
      </div>
    </div>
  );
};

export default RoleSelectionModal;
