// client/src/services/authApi.js
import { baseApi } from "./baseApi";

export const authApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // Login mutation
    login: builder.mutation({
      query: (credentials) => ({
        url: "/auth/login",
        method: "POST",
        body: credentials,
      }),
      transformResponse: (response) => response,
    }),

    // Register mutation
    register: builder.mutation({
      query: (userData) => ({
        url: "/auth/register",
        method: "POST",
        body: userData,
      }),
      transformResponse: (response) => response,
    }),

    // Google auth mutation
    googleAuth: builder.mutation({
      query: (data) => ({
        url: "/auth/google",
        method: "POST",
        body: data,
      }),
      transformResponse: (response) => response,
    }),

    // Verify email
    verifyEmail: builder.mutation({
      query: (data) => ({
        url: "/auth/verify-email",
        method: "POST",
        body: data,
      }),
    }),

    // Resend verification code
    resendVerificationCode: builder.mutation({
      query: (data) => ({
        url: "/auth/resend-verification",
        method: "POST",
        body: data,
      }),
    }),

    // Forgot password
    forgotPassword: builder.mutation({
      query: (data) => ({
        url: "/auth/forgot-password",
        method: "POST",
        body: data,
      }),
    }),

    // Reset password
    resetPassword: builder.mutation({
      query: (data) => ({
        url: "/auth/reset-password",
        method: "POST",
        body: data,
      }),
    }),

    // Get current user
    getMe: builder.query({
      query: () => "/auth/me",
      providesTags: ["User"],
    }),

    // Upgrade to Developer Account
    upgradeDeveloper: builder.mutation({
      query: (data) => ({
        url: "/auth/upgrade-developer",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["User"],
    }),
  }),
});

export const {
  useLoginMutation,
  useRegisterMutation,
  useGoogleAuthMutation,
  useVerifyEmailMutation,
  useResendVerificationCodeMutation,
  useForgotPasswordMutation,
  useResetPasswordMutation,
  useGetMeQuery,
  useUpgradeDeveloperMutation,
} = authApi;
