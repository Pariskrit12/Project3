import React, { useState } from "react";
import Button from "./Button";
import { Icon } from "@iconify/react";
import { useCreateCommentMutation } from "../../services/commentsApi";

const CommentInput = ({ postId, currentUser, placeholder }) => {
  const [open, setOpen] = useState(false);
  const [text, setText] = useState("");
  const [error, setError] = useState("");
  const [createComment, { isLoading }] = useCreateCommentMutation();

  const handleSubmit = async () => {
    if (!text.trim()) return;
    setError("");
    const optimisticComment = {
      _id: `optimistic-${Date.now()}`,
      description: text,
      creator: {
        _id: currentUser?._id,
        username: currentUser?.username,
        userProfilePic: currentUser?.userProfilePic,
      },
      post: postId,
      likes: [],
      dislikes: [],
      createdAt: new Date().toISOString(),
      isOptimistic: true,
    };
    const formData = new FormData();
    formData.append("description", text);
    try {
      await createComment({ postId, formData, optimisticComment }).unwrap();
      setText("");
      setOpen(false);
    } catch (err) {
      const msg = err?.data?.message || "";
      if (msg.includes("flagged")) {
        setError("Your comment contains inappropriate language and cannot be posted.");
      } else {
        setError(msg || "Failed to post comment. Please try again.");
      }
    }
  };

  return (
    <div
      className={`border bg-[#1E1E1E] rounded-2xl p-4 flex flex-col gap-3 transition-all duration-300 ${
        open
          ? "border-[#FF4500] shadow-[0_0_0_3px_rgba(255,69,0,0.1)]"
          : "border-[#3A3A3C] hover:border-[#9A9A9A]"
      }`}
    >
      <div className="flex items-start gap-3">
        <div className="shrink-0 w-8 h-8 rounded-full overflow-hidden bg-linear-to-br from-[#FF6534] to-[#CC3600] flex items-center justify-center border border-[#3A3A3C]">
          {currentUser?.userProfilePic ? (
            <img
              src={currentUser.userProfilePic}
              alt="avatar"
              className="w-full h-full object-cover"
            />
          ) : (
            <Icon icon="mdi:account" width="16" height="16" className="text-white" />
          )}
        </div>
        <textarea
          onFocus={() => setOpen(true)}
          className={`w-full text-sm outline-none bg-transparent text-[#D7DADC] placeholder:text-[#9A9A9A] resize-none transition-all duration-300 ${
            open ? "min-h-20" : "min-h-5"
          }`}
          placeholder={placeholder || "Write a comment..."}
          onChange={(e) => setText(e.target.value)}
          value={text}
          rows={open ? 3 : 1}
        />
      </div>

      {error && (
        <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-red-500/10 border border-red-500/40 text-red-400 text-xs ml-11">
          <Icon icon="material-symbols:block" width="14" height="14" className="shrink-0" />
          {error}
        </div>
      )}

      {open && (
        <div className="flex justify-between items-center pl-11">
          <div className="flex items-center gap-2">
            <button className="p-1.5 rounded-lg hover:bg-[#2A2A2A] transition-colors">
              <Icon
                icon="material-symbols:image"
                width="18"
                height="18"
                className="text-[#FF4500]"
              />
            </button>
          </div>
          <div className="flex gap-2">
            <Button
              name="Cancel"
              onClick={() => {
                setOpen(false);
                setText("");
                setError("");
              }}
            />
            <Button
              name="Comment"
              isActive={true}
              onClick={handleSubmit}
              loading={isLoading}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default CommentInput;
