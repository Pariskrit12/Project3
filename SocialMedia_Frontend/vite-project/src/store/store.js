import { configureStore } from "@reduxjs/toolkit";
import { usersApi } from "../services/usersApi";
import { postsApi } from "../services/postsApi";
import { commentsApi } from "../services/commentsApi";
import { communitiesApi } from "../services/communitiesApi";
import authReducer from "../slices/authSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    [usersApi.reducerPath]: usersApi.reducer,
    [postsApi.reducerPath]: postsApi.reducer,
    [commentsApi.reducerPath]: commentsApi.reducer,
    [communitiesApi.reducerPath]: communitiesApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware()
      .concat(usersApi.middleware)
      .concat(postsApi.middleware)
      .concat(commentsApi.middleware)
      .concat(communitiesApi.middleware),
});