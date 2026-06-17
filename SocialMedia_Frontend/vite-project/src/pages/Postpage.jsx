import React, { useState } from "react";
import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import Cards from "../components/HomeComponents/Cards";
import CommentInput from "../components/common/CommentInput";
import { Icon } from "@iconify/react";
import { useGetPostQuery } from "../services/postApi";
import {
  useGetCommentsQuery,
  useDeleteCommentMutation,
  useUpdateCommentMutation,
  useLikeCommentMutation,
  useDislikeCommentMutation,
} from "../services/commentsApi";
import formatTime from "../utils/formatTime";

const Postpage = () => {
  const { postId } = useParams();
  const { user } = useSelector((state) => state.auth);
  const [openDropdownId, setOpenDropdownId] = useState(null);
  const [editingCommentId, setEditingCommentId] = useState(null);
  const [editText, setEditText] = useState("");

  const { data: postData, isLoading: postLoading, isError: postError } =
    useGetPostQuery(postId);
  const { data: commentsData, isLoading: commentsLoading } =
    useGetCommentsQuery(postId);
  const [deleteComment] = useDeleteCommentMutation();
  const [updateComment, { isLoading: updating }] = useUpdateCommentMutation();
  const [likeComment] = useLikeCommentMutation();
  const [dislikeComment] = useDislikeCommentMutation();

  const post = postData?.data;
  const comments = commentsData?.data?.comments ?? [];
  const isPostOwner =
    user && post && user._id === post.creator?._id?.toString();

  const handleDelete = async (commentId) => {
    setOpenDropdownId(null);
    await deleteComment({ postId, commentId });
  };

  const handleEditStart = (comment) => {
    setEditingCommentId(comment._id);
    setEditText(comment.description);
    setOpenDropdownId(null);
  };

  const handleEditSave = async (commentId) => {
    if (!editText.trim()) return;
    const formData = new FormData();
    formData.append("description", editText);
    await updateComment({ postId, commentId, formData });
    setEditingCommentId(null);
  };

  if (postLoading) {
    return (
      <div className="flex justify-center py-20">
        <Icon
          icon="svg-spinners:ring-resize"
          width="36"
          height="36"
          className="text-[#FF4500]"
        />
      </div>
    );
  }

  if (postError || !post) {
    return (
      <div className="flex flex-col items-center gap-2 py-20 text-[#878A8C]">
        <Icon icon="material-symbols:error-outline" width="32" height="32" />
        <p className="text-sm font-medium">Post not found</p>
      </div>
    );
  }

  return (
    <main className="w-full flex flex-col gap-6">
      {/* Post card — full width */}
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
          comments={post.comments ?? []}
        />
      </section>

      {/* Comments section */}
      <section className="flex flex-col gap-5 bg-[#FFFFFF] border border-[#EDEFF1] rounded-2xl p-5 shadow-[0_2px_16px_rgba(255,69,0,0.07)]">
        {/* Header */}
        <div className="flex items-center gap-3 pb-4 border-b border-[#E5E6EA]">
          <Icon icon="mdi:comments-outline" width="22" height="22" className="text-[#FF4500]" />
          <h2 className="font-black text-lg text-[#1C1C1C]">Comments</h2>
          <span className="bg-[#E5E6EA] text-[#CC3600] text-xs font-bold px-2.5 py-0.5 rounded-full">
            {commentsData?.data?.totalComments ?? 0}
          </span>
        </div>

        {/* Comment input */}
        <CommentInput postId={postId} currentUser={user} />

        {/* transparent overlay to close dropdown on outside click */}
        {openDropdownId && (
          <div
            className="fixed inset-0 z-10"
            onClick={() => setOpenDropdownId(null)}
          />
        )}

        {/* Comment list */}
        <div className="flex flex-col gap-3">
          {commentsLoading && (
            <div className="flex justify-center py-6">
              <Icon
                icon="svg-spinners:ring-resize"
                width="24"
                height="24"
                className="text-[#FF4500]"
              />
            </div>
          )}

          {!commentsLoading && comments.length === 0 && (
            <div className="flex flex-col items-center gap-2 py-8 text-[#878A8C]">
              <Icon icon="mdi:comment-outline" width="32" height="32" />
              <p className="text-sm font-medium">No comments yet. Be the first!</p>
            </div>
          )}

          {comments.map((c) => {
            const isCommentOwner =
              user && c.creator?._id?.toString() === user._id?.toString();
            const canDelete = isCommentOwner || isPostOwner;
            const isEditing = editingCommentId === c._id;
            const isLiked = c.likes?.some(
              (id) => id.toString() === user?._id?.toString()
            );

            return (
              <div
                key={c._id}
                className={`relative flex gap-3 p-4 bg-white border border-[#EDEFF1] rounded-2xl transition-opacity ${
                  c.isOptimistic ? "opacity-60" : "opacity-100"
                }`}
              >
                {/* Avatar */}
                <div className="shrink-0 h-9 w-9 rounded-full overflow-hidden bg-linear-to-br from-[#FF6534] to-[#CC3600] flex items-center justify-center border border-[#EDEFF1] ring-2 ring-[#FF6534] ring-offset-1">
                  {c.creator?.userProfilePic ? (
                    <img
                      src={c.creator.userProfilePic}
                      alt="avatar"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <Icon
                      icon="mdi:account"
                      width="18"
                      height="18"
                      className="text-white"
                    />
                  )}
                </div>

                <div className="flex flex-col gap-1 flex-1 min-w-0">
                  {/* Top row: name + time + menu */}
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <p className="font-bold text-sm text-[#1C1C1C]">
                        {c.creator?.username ?? "user"}
                      </p>
                      <span className="w-1 h-1 rounded-full bg-[#EDEFF1]" />
                      <p className="text-xs text-[#878A8C]">
                        {formatTime(c.createdAt)}
                      </p>
                    </div>

                    {(isCommentOwner || canDelete) && !c.isOptimistic && (
                      <div className="relative z-20">
                        <button
                          onClick={() =>
                            setOpenDropdownId(
                              openDropdownId === c._id ? null : c._id
                            )
                          }
                          className="p-1 rounded-lg hover:bg-[#E5E6EA] text-[#878A8C] hover:text-[#CC3600] transition-colors"
                        >
                          <Icon
                            icon="mdi:dots-horizontal"
                            width="18"
                            height="18"
                          />
                        </button>

                        {openDropdownId === c._id && (
                          <div className="absolute right-0 top-8 z-20 bg-white border border-[#EDEFF1] rounded-xl shadow-lg overflow-hidden min-w-32.5">
                            {isCommentOwner && (
                              <button
                                onClick={() => handleEditStart(c)}
                                className="flex items-center gap-2 w-full px-3 py-2 text-sm text-[#1C1C1C] hover:bg-[#E5E6EA] transition-colors"
                              >
                                <Icon
                                  icon="mdi:pencil"
                                  width="15"
                                  height="15"
                                  className="text-[#FF4500]"
                                />
                                Edit
                              </button>
                            )}
                            {canDelete && (
                              <button
                                onClick={() => handleDelete(c._id)}
                                className="flex items-center gap-2 w-full px-3 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
                              >
                                <Icon
                                  icon="mdi:trash-can-outline"
                                  width="15"
                                  height="15"
                                />
                                Delete
                              </button>
                            )}
                          </div>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Comment body */}
                  {isEditing ? (
                    <div className="flex flex-col gap-2 mt-1">
                      <textarea
                        value={editText}
                        onChange={(e) => setEditText(e.target.value)}
                        className="w-full border border-[#EDEFF1] rounded-lg p-2 text-sm text-[#1C1C1C] outline-none focus:border-[#FF4500] resize-none bg-[#FFFFFF]"
                        rows={2}
                        autoFocus
                      />
                      <div className="flex gap-2 justify-end">
                        <button
                          onClick={() => setEditingCommentId(null)}
                          className="px-3 py-1 text-xs rounded-full bg-[#E5E6EA] text-[#A83200] font-semibold transition-colors"
                        >
                          Cancel
                        </button>
                        <button
                          onClick={() => handleEditSave(c._id)}
                          disabled={updating}
                          className="px-3 py-1 text-xs rounded-full bg-[#FF4500] text-white font-semibold disabled:opacity-60 transition-colors"
                        >
                          {updating ? "Saving..." : "Save"}
                        </button>
                      </div>
                    </div>
                  ) : (
                    <p className="text-sm text-[#3D0A1E] leading-relaxed">
                      {c.description}
                    </p>
                  )}

                  {/* Action row */}
                  <div className="flex items-center gap-2 mt-2 pt-2 border-t border-[#E5E6EA]">
                    <button
                      onClick={() =>
                        !c.isOptimistic &&
                        likeComment({ postId, commentId: c._id })
                      }
                      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold transition-all duration-200 ${
                        isLiked
                          ? "bg-[#E5E6EA] text-[#CC3600]"
                          : "text-[#878A8C] hover:bg-[#E5E6EA] hover:text-[#CC3600]"
                      }`}
                    >
                      <Icon
                        icon={isLiked ? "boxicons:like-filled" : "boxicons:like"}
                        width="14"
                        height="14"
                      />
                      <span>{c.likes?.length > 0 ? c.likes.length : "Like"}</span>
                    </button>

                    <button
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold text-[#878A8C] hover:bg-[#E5E6EA] hover:text-[#CC3600] transition-all duration-200"
                    >
                      <Icon icon="mdi:reply" width="14" height="14" />
                      Reply
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>
    </main>
  );
};

export default Postpage;
