import { Icon } from "@iconify/react";
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
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

  const handleDropDownClick = () => {
    setOpenDropdown((prev) => !prev);
  };
  console.log(openDropdown);

  return (
    <aside className="fixed z-100 bg-[#FEF7ED] flex flex-col px-3 py-5 w-65 gap-1 h-screen font-bold border-r border-[#E8D5C0]">
      <p className="text-[10px] font-bold text-[#B89880] uppercase tracking-[0.15em] px-3 mb-2">Menu</p>
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
      <div className="mx-3 my-3 border-t border-[#E8D5C0]"></div>
      <p className="text-[10px] font-bold text-[#B89880] uppercase tracking-[0.15em] px-3 mb-1">Communities</p>
      <div
        onClick={handleDropDownClick}
        className="flex items-center px-3 justify-between cursor-pointer py-2.5 rounded-xl hover:bg-[#F4D9C6] transition-all duration-200"
      >
        <div className="flex items-center gap-3">
          <Icon className="text-[#AF503A]" icon="mdi:account-group" width="20" height="20" />
          <p className="text-sm font-semibold text-[#2C1A0E]">Browse All</p>
        </div>
        <Icon
          className={`text-[#AF503A] transition-transform duration-200 ${openDropdown ? "rotate-180" : ""}`}
          icon="ep:arrow-down-bold"
          width="14"
          height="14"
        />
      </div>
      {openDropdown && (
        <div className="px-1 grid grid-cols-1 gap-0.5">
          {dropdownElement.map((elem, index) => (
            <div
              key={index}
              onClick={() => navigate("/communities")}
              className="flex items-center gap-3 cursor-pointer px-3 py-2 rounded-lg hover:bg-[#F4D9C6] transition-all duration-200"
            >
              <img className="h-7 w-7 object-cover rounded-full" src={elem.img} />
              <p className="text-sm font-medium text-[#2C1A0E]">{elem.name}</p>
            </div>
          ))}
        </div>
      )}
    </aside>
  );
};

export default Sidebar;
