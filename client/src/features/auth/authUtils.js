// client/src/features/auth/authUtils.js
import { TOKEN_KEY, USER_KEY, USER_ROLES } from "./authConstants";

// Token functions
export const getToken = () => localStorage.getItem(TOKEN_KEY);
export const setToken = (token) => {
  if (token) localStorage.setItem(TOKEN_KEY, token);
};
export const removeToken = () => localStorage.removeItem(TOKEN_KEY);

// User functions
export const getUser = () => {
  try {
    const user = localStorage.getItem(USER_KEY);
    return user ? JSON.parse(user) : null;
  } catch {
    return null;
  }
};

export const setUser = (user) => {
  if (user) localStorage.setItem(USER_KEY, JSON.stringify(user));
};
export const removeUser = () => localStorage.removeItem(USER_KEY);

// Auth check
export const isAuthenticated = () => !!getToken() && !!getUser();

// Role checks
export const isRecruiter = (user) => user?.role === USER_ROLES.RECRUITER;
export const isJobSeeker = (user) => user?.role === USER_ROLES.JOBSEEKER;

// Redirect helper
export const getRedirectPath = (role) => {
  return role === USER_ROLES.RECRUITER
    ? "/app/recruiter-dashboard"
    : "/app/dashboard";
};

// Clear all auth data
export const clearAuthData = () => {
  removeToken();
  removeUser();
};
