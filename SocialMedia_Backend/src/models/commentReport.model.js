import mongoose from "mongoose";

const commentReportSchema = new mongoose.Schema(
  {
    reporter: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    comment: { type: mongoose.Schema.Types.ObjectId, ref: "Comment", required: true },
    post: { type: mongoose.Schema.Types.ObjectId, ref: "Post", required: true },
    reason: { type: String, required: true, trim: true, maxlength: 500 },
    status: { type: String, enum: ["pending", "dismissed"], default: "pending" },
  },
  { timestamps: true }
);

commentReportSchema.index({ reporter: 1, comment: 1 }, { unique: true });

export const CommentReport = mongoose.model("CommentReport", commentReportSchema);
