import { Icon } from "@iconify/react";
import React from "react";
import { truncateWords } from "../../utils/truncateWords";
import formatTime from "../../utils/formatTime";

const RecentPostCard = ({ post, onClick }) => {
  const thumbnail = post.media?.[0]?.url;
  const thumbnailType = post.media?.[0]?.type;
  const communityName = post.community?.communityName;
  const communityPic = post.community?.communityProfilePicture;
  const title = post.postTitle || post.postDescription || "Untitled post";

  return (
    <div
      onClick={onClick}
      className="py-3 border-b border-[#3A3A3C] last:border-0 group cursor-pointer"
    >
      <div className="flex gap-3">
        {/* Text content */}
        <div className="flex flex-col gap-1.5 flex-1 min-w-0">
          {/* Community / author row */}
          <div className="flex gap-1.5 items-center">
            <div className="h-4 w-4 rounded-full overflow-hidden shrink-0 bg-linear-to-br from-[#FF6534] to-[#CC3600] flex items-center justify-center">
              {communityPic ? (
                <img src={communityPic} alt="" className="w-full h-full object-cover" />
              ) : post.creator?.userProfilePic ? (
                <img src={post.creator.userProfilePic} alt="" className="w-full h-full object-cover" />
              ) : (
                <Icon icon="mdi:account" width="10" height="10" className="text-white" />
              )}
            </div>
            <p className="text-[11px] font-bold text-[#CC3600] truncate">
              {communityName || post.creator?.username || "Unknown"}
            </p>
            <p className="text-[11px] text-[#9A9A9A] shrink-0">
              · {formatTime(post.createdAt)}
            </p>
          </div>

          {/* Title */}
          <p className="font-bold text-sm text-[#D7DADC] leading-snug group-hover:text-[#CC3600] transition-colors duration-200 line-clamp-2">
            {truncateWords(title, 8)}
          </p>

          {/* Stats */}
          <div className="flex items-center gap-3 text-[11px] text-[#9A9A9A]">
            <span className="flex items-center gap-1">
              <Icon icon="boxicons:like-filled" width="11" height="11" className="text-[#FF4500]" />
              {post.likes?.length ?? 0}
            </span>
            <span className="flex items-center gap-1">
              <Icon icon="mdi:comment-outline" width="11" height="11" />
              {post.comments?.length ?? 0}
            </span>
          </div>
        </div>

        {/* Thumbnail */}
        <div className="shrink-0 w-16 h-14 rounded-xl overflow-hidden border border-[#3A3A3C] bg-[#2A2A2A] flex items-center justify-center">
          {thumbnail ? (
            thumbnailType === "video" ? (
              <video src={thumbnail} className="w-full h-full object-cover" muted />
            ) : (
              <img src={thumbnail} alt="thumbnail" className="w-full h-full object-cover" />
            )
          ) : (
            <Icon icon="mdi:image-outline" width="22" height="22" className="text-[#9A9A9A]" />
          )}
        </div>
      </div>
    </div>
  );
};

export default RecentPostCard;
