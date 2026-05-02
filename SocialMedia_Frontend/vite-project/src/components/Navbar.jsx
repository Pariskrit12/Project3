import { Icon } from "@iconify/react";
import React, { useState } from "react";
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

  return (
    <>
      <nav className="sticky top-0 z-50 flex px-5 py-3 justify-between bg-[#FFF7F0]/85 backdrop-blur-md border-b border-[#EDD9C8] items-center shadow-[0_2px_16px_rgba(164,57,25,0.08)]">
        <div>
          <div
            onClick={() => setToggleSidebar((prev) => !prev)}
            className="text-[#AF503A] lg:hidden p-2 rounded-xl hover:bg-[#FAEBD8] cursor-pointer transition-colors duration-200"
          >
            <Icon icon="fontisto:nav-icon-a" width="20" height="20" />
          </div>
        </div>

        <div
          onClick={() => navigate("/")}
          className="flex flex-col items-center cursor-pointer select-none"
        >
          <h1 className="font-black font-serif text-xl tracking-tight">
            <span className="text-[#1C0F08]">Social</span>
            <span className="text-[#AF503A]">Sphere</span>
          </h1>
          <div className="flex items-center gap-1.5 mt-0.5">
            <div className="h-px w-6 bg-linear-to-r from-transparent to-[#AF503A]/40"></div>
            <p className="text-[9px] text-[#AF503A] font-bold tracking-[0.2em] uppercase">
              Community
            </p>
            <div className="h-px w-6 bg-linear-to-l from-transparent to-[#AF503A]/40"></div>
          </div>
        </div>

        <div className="flex items-center gap-0.5">
          {navbarLink.map((elem, index) => (
            <div
              key={index}
              className="relative p-2 rounded-xl hover:bg-[#FAEBD8] cursor-pointer transition-all duration-200 group"
            >
              <IconLink pageLink={elem.pageLink} icon={elem.icon} />
              {index === 0 && (
                <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-[#E8963A] rounded-full border border-[#FFF7F0]"></span>
              )}
            </div>
          ))}
          <button
            onClick={() => navigate("/userProfile")}
            className="ml-1.5 relative group"
          >
            <img
              src="./Sharbani.png"
              alt="photo"
              className="h-9 w-9 rounded-full object-cover border-2 border-[#AF503A] transition-all duration-200 group-hover:ring-3 group-hover:ring-[#AF503A]/25"
            />
            <div className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-400 rounded-full border-2 border-[#FFF7F0]"></div>
          </button>
        </div>
      </nav>
      {toggleSidebar && <Sidebar />}
    </>
  );
};

export default Navbar;
