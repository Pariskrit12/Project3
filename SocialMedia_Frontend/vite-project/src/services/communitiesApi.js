import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const communitiesApi = createApi({
  reducerPath: "communitiesApi",
  baseQuery: fetchBaseQuery({
    baseUrl: "/community",
    credentials: "include",
  }),
  tagTypes: ["Community", "CommunityFeed"],
  endpoints: (builder) => ({
    getCommunityFeed: builder.query({
      query: () => "/feed",
      providesTags: ["CommunityFeed"],
    }),
    createCommunity: builder.mutation({
      query: (formData) => ({
        url: "/createCommunity",
        method: "POST",
        body: formData,
      }),
      invalidatesTags: ["Community", "CommunityFeed"],
    }),
    updateCommunity: builder.mutation({
      query: ({ communityId, formData }) => ({
        url: `/updateCommunity/${communityId}`,
        method: "PATCH",
        body: formData,
      }),
      invalidatesTags: (result, error, { communityId }) => [
        { type: "Community", id: communityId },
        "CommunityFeed",
      ],
    }),
    deleteCommunity: builder.mutation({
      query: (communityId) => ({
        url: `/deleteCommunity/${communityId}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Community", "CommunityFeed"],
    }),
    getMyCommunities: builder.query({
      query: () => "/myCommunities",
      providesTags: ["Community"],
    }),
    searchCommunities: builder.query({
      query: (q) => ({ url: "/search", params: { q } }),
    }),
    getAllCommunities: builder.query({
      query: () => "/",
      providesTags: ["Community"],
    }),
    getCommunity: builder.query({
      query: (communityId) => `/${communityId}`,
      providesTags: (result, error, communityId) => [
        { type: "Community", id: communityId },
      ],
    }),
  }),
});

export const {
  useGetCommunityFeedQuery,
  useCreateCommunityMutation,
  useUpdateCommunityMutation,
  useDeleteCommunityMutation,
  useGetMyCommunitiesQuery,
  useSearchCommunitiesQuery,
  useGetAllCommunitiesQuery,
  useGetCommunityQuery,
} = communitiesApi;