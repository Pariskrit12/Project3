import React, { useState } from "react";
import Button from "../components/common/Button";
import { Icon } from "@iconify/react";
import Dropdown from "../components/common/Dropdown";

const UserProfile = () => {
    const buttons=[
        {name:"Overview"},
        {name:"Posts"},
        {name:"Comments"},
        {name:"Likes"},
        {name:"Dislikes"}
    ]

    const[active,setActive]=useState(0);
  return (
    <main className="px-10">
      <section className="flex justify-between   ">
        <div>
          <div className="border-4 border-[#AF503A] max-w-fit rounded-full">
            <img
              className="rounded-full h-20 w-20 object-cover"
              src="./Sharbani.png"
            />
          </div>
          <div className="flex flex-col gap-2">
            <div>
              <h1 className="font-bold">Sharbani Bhattarai</h1>
              <p className="text-gray-500">@sharbai</p>
              <div className="text-sm text-gray-500 flex gap-2">

              <p>1 following</p>
              <p>2 followers</p>
              </div>
            </div>
          </div>
        </div>
        <div className="flex h-11 items-center gap-4 ">
          <Button name="Follow" />
          <Icon
            className="text-[#AF503A]"
            icon="fa7-solid:share"
            width="24"
            height="24"
          />
        </div>
      </section>
      <section className="mt-5 flex flex-col gap-3">
        <div className="flex justify-between mb-4">

        {buttons.map((elem,index)=>(
            <Button key={index} name={elem.name} onClick={()=>setActive(index)} isActive={active===index}/>
        ))}
        </div>
        <Dropdown icon="iconamoon:options-bold" name="Feed options"/>
      </section>
      <div className="border mt-2 text-gray-300"></div>
    </main>
  );
};

export default UserProfile;
