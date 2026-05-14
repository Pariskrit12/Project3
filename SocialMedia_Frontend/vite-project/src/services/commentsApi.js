import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const commentsApi = createApi({
  reducerPath: "commentsApi",
  baseQuery: fetchBaseQuery({
    baseUrl: "/comment",
    credentials: "include",
  }),
  tagTypes: ["Comment"],
  endpoints: (builder) => ({
    getComments: builder.query({
      query: (postId) => `/${postId}`,
      providesTags: (result, error, postId) => [
        { type: "Comment", id: postId },
      ],
    }),
    createComment: builder.mutation({
      query: ({ postId, formData }) => ({
        url: `/${postId}`,
        method: "POST",
        body: formData,
      }),
      invalidatesTags: (result, error, { postId }) => [
        { type: "Comment", id: postId },
      ],
    }),
    updateComment: builder.mutation({
      query: ({ postId, commentId, formData }) => ({
        url: `/${postId}/${commentId}`,
        method: "PATCH",
        body: formData,
      }),
      invalidatesTags: (result, error, { postId }) => [
        { type: "Comment", id: postId },
      ],
    }),
    deleteComment: builder.mutation({
      query: ({ postId, commentId }) => ({
        url: `/${postId}/${commentId}`,
        method: "DELETE",
      }),
      invalidatesTags: (result, error, { postId }) => [
        { type: "Comment", id: postId },
      ],
    }),
    likeComment: builder.mutation({
      query: ({ postId, commentId }) => ({
        url: `/${postId}/${commentId}/like`,
        method: "POST",
      }),
      invalidatesTags: (result, error, { postId }) => [
        { type: "Comment", id: postId },
      ],
    }),
    dislikeComment: builder.mutation({
      query: ({ postId, commentId }) => ({
        url: `/${postId}/${commentId}/dislike`,
        method: "POST",
      }),
      invalidatesTags: (result, error, { postId }) => [
        { type: "Comment", id: postId },
      ],
    }),
  }),
});

export const {
  useGetCommentsQuery,
  useCreateCommentMutation,
  useUpdateCommentMutation,
  useDeleteCommentMutation,
  useLikeCommentMutation,
  useDislikeCommentMutation,
} = commentsApi;
