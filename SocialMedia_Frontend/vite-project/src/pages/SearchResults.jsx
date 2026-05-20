import { Icon } from "@iconify/react";
import React, { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import {
  useSearchAllQuery,
  useLikePostMutation,
  useDislikePostMutation,
} from "../services/postApi";
import { useToggleJoinCommunityMutation } from "../services/communitiesApi";

function timeAgo(dateStr) {
  const seconds = Math.floor((Date.now() - new Date(dateStr)) / 1000);
  if (seconds < 60) return `${seconds}s ago`;
  if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
  if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
  return `${Math.floor(seconds / 86400)}d ago`;
}

const SearchPostCard = ({ post }) => {
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);
  const [localLikes, setLocalLikes] = useState(post.likes ?? []);
  const [localDislikes, setLocalDislikes] = useState(post.dislikes ?? []);
  const [likePost] = useLikePostMutation();
  const [dislikePost] = useDislikePostMutation();

  const isLiked = localLikes.some((id) => id.toString() === user?._id);
  const isDisliked = localDislikes.some((id) => id.toString() === user?._id);
  const score = localLikes.length - localDislikes.length;
  const thumbnail = post.media?.[0];

  const handleLike = (e) => {
    e.stopPropagation();
    if (!user?._id) return;
    if (isLiked) {
      setLocalLikes((prev) => prev.filter((id) => id.toString() !== user._id));
    } else {
      setLocalLikes((prev) => [...prev, user._id]);
      if (isDisliked)
        setLocalDislikes((prev) =>
          prev.filter((id) => id.toString() !== user._id),
        );
    }
    likePost(post._id);
  };

  const handleDislike = (e) => {
    e.stopPropagation();
    if (!user?._id) return;
    if (isDisliked) {
      setLocalDislikes((prev) =>
        prev.filter((id) => id.toString() !== user._id),
      );
    } else {
      setLocalDislikes((prev) => [...prev, user._id]);
      if (isLiked)
        setLocalLikes((prev) =>
          prev.filter((id) => id.toString() !== user._id),
        );
    }
    dislikePost(post._id);
  };

  return (
    <div
      onClick={() => navigate(`/postPage/${post._id}`)}
      className="flex bg-[#FFF5F6] border border-[#FECDD3] rounded-xl hover:border-[#FDA4AF] hover:shadow-[0_4px_16px_rgba(225,29,72,0.1)] transition-all duration-200 cursor-pointer overflow-hidden"
    >
      <div className="flex flex-col items-center gap-0.5 px-2 py-3 bg-[#FFF1F2] min-w-[44px] shrink-0">
        <button
          onClick={handleLike}
          className={`p-1 rounded transition-colors ${
            isLiked
              ? "text-[#E11D48]"
              : "text-[#FDA4AF] hover:text-[#E11D48] hover:bg-[#FFE4E6]"
          }`}
        >
          <Icon icon="mdi:arrow-up-bold" width="18" height="18" />
        </button>
        <span
          className={`text-xs font-black ${
            score > 0
              ? "text-[#E11D48]"
              : score < 0
                ? "text-blue-500"
                : "text-[#BE7090]"
          }`}
        >
          {score}
        </span>
        <button
          onClick={handleDislike}
          className={`p-1 rounded transition-colors ${
            isDisliked
              ? "text-blue-500"
              : "text-[#FDA4AF] hover:text-blue-500 hover:bg-blue-50"
          }`}
        >
          <Icon icon="mdi:arrow-down-bold" width="18" height="18" />
        </button>
      </div>

      <div className="flex-1 p-3 min-w-0">
        <div className="flex items-center gap-1 text-xs text-[#BE7090] mb-1.5 flex-wrap">
          {post.community && (
            <>
              <div className="h-4 w-4 rounded-full overflow-hidden bg-[#FFE4E6] shrink-0 flex items-center justify-center">
                {post.community.communityProfilePicture ? (
                  <img
                    src={post.community.communityProfilePicture}
                    alt=""
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <Icon
                    icon="mdi:account-group"
                    width="10"
                    height="10"
                    className="text-[#E11D48]"
                  />
                )}
              </div>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  navigate(`/communities/${post.community._id}`);
                }}
                className="font-semibold text-[#9F1239] hover:text-[#E11D48] hover:underline"
              >
                c/{post.community.communityName}
              </button>
              <span className="text-[#FECDD3]">·</span>
            </>
          )}
          <span>Posted by</span>
          <button
            onClick={(e) => {
              e.stopPropagation();
              navigate(`/userProfile/${post.creator?._id}`);
            }}
            className="hover:text-[#E11D48] hover:underline"
          >
            u/{post.creator?.username}
          </button>
          <span className="text-[#FECDD3]">·</span>
          <span>{timeAgo(post.createdAt)}</span>
        </div>

        <h2 className="font-bold text-[#1C0714] text-sm leading-snug mb-1 line-clamp-2">
          {post.postTitle || post.postDescription}
        </h2>
        {post.postDescription && post.postTitle && (
          <p className="text-xs text-[#BE7090] line-clamp-2 mb-2 leading-relaxed">
            {post.postDescription}
          </p>
        )}

        <div className="flex items-center gap-1 mt-2">
          <button
            className="flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold text-[#BE7090] hover:bg-[#FFE4E6] hover:text-[#BE123C] transition-colors"
            onClick={(e) => {
              e.stopPropagation();
              navigate(`/postPage/${post._id}`);
            }}
          >
            <Icon icon="mdi:comments-outline" width="13" height="13" />
            {post.comments?.length ?? 0} Comments
          </button>
          <button
            className="flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold text-[#BE7090] hover:bg-[#FFE4E6] hover:text-[#BE123C] transition-colors"
            onClick={(e) => e.stopPropagation()}
          >
            <Icon icon="tabler:share" width="13" height="13" />
            Share
          </button>
        </div>
      </div>

      {thumbnail && (
        <div className="shrink-0 w-20 h-20 m-3 rounded-lg overflow-hidden bg-[#FFE4E6] self-center">
          {thumbnail.type === "image" ? (
            <img
              src={thumbnail.url}
              alt=""
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-[#1C0714]">
              <Icon
                icon="mdi:play-circle"
                width="24"
                height="24"
                className="text-white/80"
              />
            </div>
          )}
        </div>
      )}
    </div>
  );
};

