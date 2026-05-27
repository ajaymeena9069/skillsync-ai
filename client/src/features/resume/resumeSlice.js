import { createSlice } from "@reduxjs/toolkit";
import {
  normalizeSkills,
  saveResumeToStorage,
  getResumeFromStorage,
  clearResumeFromStorage,
} from "./resumeUtils";
import { RESUME_STATUS } from "./resumeConstants";

// Load from localStorage on app start
const loadInitialState = () => {
  const stored = getResumeFromStorage();
  if (stored && stored.parsedSkills?.length) {
    return {
      data: stored.data || null,
      parsedSkills: stored.parsedSkills || [],
      experience: stored.experience || null,
      education: stored.education || [],
      projects: stored.projects || [],
      status: RESUME_STATUS.SUCCEEDED,
      error: null,
    };
  }
  return {
    data: null,
    parsedSkills: [],
    experience: null,
    education: [],
    projects: [],
    status: RESUME_STATUS.IDLE,
    error: null,
  };
};

const initialState = loadInitialState();

const resumeSlice = createSlice({
  name: "resume",
  initialState,
  reducers: {
    setResume: (state, action) => {
      const payload = action.payload || {};
      const normalizedSkills = normalizeSkills(
        payload.parsedSkills || payload.skills || [],
      );

      state.parsedSkills = normalizedSkills;
      state.experience = payload.experience || "Not specified";
      state.education = payload.education || [];
      state.projects = payload.projects || [];
      state.data = {
        fileUrl: payload.fileUrl,
        originalName: payload.originalName,
        ...payload.data,
      };
      state.status = RESUME_STATUS.SUCCEEDED;
      state.error = null;

      // Save to localStorage only if there are skills
      if (normalizedSkills.length > 0) {
        saveResumeToStorage({
          parsedSkills: state.parsedSkills,
          experience: state.experience,
          education: state.education,
          projects: state.projects,
          data: state.data,
        });
      }
    },

    setResumeLoading: (state) => {
      state.status = RESUME_STATUS.LOADING;
      state.error = null;
    },

    setResumeError: (state, action) => {
      state.status = RESUME_STATUS.FAILED;
      state.error = action.payload;
    },

    clearResume: (state) => {
      state.data = null;
      state.parsedSkills = [];
      state.experience = null;
      state.education = [];
      state.projects = [];
      state.status = RESUME_STATUS.IDLE;
      state.error = null;
      clearResumeFromStorage();
    },

    // Manually sync from localStorage (if needed)
    syncResume: (state) => {
      const stored = getResumeFromStorage();
      if (stored && stored.parsedSkills?.length) {
        state.parsedSkills = stored.parsedSkills;
        state.experience = stored.experience;
        state.education = stored.education;
        state.projects = stored.projects;
        state.data = stored.data || null;
        state.status = RESUME_STATUS.SUCCEEDED;
      } else {
        // Clear state if no valid resume in storage
        state.parsedSkills = [];
        state.experience = null;
        state.education = [];
        state.projects = [];
        state.data = null;
        state.status = RESUME_STATUS.IDLE;
      }
    },
  },
});

export const {
  setResume,
  setResumeLoading,
  setResumeError,
  clearResume,
  syncResume,
} = resumeSlice.actions;

export default resumeSlice.reducer;
