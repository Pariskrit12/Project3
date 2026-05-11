import { ApiError } from "../utils/apiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { ApiResponse } from "../utils/apiResponse.js";
import { v2 as cloudinary } from "cloudinary";
const createCommunity = asyncHandler(async (req, res) => {
  const userId = req.user?._id;

  if (!userId) {
    throw new ApiError(401, "Unauthorized access");
  }
  const { communityName, communityDescription } = req.body;

  if (!communityName || !communityDescription) {
    throw new ApiError(400, "Complete all the fields");
  }
  const profilePath = req.files?.profilePicture?.[0]?.path;
  const bannerPath = req.files?.banner?.[0]?.path;
  if (!profilePath || !bannerPath) {
    throw new ApiError(400, "Images are required");
  }
  const uploadProfile = await uploadOnCloudinary(profilePath);
  const uploadBanner = await uploadOnCloudinary(bannerPath);
  if (!uploadProfile || !uploadBanner) {
    throw new ApiError(500, "Failed to upload images to Cloudinary");
  }
  const community = await Community.create({
    communityName: communityName.trim(),
    communityDescription: communityDescription.trim(),
    communityProfilePicture: uploadProfile.url,
    communityProfilePicturePublicId: uploadProfile.public_id,
    communityBanner: uploadBanner.url,
    communityBannerPublicId: uploadBanner.public_id,
    creator: userId,
    role: "admin",
  });

  return res
    .status(201)
    .json(new ApiResponse(201, community, "Community created successfully"));
});