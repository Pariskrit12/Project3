import { Router } from "express";
import { verifyJwt } from "../middlewares/auth";
import { upload } from "../middlewares/multer";
import { createCommunity } from "../controllers/community.controllers";

const router=Router()
router.route("/createCommunity").post(verifyJwt,upload.fields([{name:"communityProfilePicture",maxCount:1},{name:"communityBanner",maxCount:1}]),createCommunity)
export default router
