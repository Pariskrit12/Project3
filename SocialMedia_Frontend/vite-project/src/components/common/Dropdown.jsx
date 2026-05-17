import { Icon } from "@iconify/react";
import React, { useState } from "react";

const Dropdown = ({ icon, value, options = [], onSelect }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative inline-block max-w-fit">
      <div
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 border border-[#E11D48]/30 px-4 py-2 rounded-full cursor-pointer bg-linear-to-r from-[#E11D48] to-[#FB7185] text-white shadow-[0_2px_8px_rgba(225,29,72,0.25)] hover:shadow-[0_3px_12px_rgba(225,29,72,0.35)] transition-all duration-200 select-none"
      >
        <span className="text-sm font-semibold">{value}</span>
        {icon && (
          <Icon
            icon={icon}
            width="12"
            className={`transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}
          />
        )}
      </div>

      {isOpen && (
        <div className="absolute mt-2 w-full min-w-28 bg-[#FFF5F6] border border-[#FECDD3] rounded-xl shadow-[0_8px_24px_rgba(225,29,72,0.15)] z-20 overflow-hidden">
          {options.map((option, i) => (
            <div
              key={i}
              onClick={() => {
                onSelect(option);
                setIsOpen(false);
              }}
              className={`px-4 py-2.5 text-sm cursor-pointer transition-colors duration-150 font-medium ${
                value === option
                  ? "bg-[#FFE4E6] text-[#BE123C]"
                  : "text-[#1C0714] hover:bg-[#FFE4E6] hover:text-[#BE123C]"
              }`}
            >
              {option}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Dropdown;
