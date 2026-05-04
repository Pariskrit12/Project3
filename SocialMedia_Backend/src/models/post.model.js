import mongoose, { Schema } from "mongoose";
import { ApiError } from "../utils/apiError";
const postSchema = new Schema(
  {
    creator: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    postTitle: {
      type: String,
      trim: true,
    },
    postDescription: {
      type: String,
      trim: true,
    },
    media: [
      {
        type: "image" | "video",
        url: String,
        publicId: String,
      },
    ],
    community: {
      type: Schema.Types.ObjectId,
      ref: "Community",
      default: null,
    },

    likes: [
      {
        type: Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    dislikes: [
      {
        type: Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    comments: [
      {
        type: Schema.Types.ObjectId,
        ref: "Comment",
      },
    ],
  },
  { timestamps: true },
);
//check if post is empty
postSchema.pre(["save", "findOneAndUpdate"], function (next) {
  const hasText =
    (this.postTitle && this.postTitle.trim().length > 0) ||
    (this.postDescription && this.postDescription.trim().length > 0);

  const hasMedia =
    (this.images && this.images.length > 0) ||
    (this.videos && this.videos.length > 0);

  if (!hasText && !hasMedia) {
    return next(new ApiError(400, "Post cannot be empty"));
  }
  next();
});

export const Post = mongoose.model("Post", postSchema);
