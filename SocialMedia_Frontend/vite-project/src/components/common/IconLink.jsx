import { Icon } from "@iconify/react";
import React from "react";
import { Link } from "react-router-dom";

const IconLink = ({ pageLink, icon }) => {
  return (
    <Link to={pageLink}>
      <Icon className="text-[#E11D48]" icon={icon} width="24" height="24" />
    </Link>
  );
};

export default IconLink;
