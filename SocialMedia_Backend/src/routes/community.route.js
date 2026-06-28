import { Router } from "express";
import { verifyJwt } from "../middlewares/auth.js";
import { upload } from "../middlewares/multer.js";
import {
  createCommunity,
  deleteCommunity,
  getCommunitiesOfLoggedInUser,
  getCommunityById,
  getAllCommunities,
  searchCommunities,
  toggleJoinCommunity,
  getPostOfCommunity,
} from "../controllers/community.controllers.js";

const router = Router();

const communityUpload = upload.fields([
  { name: "profilePicture", maxCount: 1 },
  { name: "banner", maxCount: 1 },
]);
router.route("/createCommunity").post(verifyJwt, communityUpload, createCommunity);router.route("/deleteCommunity/:communityId").delete(verifyJwt, deleteCommunity);
router.route("/myCommunities").get(verifyJwt, getCommunitiesOfLoggedInUser);
 router.route("/search").get(verifyJwt, searchCommunities);
 router.route("/").get(verifyJwt, getAllCommunities);
router.route("/:communityId").get(verifyJwt, getCommunityById);
router.route("/:communityId/join").post(verifyJwt, toggleJoinCommunity);
router.route("/:communityId/posts").get(verifyJwt, getPostOfCommunity);

export default router;
