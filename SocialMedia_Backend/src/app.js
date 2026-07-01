import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
const app = express();
app.use(
  cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true,
  }),
);
app.use(express.static("public"));
app.use(cookieParser());
app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true, limit: "16kb" }));

import userRouter from "./routes/user.routes.js";
app.use("/users", userRouter);

import postRouter from "./routes/post.routes.js";
app.use("/post", postRouter);

import commentRouter from "./routes/comment.routes.js"
app.use("/comment",commentRouter)

import communityRouter from './routes/community.route.js';
app.use("/community",communityRouter);

import notificationRouter from "./routes/notification.routes.js";
app.use("/notification", notificationRouter);

import chatRouter from "./routes/chat.routes.js";
app.use("/chat", chatRouter);

import { ApiError } from "./utils/apiError.js";
app.use((err, req, res, next) => {
  const statusCode = err instanceof ApiError ? err.statusCode : 500;
  const message = err instanceof ApiError ? err.message : "Internal server error";
  res.status(statusCode).json({ success: false, message, errors: err.errors ?? [] });
});

export default app;
