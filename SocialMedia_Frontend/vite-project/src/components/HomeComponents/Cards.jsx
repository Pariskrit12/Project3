import { Icon } from "@iconify/react";
import React, { useState, useEffect } from "react";
import Button from "../common/Button";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { useFollowUserMutation, useUnfollowUserMutation } from "../../services/usersApi";
import { useLikePostMutation, useDislikePostMutation } from "../../services/postsApi";

const MediaCarousel = ({ media }) => {
  const [index, setIndex] = useState(0);
  const count = media.length;

  if (count === 0) return null;

  const prev = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIndex((i) => (i - 1 + count) % count);
  };

  const next = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIndex((i) => (i + 1) % count);
  };

  const current = media[index];

  return (
    <div className="mx-5 rounded-xl overflow-hidden relative bg-black select-none">
      {/* media item */}
      <div className="w-full max-h-[480px] flex items-center justify-center bg-black">
        {current.type === "image" ? (
          <img
            key={index}
            src={current.url}
            alt={`media ${index + 1}`}
            className="w-full max-h-[480px] object-contain"
          />
        ) : (
          <video
            key={index}
            src={current.url}
            controls
            className="w-full max-h-[480px] object-contain"
          />
        )}
      </div>

      {/* arrows — only shown when more than 1 item */}
      {count > 1 && (
        <>
          <button
            type="button"
            onClick={prev}
            className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/75 text-white rounded-full p-1.5 transition-colors z-10"
          >
            <Icon icon="mdi:chevron-left" width="22" height="22" />
          </button>
          <button
            type="button"
            onClick={next}
            className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/75 text-white rounded-full p-1.5 transition-colors z-10"
          >
            <Icon icon="mdi:chevron-right" width="22" height="22" />
          </button>

          {/* counter badge top-right */}
          <div className="absolute top-2 right-2 bg-black/55 text-white text-xs font-bold px-2 py-0.5 rounded-full z-10">
            {index + 1} / {count}
          </div>

          {/* dot indicators */}
          <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1.5 z-10">
            {media.map((_, i) => (
              <button
                key={i}
                type="button"
                onClick={(e) => { e.preventDefault(); e.stopPropagation(); setIndex(i); }}
                className={`rounded-full transition-all duration-200 ${
                  i === index
                    ? "bg-white w-4 h-1.5"
                    : "bg-white/50 w-1.5 h-1.5"
                }`}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
};

const Cards = ({
  onClick,
  showFull,
  communitteName,
  username,
  creatorId,
  uploadedTime,
  titleOfPost,
  media = [],
  image,
  video,
  description,
  userProfilePic,
  postId,
  likes = [],
  dislikes = [],
}) => {
  const navigate = useNavigate();

  const { user: loggedInUser } = useSelector((state) => state.auth);
  const userId = loggedInUser?._id;
  const isOwnPost = userId === creatorId;
  const isFollowing = loggedInUser?.following?.some((id) => id.toString() === creatorId);

  const [localLikes, setLocalLikes] = useState(likes);
  const [localDislikes, setLocalDislikes] = useState(dislikes);

  const likesKey = likes.join(",");
  const dislikesKey = dislikes.join(",");
  useEffect(() => { setLocalLikes(likes); }, [likesKey]);
  useEffect(() => { setLocalDislikes(dislikes); }, [dislikesKey]);

  const isLiked = localLikes.some((id) => id.toString() === userId);
  const isDisliked = localDislikes.some((id) => id.toString() === userId);

  const [followUser, { isLoading: following }] = useFollowUserMutation();
  const [unfollowUser, { isLoading: unfollowing }] = useUnfollowUserMutation();
  const [likePost] = useLikePostMutation();
  const [dislikePost] = useDislikePostMutation();

  const resolvedMedia =
    media.length > 0
      ? media
      : [
          ...(image ? [{ type: "image", url: image }] : []),
          ...(video ? [{ type: "video", url: video }] : []),
        ];

  const handleLike = (e) => {
    e.stopPropagation();
    if (!postId || !userId) return;
    if (isLiked) {
      setLocalLikes((prev) => prev.filter((id) => id.toString() !== userId));
    } else {
      setLocalLikes((prev) => [...prev, userId]);
      if (isDisliked) setLocalDislikes((prev) => prev.filter((id) => id.toString() !== userId));
    }
    likePost(postId);
  };

  const handleDislike = (e) => {
    e.stopPropagation();
    if (!postId || !userId) return;
    if (isDisliked) {
      setLocalDislikes((prev) => prev.filter((id) => id.toString() !== userId));
    } else {
      setLocalDislikes((prev) => [...prev, userId]);
      if (isLiked) setLocalLikes((prev) => prev.filter((id) => id.toString() !== userId));
    }
    dislikePost(postId);
  };

  const handleUserClick = (e) => {
    e.stopPropagation();
    if (creatorId) navigate(`/userProfile/${creatorId}`);
  };

  const handleFollowToggle = async (e) => {
    e.stopPropagation();
    if (!creatorId) return;
    if (isFollowing) {
      await unfollowUser(creatorId);
    } else {
      await followUser(creatorId);
    }
  };

  return (
    <div
      onClick={onClick}
      className="border border-[#EDD9C8] bg-[#FFFCF9] shadow-[0_2px_16px_rgba(164,57,25,0.07)] flex flex-col gap-4 rounded-2xl hover:shadow-[0_8px_28px_rgba(164,57,25,0.13)] hover:border-[#C9A88A] hover:-translate-y-0.5 transition-all duration-300 cursor-pointer overflow-hidden"
    >
      <div className="p-5 pb-0 flex justify-between items-start">
        <div onClick={handleUserClick} className="flex gap-2.5 items-center cursor-pointer group">
          <div className="shrink-0 h-10 w-10 rounded-full ring-2 ring-[#C7604A] ring-offset-1 ring-offset-[#FFFCF9] shadow-[0_2px_8px_rgba(164,57,25,0.25)] overflow-hidden bg-linear-to-br from-[#C7604A] to-[#8B3010]">
            {userProfilePic ? (
              <img className="h-full w-full object-cover" src={userProfilePic} alt={username} />
            ) : (
              <div className="h-full w-full flex items-center justify-center">
                <Icon icon="mdi:account" width="22" height="22" className="text-white" />
              </div>
            )}
          </div>
          <div>
            <p className="text-[#A43919] font-bold text-sm leading-tight">{communitteName}</p>
            <p className="text-xs text-[#C9A88A] group-hover:text-[#A43919] transition-colors">
              /{username} · {uploadedTime}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {!isOwnPost && (
            <div onClick={handleFollowToggle}>
              <Button
                isActive={!isFollowing}
                loading={following || unfollowing}
                name={communitteName ? "Join" : isFollowing ? "Unfollow" : "Follow"}
              />
            </div>
          )}
          <button
            className="p-1.5 rounded-lg hover:bg-[#FAEBD8] transition-colors"
            onClick={(e) => e.stopPropagation()}
          >
            <Icon className="text-[#C9A88A]" icon="tabler:dots-filled" width="20" height="20" />
          </button>
        </div>
      </div>

      <div className="px-5">
        <h1 className="text-lg font-bold text-[#1C0F08] leading-snug">{titleOfPost}</h1>
      </div>

      <MediaCarousel media={resolvedMedia} />

      {showFull && description && (
        <div className="px-5">
          <p className="text-sm text-[#4A2C1D] leading-relaxed">{description}</p>
        </div>
      )}

      <div className="px-5 pb-4 flex items-center gap-2 pt-1 border-t border-[#F0E6DD]">
        <button
          onClick={handleLike}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-semibold transition-all duration-200 ${
            isLiked ? "bg-[#FAEBD8] text-[#A43919]" : "text-[#9C7E6D] hover:bg-[#FAEBD8] hover:text-[#A43919]"
          }`}
        >
          <Icon icon={isLiked ? "boxicons:like-filled" : "boxicons:like"} width="16" height="16" />
          <span>{localLikes.length > 0 ? localLikes.length : "Like"}</span>
        </button>
        <button
          onClick={handleDislike}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-semibold transition-all duration-200 ${
            isDisliked ? "bg-[#FAEBD8] text-[#A43919]" : "text-[#9C7E6D] hover:bg-[#FAEBD8] hover:text-[#A43919]"
          }`}
        >
          <Icon icon={isDisliked ? "boxicons:dislike-filled" : "boxicons:dislike"} width="16" height="16" />
          <span>{localDislikes.length > 0 ? localDislikes.length : "Dislike"}</span>
        </button>
        <button
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-semibold text-[#9C7E6D] hover:bg-[#FAEBD8] hover:text-[#A43919] transition-all duration-200"
          onClick={(e) => e.stopPropagation()}
        >
          <Icon icon="mdi:comments-outline" width="16" height="16" />
          <span>Comment</span>
        </button>
        <button
          className="ml-auto p-1.5 rounded-full text-[#9C7E6D] hover:bg-[#FAEBD8] hover:text-[#A43919] transition-all duration-200"
          onClick={(e) => e.stopPropagation()}
        >
          <Icon icon="tabler:share" width="16" height="16" />
        </button>
      </div>
    </div>
  );
};

export default Cards;
