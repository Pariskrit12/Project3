import { ApiError } from "../utils/apiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { ApiResponse } from "../utils/apiResponse.js";
import { v2 as cloudinary } from "cloudinary";
import { Community } from "../models/community.model.js";
import { Post } from "../models/post.model.js";
import { User } from "../models/user.models.js";

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
const toggleJoinCommunity = asyncHandler(async (req, res) => {
  const userId = req.user?._id;
  const { communityId } = req.params;
  if (!userId) {
    throw new ApiError(401, "Unauthorized access");
  }

  const community = await Community.findById(communityId);
  if (!community) {
    throw new ApiError(404, "Community not found");
  }

  const alreadyJoined = community.members.some(
    (id) => id.toString() === userId.toString(),
  );

  if (alreadyJoined) {
    community.members = community.members.filter(
      (id) => id.toString() !== userId.toString(),
    );
  } else {
    community.members.push(userId);
  }
  await community.save();

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        community,
        alreadyJoined
          ? "Left community successfully"
          : "Joined community successfully",
      ),
    );
})
const getPostOfCommunity = asyncHandler(async (req, res) => {
  const { communityId } = req.params;
  const community = await Community.findById(communityId);
  if (!community) {
    throw new ApiError(404, "Community not found");
  }
  const postOfCommunity = await Post.find({ community: communityId }).populate(
    "creator",
    "username userProfilePic",
  );
  if (!postOfCommunity.length) {
    throw new ApiError(404, "No posts found for this community");
  }
  return res
    .status(200)
    .json(new ApiResponse(200, postOfCommunity, "Posts fetched successfully"));
});
const getFollowersOfCommunity = asyncHandler(async (req, res) => {
  const { communityId } = req.params;

  const community = await Community.findById(communityId).populate(
    "members",
    "username userProfilePic",
  );
  if (!community) {
    throw new ApiError(404, "Community not found");
  }
  return res
    .status(200)
    .json(
      new ApiResponse(200, community.members, "Fetched follower of community"),
    );
});
const deleteCommunity = asyncHandler(async (req, res) => {
  const userId = req.user?._id;
  const { communityId } = req.params;

  if (!userId) {
    throw new ApiError(401, "Unauthorized access");
  }

  const community = await Community.findById(communityId);
  if (!community) {
    throw new ApiError(404, "Community not found");
  }

  if (community.creator.toString() !== userId.toString()) {
    throw new ApiError(403, "Only the community admin can delete this community");
  }

  if (community.communityProfilePicturePublicId) {
    await cloudinary.uploader.destroy(community.communityProfilePicturePublicId);
  }
  if (community.communityBannerPublicId) {
    await cloudinary.uploader.destroy(community.communityBannerPublicId);
  }

  await community.deleteOne();

  return res
    .status(200)
    .json(new ApiResponse(200, null, "Community deleted successfully"));
});
const getCommunitiesOfLoggedInUser = asyncHandler(async (req, res) => {
  const userId = req.user?._id;

  if (!userId) {
    throw new ApiError(401, "Unauthorized access");
  }

  const communities = await Community.find({ members: userId });

  return res
    .status(200)
    .json(new ApiResponse(200, communities, "Communities fetched successfully"));
});
const getCommunityById = asyncHandler(async (req, res) => {
  const { communityId } = req.params;

  const community = await Community.findById(communityId).populate(
    "creator",
    "username userProfilePic",
  );
  if (!community) {
    throw new ApiError(404, "Community not found");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, community, "Community fetched successfully"));
});
export{createCommunity,toggleJoinCommunity,getPostOfCommunity,getFollowersOfCommunity,deleteCommunity,getCommunitiesOfLoggedInUser}
