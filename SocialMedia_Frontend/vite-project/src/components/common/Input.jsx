import { Icon } from "@iconify/react";
import React from "react";

const Input = ({ onChange, icon, type, placeholder, value, className }) => {
  return (
    <div
      className={`flex w-full border border-[#EDD9C8] bg-[#FFFCF9] rounded-xl p-3 gap-2.5 focus-within:border-[#AF503A] focus-within:bg-white focus-within:shadow-[0_0_0_3px_rgba(175,80,58,0.1)] transition-all duration-200 ${className}`}
    >
      {icon && (
        <Icon
          icon={icon}
          width="18"
          height="18"
          className="text-[#AF503A] shrink-0 mt-px"
        />
      )}
      <input
        onChange={onChange}
        className="w-full outline-none bg-transparent text-[#1C0F08] placeholder:text-[#C9A88A] text-sm"
        type={type}
        placeholder={placeholder}
        value={value}
      />
    </div>
  );
};

export default Input;
