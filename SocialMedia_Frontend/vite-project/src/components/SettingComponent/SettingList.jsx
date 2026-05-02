import { Icon } from "@iconify/react";
import React from "react";
import { useNavigate } from "react-router-dom";

const SettingList = ({ icon, name, description, path, type, onClick }) => {
  const navigate = useNavigate();

  const handleClick = () => {
    if (type !== "AccountInfo") {
      navigate(`/${path}`);
    } else {
      onClick?.();
    }
  };

  return (
    <div
      onClick={handleClick}
      className="w-full border border-[#EDD9C8] bg-[#FFFCF9] p-4 cursor-pointer hover:bg-[#FAEBD8] hover:border-[#C9A88A] hover:shadow-[0_4px_16px_rgba(164,57,25,0.08)] rounded-2xl transition-all duration-200 group"
    >
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-4">
          <div className="bg-linear-to-br from-[#FFF7F0] to-[#FAEBD8] border border-[#EDD9C8] group-hover:from-[#AF503A] group-hover:to-[#C7604A] group-hover:border-transparent rounded-xl p-2.5 shrink-0 transition-all duration-200 shadow-sm">
            <Icon
              className="text-[#A43919] group-hover:text-white transition-colors duration-200"
              icon={icon}
              width="24"
              height="24"
            />
          </div>
          <div className="flex flex-col gap-0.5">
            <p className="text-base font-bold text-[#1C0F08]">{name}</p>
            {description && (
              <p className="text-sm text-[#9C7E6D]">{description}</p>
            )}
          </div>
        </div>
        <Icon
          className="text-[#C9A88A] group-hover:text-[#A43919] transition-colors duration-200"
          icon="ri:arrow-right-s-line"
          width="24"
          height="24"
        />
      </div>
    </div>
  );
};

export default SettingList;
