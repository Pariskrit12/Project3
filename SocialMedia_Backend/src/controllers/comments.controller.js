import { Comment } from "../models/comment.model.js";
import { CommentReport } from "../models/commentReport.model.js";
import { sendNotification } from "../utils/sendNotification.js";
import { Post } from "../models/post.model.js";
import { User } from "../models/user.models.js";

import { ApiError } from "../utils/apiError.js";
import { ApiResponse } from "../utils/apiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { v2 as cloudinary } from "cloudinary";
import mongoose from "mongoose";
import { moderateText } from "../moderation/textModeration.js";
import { moderateImage } from "../moderation/imageModeration.js";

const createComment = asyncHandler(async (req, res) => {
  const userId = req.user?._id;
  const { postId } = req.params;
  if (!userId) {
    throw new ApiError(401, "Unauthorized access");
  }
  if (!postId || !mongoose.Types.ObjectId.isValid(postId)) {
    throw new ApiError(400, "Invalid or missing post ID");
  }
  const { description } = req.body;

  const hasText = description && description.length > 0;
  const hasMedia = !!req.file;
  if (!hasText && !hasMedia) {
    throw new ApiError(400, "Comment Cannot be empty");
  }

  // --- Content moderation (fail-open: errors are logged, not blocking) ---
  if (description && description.trim()) {
    const { flagged, reason } = await moderateText(description.trim());
    if (flagged) throw new ApiError(400, `Comment text was flagged for: ${reason}`);
  }
  if (req.file) {
    const { flagged } = await moderateImage(req.file.path, req.file.mimetype);
    if (flagged) throw new ApiError(400, "Image was flagged as inappropriate");
  }
  // --- End content moderation ---

  let imageUrl = "";
  let imagePublicId = "";
  if (req.file) {
    try {
      const uploadedImage = await uploadOnCloudinary(req.file?.path);
      imageUrl = uploadedImage.url;
      imagePublicId = uploadedImage.public_id;
    } catch (error) {
      throw new ApiError(
        500,
        "Something went wrong while uploading on cloudinary",
        error,
      );
    }
  }

  const comment = await Comment.create({
    description: description.trim() || "",
    image: imageUrl,
    imagePublicId,
    creator: userId,
    post: postId,
  }).catch(async (err) => {
    if (imagePublicId) await cloudinary.uploader.destroy(imagePublicId);
    throw new ApiError(500, "Failed to save comment", err);
  });

  await comment.populate("creator", "username userProfilePic");

  const post = await Post.findByIdAndUpdate(
    postId,
    { $push: { comments: comment._id } },
    { new: false, select: "creator" }
  );
  if (post && post.creator.toString() !== userId.toString()) {
    await sendNotification({
      sender: userId,
      receiver: post.creator,
      type: "comment",
      message: `${req.user.username} commented on your post`,
      link: `/postPage/${postId}`,
    });
  }

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        { createdComment: comment },
        "Comment Created successfully",
      ),
    );
});

const updateComment = asyncHandler(async (req, res) => {
  const userId = req.user?._id;
  const { commentId } = req.params;

  if (!userId) {
    throw new ApiError(401, "Unauthorized access");
  }

  const comment = await Comment.findById(commentId);
  if (!comment) {
    throw new ApiError(404, "Comment not found");
  }

  if (comment.creator.toString() !== userId.toString()) {
    throw new ApiError(403, "You cannot update this comment");
  }
  const { description } = req.body;

  const hasText = description && description.trim().length > 0;
  const hasMedia = !!req.file;

  if (!hasText && !hasMedia) {
    throw new ApiError(400, "Comment cannot be empty");
  }
  let imageUrl = comment.image;
  let imagePublicId = comment.imagePublicId;
  if (req.file) {
    if (comment.imagePublicId) {
      try {
        await cloudinary.uploader.destroy(imagePublicId);
      } catch (error) {
        throw new ApiError(
          500,
          "Failed to delete old image from cloudinary",
          error,
        );
      }
    }

    try {
      const uploadedImage = await uploadOnCloudinary(req.file?.path);
      imageUrl = uploadedImage.url;
      imagePublicId = uploadedImage.public_id;
    } catch (error) {
      throw new ApiError(
        500,
        "Failed to upload new image in cloudinary",
        error,
      );
    }
  }
  comment.description = hasText ? description.trim() : comment.description;
  comment.image = imageUrl;
  comment.imagePublicId = imagePublicId;
  const updatedComment = await comment.save().catch(async (err) => {
    if (req.file && imagePublicId) {
      await cloudinary.uploader.destroy(imagePublicId);
    }
    throw new ApiError(500, "Failed to update comment", err);
  });
  return res
    .status(200)
    .json(new ApiResponse(200, { updatedComment }, "Successfully updated comments"));
});

