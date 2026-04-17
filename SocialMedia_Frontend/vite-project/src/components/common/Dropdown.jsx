import { Icon } from "@iconify/react";
import React from "react";

const Dropdown = ({ icon, name }) => {
  return (
    <div className="flex gap-2 border max-w-fit p-2 rounded-3xl">
      {icon && <Icon className="text-[#AF503A]" icon={icon} width="24" height="24" />}
      {name && <span className="text-sm">{name}</span>}
    </div>
  );
};

export default Dropdown;
