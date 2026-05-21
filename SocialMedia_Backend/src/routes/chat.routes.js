import { Router } from "express";
import { verifyJwt } from "../middlewares/auth.js";
import {
  getConversations,
  getOrCreateConversation,
  getMessages,
  sendMessage,
  markConversationRead,
} from "../controllers/chat.controller.js";

const router = Router();

router.use(verifyJwt);

router.get("/conversations", getConversations);
router.post("/conversation/:userId", getOrCreateConversation);
router.get("/messages/:conversationId", getMessages);
router.post("/messages/:conversationId", sendMessage);
router.put("/messages/:conversationId/read", markConversationRead);

export default router;
