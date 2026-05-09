import { Comment } from "../models/comment.model";
import { ApiError } from "../utils/apiError";
import { ApiResponse } from "../utils/apiResponse";
import { asyncHandler } from "../utils/asyncHandler";
import { uploadOnCloudinary } from "../utils/cloudinary";
import { v2 as cloudinary } from "cloudinary";

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
    if (imagePublicId) {
      await cloudinary.uploader.destroy(imagePublicId);
      throw new ApiError(500, "Failed to save comment", err);
    }
  });

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
      await deleteFromCloudinary(imagePublicId);
    }
    throw new ApiError(500, "Failed to update comment", err);
  });
  return res
    .status(200)
    .json(new ApiResponse(200, updateComment, "Successfully updated comments"));
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

  if (comment.creator.toString() !== userId.toString()) {
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
  await comment.deleteOne();

  return res
    .status(200)
    .json(new ApiResponse(200, "Comment delete successfully"));
});

export { createComment, updateComment, likeComment, dislikeComment,deleteComment };
