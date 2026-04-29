import { Icon } from "@iconify/react";
import React from "react";

const NotificationCard = () => {
  return (
    <div className="flex justify-between items-center p-3.5 rounded-xl border border-[#E8D5C0] bg-[#FDF6EE] hover:bg-[#F4D9C6] hover:border-[#D4B89A] transition-all duration-200">
      <div className="flex gap-3 items-center">
        <div className="relative shrink-0">
          <img className="w-12 h-12 object-cover rounded-full border-2 border-[#E8D5C0]" src="./football.png" />
          <div className="absolute -bottom-0.5 -right-0.5 bg-[#A43919] rounded-full p-0.5 border border-[#FDF6EE]">
            <Icon icon="mdi:heart" width="9" height="9" className="text-white" />
          </div>
        </div>
        <div className="flex flex-col gap-0.5">
          <h2 className="font-semibold text-sm text-[#2C1A0E]">Football</h2>
          <p className="text-xs text-[#5C4033]">Build project on mern</p>
          <p className="text-xs text-[#B89880]">2 hours ago</p>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <img className="w-14 h-11 object-cover border border-[#E8D5C0] rounded-lg" src="Logo.png" />
        <button className="p-1.5 rounded-lg hover:bg-[#EEE7DB] transition-colors duration-200">
          <Icon className="text-[#B89880]" icon="mage:dots" width="18" height="18" />
        </button>
      </div>
    </div>
  );
};

export default NotificationCard;
