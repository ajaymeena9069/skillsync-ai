import { baseApi } from "./baseApi";
import { setResume } from "../features/resume/resumeSlice";

export const resumeApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    uploadResume: builder.mutation({
      query: (formData) => ({
        url: "/resume/upload",
        method: "POST",
        body: formData,
      }),
      invalidatesTags: ["User", "Resume"],
      async onQueryStarted(arg, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          if (data?.data) {
            // 🔥 Dispatch to Redux - will auto-save to localStorage
            dispatch(
              setResume({
                parsedSkills: data.data.parsedSkills || data.data.skills,
                experience: data.data.experience,
                education: data.data.education,
                projects: data.data.projects,
                data: data.data,
              }),
            );
          }
        } catch (error) {
          console.error("Upload failed:", error);
        }
      },
    }),

    getResume: builder.query({
      query: () => "/resume/my-resume",
      providesTags: ["Resume"],
      async onQueryStarted(arg, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          if (data?.data) {
            // 🔥 Dispatch to Redux - will auto-save to localStorage
            dispatch(
              setResume({
                parsedSkills: data.data.parsedSkills || data.data.skills,
                experience: data.data.experience,
                education: data.data.education,
                projects: data.data.projects,
                data: data.data,
              }),
            );
          }
        } catch (error) {
          console.error("Failed to fetch resume:", error);
        }
      },
    }),

    deleteResume: builder.mutation({
      query: () => ({
        url: "/resume/delete",
        method: "DELETE",
      }),
      invalidatesTags: ["User", "Resume"],
      async onQueryStarted(arg, { dispatch, queryFulfilled }) {
        try {
          await queryFulfilled;
          const { clearResume } =
            await import("../features/resume/resumeSlice");
          dispatch(clearResume());
        } catch (error) {
          console.error("Delete failed:", error);
        }
      },
    }),
  }),
});

export const {
  useUploadResumeMutation,
  useGetResumeQuery,
  useDeleteResumeMutation,
} = resumeApi;
