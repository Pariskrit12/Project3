import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { Conversation } from "../models/conversation.model.js";
import { Message } from "../models/message.model.js";
import { User } from "../models/user.models.js";
import { sendToUser } from "../socket/socketManager.js";
import { sendNotification } from "../utils/sendNotification.js";

const canChat = async (myId, otherId) => {
  const me = await User.findById(myId).select("following followers");
  return (
    me.following.some((id) => id.toString() === otherId) ||
    me.followers.some((id) => id.toString() === otherId)
  );
};

export const getConversations = asyncHandler(async (req, res) => {
  const userId = req.user._id;

  const conversations = await Conversation.find({ participants: userId })
    .populate("participants", "username userProfilePic")
    .sort({ lastMessageAt: -1 })
    .lean();

  const formatted = conversations.map((conv) => {
    const otherUser = conv.participants.find(
      (p) => p._id.toString() !== userId.toString()
    );
    return {
      ...conv,
      otherUser,
      unreadCount: conv.unread?.[userId.toString()] ?? 0,
    };
  });

  return res.status(200).json(new ApiResponse(200, formatted, "Conversations fetched"));
});

export const getOrCreateConversation = asyncHandler(async (req, res) => {
  const myId = req.user._id;
  const { userId } = req.params;

  if (myId.toString() === userId) {
    return res.status(400).json(new ApiResponse(400, null, "Cannot chat with yourself"));
  }

  const allowed = await canChat(myId.toString(), userId);
  if (!allowed) {
    return res.status(403).json(new ApiResponse(403, null, "You can only chat with followers"));
  }

  let conversation = await Conversation.findOne({
    participants: { $all: [myId, userId] },
  }).populate("participants", "username userProfilePic");

  if (!conversation) {
    const newConv = await Conversation.create({ participants: [myId, userId] });
    conversation = await Conversation.findById(newConv._id).populate(
      "participants",
      "username userProfilePic"
    );
  }

  const otherUser = conversation.participants.find(
    (p) => p._id.toString() !== myId.toString()
  );

  return res.status(200).json(
    new ApiResponse(200, { ...conversation.toObject(), otherUser }, "Conversation ready")
  );
});

export const getMessages = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  const { conversationId } = req.params;

  const conversation = await Conversation.findOne({
    _id: conversationId,
    participants: userId,
  });
  if (!conversation) {
    return res.status(404).json(new ApiResponse(404, null, "Conversation not found"));
  }

  const messages = await Message.find({ conversation: conversationId })
    .populate("sender", "username userProfilePic")
    .sort({ createdAt: 1 })
    .lean();


  conversation.unread.set(userId.toString(), 0);
  await conversation.save();

  return res.status(200).json(new ApiResponse(200, messages, "Messages fetched"));
});

export const sendMessage = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  const { conversationId } = req.params;
  const { text } = req.body;

  if (!text?.trim()) {
    return res.status(400).json(new ApiResponse(400, null, "Message cannot be empty"));
  }

  const conversation = await Conversation.findOne({
    _id: conversationId,
    participants: userId,
  });
  if (!conversation) {
    return res.status(404).json(new ApiResponse(404, null, "Conversation not found"));
  }

  const message = await Message.create({
    conversation: conversationId,
    sender: userId,
    text: text.trim(),
    readBy: [userId],
  });

  const populated = await Message.findById(message._id).populate(
    "sender",
    "username userProfilePic"
  );


  const otherId = conversation.participants.find(
    (id) => id.toString() !== userId.toString()
  );
  const currentUnread = conversation.unread.get(otherId.toString()) ?? 0;
  conversation.lastMessage = text.trim();
  conversation.lastMessageSender = userId;
  conversation.lastMessageAt = new Date();
  conversation.unread.set(otherId.toString(), currentUnread + 1);
  await conversation.save();


  sendToUser(otherId.toString(), "new_message", {
    conversationId,
    message: populated,
  });


  await sendNotification({
    sender: userId,
    receiver: otherId,
    type: "message",
    message: "sent you a message",
    link: "/chat",
  });

  return res.status(201).json(new ApiResponse(201, populated, "Message sent"));
});

export const markConversationRead = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  const { conversationId } = req.params;

  const conversation = await Conversation.findOne({
    _id: conversationId,
    participants: userId,
  });
  if (!conversation) {
    return res.status(404).json(new ApiResponse(404, null, "Conversation not found"));
  }

  conversation.unread.set(userId.toString(), 0);
  await conversation.save();

  return res.status(200).json(new ApiResponse(200, null, "Marked as read"));
});
