import { Icon } from "@iconify/react";
import React from "react";

const Input = ({ onChange, icon, type, placeholder, value, className }) => {
  return (
    <div className={`flex w-full border rounded-2xl p-2 gap-2 ${className}`}>
      {icon && <Icon icon={icon} width="24" height="24" />}
      <input
        onChange={onChange}
        className="w-full outline-none"
        type={type}
        placeholder={placeholder}
        value={value}
      />
    </div>
  );
};

export default Input;
