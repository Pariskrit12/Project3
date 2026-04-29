import { Icon } from "@iconify/react";
import React from "react";

const Input = ({ onChange, icon, type, placeholder, value, className }) => {
  return (
    <div className={`flex w-full border border-[#E8D5C0] bg-[#FEF7ED] rounded-xl p-2.5 gap-2.5 focus-within:border-[#AF503A] focus-within:shadow-[0_0_0_3px_rgba(175,80,58,0.12)] transition-all duration-200 ${className}`}>
      {icon && <Icon icon={icon} width="18" height="18" className="text-[#AF503A] shrink-0" />}
      <input
        onChange={onChange}
        className="w-full outline-none bg-transparent text-[#2C1A0E] placeholder:text-[#B89880] text-sm"
        type={type}
        placeholder={placeholder}
        value={value}
      />
    </div>
  );
};

export default Input;
