import { combineReducers } from "@reduxjs/toolkit";
import { baseApi } from "../services/baseApi";
import authReducer from "../features/auth/authSlice";
import resumeReducer from "../features/resume/resumeSlice";
import { resumeApi } from "../services/resumeApi";
const appReducer = combineReducers({
  auth: authReducer,
  resume: resumeReducer,
  [baseApi.reducerPath]: baseApi.reducer,
  [resumeApi.reducerPath]: resumeApi.reducer,
});

export const rootReducer = (state, action) => {
  // Clear all data in redux store to initial when user logs out
  // This is the most optimized way to invalidate all RTK Query tags and clear caches
  if (action.type === "auth/logout") {
    state = undefined;
  }
  return appReducer(state, action);
};
