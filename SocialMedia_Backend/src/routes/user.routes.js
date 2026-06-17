import { Router } from "express";
import { upload } from "../middlewares/multer.js";
import {
  changeEmail,
  changePassword,
  changeUsername,
  changeUserProfilePic,
  deactivateAccount,
  followUser,
  getAllUsers,
  getCurrentUser,
  getFollowerCount,
  getFollowers,
  getFollowing,
  getFollowingCount,
  getUserProfileById,
  logoutUser,
  unfollowUser,
  userLogin,
  userRegister,
  searchUsers,
  saveInterests,
  getSuggestedUsers,
  googleLogin,
} from "../controllers/users.controller.js";
import { verifyJwt, isAdmin } from "../middlewares/auth.js";

const router = Router();

router.route("/register").post(upload.single("userProfilePic"), userRegister);
router.route("/login").post(userLogin);
router.route("/auth").post(googleLogin);
router.route("/logout").post(verifyJwt, logoutUser);
router.route("/changeEmail").put(verifyJwt, changeEmail);
router
  .route("/changeUserProfilePic")
  .put(verifyJwt, upload.single("userProfilePic"), changeUserProfilePic);
router.route("/changeUsername").put(verifyJwt, changeUsername);
router.route("/getCurrentUser").get(verifyJwt, getCurrentUser);
router.route("/getProfile/:id").get(verifyJwt, getUserProfileById);
router.route("/getAllUsers").get(verifyJwt, isAdmin, getAllUsers);
router.route("/followUser/:id").post(verifyJwt, followUser);
router.route("/unfollowUser/:id").post(verifyJwt, unfollowUser);
router.route("/changePassword").put(verifyJwt, changePassword);
router.route("/deactivateAccount").post(verifyJwt, deactivateAccount);
router.route("/getFollowers").get(verifyJwt, getFollowers);
router.route("/getFollowing").get(verifyJwt, getFollowing);
router.route("/getFollowingCount").get(verifyJwt, getFollowingCount);
router.route("/getFollowerCount").get(verifyJwt, getFollowerCount);
router.route("/search").get(verifyJwt, searchUsers);
router.route("/saveInterests").post(verifyJwt, saveInterests);
router.route("/suggestions").get(verifyJwt, getSuggestedUsers);
export default router;
