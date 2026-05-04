import { Router } from "express";
import { upload } from "../middlewares/multer.js";
import { changeEmail, changeUserProfilePic, logoutUser, userLogin, userRegister } from "../controllers/users.controller.js";
import {verifyJwt} from "../middlewares/auth.js"


const router = Router();

router.route("/register").post(upload.single("userProfilePic"), userRegister);
router.route("/login").post(userLogin)
router.route("/logout").post(verifyJwt,logoutUser)
router.route("/changeEmail").put(verifyJwt,changeEmail)
router.route("/changeUserProfilePic").put(verifyJwt,upload.single("userProfilePic"),changeUserProfilePic);
export default router;
