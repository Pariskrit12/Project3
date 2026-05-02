import { Icon } from "@iconify/react";
import React from "react";

const Button = ({ name, icon, onClick, isActive }) => {
  const buttonStyle = isActive
    ? "bg-linear-to-r from-[#AF503A] to-[#C7604A] text-white shadow-[0_3px_12px_rgba(164,57,25,0.35)] hover:shadow-[0_4px_16px_rgba(164,57,25,0.45)] hover:from-[#9B4230] hover:to-[#B75540]"
    : "bg-[#F0E6DD] text-[#4A2C1D] hover:bg-[#FAEBD8] hover:text-[#A43919] border border-transparent hover:border-[#EDD9C8]";

  return (
    <div
      onClick={onClick}
      className={`px-4 py-2 flex items-center gap-1.5 ${buttonStyle} rounded-full font-semibold cursor-pointer transition-all duration-200 text-sm select-none`}
    >
      {icon && <Icon icon={icon} width="15" height="15" />}
      {name && <span>{name}</span>}
    </div>
  );
};

export default Button;
