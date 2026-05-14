import React, { useState } from "react";
import { useParams } from "react-router-dom";
import Cards from "../components/HomeComponents/Cards";
import CommentInput from "../components/common/CommentInput";
import { Icon } from "@iconify/react";
import { useGetPostQuery } from "../services/postsApi";
import formatTime from "../utils/formatTime";

const Postpage = () => {
  const { postId } = useParams();
  const [comment, setComment] = useState("");
  const { data, isLoading, isError } = useGetPostQuery(postId);

  const post = data?.data;

  if (isLoading) {
    return (
      <div className="flex justify-center py-20">
        <Icon icon="svg-spinners:ring-resize" width="36" height="36" className="text-[#AF503A]" />
      </div>
    );
  }

  if (isError || !post) {
    return (
      <div className="flex flex-col items-center gap-2 py-20 text-[#C9A88A]">
        <Icon icon="material-symbols:error-outline" width="32" height="32" />
        <p className="text-sm font-medium">Post not found</p>
      </div>
    );
  }

  return (
    <main className="flex flex-col gap-5 max-w-2xl">
      <section>
        <Cards
          showFull={true}
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
        />
      </section>

      <section className="flex flex-col gap-4">
        <div className="flex items-center gap-2">
          <h2 className="font-black text-lg text-[#1C0F08]">Comments</h2>
          <span className="bg-[#F0E6DD] text-[#A43919] text-xs font-bold px-2.5 py-0.5 rounded-full">
            {post.comments?.length ?? 0}
          </span>
        </div>
        <CommentInput
          placeholder="Write a comment..."
          onChange={(e) => setComment(e.target.value)}
          value={comment}
        />

        <div className="flex flex-col gap-3 mt-2">
          {post.comments?.length === 0 && (
            <p className="text-sm text-[#C9A88A] text-center py-4">No comments yet. Be the first!</p>
          )}
          {post.comments?.map((c, i) => (
            <div key={c._id ?? i} className="flex gap-3 p-4 bg-[#FFFCF9] border border-[#EDD9C8] rounded-2xl">
              <div className="shrink-0 h-9 w-9 rounded-full overflow-hidden bg-linear-to-br from-[#C7604A] to-[#8B3010] flex items-center justify-center border border-[#EDD9C8]">
                {c.creator?.userProfilePic ? (
                  <img src={c.creator.userProfilePic} alt="avatar" className="w-full h-full object-cover" />
                ) : (
                  <Icon icon="mdi:account" width="18" height="18" className="text-white" />
                )}
              </div>
              <div className="flex flex-col gap-1 flex-1">
                <div className="flex items-center gap-2">
                  <p className="font-bold text-sm text-[#1C0F08]">{c.creator?.username ?? "user"}</p>
                  <p className="text-xs text-[#C9A88A]">{formatTime(c.createdAt)}</p>
                </div>
                <p className="text-sm text-[#4A2C1D] leading-relaxed">{c.content}</p>
                <div className="flex items-center gap-3 mt-1">
                  <button className="flex items-center gap-1 text-xs text-[#9C7E6D] hover:text-[#A43919] transition-colors">
                    <Icon icon="boxicons:like" width="14" height="14" />
                    <span>{c.likes?.length ?? 0}</span>
                  </button>
                  <button className="text-xs text-[#9C7E6D] hover:text-[#A43919] transition-colors font-medium">
                    Reply
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
};

export default Postpage;
