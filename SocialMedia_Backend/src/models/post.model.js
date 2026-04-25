import mongoose, { Schema } from "mongoose";

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
    images: [
      {
        url: String,
        publicId: String,
      },
    ],
    videos: [
      {
        url: String,
        publicId: String,
      },
    ],
    community: {
      type: Schema.Types.ObjectId,
      ref: "Community",
      default: null,
    },
  },
  { timestamps: true },
);
//check if post is empty
postSchema.pre("save", function (next) {
  const hasText =
    (this.postTitle && this.postTitle.trim().length > 0) ||
    (this.postDescription && this.postDescription.trim().length > 0);

  const hasMedia =
    (this.images && this.images.length > 0) ||
    (this.videos && this.videos.length > 0);

  if (!hasText && !hasMedia) {
    return next(new Error("Post cannot be empty"));
  }
  next();
});

export const Post = mongoose.model("Post", postSchema);
