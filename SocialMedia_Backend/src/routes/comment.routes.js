import { Router } from "express";
import { verifyJwt, isAdmin } from "../middlewares/auth.js";
import { upload } from "../middlewares/multer.js";
import {
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
} from "../controllers/comments.controller.js";

const router = Router();

// Admin report routes — must come before /:postId to avoid param conflicts
router.route("/admin/reports").get(verifyJwt, isAdmin, getReportedComments);
router.route("/admin/reports/:reportId/dismiss").patch(verifyJwt, isAdmin, dismissReport);
router.route("/admin/reports/:reportId/delete-comment").delete(verifyJwt, isAdmin, deleteReportedComment);

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
router.route("/:postId/:commentId/report").post(verifyJwt, reportComment);

export default router;
