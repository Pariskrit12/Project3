import { Icon } from "@iconify/react";
import React, { useEffect, useRef, useState } from "react";
import Sidebar from "./Sidebar";
import IconLink from "./common/IconLink";
import { useNavigate } from "react-router-dom";

const Navbar = () => {
  const navbarLink = [
    { icon: "clarity:notification-solid", pageLink: "/notification" },
    { icon: "mdi:chat", pageLink: "/chat" },
  ];
  const [toggleSidebar, setToggleSidebar] = useState(false);
  const navigate = useNavigate();
  const sidebarRef = useRef();

  useEffect(() => {});

  return (
    <>
      <nav className="sticky top-0 z-50 flex px-5 py-3 justify-between bg-[#FEF7ED] border-b border-[#E8D5C0] items-center shadow-[0_1px_8px_rgba(164,57,25,0.07)]">
        <div>
          <div
            onClick={() => setToggleSidebar((prev) => !prev)}
            className="text-[#AF503A] lg:hidden p-2 rounded-lg hover:bg-[#F4D9C6] cursor-pointer transition-colors duration-200"
          >
            <Icon icon="fontisto:nav-icon-a" width="20" height="20" />
          </div>
        </div>
        <div
          onClick={() => navigate("/")}
          className="flex flex-col items-center cursor-pointer"
        >
          <h1 className="italic font-bold font-serif text-xl text-[#2C1A0E] tracking-tight">SocialSphere</h1>
          <h2 className="text-[10px] text-[#AF503A] font-semibold tracking-[0.15em] uppercase">Online Community Platform</h2>
        </div>
        <div className="flex items-center gap-1">
          {navbarLink.map((elem, index) => (
            <div key={index} className="p-2 rounded-xl hover:bg-[#F4D9C6] cursor-pointer transition-colors duration-200">
              <IconLink pageLink={elem.pageLink} icon={elem.icon} />
            </div>
          ))}
          <img
            onClick={() => navigate("/userProfile")}
            src="./Sharbani.png"
            alt="photo"
            className="h-9 w-9 ml-2 rounded-full object-cover border-2 border-[#AF503A] cursor-pointer hover:ring-2 hover:ring-[#AF503A]/30 transition-all duration-200"
          />
        </div>
      </nav>
      {toggleSidebar && <Sidebar />}
    </>
  );
};

export default Navbar;
