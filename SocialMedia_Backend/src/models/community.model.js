import mongoose, { Schema } from "mongoose";

const communitySchema = new Schema(
  {
    creator: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    communityName: {
      type: String,
      required: true,
      trim: true,
      unique: true,
    },
    communityDescription: {
      type: String,
      required: true,
      trim: true,
      maxlength: 500,
    },
    members: [
      {
        type: Schema.Types.ObjectId,
        ref: "User",
      },
    ],

    communityProfilePicture: {
      type: String,
      default: "",
    },
    communityProfilePicturePublicId: {
      type: String,
    },
    communityBanner: {
      type: String,
      default: "",
    },
    communityBannerPublicId: {
      type: String,
    },
    role: {
      type: String,
      enum: ["member", "moderator", "admin"],
      default: "member",
    },
  },
  { timestamps: true },
);

export const Community = mongoose.model("Community", communitySchema);
