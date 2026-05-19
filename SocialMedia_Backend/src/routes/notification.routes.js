import { Router } from "express";
import { verifyJwt } from "../middlewares/auth.js";
import {
  getNotifications,
  getUnreadCount,
  markAllRead,
  markRead,
} from "../controllers/notification.controller.js";

const router = Router();

router.use(verifyJwt);

router.get("/getAll", getNotifications);
router.get("/unreadCount", getUnreadCount);
router.put("/markAllRead", markAllRead);
router.put("/markRead/:id", markRead);

export default router;
