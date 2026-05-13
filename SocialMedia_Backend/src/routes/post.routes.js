import { Router } from "express";

import { verifyJwt } from "../middlewares/auth.js";
import { upload } from "../middlewares/multer.js";
import {
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
} from "../controllers/post.controllers.js";
const router = Router();

router
  .route("/createPost")
  .post(verifyJwt, upload.array("media", 10), createPost);

router
  .route("/createPost/:communitieId")
  .post(verifyJwt, upload.array("media", 10), createPost);

router.route("/getAllPost").get(getAllPost);
router.route("/getPost/:postId").get(verifyJwt, getPostById);
router.route("/getPostOfLoggedInUser").get(verifyJwt, getPostOfLoggedInUser);
router.route("/getPostOfUser/:userId").get(verifyJwt, getPostOfUserById);
router.route("/updatePost/:id").patch(verifyJwt, upload.array("media", 10), updatePost);
router.route("/deletePost/:postId").delete(verifyJwt, deletePost);
router.route("/like/:id").post(verifyJwt, likePost);
router.route("/dislike/:id").post(verifyJwt, dislikePost);
router.route("/search").get(verifyJwt, searchPosts);



export default router;
