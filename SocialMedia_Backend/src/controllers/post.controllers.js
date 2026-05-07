import { User } from "../models/user.models.js";
import { ApiError } from "../utils/apiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { Post } from "../models/post.model.js";
import { ApiResponse } from "../utils/apiResponse.js";
import { v2 as cloudinary } from "cloudinary";
const createPost = asyncHandler(async (req, res) => {
  const { communitieId } = req.params;
  const userId = req.user?._id;

  if (!userId) {
    throw new ApiError(401, "Unauthorized access");
  }

  const user = await User.findById(userId);
  if (!user) {
    throw new ApiError(404, "User not found");
  }

  const { postTitle, postDescription } = req.body;

  const hasText =
    (postTitle && postTitle.trim().length > 0) ||
    (postDescription && postDescription.trim().length > 0);

  const hasMedia = req?.files?.length > 0;

  if (!hasText && !hasMedia) {
    throw new ApiError(400, "Post cannot be empty");
  }

  const mediaArray = [];

  if (req?.files?.length > 0) {
    for (const file of req.files) {
      try {
        const uploadedImage = await uploadOnCloudinary(file.path);

        mediaArray.push({
          type: file.mimetype.startsWith("image") ? "image" : "video",
          url: uploadedImage.url,
          publicId: uploadedImage.public_id,
        });
      } catch (error) {
        throw new ApiError(500, "Failed to upload in cloudinary");
      }
    }
  }

  const post = await Post.create({
    postTitle,
    postDescription,
    media: mediaArray,
    creator: userId,
    community: communitieId || null,
  });

  return res
    .status(200)
    .json(
      new ApiResponse(200, { createdPost: post }, "Successfully Created Post"),
    );
});

const getAllPost = asyncHandler(async (req, res) => {
  const allPost = await Post.find().populate("creator").populate("community");
  if (allPost.length === 0) {
    throw new ApiError(404, "Failed to find any post");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, allPost, "Fetched all post successfully"));
});

const getPostById = asyncHandler(async (req, res) => {
  const { postId } = req.params;

  const post = await Post.findById(postId)
    .populate("creator")
    .populate("community")
    .populate("comments");
  if (!post) {
    throw new ApiError(404, "Post not found");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, post, "Post By id is fetched successfully"));
});

const getPostOfLoggedInUser = asyncHandler(async (req, res) => {
  const userId = req.user?._id;

  if (!userId) {
    throw new ApiError(401, "Unauthorized access");
  }

  const user = await User.findById(userId);
  if (!user) {
    throw new ApiError(404, "User not found");
  }

  const postsOfLoggedInUser = await Post.find({ creator: userId })
    .populate("communitie")
    .populate("creator");

  if (postsOfUser.length === 0) {
    throw new ApiError(404, "Post of users not found");
  }

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        postsOfLoggedInUser,
        "Posts of user successfully fetched",
      ),
    );
});

const getPostOfUserById = asyncHandler(async (req, res) => {
  const { userId } = req.params;
  const user = await User.findById(userId);
  if (!user) {
    throw new ApiError(404, "User not found");
  }

  const postOfUser = await Post.find({ creator: userId })
    .populate("communitie")
    .populate("creator");
  if (postOfUser.length === 0) {
    throw new ApiError(404, "User post not found");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, postOfUser, "Successfully fetched user post"));
});

const deletePost = asyncHandler(async (req, res) => {
  const { postId } = req.params;
  const userId = req.user?._id;

  if (!userId) {
    throw new ApiError(401, "Unauthorized access");
  }

  const loggedInUser = await User.findById(userId);
  if (!loggedInUser) {
    throw new ApiError(404, "User not found");
  }

  const post = await Post.findById(postId);
  if (!post) {
    throw new ApiError(404, "Post not found");
  }

  if (post.creator.toString() !== userId.toString()) {
    throw new ApiError(403, "You are not authorized to delete this post");
  }

  if (post.media.length > 0) {
    await Promise.all(
      post.media.map((item) =>
        cloudinary.uploader.destroy(item.publicId, {
          resource_type: item.type === "video" ? "video" : "image",
        }),
      ),
    );
  }

  await Post.findByIdAndDelete(postId);
  
  return res
    .status(200)
    .json(new ApiResponse(200, "Post deleted successfully"));
});
export { createPost };
