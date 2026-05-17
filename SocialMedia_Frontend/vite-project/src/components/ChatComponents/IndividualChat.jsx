import { Icon } from "@iconify/react";
import React from "react";
import Input from "../common/Input";

const IndividualChat = () => {
  return (
    <main className="fixed bottom-0  bg-[#FEF7ED] border h-100 w-85 rounded-lg flex flex-col ">
      <section className=" border-b w-full flex justify-between items-center ">
        <div className="flex p-1 items-center gap-1.5">

        <img
          src="./Abhigya.png"
          className="w-12 h-12 rounded-full object-cover"
        />
        <div className="text-sm">
          <p>Sharbani Bhattarai</p>
          <p className="text-gray-500">Active 14min ago</p>
        </div>
        </div>
        <div className="flex gap-2 text-[#E11D48]">
          <Icon icon="material-symbols:call" width="24" height="24" />
          <Icon icon="mdi:video" width="24" height="24" />
          <Icon icon="ic:baseline-minus" width="24" height="24" />
          <Icon icon="charm:cross" width="24" height="24" />
        </div>
      </section>
      <section className="flex-1 overflow-y-auto p-2">
        
      </section>
      <section className="border-t w-full  flex  items-center gap-2 p-2">
        <Icon icon="ic:baseline-plus" width="24" height="24" />
        <Icon icon="mdi:emoji" width="24" height="24" />
        <input className="border w-full outline-none py-1 px-2 rounded-xl" type="text" placeholder="Aa"/>
      </section>
    </main>
  );
};

export default IndividualChat;
