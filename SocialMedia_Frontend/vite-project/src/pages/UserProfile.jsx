import React, { useState } from "react";
import Button from "../components/common/Button";
import { Icon } from "@iconify/react";
import Dropdown from "../components/common/Dropdown";

const UserProfile = () => {
  const buttons = [
    { name: "Overview" },
    { name: "Posts" },
    { name: "Comments" },
    { name: "Likes" },
    { name: "Dislikes" },
  ];

  const [active, setActive] = useState(0);

  return (
    <main className="px-6 max-w-3xl">
      <section className="flex justify-between items-start">
        <div className="flex gap-4 items-center">
          <div className="border-4 border-[#AF503A] rounded-full shadow-[0_4px_16px_rgba(164,57,25,0.2)]">
            <img
              className="rounded-full h-20 w-20 object-cover"
              src="./Sharbani.png"
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <div>
              <h1 className="font-bold text-xl text-[#2C1A0E]">Sharbani Bhattarai</h1>
              <p className="text-sm text-[#B89880]">@sharbai</p>
            </div>
            <div className="text-sm text-[#5C4033] flex gap-4">
              <p><span className="font-bold text-[#2C1A0E]">1</span> following</p>
              <p><span className="font-bold text-[#2C1A0E]">2</span> followers</p>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Button name="Follow" isActive={true} />
          <button className="p-2 rounded-xl hover:bg-[#F4D9C6] transition-colors">
            <Icon
              className="text-[#AF503A]"
              icon="fa7-solid:share"
              width="20"
              height="20"
            />
          </button>
        </div>
      </section>

      <section className="mt-6">
        <div className="flex gap-1 border-b border-[#E8D5C0]">
          {buttons.map((elem, index) => (
            <button
              key={index}
              onClick={() => setActive(index)}
              className={`px-4 py-2.5 text-sm font-semibold border-b-2 transition-all duration-200 -mb-px ${
                active === index
                  ? "border-[#A43919] text-[#A43919]"
                  : "border-transparent text-[#B89880] hover:text-[#5C4033]"
              }`}
            >
              {elem.name}
            </button>
          ))}
        </div>
      </section>
    </main>
  );
};

export default UserProfile;
