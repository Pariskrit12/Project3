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
          className="text-[#E11D48]"
        />
      </div>
    );
  }

  if (postError || !post) {
    return (
      <div className="flex flex-col items-center gap-2 py-20 text-[#FDA4AF]">
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
          <h2 className="font-black text-lg text-[#1C0714]">Comments</h2>
          <span className="bg-[#FFE4E6] text-[#BE123C] text-xs font-bold px-2.5 py-0.5 rounded-full">
            {commentsData?.data?.totalComments ?? 0}
          </span>
        </div>

        <CommentInput postId={postId} currentUser={user} />

        {/* transparent overlay to close dropdown on outside click */}
        {openDropdownId && (
          <div
            className="fixed inset-0 z-10"
            onClick={() => setOpenDropdownId(null)}
          />
        )}

        <div className="flex flex-col gap-3 mt-2">
          {commentsLoading && (
            <div className="flex justify-center py-6">
              <Icon
                icon="svg-spinners:ring-resize"
                width="24"
                height="24"
                className="text-[#E11D48]"
              />
            </div>
          )}

          {!commentsLoading && comments.length === 0 && (
            <p className="text-sm text-[#FDA4AF] text-center py-4">
              No comments yet. Be the first!
            </p>
          )}

          {comments.map((c) => {
            const isCommentOwner =
              user && c.creator?._id?.toString() === user._id?.toString();
            const canDelete = isCommentOwner || isPostOwner;
            const isEditing = editingCommentId === c._id;

            return (
              <div
                key={c._id}
                className={`relative flex gap-3 p-4 bg-[#FFF5F6] border border-[#FECDD3] rounded-2xl transition-opacity ${
                  c.isOptimistic ? "opacity-60" : "opacity-100"
                }`}
              >
                <div className="shrink-0 h-9 w-9 rounded-full overflow-hidden bg-linear-to-br from-[#FB7185] to-[#BE123C] flex items-center justify-center border border-[#FECDD3]">
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
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <p className="font-bold text-sm text-[#1C0714]">
                        {c.creator?.username ?? "user"}
                      </p>
                      <p className="text-xs text-[#FDA4AF]">
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
                          className="p-1 rounded-lg hover:bg-[#FFE4E6] text-[#BE7090] hover:text-[#BE123C] transition-colors"
                        >
                          <Icon
                            icon="mdi:dots-horizontal"
                            width="18"
                            height="18"
                          />
                        </button>

                        {openDropdownId === c._id && (
                          <div className="absolute right-0 top-8 z-20 bg-white border border-[#FECDD3] rounded-xl shadow-lg overflow-hidden min-w-[130px]">
                            {isCommentOwner && (
                              <button
                                onClick={() => handleEditStart(c)}
                                className="flex items-center gap-2 w-full px-3 py-2 text-sm text-[#1C0714] hover:bg-[#FFE4E6] transition-colors"
                              >
                                <Icon
                                  icon="mdi:pencil"
                                  width="15"
                                  height="15"
                                  className="text-[#E11D48]"
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

                  {isEditing ? (
                    <div className="flex flex-col gap-2 mt-1">
                      <textarea
                        value={editText}
                        onChange={(e) => setEditText(e.target.value)}
                        className="w-full border border-[#FECDD3] rounded-lg p-2 text-sm text-[#1C0714] outline-none focus:border-[#E11D48] resize-none bg-[#FFF5F6]"
                        rows={2}
                        autoFocus
                      />
                      <div className="flex gap-2 justify-end">
                        <button
                          onClick={() => setEditingCommentId(null)}
                          className="px-3 py-1 text-xs rounded-full bg-[#FFE4E6] text-[#9F1239] hover:bg-[#FFE4E6] font-semibold transition-colors"
                        >
                          Cancel
                        </button>
                        <button
                          onClick={() => handleEditSave(c._id)}
                          disabled={updating}
                          className="px-3 py-1 text-xs rounded-full bg-linear-to-r from-[#E11D48] to-[#FB7185] text-white font-semibold disabled:opacity-60 transition-colors"
                        >
                          {updating ? "Saving..." : "Save"}
                        </button>
                      </div>
                    </div>
                  ) : (
                    <p className="text-sm text-[#9F1239] leading-relaxed">
                      {c.description}
                    </p>
                  )}

                  <div className="flex items-center gap-3 mt-1">
                    <button className="flex items-center gap-1 text-xs text-[#BE7090] hover:text-[#BE123C] transition-colors">
                      <Icon icon="boxicons:like" width="14" height="14" />
                      <span>{c.likes?.length ?? 0}</span>
                    </button>
                    <button className="text-xs text-[#BE7090] hover:text-[#BE123C] transition-colors font-medium">
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
