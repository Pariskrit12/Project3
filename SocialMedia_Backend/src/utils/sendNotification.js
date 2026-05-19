import { Notification } from "../models/notification.model.js";
import { sendToUser } from "../socket/socketManager.js";

export async function sendNotification({ sender, receiver, type, message, link }) {
  const notification = await Notification.create({ sender, receiver, type, message, link });
  const populated = await Notification.findById(notification._id).populate(
    "sender",
    "username userProfilePic"
  );
  sendToUser(receiver, "notification", populated);
  return notification;
}
