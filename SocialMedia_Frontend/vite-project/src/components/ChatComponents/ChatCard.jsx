import React from "react";

const ChatCard = ({ image, username, messageSnip }) => {
  return (
    <div className="flex gap-3 items-center px-3 py-2.5 rounded-xl hover:bg-[#2A2A2A] transition-all duration-200 cursor-pointer group">
      <div className="relative shrink-0">
        <img
          className="h-11 w-11 aspect-square rounded-full object-cover border-2 border-[#3A3A3C] group-hover:border-[#FF4500] transition-colors duration-200"
          src={image}
          alt="avatar"
        />
        <div className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-400 rounded-full border-2 border-[#111111]"></div>
      </div>
      <div className="flex flex-col gap-0.5 min-w-0 flex-1">
        <p className="font-bold text-sm text-[#D7DADC]">{username}</p>
        <p className="text-xs text-[#9A9A9A] line-clamp-1">{messageSnip}</p>
      </div>
      <div className="flex flex-col items-end gap-1.5 shrink-0">
        <span className="text-xs text-[#9A9A9A]">2h</span>
        <span className="w-4 h-4 bg-[#FF4500] rounded-full text-white text-[9px] flex items-center justify-center font-bold shadow-sm">
          2
        </span>
      </div>
    </div>
  );
};

export default ChatCard;
