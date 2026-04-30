import { Router } from "express";
import { upload } from "../middlewares/multer.js";
import { testController, userRegister } from "../controllers/user.controllers.js";
const router = Router();

router.route("/register").post(upload.single("userProfilePic"), userRegister);
router.route("/test").get(testController);
export default router;
