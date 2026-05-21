import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const chatApi = createApi({
  reducerPath: "chatApi",
  baseQuery: fetchBaseQuery({ baseUrl: "/chat", credentials: "include" }),
  tagTypes: ["Conversation", "Message"],
  endpoints: (builder) => ({
    getConversations: builder.query({
      query: () => "/conversations",
      providesTags: ["Conversation"],
    }),
    getOrCreateConversation: builder.mutation({
      query: (userId) => ({ url: `/conversation/${userId}`, method: "POST" }),
      invalidatesTags: ["Conversation"],
    }),
    getMessages: builder.query({
      query: (conversationId) => `/messages/${conversationId}`,
      providesTags: (result, error, conversationId) => [
        { type: "Message", id: conversationId },
      ],
    }),
    sendMessage: builder.mutation({
      query: ({ conversationId, text }) => ({
        url: `/messages/${conversationId}`,
        method: "POST",
        body: { text },
      }),
      async onQueryStarted({ conversationId }, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          dispatch(
            chatApi.util.updateQueryData("getMessages", conversationId, (draft) => {
              draft.data.push(data.data);
            })
          );
          dispatch(chatApi.util.invalidateTags(["Conversation"]));
        } catch {}
      },
    }),
    markConversationRead: builder.mutation({
      query: (conversationId) => ({
        url: `/messages/${conversationId}/read`,
        method: "PUT",
      }),
      invalidatesTags: ["Conversation"],
    }),
  }),
});

export const {
  useGetConversationsQuery,
  useGetOrCreateConversationMutation,
  useGetMessagesQuery,
  useSendMessageMutation,
  useMarkConversationReadMutation,
} = chatApi;
