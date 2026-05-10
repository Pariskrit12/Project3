import { Router } from "express";
import { upload } from "../middlewares/multer.js";
import { changeEmail, changeUsername, changeUserProfilePic, deactivateAccount, followUser, getAllUsers, getCurrentUser, getFollowerCount, getFollowers, getFollowing, getFollowingCount, getUserProfileById, logoutUser, unfollowUser, userLogin, userRegister } from "../controllers/users.controller.js";
import {verifyJwt} from "../middlewares/auth.js"


const router = Router();

router.route("/register").post(upload.single("userProfilePic"), userRegister);
router.route("/login").post(userLogin)
router.route("/logout").post(verifyJwt,logoutUser)
router.route("/changeEmail").put(verifyJwt,changeEmail)
router.route("/changeUserProfilePic").put(verifyJwt,upload.single("userProfilePic"),changeUserProfilePic);
router.route("/changeUsername").put(verifyJwt,changeUsername);
router.route("/getCurrentUser").get(verifyJwt,getCurrentUser);
router.route("/getProfile").get(verifyJwt,getUserProfileById);
router.route("/getAllUsers").get(verifyJwt,getAllUsers);
router.route("/followUSer").post(verifyJwt,followUser);
router.route("/unfollorUser").post(verifyJwt,unfollowUser);
router.route("/deactivateAccount").post(verifyJwt, deactivateAccount);
router.route("/getFollowers").get(verifyJwt,getFollowers);
router.route("/getFollowing").get(verifyJwt,getFollowing);
router.route("/getFollowingCount").get(verifyJwt, getFollowingCount);
export default router;
