import React from "react";
import Cards from "../components/HomeComponents/Cards";
import { Icon } from "@iconify/react";
import { useNavigate } from "react-router-dom";
import { useGetTopPostsQuery } from "../services/postApi";
import formatTime from "../utils/formatTime";

const Top = () => {
  const navigate = useNavigate();
  const { data, isLoading, isError } = useGetTopPostsQuery();
  const posts = data?.data?.posts ?? [];

  return (
    <main className="flex flex-col gap-5">
      <div className="flex items-center gap-3">
        <div className="bg-[#FF4500] p-2.5 rounded-xl shadow-[0_3px_12px_rgba(255,69,0,0.3)]">
          <Icon icon="mdi:arrow-up-bold-circle" width="20" height="20" className="text-white" />
        </div>
        <div>
          <h1 className="font-black text-2xl text-[#1C1C1C]">Top Posts</h1>
          <p className="text-sm text-[#878A8C]">Most liked across the community</p>
        </div>
      </div>

      {isLoading && (
        <div className="flex justify-center py-20">
          <Icon icon="svg-spinners:ring-resize" width="36" height="36" className="text-[#FF4500]" />
        </div>
      )}

      {isError && (
        <div className="flex flex-col items-center gap-2 py-20 text-[#878A8C]">
          <Icon icon="material-symbols:error-outline" width="32" height="32" />
          <p className="text-sm font-medium">Failed to load top posts</p>
        </div>
      )}

      {!isLoading && !isError && posts.length === 0 && (
        <div className="flex flex-col items-center gap-2 py-20 text-[#878A8C]">
          <Icon icon="mdi:arrow-up-bold-circle" width="32" height="32" />
          <p className="text-sm font-medium">No top posts yet</p>
        </div>
      )}

      <section className="grid grid-cols-1 gap-4">
        {posts.map((post) => (
          <Cards
            key={post._id}
            postId={post._id}
            communitteName={post.community?.communityName}
            username={post.creator?.username}
            creatorId={post.creator?._id}
            userProfilePic={post.creator?.userProfilePic}
            uploadedTime={formatTime(post.createdAt)}
            titleOfPost={post.postTitle}
            description={post.postDescription}
            media={post.media ?? []}
            likes={post.likes ?? []}
            dislikes={post.dislikes ?? []}
            comments={post.comments ?? []}
            onClick={() => navigate(`/postPage/${post._id}`)}
          />
        ))}
      </section>
    </main>
  );
};

export default Top;
