import React, { useState } from "react";
import Button from "./Button";

const CommentInput = ({ placeholder, onChange, value }) => {
  const [open, setOpen] = useState(false);
  return (
    <div className="border border-[#E8D5C0] bg-[#FDF6EE] rounded-2xl p-4 flex flex-col gap-3 focus-within:border-[#AF503A] transition-all duration-200">
      <textarea
        onFocus={() => setOpen(true)}
        className="w-full text-sm outline-none bg-transparent text-[#2C1A0E] placeholder:text-[#B89880] resize-none"
        placeholder={placeholder}
        onChange={onChange}
        value={value}
        rows={1}
      />

      {open && (
        <div className="flex justify-between items-center">
          <div className="rounded-full border border-[#E8D5C0] px-3 py-1 text-sm cursor-pointer text-[#5C4033] hover:bg-[#F4D9C6] transition-colors">
            Aa
          </div>
          <div className="flex gap-2">
            <Button name="Comment" isActive={true} />
            <Button name="Cancel" onClick={() => setOpen(false)} />
          </div>
        </div>
      )}
    </div>
  );
};

export default CommentInput;
