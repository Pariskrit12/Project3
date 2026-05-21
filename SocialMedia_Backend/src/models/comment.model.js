import mongoose, { Schema } from "mongoose";

const commentSchema = new Schema({
  creator: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  likes: [
    {
      type: Schema.Types.ObjectId,
      ref: "User",
      default: [],
    },
  ],
  dislikes: [
    {
      type: Schema.Types.ObjectId,
      ref: "User",
      default: [],
    },
  ],

  image: {
    type: String,
    default: "",
  },
  imagePublicId: {
    type: String,
  },
  description: {
    type: String,
    required: true,
    trim: true,
  },
  post: {
    type: Schema.Types.ObjectId,
    ref: "Post",
    required: true,
  },
}, { timestamps: true });
export const Comment = mongoose.model("Comment", commentSchema);
