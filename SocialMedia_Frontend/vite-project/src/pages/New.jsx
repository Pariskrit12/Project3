import React from "react";
import Cards from "../components/HomeComponents/Cards";
import { Icon } from "@iconify/react";
import { useNavigate } from "react-router-dom";
import { useGetNewPostsQuery } from "../services/postApi";
import formatTime from "../utils/formatTime";

const New = () => {
  const navigate = useNavigate();
  const { data, isLoading, isError } = useGetNewPostsQuery();
  const posts = data?.data?.posts ?? [];

  return (
    <main className="flex flex-col gap-5">
      <div className="flex items-center gap-3">
        <div className="bg-linear-to-br from-[#FB7185] to-[#E11D48] p-2.5 rounded-xl shadow-[0_3px_12px_rgba(225,29,72,0.3)]">
          <Icon icon="fluent:new-16-filled" width="20" height="20" className="text-white" />
        </div>
        <div>
          <h1 className="font-black text-2xl text-[#1C0714]">New Posts</h1>
          <p className="text-sm text-[#BE7090]">Fresh from the community</p>
        </div>
      </div>

      {isLoading && (
        <div className="flex justify-center py-20">
          <Icon icon="svg-spinners:ring-resize" width="36" height="36" className="text-[#E11D48]" />
        </div>
      )}

      {isError && (
        <div className="flex flex-col items-center gap-2 py-20 text-[#FDA4AF]">
          <Icon icon="material-symbols:error-outline" width="32" height="32" />
          <p className="text-sm font-medium">Failed to load new posts</p>
        </div>
      )}

      {!isLoading && !isError && posts.length === 0 && (
        <div className="flex flex-col items-center gap-2 py-20 text-[#FDA4AF]">
          <Icon icon="fluent:new-16-filled" width="32" height="32" />
          <p className="text-sm font-medium">No new posts yet</p>
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

export default New;
