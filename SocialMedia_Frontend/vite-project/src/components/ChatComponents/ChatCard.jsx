import React from "react";

const ChatCard = ({ image, username, messageSnip }) => {
  return (
    <div className="flex gap-3 items-center px-3 py-2.5 rounded-xl hover:bg-[#FAEBD8] transition-all duration-200 cursor-pointer group">
      <div className="relative shrink-0">
        <img
          className="h-11 w-11 aspect-square rounded-full object-cover border-2 border-[#EDD9C8] group-hover:border-[#AF503A] transition-colors duration-200"
          src={image}
          alt="avatar"
        />
        <div className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-400 rounded-full border-2 border-[#FFF7F0]"></div>
      </div>
      <div className="flex flex-col gap-0.5 min-w-0 flex-1">
        <p className="font-bold text-sm text-[#1C0F08]">{username}</p>
        <p className="text-xs text-[#9C7E6D] line-clamp-1">{messageSnip}</p>
      </div>
      <div className="flex flex-col items-end gap-1.5 shrink-0">
        <span className="text-xs text-[#C9A88A]">2h</span>
        <span className="w-4 h-4 bg-linear-to-br from-[#AF503A] to-[#C7604A] rounded-full text-white text-[9px] flex items-center justify-center font-bold shadow-sm">
          2
        </span>
      </div>
    </div>
  );
};

export default ChatCard;
