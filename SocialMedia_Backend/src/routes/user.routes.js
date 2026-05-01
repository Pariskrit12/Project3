import { Router } from "express";
import { upload } from "../middlewares/multer.js";
import { userRegister } from "../controllers/user.controllers.js";
import { userLogin } from "../controllers/users.controller.js";
const router = Router();

router.route("/register").post(upload.single("userProfilePic"), userRegister);
router.route("/login").post(userLogin)
export default router;
