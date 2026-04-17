import React, { useState } from "react";
import Button from "./Button";

const CommentInput = ({ placeholder, onChange, value }) => {
  const [open, setOpen] = useState(false);
  return (
    <div className="border border-[#F0E6D8] bg-[#faeddf] rounded-2xl p-3 flex flex-col gap-3">
      <textarea
        onFocus={() => setOpen(true)}
        className="w-full text-sm outline-none bg-transparent"
        placeholder={placeholder}
        onChange={onChange}
        value={value}
        rows={1}
      />

      {open && (
        <div className="flex justify-between items-center">
          <div className="rounded-full border px-2 py-1 text-sm cursor-pointer">
            Aa
          </div>

          <div className="flex gap-3">
            <Button name="Comment" />
            <Button name="Cancel" onClick={() => setOpen(false)} />
          </div>
        </div>
      )}
    </div>
  );
};

export default CommentInput;
