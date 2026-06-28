import mongoose, { Schema } from "mongoose";
import { ApiError } from "../utils/apiError.js";
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
        type: {
          type: String,
          enum: ["image", "video"],
        },
        url: {
          type: String,
        },
        publicId: {
          type: String,
        },
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
    tags: [
      {
        type: String,
        trim: true,
        lowercase: true,
      },
    ],
  },
  { timestamps: true },
);postSchema.pre("save", async function () {
  const hasText =
    (this.postTitle && this.postTitle.trim().length > 0) ||
    (this.postDescription && this.postDescription.trim().length > 0);

  const hasMedia = this.media && this.media.length > 0;

  if (!hasText && !hasMedia) {
    throw new ApiError(400, "Post cannot be empty");
  }
});

export const Post = mongoose.model("Post", postSchema);
