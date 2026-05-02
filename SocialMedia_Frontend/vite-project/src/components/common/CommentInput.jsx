import React, { useState } from "react";
import Button from "./Button";
import { Icon } from "@iconify/react";

const CommentInput = ({ placeholder, onChange, value }) => {
  const [open, setOpen] = useState(false);

  return (
    <div
      className={`border bg-[#FFFCF9] rounded-2xl p-4 flex flex-col gap-3 transition-all duration-300 ${
        open
          ? "border-[#AF503A] shadow-[0_0_0_3px_rgba(175,80,58,0.1)]"
          : "border-[#EDD9C8] hover:border-[#C9A88A]"
      }`}
    >
      <div className="flex items-start gap-3">
        <img
          src="./Sharbani.png"
          alt="avatar"
          className="w-8 h-8 rounded-full object-cover border border-[#EDD9C8] shrink-0 mt-0.5"
        />
        <textarea
          onFocus={() => setOpen(true)}
          className={`w-full text-sm outline-none bg-transparent text-[#1C0F08] placeholder:text-[#C9A88A] resize-none transition-all duration-300 ${
            open ? "min-h-20" : "min-h-5"
          }`}
          placeholder={placeholder || "Write a comment..."}
          onChange={onChange}
          value={value}
          rows={open ? 3 : 1}
        />
      </div>

      {open && (
        <div className="flex justify-between items-center pl-11">
          <div className="flex items-center gap-2 text-[#9C7E6D]">
            <button className="p-1.5 rounded-lg hover:bg-[#FAEBD8] transition-colors">
              <Icon icon="material-symbols:image" width="18" height="18" className="text-[#AF503A]" />
            </button>
            <button className="p-1.5 rounded-lg hover:bg-[#FAEBD8] transition-colors">
              <Icon icon="mdi:emoji" width="18" height="18" className="text-[#AF503A]" />
            </button>
          </div>
          <div className="flex gap-2">
            <Button name="Cancel" onClick={() => setOpen(false)} />
            <Button name="Comment" isActive={true} />
          </div>
        </div>
      )}
    </div>
  );
};

export default CommentInput;
