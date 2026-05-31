import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { TOKEN_KEY } from "../features/auth/authConstants";

const baseQuery = fetchBaseQuery({
  baseUrl: import.meta.env.VITE_API_URL || "http://localhost:5000/api",
  credentials: "include",
  prepareHeaders: (headers) => {
    const token = localStorage.getItem(TOKEN_KEY);
    if (token) {
      headers.set("authorization", `Bearer ${token}`);
    }
    return headers;
  },
});

export const baseApi = createApi({
  reducerPath: "api",
  baseQuery,
  tagTypes: [
    "Auth",
    "User",
    "Jobs",
    "Applications",
    "Company",
    "Resume",
    "Matches",
    "SkillGap",
    "Roadmap",
    "Notification",
    "DashboardStats",
    "Analytics",
    "Candidates",
    "CompanyProfile",
    "CompanyStats",
    "PublicStats",
    "Job",
    "MyJobs",
    "JobApplications",
    "ApplicationStatus",
    "Application",
    "Match",
    "JobMatches",
    "DetailedMatch",
    "Testimonial",
  ],
  endpoints: () => ({}),
});
