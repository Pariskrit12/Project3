import mongoose, { Schema } from "mongoose";

const notificationSchema = new mongoose.Schema(
  {
    receiver: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    sender: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    type: {
      type: String,
      enum: ["like_comment", "like_post", "comment", "follow", "message", "post", "join_community"],
    },
    message: String,
    isRead: {
      type: Boolean,
      default: false,
    },
    link: String,
  },
  { timestamps: true },
);

export const Notification = mongoose.model("Notification", notificationSchema);
