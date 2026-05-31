// client/src/features/auth/authSlice.js
import { createSlice } from "@reduxjs/toolkit";
import { AUTH_STATUS, USER_ROLES } from "./authConstants";
import {
  getUser,
  getToken,
  setUser,
  setToken,
  clearAuthData,
} from "./authUtils";

const initialState = {
  user: getUser(),
  token: getToken(),
  isAuthenticated: !!getToken() && !!getUser(),
  status: AUTH_STATUS.IDLE,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    // Set credentials after login/register
    setCredentials: (state, action) => {
      const { user, token } = action.payload;

      state.user = user;
      state.token = token;
      state.isAuthenticated = true;
      state.status = AUTH_STATUS.AUTHENTICATED;

      // Persist to localStorage
      if (user) setUser(user);
      if (token) setToken(token);
    },

    // Update user profile (partial update)
    updateUser: (state, action) => {
      const updates = action.payload;
      state.user = { ...state.user, ...updates };
      setUser(state.user);
    },

    // Logout user
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      state.status = AUTH_STATUS.UNAUTHENTICATED;
      clearAuthData();
    },

    // Sync from storage (on app load)
    syncAuth: (state) => {
      const user = getUser();
      const token = getToken();

      if (user && token) {
        state.user = user;
        state.token = token;
        state.isAuthenticated = true;
        state.status = AUTH_STATUS.AUTHENTICATED;
      }
    },
  },
});

// Selectors
export const selectUser = (state) => state.auth.user;
export const selectToken = (state) => state.auth.token;
export const selectIsAuthenticated = (state) => state.auth.isAuthenticated;
export const selectUserRole = (state) => state.auth.user?.role;
export const selectIsRecruiter = (state) =>
  state.auth.user?.role === USER_ROLES.RECRUITER;
export const selectIsJobSeeker = (state) =>
  state.auth.user?.role === USER_ROLES.JOBSEEKER;

// Profile completion selectors
export const selectIsProfileComplete = (state) => {
  const user = state.auth.user;
  if (!user) return false;
  return user.role === USER_ROLES.RECRUITER
    ? user.isCompanyComplete
    : user.isProfileComplete;
};

export const selectCompany = (state) => state.auth.user?.company || {};
export const selectSkills = (state) => state.auth.user?.skills || [];

export const { setCredentials, updateUser, logout, syncAuth } =
  authSlice.actions;
export default authSlice.reducer;
