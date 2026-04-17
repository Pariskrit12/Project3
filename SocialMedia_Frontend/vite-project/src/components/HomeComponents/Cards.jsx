import { Icon } from "@iconify/react";
import React from "react";
import Button from "../common/Button";
import { useNavigate } from "react-router-dom";

const Cards = ({ onClick, showFull,communitteName,username,uploadedTime,titleOfPost,image,description }) => {
  const buttonDetails = [
    { icon: "boxicons:like-filled" },
    { icon: "boxicons:dislike-filled" },
    { icon: "mdi:comments" },
  ];

  return (
    <div
      onClick={onClick}
      className="border border-[#E8D5C0] bg-[#FDF6EE] shadow-[0_2px_12px_rgba(164,57,25,0.08)] p-4 flex flex-col gap-3 rounded-2xl hover:shadow-[0_4px_20px_rgba(164,57,25,0.14)] transition-shadow duration-200 cursor-pointer min-h-fit"
    >
      <div className="flex justify-between">

      <div className="flex gap-2 items-center">
        <div className="bg-[#A43919] text-white rounded-full p-1">
          <Icon icon="bi:emoji-grin-fill" width="18" height="18" />
        </div>
        <p className="text-[#A43919] flex items-center font-semibold">{communitteName} &nbsp; <span className="text-xs text-[#B89880]">/{username}</span></p>
        <span className="text-xs text-[#B89880] ">{uploadedTime}</span>
      </div>
      <div className="flex items-center gap-4">
        <Button isActive={true} name="Join"/>
          <Icon icon="tabler:dots-filled" width="24" height="24" />
      </div>
      </div>
      <div>
        <h1 className="text-xl font-bold text-[#2C1A0E]">{titleOfPost}</h1>
      </div>
      <div className="flex justify-center w-full bg-[#EEE7DB] rounded-xl overflow-hidden">
        <img className="object-contain w-full xs:w-122" src={image} alt="image" />
      </div>
      <div>
        {showFull && (
          <p className="text-sm text-[#5C4033] leading-relaxed">
           {description}
          </p>
        )}
      </div>
      <div className="flex gap-2 pt-1 border-t border-[#EEE7DB]">
        {buttonDetails.map((elem, index) => (
          <Button key={index} icon={elem.icon} />
        ))}
      </div>
    </div>
  );
};

export default Cards;
