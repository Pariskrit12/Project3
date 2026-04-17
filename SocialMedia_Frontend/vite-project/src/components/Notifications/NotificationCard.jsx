import { Icon } from "@iconify/react";
import React from "react";

const NotificationCard = () => {
  return (
    <div className="flex justify-between mt-1 border-b pb-1.5 ">
      <div className="flex ">
        <img className="w-15 h-15 object-contain" src="./football.png" />
        <div className="flex flex-col">
          <h2>Football</h2>
          <p className="text-sm">Build project on mern</p>
          <p className="text-sm">2 hours ago</p>
        </div>
      </div>
      <div className="flex items-center"> 
        <img className="w-20 h-15 object-contain border rounded-lg" src="Logo.png"/>
        <div>
        <Icon icon="mage:dots" width="24" height="24" />
        </div>
      </div>
    </div>
  );
};

export default NotificationCard;
