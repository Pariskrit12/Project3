import { configureStore } from "@reduxjs/toolkit";
import { usersApi } from "../services/userApi";
import { postsApi } from "../services/postApi";
import { commentsApi } from "../services/commentsApi";
import { communitiesApi } from "../services/communitiesApi";
import { notificationApi } from "../services/notificationApi";
import { chatApi } from "../services/chatApi";
import authReducer from "../slices/authSlice";
import notificationReducer from "../slices/notificationSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    notifications: notificationReducer,
    [usersApi.reducerPath]: usersApi.reducer,
    [postsApi.reducerPath]: postsApi.reducer,
    [commentsApi.reducerPath]: commentsApi.reducer,
    [communitiesApi.reducerPath]: communitiesApi.reducer,
    [notificationApi.reducerPath]: notificationApi.reducer,
    [chatApi.reducerPath]: chatApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware()
      .concat(usersApi.middleware)
      .concat(postsApi.middleware)
      .concat(commentsApi.middleware)
      .concat(communitiesApi.middleware)
      .concat(notificationApi.middleware)
      .concat(chatApi.middleware),
});
