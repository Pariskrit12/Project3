import { Icon } from "@iconify/react";
import React from "react";
import { useNavigate } from "react-router-dom";

const SettingList = ({ icon, name, description, path, type, onClick }) => {
  const navigate = useNavigate();
  const handleClick = () => {
    if (type !== "AccountInfo") {
      navigate(`/${path}`)
    } else {
      onClick();
    }
  }
  return (
    <div
      onClick={handleClick}
      className="w-full border border-[#E8D5C0] bg-[#FDF6EE] p-4 cursor-pointer hover:bg-[#F4D9C6] hover:border-[#D4B89A] rounded-xl transition-all duration-200"
    >
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-4">
          <div className="bg-[#EEE7DB] rounded-xl p-2.5 shrink-0">
            <Icon className="text-[#A43919]" icon={icon} width="26" height="26" />
          </div>
          <div className="flex flex-col gap-0.5">
            <p className="text-base font-bold text-[#2C1A0E]">{name}</p>
            {description && (
              <p className="text-sm text-[#B89880]">{description}</p>
            )}
          </div>
        </div>
        <div>
          <Icon className="text-[#B89880]" icon="ri:arrow-right-s-line" width="26" height="26" />
        </div>
      </div>
    </div>
  );
};

export default SettingList;
