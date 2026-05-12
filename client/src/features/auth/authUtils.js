import { AUTH_STORAGE_KEY, USER_ROLES } from "./authConstants";

export const saveAccessToken = (token) => {
  localStorage.setItem(AUTH_STORAGE_KEY, token);
};

export const saveUser = (user) => {
  localStorage.setItem("user", JSON.stringify(user));
};

export const getUser = () => {
  const u = localStorage.getItem("user");
  return u ? JSON.parse(u) : null;
};

export const removeAuthData = () => {
  localStorage.removeItem(AUTH_STORAGE_KEY);
  localStorage.removeItem("user");
};

export const isAuthenticated = () => {
  return !!localStorage.getItem(AUTH_STORAGE_KEY);
};

export const isRecruiter = (user) => {
  return user?.role === USER_ROLES.RECRUITER;
};

export const isUser = (user) => {
  return user?.role === USER_ROLES.USER;
};

export const hasRequiredRole = (user, role) => {
  return user?.role === role;
};
