import { Icon } from "@iconify/react";
import React from "react";

const Button = ({ name, icon, onClick, isActive, loading }) => {
  const buttonStyle = isActive
    ? "bg-[#FF4500] text-white shadow-[0_3px_12px_rgba(255,69,0,0.35)] hover:shadow-[0_4px_16px_rgba(255,69,0,0.45)] hover:bg-[#CC3600]"
    : "bg-[#E5E6EA] text-[#A83200] hover:bg-[#E5E6EA] hover:text-[#CC3600] border border-transparent hover:border-[#EDEFF1]";

  return (
    <button
      type={onClick ? "button" : "submit"}
      onClick={loading ? undefined : onClick}
      disabled={loading}
      className={`w-full px-4 py-2 flex items-center justify-center gap-1.5 ${buttonStyle} rounded-full font-semibold ${loading ? "cursor-not-allowed opacity-80" : "cursor-pointer"} transition-all duration-200 text-sm select-none`}
    >
      {loading ? (
        <>
          <svg
            className="animate-spin h-4 w-4 shrink-0"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8v8H4z"
            />
          </svg>
          {name && <span>{name}</span>}
        </>
      ) : (
        <>
          {icon && <Icon icon={icon} width="15" height="15" />}
          {name && <span>{name}</span>}
        </>
      )}
    </button>
  );
};

export default Button;
