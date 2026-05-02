import { Icon } from "@iconify/react";
import React from "react";

const NotificationCard = () => {
  return (
    <div className="flex justify-between items-center p-4 rounded-2xl border border-[#EDD9C8] bg-[#FFFCF9] hover:bg-[#FAEBD8] hover:border-[#C9A88A] hover:shadow-[0_4px_16px_rgba(164,57,25,0.1)] transition-all duration-200 group">
      <div className="flex gap-3.5 items-center">
        <div className="relative shrink-0">
          <img
            className="w-12 h-12 object-cover rounded-full border-2 border-[#EDD9C8] group-hover:border-[#AF503A] transition-colors duration-200"
            src="./football.png"
            alt="user"
          />
          <div className="absolute -bottom-0.5 -right-0.5 bg-linear-to-br from-[#AF503A] to-[#8B3010] rounded-full p-1 border-2 border-[#FFFCF9] shadow-sm">
            <Icon icon="mdi:heart" width="8" height="8" className="text-white" />
          </div>
        </div>
        <div className="flex flex-col gap-0.5">
          <h2 className="font-bold text-sm text-[#1C0F08]">Football</h2>
          <p className="text-xs text-[#4A2C1D]">Build project on mern</p>
          <p className="text-xs text-[#C9A88A] flex items-center gap-1 mt-0.5">
            <Icon icon="mdi:clock-outline" width="11" height="11" />
            2 hours ago
          </p>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <div className="rounded-xl overflow-hidden border border-[#EDD9C8] shadow-sm">
          <img
            className="w-14 h-11 object-cover"
            src="Logo.png"
            alt="post thumbnail"
          />
        </div>
        <button className="p-1.5 rounded-xl hover:bg-[#F0E6DD] transition-colors duration-200">
          <Icon className="text-[#C9A88A]" icon="mage:dots" width="18" height="18" />
        </button>
      </div>
    </div>
  );
};

export default NotificationCard;
