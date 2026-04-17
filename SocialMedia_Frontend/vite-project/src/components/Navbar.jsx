import { Icon } from "@iconify/react";
import React, { useEffect, useRef, useState } from "react";
import Sidebar from "./Sidebar";
import IconLink from "./common/IconLink";
import { useNavigate } from "react-router-dom";

const Navbar = () => {
  const navbarLink = [
    { icon: "clarity:notification-solid", pageLink: "/notification" },
    { icon: "mdi:chat", pageLink: "/chat" },
    { icon: "boxicons:user-filled", pageLink: "/userProfile" },

  ];
  const [toggleSidebar, setToggleSidebar] = useState(false);
  const navigate = useNavigate();
const sidebarRef=useRef();

useEffect(()=>{
  
})


  return (
    <>
      <nav className="sticky top-0 z-50 flex  px-3 py-4 justify-between bg-[#FEF7ED] border-b items-center">
        <div>
          <Icon
            onClick={() => setToggleSidebar((prev) => !prev)}
            className="text-[#AF503A] lg:hidden"
            icon="fontisto:nav-icon-a"
            width="24"
            height="24"
          />
        </div>
        <div
          onClick={() => navigate("/")}
          className="flex flex-col items-center cursor-pointer "
        >
          <h1 className="italic font-bold font-serif text-lg ">SocialSphere</h1>
          <h2 className="text-[14px] text-[#AF503A]">
            Online Community Platform
          </h2>
        </div>
        <div className="flex items-center gap-3 md:gap-5 lg:gap-8 ">
          {navbarLink.map((elem, index) => (
            <IconLink key={index} pageLink={elem.pageLink} icon={elem.icon} />
          ))}
        </div>
      </nav>
      {toggleSidebar && <Sidebar />}
    </>
  );
};

export default Navbar;
