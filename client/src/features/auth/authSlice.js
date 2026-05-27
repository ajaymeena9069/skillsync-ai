// client/src/features/auth/authSlice.js - SIMPLE VERSION
import { createSlice } from "@reduxjs/toolkit";
import { AUTH_STATUS, USER_ROLES } from "./authConstants";
import {
  getUser,
  isAuthenticated,
  saveUser,
  removeAuthData,
  getAccessToken,
} from "./authUtils";
import { clearResumeFromStorage } from "../resume/resumeUtils";

const initialState = {
  user: getUser(),
  accessToken: getAccessToken(),
  isAuthenticated: isAuthenticated()
    ? AUTH_STATUS.AUTHENTICATED
    : AUTH_STATUS.UNAUTHENTICATED,
};

const authSlice = createSlice({
  name: "auth",
  initialState,

  reducers: {
    setCredentials: (state, action) => {
      const { user, accessToken, redirectUrl } = action.payload;

      // ✅ DIRECTLY STORE - NO TRANSFORMATION
      state.user = user;
      state.accessToken = accessToken;
      state.isAuthenticated = AUTH_STATUS.AUTHENTICATED;
      state.redirectUrl = redirectUrl || null;

      if (state.user) {
        saveUser(state.user);
      }
      if (accessToken) {
        localStorage.setItem("accessToken", accessToken);
      }
    },

    logoutUser: (state) => {
      state.user = null;
      state.accessToken = null;
      state.isAuthenticated = AUTH_STATUS.UNAUTHENTICATED;
      state.redirectUrl = null;
      removeAuthData();
      clearResumeFromStorage();
    },

    updateUserProfile: (state, action) => {
      const updates = action.payload;
      if (!state.user) return;

      // ✅ Handle company update properly
      if (updates.company) {
        state.user.company = {
          ...state.user.company,
          ...updates.company,
        };
      }

      // ✅ Handle other fields
      Object.keys(updates).forEach((key) => {
        if (key !== "company" && updates[key] !== undefined) {
          state.user[key] = updates[key];
        }
      });

      saveUser(state.user);
    },
    syncAuthFromStorage: (state) => {
      const user = getUser();
      const token = getAccessToken();

      if (user && token) {
        state.user = user;
        state.accessToken = token;
        state.isAuthenticated = AUTH_STATUS.AUTHENTICATED;
      }
    },
  },
});

// Selectors
export const selectUser = (state) => state.auth.user;
export const selectUserRole = (state) => state.auth.user?.role;
export const selectIsRecruiter = (state) =>
  state.auth.user?.role === USER_ROLES.RECRUITER;
export const selectIsCandidate = (state) =>
  state.auth.user?.role === USER_ROLES.USER;
export const selectIsProfileComplete = (state) => {
  const user = state.auth.user;
  if (!user) return false;
  return user.role === USER_ROLES.RECRUITER
    ? user.isCompanyComplete
    : user.isProfileComplete;
};

export const selectCompanyData = (state) => state.auth.user?.company || {};
export const selectCompanyName = (state) =>
  state.auth.user?.company?.name || "";
export const selectCompanyLogo = (state) =>
  state.auth.user?.company?.logo || "";

export const selectCandidateSkills = (state) => state.auth.user?.skills || [];
export const selectCandidateResume = (state) =>
  state.auth.user?.resumeUrl || "";
export const selectCandidateLocation = (state) =>
  state.auth.user?.location || "";

export const selectCompanyCompletionPercentage = (state) => {
  const company = state.auth.user?.company;
  if (!company) return 0;

  let completed = 0;
  if (company.name) completed++;
  if (company.logo) completed++;
  if (company.email) completed++;
  if (company.phone) completed++;
  if (company.location) completed++;
  if (company.industry) completed++;
  if (company.description?.length >= 50) completed++;
  if (company.benefits?.length > 0) completed++;

  return Math.round((completed / 8) * 100);
};

export const selectProfileCompletionPercentage = (state) => {
  const user = state.auth.user;
  if (!user || user.role !== USER_ROLES.USER) return 0;

  let completed = 0;
  if (user.name) completed++;
  if (user.email) completed++;
  if (user.phone) completed++;
  if (user.location) completed++;
  if (user.currentRole) completed++;
  if (user.experience && user.experience !== "0 years") completed++;
  if (user.skills?.length >= 3) completed++;
  if (user.resumeUrl) completed++;

  return Math.round((completed / 8) * 100);
};

export const {
  setCredentials,
  logoutUser,
  updateUserProfile,
  syncAuthFromStorage,
} = authSlice.actions;

export default authSlice.reducer;
