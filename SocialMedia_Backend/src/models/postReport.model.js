import mongoose from "mongoose";

const postReportSchema = new mongoose.Schema(
  {
    reporter: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    post: { type: mongoose.Schema.Types.ObjectId, ref: "Post", required: true },
    reason: { type: String, required: true, trim: true, maxlength: 500 },
    status: { type: String, enum: ["pending", "dismissed"], default: "pending" },
  },
  { timestamps: true }
);

postReportSchema.index({ reporter: 1, post: 1 }, { unique: true });

export const PostReport = mongoose.model("PostReport", postReportSchema);