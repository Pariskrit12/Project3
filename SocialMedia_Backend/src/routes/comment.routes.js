import { Router } from "express";
import { verifyJwt } from "../middlewares/auth.js";
import { upload } from "../middlewares/multer.js";
import {
  createComment,
  updateComment,
  likeComment,
  dislikeComment,
  deleteComment,
  getCommentOfPost,
} from "../controllers/comments.controller.js";

const router = Router();

router
  .route("/:postId")
  .get(verifyJwt, getCommentOfPost)
  .post(verifyJwt, upload.single("image"), createComment);

router
  .route("/:postId/:commentId")
  .patch(verifyJwt, upload.single("image"), updateComment)
  .delete(verifyJwt, deleteComment);

router.route("/:postId/:commentId/like").post(verifyJwt, likeComment);
router.route("/:postId/:commentId/dislike").post(verifyJwt, dislikeComment);

export default router;