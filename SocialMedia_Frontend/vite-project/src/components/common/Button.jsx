import { Icon } from "@iconify/react";
import React from "react";

const Button = ({ name, icon, onClick, isActive }) => {
  const buttonColor = isActive
    ? "bg-[#A43919] text-white"
    : "bg-[#EEE7DB] text-black";
  return (
    <div
      onClick={onClick}
      className={`px-4 py-2 flex items-center gap-1 ${buttonColor}  rounded-3xl font-semibold cursor-pointer`}
    >
      <Icon icon={icon} />
      {name && <span>{name}</span>}
    </div>
  );
};

export default Button;
