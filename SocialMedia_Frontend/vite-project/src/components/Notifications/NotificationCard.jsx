import { Icon } from "@iconify/react";
import React from "react";
import { useNavigate } from "react-router-dom";
import { useMarkReadMutation } from "../../services/notificationApi";
import formatTime from "../../utils/formatTime";

const TYPE_ICONS = {
  like_post: { icon: "mdi:heart", bg: "from-[#E11D48] to-[#BE123C]" },
  like_comment: { icon: "mdi:heart", bg: "from-[#E11D48] to-[#BE123C]" },
  comment: { icon: "mdi:comment", bg: "from-[#7C3AED] to-[#5B21B6]" },
  follow: { icon: "mdi:account-plus", bg: "from-[#0EA5E9] to-[#0369A1]" },
  join_community: { icon: "mdi:account-group", bg: "from-[#10B981] to-[#065F46]" },
  message: { icon: "mdi:message", bg: "from-[#F59E0B] to-[#B45309]" },
  post: { icon: "mdi:post", bg: "from-[#6366F1] to-[#3730A3]" },
};

const NotificationCard = ({ notification }) => {
  const navigate = useNavigate();
  const [markRead] = useMarkReadMutation();

  const { type, message, isRead, sender, link, createdAt } = notification;
  const { icon, bg } = TYPE_ICONS[type] ?? { icon: "mdi:bell", bg: "from-[#E11D48] to-[#BE123C]" };

  const handleClick = () => {
    if (!isRead) markRead(notification._id);
    if (link) navigate(link);
  };

  return (
    <div
      onClick={handleClick}
      className={`flex justify-between items-center p-4 rounded-2xl border transition-all duration-200 cursor-pointer group ${
        isRead
          ? "border-[#FECDD3] bg-white hover:bg-[#FFF5F6]"
          : "border-[#FDA4AF] bg-[#FFF5F6] hover:bg-[#FFE4E6] hover:border-[#FDA4AF] hover:shadow-[0_4px_16px_rgba(225,29,72,0.1)]"
      }`}
    >
      <div className="flex gap-3.5 items-center">
        <div className="relative shrink-0">
          <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-[#FECDD3] group-hover:border-[#E11D48] transition-colors duration-200 bg-[#FFE4E6] flex items-center justify-center">
            {sender?.userProfilePic ? (
              <img
                src={sender.userProfilePic}
                alt={sender.username}
                className="w-full h-full object-cover"
              />
            ) : (
              <Icon icon="mdi:account" width="24" height="24" className="text-[#FDA4AF]" />
            )}
          </div>
          <div className={`absolute -bottom-0.5 -right-0.5 bg-linear-to-br ${bg} rounded-full p-1 border-2 border-[#FFF5F6] shadow-sm`}>
            <Icon icon={icon} width="8" height="8" className="text-white" />
          </div>
        </div>

        <div className="flex flex-col gap-0.5">
          <h2 className="font-bold text-sm text-[#1C0714]">
            {sender?.username ?? "Someone"}
          </h2>
          <p className="text-xs text-[#9F1239]">{message}</p>
          <p className="text-xs text-[#FDA4AF] flex items-center gap-1 mt-0.5">
            <Icon icon="mdi:clock-outline" width="11" height="11" />
            {createdAt ? formatTime(createdAt) : ""}
          </p>
        </div>
      </div>

      {!isRead && (
        <div className="shrink-0 w-2.5 h-2.5 rounded-full bg-[#E11D48] ml-2" />
      )}
    </div>
  );
};

export default NotificationCard;
