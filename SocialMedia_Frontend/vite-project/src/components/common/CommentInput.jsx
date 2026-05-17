import React, { useState } from "react";
import Button from "./Button";
import { Icon } from "@iconify/react";
import { useCreateCommentMutation } from "../../services/commentsApi";

const CommentInput = ({ postId, currentUser, placeholder }) => {
  const [open, setOpen] = useState(false);
  const [text, setText] = useState("");
  const [createComment, { isLoading }] = useCreateCommentMutation();

  const handleSubmit = async () => {
    if (!text.trim()) return;
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
    setText("");
    setOpen(false);
    try {
      await createComment({ postId, formData, optimisticComment });
    } catch {
      // error handling — refetch will restore correct state
    }
  };

  return (
    <div
      className={`border bg-[#FFF5F6] rounded-2xl p-4 flex flex-col gap-3 transition-all duration-300 ${
        open
          ? "border-[#E11D48] shadow-[0_0_0_3px_rgba(225,29,72,0.1)]"
          : "border-[#FECDD3] hover:border-[#FDA4AF]"
      }`}
    >
      <div className="flex items-start gap-3">
        <div className="shrink-0 w-8 h-8 rounded-full overflow-hidden bg-linear-to-br from-[#FB7185] to-[#BE123C] flex items-center justify-center border border-[#FECDD3]">
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
          className={`w-full text-sm outline-none bg-transparent text-[#1C0714] placeholder:text-[#FDA4AF] resize-none transition-all duration-300 ${
            open ? "min-h-20" : "min-h-5"
          }`}
          placeholder={placeholder || "Write a comment..."}
          onChange={(e) => setText(e.target.value)}
          value={text}
          rows={open ? 3 : 1}
        />
      </div>

      {open && (
        <div className="flex justify-between items-center pl-11">
          <div className="flex items-center gap-2">
            <button className="p-1.5 rounded-lg hover:bg-[#FFE4E6] transition-colors">
              <Icon
                icon="material-symbols:image"
                width="18"
                height="18"
                className="text-[#E11D48]"
              />
            </button>
          </div>
          <div className="flex gap-2">
            <Button
              name="Cancel"
              onClick={() => {
                setOpen(false);
                setText("");
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
