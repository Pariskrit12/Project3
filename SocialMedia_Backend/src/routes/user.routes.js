import { Router } from "express";
import { upload } from "../middlewares/multer.js";
import { userLogin, userRegister } from "../controllers/users.controller.js";


const router = Router();

router.route("/register").post(upload.single("userProfilePic"), userRegister);
router.route("/login").post(userLogin)
export default router;
