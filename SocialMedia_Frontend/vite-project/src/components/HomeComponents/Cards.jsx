import { Icon } from "@iconify/react";
import React, { useState } from "react";
import Button from "../common/Button";
import { useNavigate } from "react-router-dom";

const Cards = ({ onClick, showFull, communitteName, username, uploadedTime, titleOfPost, image, description }) => {
  const [liked, setLiked] = useState(false);
  const [disliked, setDisliked] = useState(false);

  return (
    <div
      onClick={onClick}
      className="border border-[#EDD9C8] bg-[#FFFCF9] shadow-[0_2px_16px_rgba(164,57,25,0.07)] flex flex-col gap-4 rounded-2xl hover:shadow-[0_8px_28px_rgba(164,57,25,0.13)] hover:border-[#C9A88A] hover:-translate-y-0.5 transition-all duration-300 cursor-pointer overflow-hidden"
    >
      <div className="p-5 pb-0 flex justify-between items-start">
        <div className="flex gap-2.5 items-center">
          <div className="bg-linear-to-br from-[#C7604A] to-[#8B3010] text-white rounded-full p-1.5 shadow-[0_2px_8px_rgba(164,57,25,0.3)] shrink-0">
            <Icon icon="bi:emoji-grin-fill" width="14" height="14" />
          </div>
          <div>
            <p className="text-[#A43919] font-bold text-sm leading-tight">{communitteName}</p>
            <p className="text-xs text-[#C9A88A]">/{username} · {uploadedTime}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button isActive={true} name="Join" />
          <button className="p-1.5 rounded-lg hover:bg-[#FAEBD8] transition-colors">
            <Icon className="text-[#C9A88A]" icon="tabler:dots-filled" width="20" height="20" />
          </button>
        </div>
      </div>

      <div className="px-5">
        <h1 className="text-lg font-bold text-[#1C0F08] leading-snug">{titleOfPost}</h1>
      </div>

      {image && (
        <div className="mx-5 rounded-xl overflow-hidden bg-[#F0E6DD]">
          <img className="w-full" src={image} alt="post" />
        </div>
      )}

      {showFull && description && (
        <div className="px-5">
          <p className="text-sm text-[#4A2C1D] leading-relaxed">{description}</p>
        </div>
      )}

      <div className="px-5 pb-4 flex items-center gap-2 pt-1 border-t border-[#F0E6DD]">
        <button
          onClick={(e) => { e.stopPropagation(); setLiked(v => !v); }}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-semibold transition-all duration-200 ${
            liked ? "bg-[#FAEBD8] text-[#A43919]" : "text-[#9C7E6D] hover:bg-[#FAEBD8] hover:text-[#A43919]"
          }`}
        >
          <Icon icon={liked ? "boxicons:like-filled" : "boxicons:like"} width="16" height="16" />
          <span>Like</span>
        </button>
        <button
          onClick={(e) => { e.stopPropagation(); setDisliked(v => !v); }}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-semibold transition-all duration-200 ${
            disliked ? "bg-[#FAEBD8] text-[#A43919]" : "text-[#9C7E6D] hover:bg-[#FAEBD8] hover:text-[#A43919]"
          }`}
        >
          <Icon icon={disliked ? "boxicons:dislike-filled" : "boxicons:dislike"} width="16" height="16" />
          <span>Dislike</span>
        </button>
        <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-semibold text-[#9C7E6D] hover:bg-[#FAEBD8] hover:text-[#A43919] transition-all duration-200">
          <Icon icon="mdi:comments-outline" width="16" height="16" />
          <span>Comment</span>
        </button>
        <button className="ml-auto p-1.5 rounded-full text-[#9C7E6D] hover:bg-[#FAEBD8] hover:text-[#A43919] transition-all duration-200">
          <Icon icon="tabler:share" width="16" height="16" />
        </button>
      </div>
    </div>
  );
};

export default Cards;
