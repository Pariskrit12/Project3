import { Icon } from "@iconify/react";
import React from "react";

const Button = ({ name, icon, onClick, isActive }) => {
  const buttonColor = isActive
    ? "bg-[#A43919] text-white shadow-[0_2px_8px_rgba(164,57,25,0.25)]"
    : "bg-[#EEE7DB] text-[#5C4033] hover:bg-[#F4D9C6] hover:text-[#A43919]";
  return (
    <div
      onClick={onClick}
      className={`px-4 py-2 flex items-center gap-1.5 ${buttonColor} rounded-full font-semibold cursor-pointer transition-all duration-200 text-sm select-none`}
    >
      {icon && <Icon icon={icon} width="15" height="15" />}
      {name && <span>{name}</span>}
    </div>
  );
};

export default Button;
