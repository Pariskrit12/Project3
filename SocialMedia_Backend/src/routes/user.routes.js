import { Router } from "express";
import { upload } from "../middlewares/multer.js";
import { logoutUser, userLogin, userRegister } from "../controllers/users.controller.js";
import {verifyJwt} from "../middlewares/auth.js"


const router = Router();

router.route("/register").post(upload.single("userProfilePic"), userRegister);
router.route("/login").post(userLogin)
router.route("/logout").post(verifyJwt,logoutUser)
export default router;
