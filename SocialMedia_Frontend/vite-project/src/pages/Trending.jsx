import React from "react";
import Cards from "../components/HomeComponents/Cards";
import { Icon } from "@iconify/react";
import { useGetTopPostsQuery } from "../services/postApi";
import formatTime from "../utils/formatTime";
import { useNavigate } from "react-router-dom";

const Trending = () => {
  const { data, isLoading, isError } = useGetTopPostsQuery();
  const navigate = useNavigate();

  const posts = data?.data?.posts ?? [];

  return (
    <main className="flex flex-col gap-5">
      <div className="flex items-center gap-3">
        <div className="bg-linear-to-br from-[#E11D48] to-[#BE123C] p-2.5 rounded-xl shadow-[0_3px_12px_rgba(225,29,72,0.3)]">
          <Icon icon="mingcute:trending-up-fill" width="20" height="20" className="text-white" />
        </div>
        <div>
          <h1 className="font-black text-2xl text-[#1C0714]">Trending</h1>
          <p className="text-sm text-[#BE7090]">What everyone is talking about</p>
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
          <p className="text-sm font-medium">Failed to load trending posts</p>
        </div>
      )}

      {!isLoading && !isError && posts.length === 0 && (
        <div className="flex flex-col items-center gap-2 py-20 text-[#FDA4AF]">
          <Icon icon="mingcute:trending-up-fill" width="32" height="32" />
          <p className="text-sm font-medium">No trending posts yet</p>
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
            media={post.media || []}
            description={post.postDescription}
            likes={post.likes}
            dislikes={post.dislikes}
            onClick={() => navigate(`/postPage/${post._id}`)}
          />
        ))}
      </section>
    </main>
  );
};

export default Trending;
