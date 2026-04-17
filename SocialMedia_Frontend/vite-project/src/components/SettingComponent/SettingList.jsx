import { Icon } from "@iconify/react";
import React from "react";
import { useNavigate } from "react-router-dom";

const SettingList = ({ icon, name, description, path,type,onClick }) => {
  const navigate = useNavigate();
  const handleClick=()=>{
    if(type !=="AccountInfo"){
      navigate(`/${path}`)
    }else{
      onClick();
    }
  }
  return (
    <div
      onClick={handleClick}
      className="w-full border p-3 cursor-pointer hover:bg-gray-200 "
    >
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-2">
          <div className="rounded-full hover:bg-gray-300 p-2">
            <Icon icon={icon} width="35" height="35" />
          </div>
          <div className="flex flex-col">
            <p className="text-lg font-bold">{name}</p>
            {description && (
              <p className="text-sm text-gray-400">{description}</p>
            )}
          </div>
        </div>
        <div>
          <Icon icon="ri:arrow-right-s-line" width="35" height="35" />
        </div>
      </div>
    </div>
  );
};

export default SettingList;
