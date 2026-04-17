import { Icon } from "@iconify/react";
import React, { useState } from "react";
import Button from "./common/Button";

const CommentInput = ({ icon, placeholder, onChange, value }) => {
  const [open, setOpen] = useState(false);

  return (
    <div
      onClick={() => setOpen(true)}
      className="flex border py-2  px-1 rounded-xl flex-col gap-5"
    >
      <div className={`flex   ${open ? "h-20" : ""}`}>
        {icon &&(

        <span>{icon}</span>
        )}
        <input
          className="outline-none w-full h-full"
          type="text"
          value={value}
          onChange={onChange}
          placeholder={placeholder}
        />
        
      </div>
      {open && (
        <div className="flex justify-between items-center">
          <div className="rounded-full border px-2 p-1">Aa</div>
          <div className="flex gap-4  ">
            <Button name="Cancel" />
            <Button name="Comment" />
          </div>
        </div>
      )}
    </div>
  );
};

export default CommentInput;
