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
      async onQueryStarted({ postId, optimisticComment }, { dispatch, queryFulfilled }) {
        if (!optimisticComment) return;
        const patchResult = dispatch(
          commentsApi.util.updateQueryData("getComments", postId, (draft) => {
            if (draft?.data) {
              draft.data.comments = [optimisticComment, ...(draft.data.comments ?? [])];
              draft.data.totalComments = (draft.data.totalComments ?? 0) + 1;
            }
          })
        );
        try {
          const { data } = await queryFulfilled;
          const realComment = data?.data?.createdComment;
          if (realComment) {
            dispatch(
              commentsApi.util.updateQueryData("getComments", postId, (draft) => {
                if (draft?.data?.comments) {
                  const idx = draft.data.comments.findIndex(
                    (c) => c._id === optimisticComment._id
                  );
                  if (idx !== -1) draft.data.comments[idx] = realComment;
                }
              })
            );
          }
        } catch {
          patchResult.undo();
        }
      },
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
      async onQueryStarted({ postId, commentId }, { dispatch, queryFulfilled }) {
        const patchResult = dispatch(
          commentsApi.util.updateQueryData("getComments", postId, (draft) => {
            if (draft?.data?.comments) {
              draft.data.comments = draft.data.comments.filter(
                (c) => c._id !== commentId
              );
              draft.data.totalComments = Math.max(
                0,
                (draft.data.totalComments ?? 1) - 1
              );
            }
          })
        );
        try {
          await queryFulfilled;
        } catch {
          patchResult.undo();
        }
      },
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
