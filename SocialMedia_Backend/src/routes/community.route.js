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
} from "../controllers/community.controllers.js";

const router = Router();

const communityUpload = upload.fields([
  { name: "profilePicture", maxCount: 1 },
  { name: "banner", maxCount: 1 },
]);

//router.route("/feed").get(verifyJwt, getPersonalizedFeed);
router.route("/createCommunity").post(verifyJwt, communityUpload, createCommunity);
//router.route("/updateCommunity/:communityId").patch(verifyJwt, communityUpload, updateCommunity);
router.route("/deleteCommunity/:communityId").delete(verifyJwt, deleteCommunity);
router.route("/myCommunities").get(verifyJwt, getCommunitiesOfLoggedInUser);
 router.route("/search").get(verifyJwt, searchCommunities);
 router.route("/").get(verifyJwt, getAllCommunities);
router.route("/:communityId").get(verifyJwt, getCommunityById);

export default router;
