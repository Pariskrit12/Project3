import { Router } from "express";

import { verifyJwt } from "../middlewares/auth.js";
import { upload } from "../middlewares/multer.js";
import { createPost } from "../controllers/post.controllers.js";
const router = Router();

router
  .route("/createPost")
  .post(verifyJwt, upload.array("media", 10), createPost);

router
  .route("/createPost/:communitieId")
  .post(verifyJwt, upload.array("media", 10), createPost);


export default router;
