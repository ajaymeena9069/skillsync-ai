import { combineReducers } from "@reduxjs/toolkit";
import { baseApi } from "../services/baseApi";
import authReducer from "../features/auth/authSlice";
import resumeReducer from "../features/resume/resumeSlice";
import { resumeApi } from "../services/resumeApi";
export const rootReducer = combineReducers({
  auth: authReducer,
  resume: resumeReducer,
  [baseApi.reducerPath]: baseApi.reducer,
  [resumeApi.reducerPath]: resumeApi.reducer,
});
