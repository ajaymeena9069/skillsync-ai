// client/src/services/companyApi.js
import { baseApi } from "./baseApi";

export const companyApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getCompanyProfile: builder.query({
      query: () => "/company/profile",
      providesTags: ["CompanyProfile"],
    }),
    updateCompanyProfile: builder.mutation({
      query: (data) => ({
        url: "/company/profile",
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["CompanyProfile"],
    }),
    uploadCompanyLogo: builder.mutation({
      query: (formData) => ({
        url: "/company/logo",
        method: "POST",
        body: formData,
      }),
      invalidatesTags: ["CompanyProfile"],
    }),
    getCompanyStats: builder.query({
      query: () => "/company/stats",
      providesTags: ["CompanyStats"],
    }),
    getPublicCompanyProfile: builder.query({
      query: (recruiterId) => `/company/public/${recruiterId}`,
      providesTags: (result, error, recruiterId) => [
        { type: "CompanyProfile", id: recruiterId },
      ],
    }),
  }),
});

export const {
  useGetCompanyProfileQuery,
  useUpdateCompanyProfileMutation,
  useUploadCompanyLogoMutation,
  useGetCompanyStatsQuery,
  useGetPublicCompanyProfileQuery,
} = companyApi;
