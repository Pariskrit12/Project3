import { Icon } from "@iconify/react";
import React, { useState, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import {
  useGetCommunityQuery,
  useToggleJoinCommunityMutation,
  useGetCommunityPostsQuery,
} from "../services/communitiesApi";
import Cards from "../components/HomeComponents/Cards";

const FILTERS = ["New", "Top", "Best"];

function timeAgo(dateStr) {
  const seconds = Math.floor((Date.now() - new Date(dateStr)) / 1000);
  if (seconds < 60) return `${seconds}s ago`;
  if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
  if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
  return `${Math.floor(seconds / 86400)}d ago`;
}

const Communites = () => {
  const { communityId } = useParams();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);
  const [filter, setFilter] = useState("New");

  const { data: communityData, isLoading, isError } = useGetCommunityQuery(communityId);
  const { data: postsData, isLoading: postsLoading } = useGetCommunityPostsQuery(communityId);
  const [toggleJoin, { isLoading: joining }] = useToggleJoinCommunityMutation();

  const community = communityData?.data;
  const rawPosts = postsData?.data ?? [];

  const isCreator = community && user && community.creator?._id?.toString() === user._id?.toString();
  const isMember = community?.members?.some((id) => id.toString() === user?._id?.toString());

  const posts = useMemo(() => {
    const arr = [...rawPosts];
    if (filter === "New") return arr.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    if (filter === "Top") return arr.sort((a, b) => b.likes.length - a.likes.length);
    if (filter === "Best") return arr.sort((a, b) => (b.likes.length - b.dislikes.length) - (a.likes.length - a.dislikes.length));
    return arr;
  }, [rawPosts, filter]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[50vh]">
        <Icon icon="svg-spinners:ring-resize" width="40" height="40" className="text-[#FF4500]" />
      </div>
    );
  }

  if (isError || !community) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] gap-3 text-[#9A9A9A]">
        <Icon icon="material-symbols:error-outline" width="40" height="40" />
        <p className="font-semibold">Community not found</p>
        <button onClick={() => navigate(-1)} className="text-sm text-[#FF4500] hover:underline">
          Go back
        </button>
      </div>
    );
  }

  return (
    <main>

      <div className="relative mb-14">
        <div className="relative h-48 rounded-2xl overflow-hidden shadow-[0_4px_20px_rgba(255,69,0,0.15)]">
          <img
            className="w-full h-full object-cover"
            src={community.communityBanner || "./Banner1.jpg"}
            alt="banner"
          />
          <div className="absolute inset-0 bg-linear-to-t from-[#D7DADC]/50 to-transparent" />
        </div>
        <div className="absolute left-6 bottom-0 translate-y-1/2 h-[88px] w-[88px] rounded-full border-4 border-[#111111] shadow-[0_4px_20px_rgba(255,69,0,0.25)] overflow-hidden bg-[#2A2A2A]">
          <img
            className="w-full h-full object-cover"
            src={community.communityProfilePicture || "./Sharbani.png"}
            alt={community.communityName}
          />
        </div>
      </div>
      <div className="flex justify-between items-start mb-5 ml-1">
        <div className="pl-[112px]">
          <h1 className="text-2xl font-black text-[#D7DADC]">{community.communityName}</h1>
          <p className="text-sm text-[#9A9A9A] flex items-center gap-1 mt-0.5">
            <Icon icon="mdi:account-group" width="14" height="14" />
            {community.members?.length ?? 0} members
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">          {isCreator && (
            <>
              <button
                onClick={() => navigate(`/create-post?communityId=${communityId}`)}
                className="flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-semibold bg-[#FF4500] text-white hover:bg-[#CC3600] transition-colors shadow-[0_3px_12px_rgba(255,69,0,0.3)]"
              >
                <Icon icon="ic:round-plus" width="16" height="16" />
                Create Post
              </button>
              <button className="flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-semibold border border-[#3A3A3C] bg-[#1E1E1E] text-[#A83200] hover:bg-[#2A2A2A] transition-colors">
                <Icon icon="material-symbols:edit-outline" width="16" height="16" />
                Edit
              </button>
            </>
          )}
          {isMember && !isCreator && (
            <>
              <button
                onClick={() => navigate(`/create-post?communityId=${communityId}`)}
                className="flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-semibold bg-[#FF4500] text-white hover:bg-[#CC3600] transition-colors shadow-[0_3px_12px_rgba(255,69,0,0.3)]"
              >
                <Icon icon="ic:round-plus" width="16" height="16" />
                Create Post
              </button>
              <button
                onClick={() => toggleJoin(communityId)}
                disabled={joining}
                className="flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-semibold border border-[#3A3A3C] bg-[#1E1E1E] text-[#A83200] hover:bg-[#2A2A2A] transition-colors"
              >
                {joining ? (
                  <Icon icon="svg-spinners:ring-resize" width="14" height="14" />
                ) : (
                  <Icon icon="mdi:logout" width="16" height="16" />
                )}
                Leave
              </button>
            </>
          )}
          {!isMember && !isCreator && (
            <button
              onClick={() => toggleJoin(communityId)}
              disabled={joining}
              className="flex items-center gap-1.5 px-5 py-2 rounded-full text-sm font-semibold bg-[#FF4500] text-white hover:bg-[#CC3600] transition-colors shadow-[0_3px_12px_rgba(255,69,0,0.3)]"
            >
              {joining ? (
                <Icon icon="svg-spinners:ring-resize" width="14" height="14" />
              ) : (
                <Icon icon="mdi:account-plus" width="16" height="16" />
              )}
              Join
            </button>
          )}

          <button className="p-2 rounded-xl hover:bg-[#2A2A2A] transition-colors border border-[#3A3A3C] bg-[#1E1E1E]">
            <Icon className="text-[#FF4500]" icon="pepicons-pop:dots-x" width="18" height="18" />
          </button>
        </div>
      </div>
      <section className="grid grid-cols-[2.3fr_1fr] gap-5">
        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-2 border border-[#3A3A3C] bg-[#1E1E1E] rounded-xl px-3 py-2">
            {FILTERS.map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`flex items-center gap-1.5 px-4 py-1.5 rounded-full text-sm font-semibold transition-all duration-200 ${
                  filter === f
                    ? "bg-[#FF4500] text-white shadow-[0_2px_8px_rgba(255,69,0,0.3)]"
                    : "text-[#9A9A9A] hover:bg-[#2A2A2A] hover:text-[#CC3600]"
                }`}
              >
                {f === "New" && <Icon icon="mdi:clock-outline" width="14" height="14" />}
                {f === "Top" && <Icon icon="mdi:arrow-up-bold" width="14" height="14" />}
                {f === "Best" && <Icon icon="mdi:star-outline" width="14" height="14" />}
                {f}
              </button>
            ))}
          </div>
          {postsLoading ? (
            <div className="flex justify-center py-12">
              <Icon icon="svg-spinners:ring-resize" width="32" height="32" className="text-[#FF4500]" />
            </div>
          ) : posts.length === 0 ? (
            <div className="flex flex-col items-center justify-center gap-3 py-16 text-[#9A9A9A] border border-[#3A3A3C] rounded-2xl bg-[#1E1E1E]">
              <Icon icon="mdi:post-outline" width="36" height="36" />
              <p className="text-sm font-medium">No posts yet in this community</p>
              {(isCreator || isMember) && (
                <button
                  onClick={() => navigate("/create-post")}
                  className="mt-1 px-4 py-1.5 rounded-full text-sm font-semibold bg-[#FF4500] text-white hover:bg-[#CC3600] transition-colors"
                >
                  Be the first to post
                </button>
              )}
            </div>
          ) : (
            posts.map((post) => (
              <Cards
                key={post._id}
                postId={post._id}
                communitteName={community.communityName}
                username={post.creator?.username}
                creatorId={post.creator?._id}
                userProfilePic={post.creator?.userProfilePic}
                uploadedTime={timeAgo(post.createdAt)}
                titleOfPost={post.postTitle}
                description={post.postDescription}
                media={post.media ?? []}
                likes={post.likes ?? []}
                dislikes={post.dislikes ?? []}
                comments={post.comments ?? []}
                onClick={() => navigate(`/postPage/${post._id}`)}
              />
            ))
          )}
        </div>
        <div className="border border-[#3A3A3C] bg-[#1E1E1E] rounded-2xl max-h-fit sticky top-20 overflow-hidden shadow-[0_4px_20px_rgba(255,69,0,0.08)]">
          <div className="p-4 border-b border-[#3A3A3C]">
            <p className="font-black text-[#D7DADC]">About Community</p>
            <p className="text-sm text-[#A83200] mt-2.5 leading-relaxed">
              {community.communityDescription}
            </p>
            <p className="text-xs text-[#9A9A9A] mt-2 flex items-center gap-1">
              <Icon icon="mdi:calendar" width="12" height="12" />
              Created{" "}
              {new Date(community.createdAt).toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
                year: "numeric",
              })}
            </p>
            <div className="flex gap-4 mt-3">
              <div>
                <p className="font-black text-xl text-[#D7DADC]">{community.members?.length ?? 0}</p>
                <p className="text-xs text-[#9A9A9A]">Members</p>
              </div>
              <div>
                <p className="font-black text-xl text-[#D7DADC]">{posts.length}</p>
                <p className="text-xs text-[#9A9A9A]">Posts</p>
              </div>
            </div>
          </div>

          <div className="p-4">
            <p className="font-black text-sm text-[#D7DADC] uppercase tracking-wide mb-2 flex items-center gap-2">
              <Icon icon="mdi:shield-crown" width="16" height="16" className="text-[#FF4500]" />
              Created by
            </p>
            <div
              className="flex items-center gap-2 cursor-pointer hover:text-[#FF4500] transition-colors"
              onClick={() => navigate(`/userProfile/${community.creator?._id}`)}
            >
              <div className="h-7 w-7 rounded-full overflow-hidden bg-[#2A2A2A] shrink-0">
                {community.creator?.userProfilePic ? (
                  <img className="w-full h-full object-cover" src={community.creator.userProfilePic} alt="" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <Icon icon="mdi:account" width="16" height="16" className="text-[#FF4500]" />
                  </div>
                )}
              </div>
              <p className="text-sm text-[#A83200] font-medium">{community.creator?.username ?? "Unknown"}</p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
};

export default Communites;
