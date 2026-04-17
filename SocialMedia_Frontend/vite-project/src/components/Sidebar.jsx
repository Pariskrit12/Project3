import { Icon } from "@iconify/react";
import React, { useState } from "react";
import { Link } from "react-router-dom";
import NavigationLink from "./common/NavigationLink";
const Sidebar = () => {
  const sideBarLinks = [
    { icon: "boxicons:home-filled", label: "Home", path: "/" },
    { icon: "mingcute:trending-up-fill", label: "Trending", path:"/trending" },
    { icon: "fluent:new-16-filled", label: "New" ,path:"/new"},
    { icon: "fluent:align-top-24-filled", label: "Top",path:"/top" },
    { icon: "material-symbols:communities", label: "Communities" ,path:"/communities"},
    { icon: "lets-icons:setting-fill", label: "Settings",path:'/settings' },
    { icon: "material-symbols:login", label: "Login", path: "/login" },
  ];
  const [activeIndex, setActiveIndex] = useState(0);

  return (
    <aside className="fixed z-100 bg-[#faeddf] flex flex-col p-4 w-65 gap-5 h-screen">
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
    </aside>
  );
};

export default Sidebar;
