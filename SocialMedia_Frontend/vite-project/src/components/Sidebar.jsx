import { Icon } from "@iconify/react";
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import NavigationLink from "./common/NavigationLink";
const Sidebar = () => {
  const sideBarLinks = [
    { icon: "boxicons:home-filled", label: "Home", path: "/" },
    { icon: "mingcute:trending-up-fill", label: "Trending", path:"/trending" },
    { icon: "fluent:new-16-filled", label: "New" ,path:"/new"},
    { icon: "fluent:align-top-24-filled", label: "Top",path:"/top" },
    { icon: "lets-icons:setting-fill", label: "Settings",path:'/settings' },
    { icon: "material-symbols:login", label: "Login", path: "/login" },
  ];
const navigate=useNavigate();
  const dropdownElement=[
    {name:"Personal Life", img:"./Sharbani.png"},
    {name:"Football", img:"./football.png"},
    {name:"F1", img:"./post3.jpg"}
  ]
  const [activeIndex, setActiveIndex] = useState(0);
  const[openDropdown,setOpenDropdown]=useState(false);

  const handleDropDownClick=()=>{
    setOpenDropdown(prev=>!prev);
  }
  console.log(openDropdown);
  
  return (
    <aside className="fixed z-100 bg-[#faeddf] flex flex-col p-4 w-65 gap-5 h-screen font-bold">
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
      <div onClick={handleDropDownClick} className="flex items-center pl-3 justify-between cursor-pointer py-2 hover:bg-[#F4D9C6]">
        <p>Communities</p>
        <Icon className="text-[#AF503A]" icon="ep:arrow-down-bold" width="24" height="24" />
        </div>
        {openDropdown &&(
         <div className=" px-2 grid grid-cols-1 gap-2">
          {dropdownElement.map((elem,index)=>(

          <div onClick={()=>navigate('/communities')} className="flex items-center gap-3 cursor-pointer px-5 py-1  hover:bg-[#F4D9C6]" >
            <img className="h-10 w-10 object-cover rounded-full" src={elem.img}/>
            <p>{elem.name}</p>
          </div>
          ))}
         </div>
        )}
    </aside>
  );
};

export default Sidebar;