const likeComment = asyncHandler(async (req, res) => {
  const userId = req.user?._id;
  const { commentId } = req.params;
  if (!userId) {
    throw new ApiError(401, "Unauthorized access");
  }

  const comment = await Comment.findById(commentId);
  if (!comment) {
    throw new ApiError(404, "comment not found");
  }

  const alreadyLiked = comment.likes.some(
    (id) => id.toString() === userId.toString(),
  );
  const alreadyDisliked = comment.dislikes.some(
    (id) => id.toString() === userId.toString(),
  );
  let message = "";
  if (alreadyLiked) {
    comment.likes = comment.likes.filter(
      (id) => id.toString() !== userId.toString(),
    );
    message = "Like removed from comment";
  } else {
    comment.likes.push(userId);
    message = "Successfully liked the comment";
    if (alreadyDisliked) {
      comment.dislikes = comment.dislikes.filter(
        (id) => id.toString() !== userId.toString(),
      );
    }
  }

  await comment.save();

  if (!alreadyLiked && comment.creator.toString() !== userId.toString()) {
    await sendNotification({
      sender: userId,
      receiver: comment.creator,
      type: "like_comment",
      message: `${req.user.username} liked your comment`,
      link: `/postPage/${comment.post}`,
    });
  }

  return res.status(200).json(new ApiResponse(200, comment, message));
});

const dislikeComment = asyncHandler(async (req, res) => {
  const userId = req.user?._id;
  const { commentId } = req.params;
  if (!userId) {
    throw new ApiError(401, "Unauthorized access");
  }

  const comment = await Comment.findById(commentId);
  if (!comment) {
    throw new ApiError(404, "comment not found");
  }

  const alreadyLiked = comment.likes.some(
    (id) => id.toString() === userId.toString(),
  );
  const alreadyDisliked = comment.dislikes.some(
    (id) => id.toString() === userId.toString(),
  );
  let message = "";
  if (alreadyDisliked) {
    comment.dislikes = comment.dislikes.filter(
      (id) => id.toString() !== userId.toString(),
    );
    message = "Dislike removed from comment";
  } else {
    comment.dislikes.push(userId);
    message = "Successfully disliked the comment";
    if (alreadyLiked) {
      comment.likes = comment.likes.filter(
        (id) => id.toString() !== userId.toString(),
      );
    }
  }

  await comment.save();

  return res.status(200).json(new ApiResponse(200, comment, message));
});

const deleteComment = asyncHandler(async (req, res) => {
  const userId = req.user?._id;
  const { commentId } = req.params;
  if (!userId) {
    throw new ApiError(401, "Unauthorized access");
  }

  const comment = await Comment.findById(commentId);
  if (!comment) {
    throw new ApiError(404, "Comment not found");
  }

  const post = await Post.findById(comment.post).select("creator");
  const isCommentOwner = comment.creator.toString() === userId.toString();
  const isPostOwner = post && post.creator.toString() === userId.toString();

  if (!isCommentOwner && !isPostOwner) {
    throw new ApiError(403, "You cannot delete this comment");
  }

  if (comment.imagePublicId) {
    try {
      await cloudinary.uploader.destroy(comment.imagePublicId);
    } catch (error) {
      throw new ApiError(
        500,
        "Failed to delete old image from cloudinary",
        error,
      );
    }
  }
  await Promise.all([
    comment.deleteOne(),
    Post.findByIdAndUpdate(comment.post, { $pull: { comments: comment._id } }),
  ]);

  return res
    .status(200)
    .json(new ApiResponse(200, {}, "Comment deleted successfully"));
});

