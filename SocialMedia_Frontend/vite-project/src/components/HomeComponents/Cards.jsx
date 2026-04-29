import { Icon } from "@iconify/react";
import React from "react";
import Button from "../common/Button";
import { useNavigate } from "react-router-dom";

const Cards = ({ onClick, showFull, communitteName, username, uploadedTime, titleOfPost, image, description }) => {
  const buttonDetails = [
    { icon: "boxicons:like-filled" },
    { icon: "boxicons:dislike-filled" },
    { icon: "mdi:comments" },
  ];

  return (
    <div
      onClick={onClick}
      className="border border-[#E8D5C0] bg-[#FDF6EE] shadow-[0_2px_12px_rgba(164,57,25,0.08)] p-5 flex flex-col gap-4 rounded-2xl hover:shadow-[0_6px_24px_rgba(164,57,25,0.14)] hover:border-[#D4B89A] transition-all duration-200 cursor-pointer"
    >
      <div className="flex justify-between items-start">
        <div className="flex gap-2.5 items-center">
          <div className="bg-linear-to-br from-[#AF503A] to-[#A43919] text-white rounded-full p-1.5 shadow-sm shrink-0">
            <Icon icon="bi:emoji-grin-fill" width="15" height="15" />
          </div>
          <div>
            <p className="text-[#A43919] font-bold text-sm leading-tight">{communitteName}</p>
            <p className="text-xs text-[#B89880]">/{username} · {uploadedTime}</p>
          </div>
        </div>
        <div className="flex items-center gap-2.5">
          <Button isActive={true} name="Join" />
          <Icon className="text-[#B89880]" icon="tabler:dots-filled" width="20" height="20" />
        </div>
      </div>

      <h1 className="text-lg font-bold text-[#2C1A0E] leading-snug">{titleOfPost}</h1>

      <div className="rounded-xl overflow-hidden bg-[#EEE7DB] flex justify-center">
        <img className="object-contain w-full xs:w-122" src={image} alt="post" />
      </div>

      <div>
        {showFull && (
          <p className="text-sm text-[#5C4033] leading-relaxed">{description}</p>
        )}
      </div>

      <div className="flex gap-2 pt-2 border-t border-[#EEE7DB]">
        {buttonDetails.map((elem, index) => (
          <Button key={index} icon={elem.icon} />
        ))}
      </div>
    </div>
  );
};

export default Cards;
