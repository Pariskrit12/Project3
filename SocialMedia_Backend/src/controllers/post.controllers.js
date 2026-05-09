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
const likePost = asyncHandler(async (req, res) => {
  const userId = req.user?._id;
  const { id: postId } = req.params;
  if (!userId) {
    throw new ApiError(401, "Unauthorized access");
  }
  const post = await Post.findById(postId);
  if (!post) {
    throw new ApiError(404, "Post not found");
  }
  const alreadyDisliked = post.dislikes.some(
    (id) => id.toString() === userId.toString(),
  );
  const alreadyLiked = post.likes.some(
    (id) => id.toString() === userId.toString(),
  );
  let message = "";
  if (alreadyLiked) {
    post.likes = post.likes.filter((id) => id.toString() !== userId.toString());
    message = "Like removed";
  } else {
    post.likes.push(userId);
    if (alreadyDisliked) {
      post.dislikes = post.dislikes.filter(
        (id) => id.toString() !== userId.toString(),
      );
    }
    message = "Liked post successfully";
  }
  await post.save();

  return res.status(200).json(new ApiResponse(200, post, message));
});
const dislikePost = asyncHandler(async (req, res) => {
  const userId = req.user?._id;
  const { id: postId } = req.params;
  if (!userId) {
    throw new ApiError(401, "Unauthorized access");
  }

  const post = await Post.findById(postId);
  if (!post) {
    throw new ApiError(404, "Post not found");
  }

  const alreadyDisliked = post.dislikes.some(
    (id) => id.toString() === userId.toString(),
  );
  const alreadyLiked = post.likes.some(
    (id) => id.toString() === userId.toString(),
  );
  let message = "";
  if (alreadyDisliked) {
    post.dislikes = post.dislikes.filter(
      (id) => id.toString() !== userId.toString(),
    );
    message = "Disliked removed";
  } else {
    post.dislikes.push(userId);
    message = "Post disliked successfully";
    if (alreadyLiked) {
      post.likes = post.likes.filter(
        (id) => id.toString() !== userId.toString(),
      );
    }
  }

  await post.save();

  return res.status(200).json(new ApiResponse(200, post, message));
});
const updatePost = asyncHandler(async (req, res) => {
  const userId = req.user?._id;
  const { id: postId } = req.params;
  if (!userId) {
    throw new ApiError(401, "Unauthorized access");
  }

  const post = await Post.findById(postId);
  if (!post) {
    throw new ApiError(404, "Post not found");
  }
  if (post.creator.toString() !== userId.toString()) {
    throw new ApiError(403, "You cannot edit this post");
  }
  const { postTitle, postDescription } = req.body;

  const hasText =
    (postTitle && postTitle.trim().length > 0) ||
    (postDescription && postDescription.trim().length > 0);
  const hasNewMedia = req?.files?.length > 0;

  if (!hasText && !hasNewMedia) {
    throw new ApiError(400, "Post cannot be empty");
  }

  if (postTitle) {
    post.postTitle = postTitle.trim();
  }

  if (postDescription) {
    post.postDescription = postDescription.trim();
  }
  if (hasNewMedia) {
    if (post.media.length > 0) {
      //remove old media
      await Promise.all(
        post.media.map((item) =>
          cloudinary.uploader.destroy(item.publicId, {
            resource_type: item.type === "video" ? "video" : "image",
          }),
        ),
      );
    }
    const mediaArray = [];

    for (const file of req.files) {
      try {
        const uploadedImage = await uploadOnCloudinary(file.path);
        mediaArray.push({
          type: file.mimetype.startsWith("image") ? "image" : "video",
          url: uploadedImage.url,
          publicId: uploadedImage.public_id,
        });
      } catch (error) {
        throw new ApiError(500, "Failed to upload media in cloudinary");
      }
    }
    post.media = mediaArray;
  }
  await post.save();

  return res
    .status(200)
    .json(new ApiResponse(200, post, "Post updated successfully"));
});

export {
  createPost,
  getAllPost,
  getPostById,
  getPostOfLoggedInUser,
  getPostOfUserById,
  deletePost,
  likePost,
  dislikePost,
  updatePost,
  
};
