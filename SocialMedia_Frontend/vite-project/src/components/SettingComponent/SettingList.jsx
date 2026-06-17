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
      className="w-full border border-[#EDEFF1] bg-[#FFFFFF] p-4 cursor-pointer hover:bg-[#E5E6EA] hover:border-[#878A8C] hover:shadow-[0_4px_16px_rgba(255,69,0,0.08)] rounded-2xl transition-all duration-200 group"
    >
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-4">
          <div className="bg-linear-to-br from-[#DAE0E6] to-[#E5E6EA] border border-[#EDEFF1] group-hover:from-[#FF4500] group-hover:to-[#FF6534] group-hover:border-transparent rounded-xl p-2.5 shrink-0 transition-all duration-200 shadow-sm">
            <Icon
              className="text-[#CC3600] group-hover:text-white transition-colors duration-200"
              icon={icon}
              width="24"
              height="24"
            />
          </div>
          <div className="flex flex-col gap-0.5">
            <p className="text-base font-bold text-[#1C1C1C]">{name}</p>
            {description && (
              <p className="text-sm text-[#878A8C]">{description}</p>
            )}
          </div>
        </div>
        <Icon
          className="text-[#878A8C] group-hover:text-[#CC3600] transition-colors duration-200"
          icon="ri:arrow-right-s-line"
          width="24"
          height="24"
        />
      </div>
    </div>
  );
};

export default SettingList;
