import { User } from "../models/user.models.js";
import { ApiError } from "../utils/apiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { Post } from "../models/post.model.js";
import { Community } from "../models/community.model.js";
import { ApiResponse } from "../utils/apiResponse.js";
import { v2 as cloudinary } from "cloudinary";
import { sendNotification } from "../utils/sendNotification.js";

async function activeCreatorIds() {
  const deactivated = await User.find({ accountStatus: "deactivated" }).select("_id").lean();
  return deactivated.map((u) => u._id);
}

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

  const { postTitle, postDescription, tags } = req.body;

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

  const rawTags = tags
    ? Array.isArray(tags)
      ? tags
      : JSON.parse(tags)
    : [];

  const post = await Post.create({
    postTitle,
    postDescription,
    media: mediaArray,
    creator: userId,
    community: communitieId || null,
    tags: rawTags,
  });

  return res
    .status(200)
    .json(
      new ApiResponse(200, { createdPost: post }, "Successfully Created Post"),
    );
});
const getAllPost = asyncHandler(async (req, res) => {
  const deactivatedIds = await activeCreatorIds();
  const allPost = await Post.find({ creator: { $nin: deactivatedIds } }).populate("creator").populate("community");
  if (allPost.length === 0) {
    throw new ApiError(404, "Failed to find any post");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, allPost, "Fetched all post successfully"));
});
const getPostById = asyncHandler(async (req, res) => {
  const { postId } = req.params;
  const userId = req.user?._id;

  const post = await Post.findById(postId)
    .populate("creator")
    .populate("community")
    .populate("comments");
  if (!post) {
    throw new ApiError(404, "Post not found");
  }
  if (post.creator?.accountStatus === "deactivated") {
    throw new ApiError(404, "Post not found");
  }

  if (userId) {
    await User.findByIdAndUpdate(userId, {
      $pull: { recentlyVisited: postId },
    });
    await User.findByIdAndUpdate(userId, {
      $push: { recentlyVisited: { $each: [postId], $position: 0, $slice: 10 } },
    });
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
    .populate("community")
    .populate("creator");

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
  if (!user || user.accountStatus === "deactivated") {
    throw new ApiError(404, "User not found");
  }

  const postOfUser = await Post.find({ creator: userId })
    .populate("community")
    .populate("creator");

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
    if (post.creator.toString() !== userId.toString()) {
      await sendNotification({
        sender: userId,
        receiver: post.creator,
        type: "like_post",
        message: `${req.user.username} liked your post`,
        link: `/postPage/${post._id}`,
      });
    }
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
const searchPosts = asyncHandler(async (req, res) => {
  const { q } = req.query;

  if (!q || q.trim().length === 0) {
    throw new ApiError(400, "Search query is required");
  }
  const escaped = q.trim().replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const regex = new RegExp(escaped, "i");
  const deactivatedIds = await activeCreatorIds();

  const posts = await Post.find({
    creator: { $nin: deactivatedIds },
    $or: [{ postTitle: regex }, { postDescription: regex }],
  })
    .populate("creator", "username userProfilePic")
    .populate("community", "communityName");

  return res
    .status(200)
    .json(new ApiResponse(200, posts, "Posts fetched successfully"));
});

const getRecentlyVisitedPosts = asyncHandler(async (req, res) => {
  const userId = req.user?._id;
  if (!userId) {
    throw new ApiError(401, "Unauthorized access");
  }

  const user = await User.findById(userId).populate({
    path: "recentlyVisited",
    populate: [
      { path: "creator", select: "username userProfilePic" },
      { path: "community", select: "communityName communityProfilePicture" },
    ],
  });

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        user.recentlyVisited,
        "Recently visited posts fetched successfully",
      ),
    );
});

const getNewPosts = asyncHandler(async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const skip = (page - 1) * limit;

  const deactivatedIds = await activeCreatorIds();
  const activeFilter = { creator: { $nin: deactivatedIds } };
  const [posts, total] = await Promise.all([
    Post.find(activeFilter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .populate("creator", "username userProfilePic")
      .populate("community", "communityName communityProfilePicture"),
    Post.countDocuments(activeFilter),
  ]);

  return res.status(200).json(
    new ApiResponse(
      200,
      {
        posts,
        total,
        currentPage: page,
        totalPages: Math.ceil(total / limit),
      },
      "New posts fetched successfully",
    ),
  );
});

const getTopPosts = asyncHandler(async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const skip = (page - 1) * limit;

  const deactivatedIds = await activeCreatorIds();
  const [posts, total] = await Promise.all([
    Post.aggregate([
      { $match: { creator: { $nin: deactivatedIds } } },
      {
        $addFields: {
          likesCount: { $size: "$likes" },
          score: { $subtract: [{ $size: "$likes" }, { $size: "$dislikes" }] },
        },
      },
      { $sort: { likesCount: -1, score: -1, createdAt: -1 } },
      { $skip: skip },
      { $limit: limit },
      {
        $lookup: {
          from: "users",
          localField: "creator",
          foreignField: "_id",
          pipeline: [{ $project: { username: 1, userProfilePic: 1 } }],
          as: "creator",
        },
      },
      { $unwind: { path: "$creator", preserveNullAndEmptyArrays: true } },
      {
        $lookup: {
          from: "communities",
          localField: "community",
          foreignField: "_id",
          pipeline: [
            { $project: { communityName: 1, communityProfilePicture: 1 } },
          ],
          as: "community",
        },
      },
      { $unwind: { path: "$community", preserveNullAndEmptyArrays: true } },
    ]),
    Post.countDocuments({ creator: { $nin: deactivatedIds } }),
  ]);

  return res.status(200).json(
    new ApiResponse(
      200,
      {
        posts,
        total,
        currentPage: page,
        totalPages: Math.ceil(total / limit),
      },
      "Top posts fetched successfully",
    ),
  );
});

