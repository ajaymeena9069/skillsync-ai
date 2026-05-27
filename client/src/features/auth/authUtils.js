// client/src/features/auth/authUtils.js
import { AUTH_STORAGE_KEY, USER_ROLES } from "./authConstants";

const TOKEN_KEY = "accessToken";

export const saveAccessToken = (token) => {
  if (token) localStorage.setItem(TOKEN_KEY, token);
};

export const saveUser = (user) => {
  if (user) {
    localStorage.setItem("user", JSON.stringify(user));
    console.log("💾 User saved:", {
      id: user.id,
      role: user.role,
      companyName: user.company?.name,
    });
  }
};

export const getUser = () => {
  try {
    const u = localStorage.getItem("user");
    if (u) {
      const user = JSON.parse(u);
      console.log("📖 User loaded:", {
        id: user.id,
        role: user.role,
        companyName: user.company?.name,
      });
      return user;
    }
    return null;
  } catch (error) {
    console.error("Failed to parse user:", error);
    return null;
  }
};

export const getAccessToken = () => {
  return localStorage.getItem(TOKEN_KEY);
};

export const removeAuthData = () => {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem("user");
  console.log("🗑️ Auth data cleared");
};

export const isAuthenticated = () => {
  return !!localStorage.getItem(TOKEN_KEY) && !!getUser();
};

export const isRecruiter = (user) => user?.role === USER_ROLES.RECRUITER;
export const isUser = (user) => user?.role === USER_ROLES.USER;
export const hasRequiredRole = (user, role) => user?.role === role;

export const getRedirectPath = (role) => {
  return role === USER_ROLES.RECRUITER
    ? "/app/recruiter-dashboard"
    : "/app/dashboard";
};
