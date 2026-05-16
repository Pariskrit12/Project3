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
  searchAll,
  getRecentlyVisitedPosts,
  getNewPosts,
  getTopPosts,
  getFeedPosts,
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
router.route("/search/all").get(verifyJwt, searchAll);
router.route("/recentlyVisited").get(verifyJwt, getRecentlyVisitedPosts);
router.route("/new").get(verifyJwt, getNewPosts);
router.route("/top").get(verifyJwt, getTopPosts);
router.route("/feed").get(verifyJwt, getFeedPosts);



export default router;
