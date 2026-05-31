import { baseApi } from "./baseApi";

export const testimonialApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getPublicTestimonials: builder.query({
      query: () => "/testimonials/public",
      providesTags: ["Testimonial"],
    }),
    submitTestimonial: builder.mutation({
      query: (data) => ({
        url: "/testimonials",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Testimonial"],
    }),
  }),
});

export const {
  useGetPublicTestimonialsQuery,
  useSubmitTestimonialMutation,
} = testimonialApi;
