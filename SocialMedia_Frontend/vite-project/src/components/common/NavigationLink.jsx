import React from "react";
import { useNavigate } from "react-router-dom";
import { Icon } from "@iconify/react";

const NavigationLink = ({ icon, label, onClick, isActive, path }) => {
  const navigate = useNavigate();

  const handleClick = (e) => {
    e.preventDefault();
    if (onClick) {
      onClick(e);
    } else {
      navigate(path);
    }
  };

  return (
    <button
      onClick={handleClick}
      className={`w-full flex gap-3 items-center py-2.5 px-3 rounded-xl transition-all duration-200 font-medium relative ${
        isActive
          ? "bg-[#FF4500] text-white shadow-[0_3px_12px_rgba(255,69,0,0.3)]"
          : "text-[#D7DADC] hover:bg-[#2A2A2A] hover:text-[#CC3600]"
      }`}
    >
      <Icon
        icon={icon}
        width="19"
        height="19"
        className={isActive ? "text-white" : "text-[#FF4500]"}
      />
      <span className="text-sm">{label}</span>
      {isActive && (
        <span className="ml-auto w-1.5 h-1.5 rounded-full bg-white/70"></span>
      )}
    </button>
  );
};

export default NavigationLink;
