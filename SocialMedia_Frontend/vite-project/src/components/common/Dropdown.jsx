import { Icon } from "@iconify/react";
import React, { useState } from "react";

const Dropdown = ({ icon, value, options = [], onSelect }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative inline-block max-w-fit">
      <div
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 border px-3 py-2 rounded-3xl cursor-pointer bg-[#AF503A] text-white"
      >
        {icon && <Icon icon={icon} width="15" />}
        <span>{value}</span>
      </div>

      {isOpen && (
        <div className="absolute mt-2 w-full bg-white border rounded-xl shadow-lg">
          {options.map((option, i) => (
            <div
              key={i}
              onClick={() => {
                onSelect(option);
                setIsOpen(false);
              }}
              className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
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