const getCommentOfPost = asyncHandler(async (req, res) => {
  const { postId } = req.params;
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;

  const skip = (page - 1) * limit;
  const deactivated = await User.find({ accountStatus: "deactivated" }).select("_id").lean();
  const deactivatedIds = deactivated.map((u) => u._id);
  const commentFilter = { post: postId, creator: { $nin: deactivatedIds } };

  const comments = await Comment.find(commentFilter)
    .populate("creator", "username userProfilePic")
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit);

  const totalComments = await Comment.countDocuments(commentFilter);
  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        {
          comments,
          totalComments,
          currentPage: page,
          totalPages: Math.ceil(totalComments / limit),
        },
        "Comment of post fetched successfully",
      ),
    );
});
const reportComment = asyncHandler(async (req, res) => {
  const userId = req.user?._id;
  const { commentId, postId } = req.params;
  const { reason } = req.body;

  if (!reason || !reason.trim()) {
    throw new ApiError(400, "Reason is required for reporting a comment");
  }

  const comment = await Comment.findById(commentId);
  if (!comment) throw new ApiError(404, "Comment not found");

  if (comment.creator.toString() === userId.toString()) {
    throw new ApiError(403, "You cannot report your own comment");
  }

  const existing = await CommentReport.findOne({ reporter: userId, comment: commentId });
  if (existing) throw new ApiError(409, "You have already reported this comment");

  await CommentReport.create({
    reporter: userId,
    comment: commentId,
    post: comment.post,
    reason: reason.trim(),
  });

  return res.status(201).json(new ApiResponse(201, {}, "Comment reported successfully"));
});

const getReportedComments = asyncHandler(async (req, res) => {
  const reports = await CommentReport.find()
    .populate("reporter", "username userProfilePic")
    .populate({ path: "comment", populate: { path: "creator", select: "username userProfilePic" } })
    .populate("post", "postTitle")
    .sort({ createdAt: -1 })
    .lean();

  return res.status(200).json(new ApiResponse(200, { reports }, "Reported comments fetched"));
});

const dismissReport = asyncHandler(async (req, res) => {
  const { reportId } = req.params;
  const report = await CommentReport.findByIdAndUpdate(reportId, { status: "dismissed" }, { new: true });
  if (!report) throw new ApiError(404, "Report not found");
  return res.status(200).json(new ApiResponse(200, {}, "Report dismissed"));
});

const deleteReportedComment = asyncHandler(async (req, res) => {
  const { reportId } = req.params;
  const report = await CommentReport.findById(reportId);
  if (!report) throw new ApiError(404, "Report not found");

  const comment = await Comment.findById(report.comment);
  if (comment) {
    if (comment.imagePublicId) {
      try { await cloudinary.uploader.destroy(comment.imagePublicId); } catch (_) {}
    }
    await Promise.all([
      comment.deleteOne(),
      Post.findByIdAndUpdate(comment.post, { $pull: { comments: comment._id } }),
      CommentReport.deleteMany({ comment: comment._id }),
    ]);
  } else {
    await report.deleteOne();
  }

  return res.status(200).json(new ApiResponse(200, {}, "Comment deleted and reports cleared"));
});

export {
  createComment,
  updateComment,
  likeComment,
  dislikeComment,
  deleteComment,
  getCommentOfPost,
  reportComment,
  getReportedComments,
  dismissReport,
  deleteReportedComment,
};
