import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { Icon } from "@iconify/react";
import Button from "../components/common/Button";
import { useGetProfileQuery, useFollowUserMutation, useUnfollowUserMutation } from "../services/userApi";
import { useGetPostsOfUserQuery } from "../services/postApi";

const UserListModal = ({ title, users, onClose, onUserClick }) => (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm" onClick={onClose}>
    <div
      className="bg-[#FFF5F6] border border-[#FECDD3] rounded-2xl w-full max-w-sm mx-4 shadow-[0_8px_40px_rgba(225,29,72,0.18)] overflow-hidden"
      onClick={(e) => e.stopPropagation()}
    >
      <div className="flex items-center justify-between px-5 py-4 border-b border-[#FECDD3]">
        <h2 className="font-black text-[#1C0714] text-base">{title}</h2>
        <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-[#FFE4E6] transition-colors text-[#E11D48]">
          <Icon icon="mdi:close" width="18" height="18" />
        </button>
      </div>
      <div className="overflow-y-auto max-h-80">
        {users.length === 0 ? (
          <div className="flex flex-col items-center gap-2 py-10 text-[#FDA4AF]">
            <Icon icon="mdi:account-group-outline" width="32" height="32" />
            <p className="text-sm font-medium">No users yet</p>
          </div>
        ) : (
          users.map((u) => (
            <button
              key={u._id}
              onClick={() => onUserClick(u._id)}
              className="flex items-center gap-3 w-full px-5 py-3 hover:bg-[#FFE4E6] transition-colors text-left"
            >
              <div className="shrink-0 h-10 w-10 rounded-full overflow-hidden bg-linear-to-br from-[#FB7185] to-[#BE123C] flex items-center justify-center border-2 border-[#FECDD3]">
                {u.userProfilePic ? (
                  <img src={u.userProfilePic} alt={u.username} className="w-full h-full object-cover" />
                ) : (
                  <Icon icon="mdi:account" width="20" height="20" className="text-white" />
                )}
              </div>
              <div className="min-w-0">
                <p className="font-bold text-sm text-[#1C0714] truncate">{u.fullName || u.username}</p>
                <p className="text-xs text-[#BE7090] truncate">@{u.username}</p>
              </div>
            </button>
          ))
        )}
      </div>
    </div>
  </div>
);

const UserProfile = () => {
  const { userId } = useParams();
  const navigate = useNavigate();
  const { user: loggedInUser } = useSelector((state) => state.auth);
  const isOwnProfile = loggedInUser?._id === userId;

  const tabs = ["Posts", "Overview"];
  const [active, setActive] = useState(0);
  const [modal, setModal] = useState(null); // "followers" | "following" | null

  const { data: profileData, isLoading: profileLoading } = useGetProfileQuery(userId);
  const { data: postsData, isLoading: postsLoading } = useGetPostsOfUserQuery(userId);
  const [followUser, { isLoading: following }] = useFollowUserMutation();
  const [unfollowUser, { isLoading: unfollowing }] = useUnfollowUserMutation();

  const user = profileData?.data;
  const posts = postsData?.data || [];

  const myId = loggedInUser?._id?.toString();
  const isFollowingProfile = user?.followers?.some(
    (f) => (f._id ?? f).toString() === myId
  );
  const profileFollowsMe = user?.following?.some(
    (f) => (f._id ?? f).toString() === myId
  );

  const handleFollowToggle = async () => {
    if (isFollowingProfile) {
      await unfollowUser(userId);
    } else {
      await followUser(userId);
    }
  };

  const followBtnLabel = isFollowingProfile
    ? "Following"
    : profileFollowsMe
    ? "Follow Back"
    : "Follow";
  const followBtnLoading = following || unfollowing;

  if (profileLoading) {
    return (
      <div className="flex justify-center py-20">
        <Icon icon="svg-spinners:ring-resize" width="36" height="36" className="text-[#E11D48]" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex flex-col items-center gap-2 py-20 text-[#FDA4AF]">
        <Icon icon="material-symbols:error-outline" width="32" height="32" />
        <p className="text-sm font-medium">User not found</p>
      </div>
    );
  }

  return (
    <main className="max-w-3xl">
      {/* Banner + Avatar */}
      <section className="relative mb-14">
        <div className="h-36 bg-linear-to-br from-[#E11D48] via-[#FB7185] to-[#BE123C] rounded-2xl overflow-hidden relative">
          <div className="absolute inset-0">
            <div className="absolute top-4 left-10 w-16 h-16 rounded-full bg-white/20"></div>
            <div className="absolute bottom-2 right-20 w-24 h-24 rounded-full bg-white/15"></div>
            <div className="absolute top-8 right-40 w-10 h-10 rounded-full bg-white/20"></div>
          </div>
        </div>
        <div className="absolute bottom-0 left-6 translate-y-1/2 z-10">
          <div className="border-4 border-[#FFF1F2] rounded-full shadow-[0_4px_20px_rgba(225,29,72,0.25)] h-20 w-20 overflow-hidden bg-linear-to-br from-[#FB7185] to-[#BE123C] flex items-center justify-center">
            {user.userProfilePic ? (
              <img className="h-full w-full object-cover rounded-full" src={user.userProfilePic} alt={user.username} />
            ) : (
              <Icon icon="mdi:account" width="36" height="36" className="text-white" />
            )}
          </div>
        </div>
      </section>

      {/* Info */}
      <section className="px-1 mt-2">
        <div className="flex justify-end mb-3 gap-2">
          {isOwnProfile ? (
            <Button name="Edit Profile" isActive={true} onClick={() => navigate("/settings/accountInformation")} />
          ) : (
            <Button
              name={followBtnLabel}
              isActive={!isFollowingProfile}
              onClick={handleFollowToggle}
              loading={followBtnLoading}
            />
          )}
          <button className="p-2 rounded-xl hover:bg-[#FFE4E6] transition-colors border border-[#FECDD3] bg-[#FFF5F6]">
            <Icon className="text-[#E11D48]" icon="fa7-solid:share" width="18" height="18" />
          </button>
          <button className="p-2 rounded-xl hover:bg-[#FFE4E6] transition-colors border border-[#FECDD3] bg-[#FFF5F6]">
            <Icon className="text-[#E11D48]" icon="tabler:dots" width="18" height="18" />
          </button>
        </div>

        <h1 className="font-black text-2xl text-[#1C0714]">{user.fullName || user.username}</h1>
        <p className="text-sm text-[#BE7090]">@{user.username}</p>

        <div className="text-sm text-[#9F1239] flex gap-5 mt-3">
          <button onClick={() => setModal("following")} className="text-center hover:opacity-70 transition-opacity cursor-pointer">
            <p className="font-black text-lg text-[#1C0714]">{user.following?.length ?? 0}</p>
            <p className="text-xs text-[#BE7090]">following</p>
          </button>
          <button onClick={() => setModal("followers")} className="text-center hover:opacity-70 transition-opacity cursor-pointer">
            <p className="font-black text-lg text-[#1C0714]">{user.followers?.length ?? 0}</p>
            <p className="text-xs text-[#BE7090]">followers</p>
          </button>
          <div className="text-center">
            <p className="font-black text-lg text-[#1C0714]">{posts.length}</p>
            <p className="text-xs text-[#BE7090]">posts</p>
          </div>
        </div>
      </section>

      {/* Tabs */}
      <section className="mt-6 border-b border-[#FECDD3]">
        <div className="flex gap-1">
          {tabs.map((tab, index) => (
            <button
              key={index}
              onClick={() => setActive(index)}
              className={`px-4 py-2.5 text-sm font-bold border-b-2 transition-all duration-200 -mb-px ${
                active === index
                  ? "border-[#BE123C] text-[#BE123C]"
                  : "border-transparent text-[#BE7090] hover:text-[#9F1239] hover:border-[#FDA4AF]"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </section>

      {/* Tab content */}
      <section className="mt-5">
        {active === 0 && (
          <div>
            {postsLoading && (
              <div className="flex justify-center py-10">
                <Icon icon="svg-spinners:ring-resize" width="30" height="30" className="text-[#E11D48]" />
              </div>
            )}
            {!postsLoading && posts.length === 0 && (
              <div className="flex flex-col items-center gap-2 py-10 text-[#FDA4AF]">
                <Icon icon="mdi:camera-outline" width="40" height="40" />
                <p className="text-sm font-semibold text-[#9F1239]">No posts yet</p>
                <p className="text-xs text-[#FDA4AF]">Share photos and videos</p>
              </div>
            )}
            {!postsLoading && posts.length > 0 && (
              <div className="grid grid-cols-3 gap-0.5">
                {posts.map((post) => {
                  const firstMedia = post.media?.[0];
                  const isVideo = firstMedia?.type === "video";
                  const mediaSrc = firstMedia?.url;
                  const multipleMedia = post.media?.length > 1;

                  return (
                    <div
                      key={post._id}
                      onClick={() => navigate(`/postPage/${post._id}`)}
                      className="relative aspect-square cursor-pointer overflow-hidden group bg-[#F5E6D8]"
                    >
                      {mediaSrc ? (
                        isVideo ? (
                          <video
                            src={mediaSrc}
                            className="w-full h-full object-cover"
                            muted
                            preload="metadata"
                          />
                        ) : (
                          <img
                            src={mediaSrc}
                            alt={post.postTitle}
                            className="w-full h-full object-cover"
                          />
                        )
                      ) : (
                        <div className="w-full h-full flex flex-col items-center justify-center gap-1 px-2">
                          <Icon icon="mdi:text-box-outline" width="24" height="24" className="text-[#FDA4AF]" />
                          <p className="text-[10px] text-[#BE7090] text-center font-medium leading-tight line-clamp-3">
                            {post.postTitle}
                          </p>
                        </div>
                      )}

                      {/* video play badge */}
                      {isVideo && (
                        <div className="absolute top-2 right-2">
                          <Icon icon="mdi:play-circle" width="20" height="20" className="text-white drop-shadow" />
                        </div>
                      )}

                      {/* multiple media badge */}
                      {multipleMedia && (
                        <div className="absolute top-2 right-2">
                          <Icon icon="material-symbols:collections" width="18" height="18" className="text-white drop-shadow" />
                        </div>
                      )}

                      {/* hover overlay */}
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center gap-4">
                        <div className="flex items-center gap-1.5 text-white font-bold text-sm">
                          <Icon icon="mdi:heart" width="20" height="20" />
                          <span>{post.likes?.length ?? 0}</span>
                        </div>
                        <div className="flex items-center gap-1.5 text-white font-bold text-sm">
                          <Icon icon="mdi:comment" width="20" height="20" />
                          <span>{post.comments?.length ?? 0}</span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {active === 1 && (
          <div className="flex flex-col gap-3 px-1">
            {user.email && (
              <div className="flex items-center gap-3 p-4 bg-[#FFF5F6] border border-[#FECDD3] rounded-2xl">
                <Icon icon="material-symbols:mail-outline" width="18" height="18" className="text-[#E11D48]" />
                <p className="text-sm text-[#9F1239]">{user.email}</p>
              </div>
            )}
            <div className="flex items-center gap-3 p-4 bg-[#FFF5F6] border border-[#FECDD3] rounded-2xl">
              <Icon icon="material-symbols:calendar-today-outline" width="18" height="18" className="text-[#E11D48]" />
              <p className="text-sm text-[#9F1239]">
                Joined {new Date(user.createdAt).toLocaleDateString("en-US", { month: "long", year: "numeric" })}
              </p>
            </div>
          </div>
        )}
      </section>

      {modal && (
        <UserListModal
          title={modal === "followers" ? "Followers" : "Following"}
          users={modal === "followers" ? (user.followers ?? []) : (user.following ?? [])}
          onClose={() => setModal(null)}
          onUserClick={(id) => { setModal(null); navigate(`/userProfile/${id}`); }}
        />
      )}
    </main>
  );
};

export default UserProfile;
