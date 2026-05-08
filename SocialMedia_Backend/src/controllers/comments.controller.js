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

const 

export {createComment}
