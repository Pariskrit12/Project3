import { Icon } from "@iconify/react";
import React from "react";

const NotificationCard = () => {
  return (
    <div className="flex justify-between items-center p-4 rounded-2xl border border-[#FECDD3] bg-[#FFF5F6] hover:bg-[#FFE4E6] hover:border-[#FDA4AF] hover:shadow-[0_4px_16px_rgba(225,29,72,0.1)] transition-all duration-200 group">
      <div className="flex gap-3.5 items-center">
        <div className="relative shrink-0">
          <img
            className="w-12 h-12 object-cover rounded-full border-2 border-[#FECDD3] group-hover:border-[#E11D48] transition-colors duration-200"
            src="./football.png"
            alt="user"
          />
          <div className="absolute -bottom-0.5 -right-0.5 bg-linear-to-br from-[#E11D48] to-[#BE123C] rounded-full p-1 border-2 border-[#FFF5F6] shadow-sm">
            <Icon icon="mdi:heart" width="8" height="8" className="text-white" />
          </div>
        </div>
        <div className="flex flex-col gap-0.5">
          <h2 className="font-bold text-sm text-[#1C0714]">Football</h2>
          <p className="text-xs text-[#9F1239]">Build project on mern</p>
          <p className="text-xs text-[#FDA4AF] flex items-center gap-1 mt-0.5">
            <Icon icon="mdi:clock-outline" width="11" height="11" />
            2 hours ago
          </p>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <div className="rounded-xl overflow-hidden border border-[#FECDD3] shadow-sm">
          <img
            className="w-14 h-11 object-cover"
            src="Logo.png"
            alt="post thumbnail"
          />
        </div>
        <button className="p-1.5 rounded-xl hover:bg-[#FFE4E6] transition-colors duration-200">
          <Icon className="text-[#FDA4AF]" icon="mage:dots" width="18" height="18" />
        </button>
      </div>
    </div>
  );
};

export default NotificationCard;
