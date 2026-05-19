import { Notification } from "../models/notification.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/apiResponse.js";
import { ApiError } from "../utils/apiError.js";

const getNotifications = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  const notifications = await Notification.find({ receiver: userId })
    .populate("sender", "username userProfilePic")
    .sort({ createdAt: -1 })
    .limit(50);
  return res.status(200).json(new ApiResponse(200, notifications, "Notifications fetched"));
});

const getUnreadCount = asyncHandler(async (req, res) => {
  const count = await Notification.countDocuments({ receiver: req.user._id, isRead: false });
  return res.status(200).json(new ApiResponse(200, count, "Unread count fetched"));
});

const markAllRead = asyncHandler(async (req, res) => {
  await Notification.updateMany({ receiver: req.user._id, isRead: false }, { isRead: true });
  return res.status(200).json(new ApiResponse(200, {}, "All notifications marked as read"));
});

const markRead = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const notification = await Notification.findOneAndUpdate(
    { _id: id, receiver: req.user._id },
    { isRead: true },
    { new: true }
  );
  if (!notification) throw new ApiError(404, "Notification not found");
  return res.status(200).json(new ApiResponse(200, {}, "Notification marked as read"));
});

export { getNotifications, getUnreadCount, markAllRead, markRead };
