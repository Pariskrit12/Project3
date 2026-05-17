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
      className="w-full border border-[#FECDD3] bg-[#FFF5F6] p-4 cursor-pointer hover:bg-[#FFE4E6] hover:border-[#FDA4AF] hover:shadow-[0_4px_16px_rgba(225,29,72,0.08)] rounded-2xl transition-all duration-200 group"
    >
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-4">
          <div className="bg-linear-to-br from-[#FFF1F2] to-[#FFE4E6] border border-[#FECDD3] group-hover:from-[#E11D48] group-hover:to-[#FB7185] group-hover:border-transparent rounded-xl p-2.5 shrink-0 transition-all duration-200 shadow-sm">
            <Icon
              className="text-[#BE123C] group-hover:text-white transition-colors duration-200"
              icon={icon}
              width="24"
              height="24"
            />
          </div>
          <div className="flex flex-col gap-0.5">
            <p className="text-base font-bold text-[#1C0714]">{name}</p>
            {description && (
              <p className="text-sm text-[#BE7090]">{description}</p>
            )}
          </div>
        </div>
        <Icon
          className="text-[#FDA4AF] group-hover:text-[#BE123C] transition-colors duration-200"
          icon="ri:arrow-right-s-line"
          width="24"
          height="24"
        />
      </div>
    </div>
  );
};

export default SettingList;
