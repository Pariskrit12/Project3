import React from "react";
import Cards from "../components/HomeComponents/Cards";
import { Icon } from "@iconify/react";
import { useGetAllPostsQuery } from "../services/postsApi";
import formatTime from "../utils/formatTime";
import { useNavigate } from "react-router-dom";

const Trending = () => {
  const { data, isLoading, isError } = useGetAllPostsQuery();
  const navigate = useNavigate();

  const posts = data?.data || [];

  return (
    <main className="flex flex-col gap-5">
      <div className="flex items-center gap-3">
        <div className="bg-linear-to-br from-[#AF503A] to-[#E8963A] p-2.5 rounded-xl shadow-[0_3px_12px_rgba(164,57,25,0.3)]">
          <Icon icon="mingcute:trending-up-fill" width="20" height="20" className="text-white" />
        </div>
        <div>
          <h1 className="font-black text-2xl text-[#1C0F08]">Trending</h1>
          <p className="text-sm text-[#9C7E6D]">What everyone is talking about</p>
        </div>
      </div>

      {isLoading && (
        <div className="flex justify-center py-20">
          <Icon icon="svg-spinners:ring-resize" width="36" height="36" className="text-[#AF503A]" />
        </div>
      )}

      {isError && (
        <div className="flex flex-col items-center gap-2 py-20 text-[#C9A88A]">
          <Icon icon="material-symbols:error-outline" width="32" height="32" />
          <p className="text-sm font-medium">Failed to load trending posts</p>
        </div>
      )}

      {!isLoading && !isError && posts.length === 0 && (
        <div className="flex flex-col items-center gap-2 py-20 text-[#C9A88A]">
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
