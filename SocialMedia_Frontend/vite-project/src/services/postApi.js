import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const postsApi = createApi({
  reducerPath: "postsApi",
  baseQuery: fetchBaseQuery({
    baseUrl: "/post",
    credentials: "include",
  }),
  tagTypes: ["Post", "UserPosts", "RecentlyVisited"],
  endpoints: (builder) => ({
    createPost: builder.mutation({
      query: (formData) => ({
        url: "/createPost",
        method: "POST",
        body: formData,
      }),
      invalidatesTags: ["Post", "UserPosts"],
    }),
    createPostInCommunity: builder.mutation({
      query: ({ communityId, formData }) => ({
        url: `/createPost/${communityId}`,
        method: "POST",
        body: formData,
      }),
      invalidatesTags: ["Post"],
    }),
    getAllPosts: builder.query({
      query: () => "/getAllPost",
      providesTags: ["Post"],
    }),
    getPost: builder.query({
      query: (postId) => `/getPost/${postId}`,
      providesTags: (result, error, postId) => [{ type: "Post", id: postId }],
    }),
    getPostsOfCurrentUser: builder.query({
      query: () => "/getPostOfLoggedInUser",
      providesTags: ["UserPosts"],
    }),
    getPostsOfUser: builder.query({
      query: (userId) => `/getPostOfUser/${userId}`,
      providesTags: (result, error, userId) => [
        { type: "UserPosts", id: userId },
      ],
    }),
    updatePost: builder.mutation({
      query: ({ id, formData }) => ({
        url: `/updatePost/${id}`,
        method: "PATCH",
        body: formData,
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: "Post", id },
        "UserPosts",
      ],
    }),
    deletePost: builder.mutation({
      query: (postId) => ({ url: `/deletePost/${postId}`, method: "DELETE" }),
      invalidatesTags: ["Post", "UserPosts"],
    }),
    likePost: builder.mutation({
      query: (id) => ({ url: `/like/${id}`, method: "POST" }),
      invalidatesTags: (result, error, id) => [{ type: "Post", id }],
    }),
    dislikePost: builder.mutation({
      query: (id) => ({ url: `/dislike/${id}`, method: "POST" }),
      invalidatesTags: (result, error, id) => [{ type: "Post", id }],
    }),
    searchPosts: builder.query({
      query: (q) => ({ url: "/search", params: { q } }),
    }),
     searchAll: builder.query({
      query: (q) => ({ url: "/search/all", params: { q } }),
    }),
    getRecentlyVisitedPosts: builder.query({
      query: () => "/recentlyVisited",
      providesTags: ["RecentlyVisited"],
    }),
    getNewPosts: builder.query({
      query: ({ page = 1, limit = 10 } = {}) => ({ url: "/new", params: { page, limit } }),
      providesTags: ["Post"],
    }),
    getTopPosts: builder.query({
      query: ({ page = 1, limit = 10 } = {}) => ({ url: "/top", params: { page, limit } }),
      providesTags: ["Post"],
    }),
    getFeed: builder.query({
      query: ({ page = 1, limit = 10 } = {}) => ({ url: "/feed", params: { page, limit } }),
      providesTags: ["Post"],
    }),
  }),
});

export const {
  useSearchAllQuery,
  useGetFeedQuery,
  useGetNewPostsQuery,
  useGetRecentlyVisitedPostsQuery,
  useGetTopPostsQuery,
  useCreatePostMutation,
  useCreatePostInCommunityMutation,
  useGetAllPostsQuery,
  useGetPostQuery,
  useGetPostsOfCurrentUserQuery,
  useGetPostsOfUserQuery,
  useUpdatePostMutation,
  useDeletePostMutation,
  useLikePostMutation,
  useDislikePostMutation,
  useSearchPostsQuery,
} = postsApi;