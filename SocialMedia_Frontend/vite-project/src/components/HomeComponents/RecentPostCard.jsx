import { Icon } from "@iconify/react";
import React from "react";
import { truncateWords } from "../../utils/truncateWords";

const RecentPostCard = () => {
  const title = "Lorem ipsum dolor sit amet consectetur adipisicing elit. Maxime, animi?";
  return (
    <div className="py-3 border-b border-[#EDD9C8] last:border-0 group cursor-pointer">
      <div className="flex justify-between gap-3">
        <div className="flex flex-col gap-1.5 flex-1 min-w-0">
          <div className="flex gap-1.5 items-center">
            <div className="bg-linear-to-br from-[#C7604A] to-[#8B3010] rounded-full p-0.5 shrink-0">
              <Icon icon="bi:emoji-grin-fill" width="10" height="10" className="text-white" />
            </div>
            <p className="text-xs font-bold text-[#A43919]">Football</p>
            <p className="text-xs text-[#C9A88A]">· 2h ago</p>
          </div>
          <p className="font-bold text-sm text-[#1C0F08] leading-snug group-hover:text-[#A43919] transition-colors duration-200">
            {truncateWords(title, 5)}
          </p>
        </div>
        <div className="shrink-0">
          <img
            src="./Sharbani.png"
            className="w-16 h-14 object-cover rounded-xl border border-[#EDD9C8]"
            alt="post thumbnail"
          />
        </div>
      </div>
      <div className="flex text-xs gap-3 text-[#C9A88A] mt-2">
        <div className="flex items-center gap-1">
          <Icon icon="boxicons:like-filled" width="11" height="11" />
          <p>191</p>
        </div>
        <div className="flex items-center gap-1">
          <Icon icon="mdi:comments" width="11" height="11" />
          <p>20</p>
        </div>
      </div>
    </div>
  );
};

export default RecentPostCard;
