import React from "react";
import Cards from "../components/HomeComponents/Cards";
import { Icon } from "@iconify/react";
import { useNavigate } from "react-router-dom";
import { useGetFeedQuery } from "../services/postApi";
import formatTime from "../utils/formatTime";

const Home = () => {
  const navigate = useNavigate();
  const { data, isLoading, isError } = useGetFeedQuery();
  const posts = data?.data?.posts ?? [];

  return (
    <main className="flex flex-col gap-5">
      <section className="grid grid-cols-1 gap-4">
        {isLoading && (
          <div className="flex justify-center py-10">
            <Icon
              icon="svg-spinners:ring-resize"
              width="36"
              height="36"
              className="text-[#FF4500]"
            />
          </div>
        )}
        {isError && (
          <div className="flex flex-col items-center gap-2 py-10 text-[#9A9A9A]">
            <Icon icon="material-symbols:error-outline" width="32" height="32" />
            <p className="text-sm font-medium">Failed to load posts</p>
          </div>
        )}
        {!isLoading && !isError && posts.length === 0 && (
          <div className="flex flex-col items-center gap-2 py-10 text-[#9A9A9A]">
            <Icon icon="mdi:post-outline" width="32" height="32" />
            <p className="text-sm font-medium">No posts yet</p>
          </div>
        )}
        {posts.map((post) => (
          <Cards
            key={post._id}
            postId={post._id}
            communitteName={post.community?.communityName}
            media={post.media || []}
            description={post.postDescription}
            titleOfPost={post.postTitle}
            username={post.creator?.username}
            creatorId={post.creator?._id}
            uploadedTime={formatTime(post.createdAt)}
            userProfilePic={post.creator?.userProfilePic}
            likes={post.likes}
            dislikes={post.dislikes}
            comments={post.comments ?? []}
            onClick={() => navigate(`/postPage/${post._id}`)}
          />
        ))}
      </section>
    </main>
  );
};

export default Home;