const searchAll = asyncHandler(async (req, res) => {
  const { q } = req.query;

  if (!q || q.trim().length === 0) {
    throw new ApiError(400, "Search query is required");
  }

  const escaped = q.trim().replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const regex = new RegExp(escaped, "i");
  const deactivatedIds = await activeCreatorIds();

  const [posts, communities] = await Promise.all([
    Post.find({
      creator: { $nin: deactivatedIds },
      $or: [{ postTitle: regex }, { postDescription: regex }],
    })
      .populate("creator", "username userProfilePic")
      .populate("community", "communityName communityProfilePicture")
      .sort({ createdAt: -1 })
      .limit(20),

    Community.find({
      $or: [{ communityName: regex }, { communityDescription: regex }],
    })
      .populate("creator", "username userProfilePic")
      .sort({ createdAt: -1 })
      .limit(20),
  ]);

  return res
    .status(200)
    .json(new ApiResponse(200, { posts, communities }, "Search results fetched successfully"));
});

const getTrendingPosts = asyncHandler(async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const skip = (page - 1) * limit;


  const cutoff = new Date(Date.now() - 48 * 60 * 60 * 1000);
  const deactivatedIds = await activeCreatorIds();

  const [posts, total] = await Promise.all([
    Post.aggregate([
      { $match: { createdAt: { $gte: cutoff }, creator: { $nin: deactivatedIds } } },
      {
        $addFields: {
          // likes + (comments × 2) 
          engagementScore: {
            $add: [{ $size: "$likes" }, { $multiply: [{ $size: "$comments" }, 2] }],
          },
        },
      },
      { $sort: { engagementScore: -1, createdAt: -1 } },
      { $skip: skip },
      { $limit: limit },
      {
        $lookup: {
          from: "users",
          localField: "creator",
          foreignField: "_id",
          pipeline: [{ $project: { username: 1, userProfilePic: 1 } }],
          as: "creator",
        },
      },
      { $unwind: { path: "$creator", preserveNullAndEmptyArrays: true } },
      {
        $lookup: {
          from: "communities",
          localField: "community",
          foreignField: "_id",
          pipeline: [{ $project: { communityName: 1, communityProfilePicture: 1 } }],
          as: "community",
        },
      },
      { $unwind: { path: "$community", preserveNullAndEmptyArrays: true } },
    ]),
    Post.countDocuments({ createdAt: { $gte: cutoff }, creator: { $nin: deactivatedIds } }),
  ]);

  return res.status(200).json(
    new ApiResponse(
      200,
      { posts, total, currentPage: page, totalPages: Math.ceil(total / limit) },
      "Trending posts fetched successfully",
    ),
  );
});

const getFeedPosts = asyncHandler(async (req, res) => {
  const userId = req.user?._id;
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const skip = (page - 1) * limit;

  const deactivatedIds = await activeCreatorIds();
  const [user, allPosts] = await Promise.all([
    User.findById(userId).select("interests"),
    Post.find({ creator: { $nin: deactivatedIds } })
      .populate("creator", "username userProfilePic")
      .populate("community", "communityName communityProfilePicture")
      .sort({ createdAt: -1 }),
  ]);

  const interests = (user?.interests ?? []).map((i) => i.toLowerCase());

  let sorted;
  if (interests.length === 0) {
    sorted = allPosts;
  } else {
    sorted = [...allPosts].sort((a, b) => {
      const scoreA = (a.tags ?? []).filter((t) =>
        interests.includes(t.toLowerCase()),
      ).length;
      const scoreB = (b.tags ?? []).filter((t) =>
        interests.includes(t.toLowerCase()),
      ).length;
      return scoreB - scoreA;
    });
  }

  const total = sorted.length;
  const posts = sorted.slice(skip, skip + limit);

  return res.status(200).json(
    new ApiResponse(
      200,
      { posts, total, currentPage: page, totalPages: Math.ceil(total / limit) },
      "Feed fetched successfully",
    ),
  );
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
  searchPosts,
  searchAll,
  getRecentlyVisitedPosts,
  getNewPosts,
  getTopPosts,
  getTrendingPosts,
  getFeedPosts,
};
