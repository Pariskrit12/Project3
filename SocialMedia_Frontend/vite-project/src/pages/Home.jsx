import React, { useState } from "react";
import Cards from "../components/HomeComponents/Cards";
import { Icon } from "@iconify/react";
import { useNavigate } from "react-router-dom";
import Input from "../components/common/Input";
import { useGetAllPostsQuery } from "../services/postsApi";
import formatTime from "../utils/formatTime";

const Home = () => {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");

  const { data, isLoading, isError } = useGetAllPostsQuery();

  return (
    <main className="flex flex-col gap-5">
      <section
        onClick={() => setOpen(true)}
        className="rounded-2xl overflow-hidden shadow-[0_3px_16px_rgba(164,57,25,0.15)]"
      >
        {open ? (
          <Input
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search anything..."
            icon="material-symbols:search"
            value={search}
            className="rounded-2xl border-2 border-[#AF503A] bg-white shadow-none"
          />
        ) : (
          <div className="flex items-center gap-3 w-full py-3.5 px-5 rounded-2xl bg-linear-to-r from-[#AF503A] via-[#C7604A] to-[#E8963A] cursor-pointer group">
            <Icon icon="material-symbols:search" width="22" height="22" className="text-white/80" />
            <span className="text-white/80 font-medium text-sm flex-1">Find anything...</span>
            <Icon icon="ph:magnifying-glass-bold" width="18" height="18" className="text-white/60" />
          </div>
        )}
      </section>

      <section className="flex items-center gap-2">
        {["Hot", "New", "Top", "Rising"].map((tab, i) => (
          <button
            key={i}
            onClick={() => i > 0 && navigate(`/${tab.toLowerCase()}`)}
            className={`px-3.5 py-1.5 rounded-full text-sm font-semibold transition-all duration-200 ${
              i === 0
                ? "bg-linear-to-r from-[#AF503A] to-[#C7604A] text-white shadow-[0_2px_8px_rgba(164,57,25,0.3)]"
                : "bg-[#F0E6DD] text-[#4A2C1D] hover:bg-[#FAEBD8] hover:text-[#A43919]"
            }`}
          >
            {tab}
          </button>
        ))}
      </section>

      <section className="grid grid-cols-1 gap-4">
        {isLoading && (
          <div className="flex justify-center py-10">
            <Icon icon="svg-spinners:ring-resize" width="36" height="36" className="text-[#AF503A]" />
          </div>
        )}
        {isError && (
          <div className="flex flex-col items-center gap-2 py-10 text-[#C9A88A]">
            <Icon icon="material-symbols:error-outline" width="32" height="32" />
            <p className="text-sm font-medium">Failed to load posts</p>
          </div>
        )}
        {!isLoading && !isError && data?.data?.length === 0 && (
          <div className="flex flex-col items-center gap-2 py-10 text-[#C9A88A]">
            <Icon icon="mdi:post-outline" width="32" height="32" />
            <p className="text-sm font-medium">No posts yet</p>
          </div>
        )}
        {data?.data?.map((post) => (
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
            onClick={() => navigate(`/postPage/${post._id}`)}

          />
        ))}
      </section>
    </main>
  );
};

export default Home;
