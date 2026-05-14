import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const usersApi = createApi({
  reducerPath: "usersApi",
  baseQuery: fetchBaseQuery({
    baseUrl: "/users",
    credentials: "include",
  }),
  tagTypes: ["User", "Followers", "Following"],
  endpoints: (builder) => ({
    register: builder.mutation({
      query: (formData) => ({
        url: "/register",
        method: "POST",
        body: formData,
      }),
    }),
    login: builder.mutation({
      query: (credentials) => ({
        url: "/login",
        method: "POST",
        body: credentials,
      }),
      invalidatesTags: ["User"],
    }),
    logout: builder.mutation({
      query: () => ({ url: "/logout", method: "POST" }),
      invalidatesTags: ["User"],
    }),
    getCurrentUser: builder.query({
      query: () => "/getCurrentUser",
      providesTags: ["User"],
    }),
    getProfile: builder.query({
      query: (id) => `/getProfile/${id}`,
      providesTags: (result, error, id) => [{ type: "User", id }],
    }),
    getAllUsers: builder.query({
      query: () => "/getAllUsers",
      providesTags: ["User"],
    }),
    searchUsers: builder.query({
      query: (q) => ({ url: "/search", params: { q } }),
    }),
    changeEmail: builder.mutation({
      query: (body) => ({ url: "/changeEmail", method: "PUT", body }),
      invalidatesTags: ["User"],
    }),
    changeUsername: builder.mutation({
      query: (body) => ({ url: "/changeUsername", method: "PUT", body }),
      invalidatesTags: ["User"],
    }),
    changePassword: builder.mutation({
      query: (body) => ({ url: "/changePassword", method: "PUT", body }),
    }),
    changeProfilePic: builder.mutation({
      query: (formData) => ({
        url: "/changeUserProfilePic",
        method: "PUT",
        body: formData,
      }),
      invalidatesTags: ["User"],
    }),
    followUser: builder.mutation({
      query: (id) => ({ url: `/followUser/${id}`, method: "POST" }),
      invalidatesTags: ["Followers", "Following"],
    }),
    unfollowUser: builder.mutation({
      query: (id) => ({ url: `/unfollowUser/${id}`, method: "POST" }),
      invalidatesTags: ["Followers", "Following"],
    }),
    getFollowers: builder.query({
      query: () => "/getFollowers",
      providesTags: ["Followers"],
    }),
    getFollowing: builder.query({
      query: () => "/getFollowing",
      providesTags: ["Following"],
    }),
    getFollowerCount: builder.query({
      query: () => "/getFollowerCount",
      providesTags: ["Followers"],
    }),
    getFollowingCount: builder.query({
      query: () => "/getFollowingCount",
      providesTags: ["Following"],
    }),
    deactivateAccount: builder.mutation({
      query: (body) => ({ url: "/deactivateAccount", method: "POST", body }),
      invalidatesTags: ["User"],
    }),
  }),
});

export const {
  useRegisterMutation,
  useLoginMutation,
  useLogoutMutation,
  useGetCurrentUserQuery,
  useGetProfileQuery,
  useGetAllUsersQuery,
  useSearchUsersQuery,
  useChangeEmailMutation,
  useChangeUsernameMutation,
  useChangePasswordMutation,
  useChangeProfilePicMutation,
  useFollowUserMutation,
  useUnfollowUserMutation,
  useGetFollowersQuery,
  useGetFollowingQuery,
  useGetFollowerCountQuery,
  useGetFollowingCountQuery,
  useDeactivateAccountMutation,
} = usersApi;
