import { Icon } from "@iconify/react";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import NavigationLink from "./common/NavigationLink";

const Sidebar = () => {
  const sideBarLinks = [
    { icon: "boxicons:home-filled", label: "Home", path: "/" },
    { icon: "mingcute:trending-up-fill", label: "Trending", path: "/trending" },
    { icon: "fluent:new-16-filled", label: "New", path: "/new" },
    { icon: "fluent:align-top-24-filled", label: "Top", path: "/top" },
    { icon: "lets-icons:setting-fill", label: "Settings", path: "/settings" },
    { icon: "material-symbols:login", label: "Login", path: "/login" },
  ];
  const navigate = useNavigate();
  const dropdownElement = [
    { name: "Personal Life", img: "./Sharbani.png" },
    { name: "Football", img: "./football.png" },
    { name: "F1", img: "./post3.jpg" },
  ];
  const [activeIndex, setActiveIndex] = useState(0);
  const [openDropdown, setOpenDropdown] = useState(false);

  return (
    <aside className="fixed z-100 bg-[#FFF7F0] flex flex-col px-3 py-6 w-65 gap-0.5 h-screen border-r border-[#EDD9C8] shadow-[1px_0_12px_rgba(164,57,25,0.05)]">
      <p className="text-[9px] font-extrabold text-[#C9A88A] uppercase tracking-[0.2em] px-3 mb-2">
        Menu
      </p>
      {sideBarLinks.map((elem, index) => (
        <NavigationLink
          key={index}
          label={elem.label}
          icon={elem.icon}
          onClick={() => setActiveIndex(index)}
          isActive={activeIndex === index}
          path={elem.path}
        />
      ))}

      <div className="mx-3 my-4 h-px bg-linear-to-r from-transparent via-[#EDD9C8] to-transparent"></div>

      <p className="text-[9px] font-extrabold text-[#C9A88A] uppercase tracking-[0.2em] px-3 mb-1">
        Communities
      </p>
      <div
        onClick={() => setOpenDropdown((prev) => !prev)}
        className="flex items-center px-3 justify-between cursor-pointer py-2.5 rounded-xl hover:bg-[#FAEBD8] transition-all duration-200 group"
      >
        <div className="flex items-center gap-3">
          <div className="bg-linear-to-br from-[#AF503A] to-[#8B3010] p-1.5 rounded-lg">
            <Icon icon="mdi:account-group" width="16" height="16" className="text-white" />
          </div>
          <p className="text-sm font-semibold text-[#1C0F08]">Browse All</p>
        </div>
        <Icon
          className={`text-[#AF503A] transition-transform duration-300 ${openDropdown ? "rotate-180" : ""}`}
          icon="ep:arrow-down-bold"
          width="13"
          height="13"
        />
      </div>

      {openDropdown && (
        <div className="px-1 flex flex-col gap-0.5 mt-0.5">
          {dropdownElement.map((elem, index) => (
            <div
              key={index}
              onClick={() => navigate("/communities")}
              className="flex items-center gap-3 cursor-pointer px-3 py-2 rounded-xl hover:bg-[#FAEBD8] transition-all duration-200"
            >
              <img
                className="h-7 w-7 object-cover rounded-full border border-[#EDD9C8]"
                src={elem.img}
                alt={elem.name}
              />
              <p className="text-sm font-medium text-[#1C0F08]">{elem.name}</p>
            </div>
          ))}
        </div>
      )}
    </aside>
  );
};

export default Sidebar;
