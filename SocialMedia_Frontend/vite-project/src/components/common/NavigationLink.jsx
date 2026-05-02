import React from "react";
import { Link } from "react-router-dom";
import { Icon } from "@iconify/react";

const NavigationLink = ({ icon, label, onClick, isActive, path }) => {
  return (
    <Link
      to={path}
      onClick={onClick}
      className={`flex gap-3 items-center py-2.5 px-3 rounded-xl transition-all duration-200 font-medium relative ${
        isActive
          ? "bg-linear-to-r from-[#AF503A] to-[#C7604A] text-white shadow-[0_3px_12px_rgba(164,57,25,0.3)]"
          : "text-[#1C0F08] hover:bg-[#FAEBD8] hover:text-[#A43919]"
      }`}
    >
      <Icon
        icon={icon}
        width="19"
        height="19"
        className={isActive ? "text-white" : "text-[#AF503A]"}
      />
      <span className="text-sm">{label}</span>
      {isActive && (
        <span className="ml-auto w-1.5 h-1.5 rounded-full bg-white/70"></span>
      )}
    </Link>
  );
};

export default NavigationLink;
