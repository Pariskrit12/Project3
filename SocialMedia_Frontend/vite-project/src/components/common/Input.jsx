import { Icon } from "@iconify/react";
import React, { useState } from "react";

const Input = ({ onChange, icon, type, placeholder, value, className }) => {
  const [showPassword, setShowPassword] = useState(false);
  const isPassword = type === "password";
  const inputType = isPassword ? (showPassword ? "text" : "password") : type;

  return (
    <div
      className={`flex w-full border border-[#EDEFF1] bg-[#FFFFFF] rounded-xl p-3 gap-2.5 focus-within:border-[#FF4500] focus-within:bg-white focus-within:shadow-[0_0_0_3px_rgba(255,69,0,0.1)] transition-all duration-200 ${className}`}
    >
      {icon && (
        <Icon
          icon={icon}
          width="18"
          height="18"
          className="text-[#FF4500] shrink-0 mt-px"
        />
      )}
      <input
        onChange={onChange}
        className="w-full outline-none bg-transparent text-[#1C1C1C] placeholder:text-[#878A8C] text-sm"
        type={inputType}
        placeholder={placeholder}
        value={value}
      />
      {isPassword && (
        <button
          type="button"
          onClick={() => setShowPassword((prev) => !prev)}
          className="shrink-0 mt-px text-[#878A8C] hover:text-[#FF4500] transition-colors duration-200 cursor-pointer"
          tabIndex={-1}
        >
          <Icon
            icon={showPassword ? "mdi:eye-off-outline" : "mdi:eye-outline"}
            width="18"
            height="18"
          />
        </button>
      )}
    </div>
  );
};

export default Input;
