import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const notificationApi = createApi({
  reducerPath: "notificationApi",
  baseQuery: fetchBaseQuery({ baseUrl: "/notification", credentials: "include" }),
  tagTypes: ["Notification"],
  endpoints: (builder) => ({
    getNotifications: builder.query({
      query: () => "/getAll",
      providesTags: ["Notification"],
    }),
    getUnreadCount: builder.query({
      query: () => "/unreadCount",
      providesTags: ["Notification"],
    }),
    markAllRead: builder.mutation({
      query: () => ({ url: "/markAllRead", method: "PUT" }),
      invalidatesTags: ["Notification"],
    }),
    markRead: builder.mutation({
      query: (id) => ({ url: `/markRead/${id}`, method: "PUT" }),
      invalidatesTags: ["Notification"],
    }),
  }),
});

export const {
  useGetNotificationsQuery,
  useGetUnreadCountQuery,
  useMarkAllReadMutation,
  useMarkReadMutation,
} = notificationApi;
