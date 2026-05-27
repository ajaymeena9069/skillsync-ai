import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { AUTH_STORAGE_KEY } from "../features/auth/authConstants";

const baseQuery = fetchBaseQuery({
  baseUrl: import.meta.env.VITE_API_URL,
  credentials: "include",
  prepareHeaders: (headers, { getState }) => {
    // ✅ Get token from localStorage instead of Redux state
    const token = localStorage.getItem(AUTH_STORAGE_KEY);

    // console.log(
    //   "Token from localStorage:",
    //   token ? `${token.substring(0, 50)}...` : "NO TOKEN",
    // );

    if (token) {
      headers.set("authorization", `Bearer ${token}`);
    }
    return headers;
  },
});

export const baseApi = createApi({
  reducerPath: "api",
  baseQuery: baseQuery,
  tagTypes: [
    "Auth",
    "User",
    "Jobs",
    "Resume",
    "Notifications",
    "Recruiter",
    "Applications",
    "CompanyStats",
    "CompanyProfile",
    "Match",
    "JobMatches",
    "DetailedMatch",
  ],
  endpoints: () => ({}),
});