const SearchCommunityCard = ({ community }) => {
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);
  const [toggleJoin, { isLoading: joining }] = useToggleJoinCommunityMutation();
  const [isMember, setIsMember] = useState(
    community.members?.some((id) => id.toString() === user?._id?.toString()) ??
      false,
  );
  const [memberCount, setMemberCount] = useState(
    community.members?.length ?? 0,
  );

  const handleToggleJoin = async (e) => {
    e.stopPropagation();
    setIsMember((prev) => !prev);
    setMemberCount((prev) => (isMember ? prev - 1 : prev + 1));
    try {
      await toggleJoin(community._id).unwrap();
    } catch {
      setIsMember((prev) => !prev);
      setMemberCount((prev) => (isMember ? prev + 1 : prev - 1));
    }
  };

  return (
    <div className="bg-[#FFF5F6] border border-[#FECDD3] rounded-xl overflow-hidden hover:border-[#FDA4AF] hover:shadow-[0_4px_16px_rgba(225,29,72,0.1)] transition-all duration-200">
      <div
        className="h-14 w-full relative cursor-pointer"
        onClick={() => navigate(`/communities/${community._id}`)}
      >
        {community.communityBanner ? (
          <img
            src={community.communityBanner}
            alt=""
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-r from-[#E11D48] to-[#FB7185]" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
      </div>
      <div className="px-3 pb-3 pt-1 flex items-start gap-3">
        <div
          className="shrink-0 h-11 w-11 rounded-full border-2 border-[#FFF5F6] overflow-hidden bg-[#FFE4E6] -mt-6 cursor-pointer shadow-[0_2px_8px_rgba(225,29,72,0.2)] z-10"
          onClick={() => navigate(`/communities/${community._id}`)}
        >
          {community.communityProfilePicture ? (
            <img
              src={community.communityProfilePicture}
              alt=""
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-[#E11D48]">
              <Icon
                icon="mdi:account-group"
                width="18"
                height="18"
                className="text-white"
              />
            </div>
          )}
        </div>

        <div className="flex-1 min-w-0 mt-1">
          <div className="flex items-start justify-between gap-2">
            <div className="min-w-0">
              <button
                onClick={() => navigate(`/communities/${community._id}`)}
                className="font-bold text-[#1C0714] hover:text-[#E11D48] transition-colors text-sm leading-tight truncate block max-w-full"
              >
                c/{community.communityName}
              </button>
              <p className="text-xs text-[#BE7090] flex items-center gap-1 mt-0.5">
                <Icon icon="mdi:account-group" width="11" height="11" />
                {memberCount} members
              </p>
            </div>
            <button
              onClick={handleToggleJoin}
              disabled={joining}
              className={`shrink-0 px-4 py-1.5 rounded-full text-xs font-bold transition-all duration-200 ${
                isMember
                  ? "border border-[#E11D48] text-[#E11D48] hover:bg-[#FFE4E6]"
                  : "bg-[#E11D48] text-white hover:bg-[#BE123C] shadow-[0_2px_8px_rgba(225,29,72,0.3)]"
              }`}
            >
              {joining ? (
                <Icon icon="svg-spinners:ring-resize" width="12" height="12" />
              ) : isMember ? (
                "Joined"
              ) : (
                "Join"
              )}
            </button>
          </div>
          <p className="text-xs text-[#9F1239] mt-1.5 line-clamp-2 leading-relaxed">
            {community.communityDescription}
          </p>
        </div>
      </div>
    </div>
  );
};

const TABS = ["All", "Posts", "Communities"];

const SearchResults = () => {
  const [searchParams] = useSearchParams();
  const q = searchParams.get("q") || "";
  const [tab, setTab] = useState("All");
  const navigate = useNavigate();

  useEffect(() => {
    setTab("All");
  }, [q]);

  const { data, isLoading, isError } = useSearchAllQuery(q, { skip: !q });

  const posts = data?.data?.posts ?? [];
  const communities = data?.data?.communities ?? [];
  const showPosts = tab === "All" || tab === "Posts";
  const showCommunities = tab === "All" || tab === "Communities";

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-5">
        <p className="text-xs font-semibold text-[#FDA4AF] uppercase tracking-widest mb-1">
          Search results for
        </p>
        <h1 className="text-2xl font-black text-[#1C0714]">"{q}"</h1>
        {!isLoading && !isError && (
          <p className="text-sm text-[#BE7090] mt-1">
            {posts.length + communities.length} results
          </p>
        )}
      </div>

      <div className="flex items-center gap-1 border border-[#FECDD3] bg-[#FFF5F6] rounded-xl px-2 py-2 mb-5">
        {TABS.map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`flex-1 py-1.5 rounded-lg text-sm font-semibold transition-all duration-200 ${
              tab === t
                ? "bg-[#E11D48] text-white shadow-[0_2px_8px_rgba(225,29,72,0.3)]"
                : "text-[#BE7090] hover:bg-[#FFE4E6] hover:text-[#BE123C]"
            }`}
          >
            {t}
            {t === "Posts" && posts.length > 0 && (
              <span className="ml-1.5 text-xs opacity-70">
                ({posts.length})
              </span>
            )}
            {t === "Communities" && communities.length > 0 && (
              <span className="ml-1.5 text-xs opacity-70">
                ({communities.length})
              </span>
            )}
          </button>
        ))}
      </div>

      {isLoading && (
        <div className="flex justify-center py-16">
          <Icon
            icon="svg-spinners:ring-resize"
            width="36"
            height="36"
            className="text-[#E11D48]"
          />
        </div>
      )}
      {isError && (
        <div className="flex flex-col items-center gap-3 py-12 text-[#BE7090]">
          <Icon icon="material-symbols:error-outline" width="40" height="40" />
          <p className="font-semibold">
            Something went wrong. Please try again.
          </p>
        </div>
      )}

      {!q && !isLoading && (
        <div className="flex flex-col items-center gap-4 py-16 text-[#BE7090]">
          <Icon icon="mdi:magnify" width="48" height="48" />
          <div className="text-center">
            <p className="font-bold text-[#9F1239]">Start searching</p>
            <p className="text-sm mt-1">
              Search for posts and communities above
            </p>
          </div>
        </div>
      )}

      {q &&
        !isLoading &&
        !isError &&
        posts.length === 0 &&
        communities.length === 0 && (
          <div className="flex flex-col items-center gap-4 py-16 text-[#BE7090]">
            <Icon icon="mdi:magnify-close" width="48" height="48" />
            <div className="text-center">
              <p className="font-bold text-[#9F1239]">No results for "{q}"</p>
              <p className="text-sm mt-1">
                Try different keywords or check the spelling
              </p>
            </div>
            <button
              onClick={() => navigate("/")}
              className="mt-1 px-5 py-2 rounded-full bg-[#E11D48] text-white text-sm font-semibold hover:bg-[#BE123C] transition-colors"
            >
              Back to Home
            </button>
          </div>
        )}

      {!isLoading &&
        !isError &&
        (posts.length > 0 || communities.length > 0) && (
          <div className="flex flex-col gap-6">
            {showCommunities && communities.length > 0 && (
              <div>
                {tab === "All" && (
                  <div className="flex items-center justify-between mb-3">
                    <h2 className="font-black text-[#1C0714] text-xs uppercase tracking-widest flex items-center gap-2">
                      <Icon
                        icon="mdi:account-group"
                        width="15"
                        height="15"
                        className="text-[#E11D48]"
                      />
                      Communities
                    </h2>
                    {communities.length > 3 && (
                      <button
                        onClick={() => setTab("Communities")}
                        className="text-xs text-[#E11D48] font-semibold hover:underline"
                      >
                        See all {communities.length}
                      </button>
                    )}
                  </div>
                )}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {(tab === "All" ? communities.slice(0, 4) : communities).map(
                    (c) => (
                      <SearchCommunityCard key={c._id} community={c} />
                    ),
                  )}
                </div>
              </div>
            )}

            {showPosts && posts.length > 0 && (
              <div>
                {tab === "All" && (
                  <div className="flex items-center justify-between mb-3">
                    <h2 className="font-black text-[#1C0714] text-xs uppercase tracking-widest flex items-center gap-2">
                      <Icon
                        icon="mdi:post-outline"
                        width="15"
                        height="15"
                        className="text-[#E11D48]"
                      />
                      Posts
                    </h2>
                    {posts.length > 5 && (
                      <button
                        onClick={() => setTab("Posts")}
                        className="text-xs text-[#E11D48] font-semibold hover:underline"
                      >
                        See all {posts.length}
                      </button>
                    )}
                  </div>
                )}
                <div className="flex flex-col gap-2">
                  {(tab === "All" ? posts.slice(0, 5) : posts).map((p) => (
                    <SearchPostCard key={p._id} post={p} />
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
    </div>
  );
};

export default SearchResults;
