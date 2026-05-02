import React, { useState } from "react";
import Button from "../components/common/Button";
import { Icon } from "@iconify/react";

const UserProfile = () => {
  const tabs = ["Overview", "Posts", "Comments", "Likes", "Dislikes"];
  const [active, setActive] = useState(0);

  return (
    <main className="max-w-3xl">
      <section className="relative mb-14">
        <div className="h-36 bg-linear-to-br from-[#AF503A] via-[#C7604A] to-[#E8963A] rounded-2xl overflow-hidden relative">
          <div className="absolute inset-0">
            <div className="absolute top-4 left-10 w-16 h-16 rounded-full bg-white/20"></div>
            <div className="absolute bottom-2 right-20 w-24 h-24 rounded-full bg-white/15"></div>
            <div className="absolute top-8 right-40 w-10 h-10 rounded-full bg-white/20"></div>
          </div>
        </div>

        <div className="absolute bottom-0 left-6 translate-y-1/2 z-10">
          <div className="border-4 border-[#FFF7F0] rounded-full shadow-[0_4px_20px_rgba(164,57,25,0.25)]">
            <img
              className="rounded-full h-20 w-20 object-cover"
              src="./Sharbani.png"
              alt="profile"
            />
          </div>
        </div>
      </section>

      <section className="px-1 mt-2">
        <div className="flex justify-end mb-3 gap-2">
          <Button name="Follow" isActive={true} />
          <button className="p-2 rounded-xl hover:bg-[#FAEBD8] transition-colors border border-[#EDD9C8] bg-[#FFFCF9]">
            <Icon className="text-[#AF503A]" icon="fa7-solid:share" width="18" height="18" />
          </button>
          <button className="p-2 rounded-xl hover:bg-[#FAEBD8] transition-colors border border-[#EDD9C8] bg-[#FFFCF9]">
            <Icon className="text-[#AF503A]" icon="tabler:dots" width="18" height="18" />
          </button>
        </div>
        <h1 className="font-black text-2xl text-[#1C0F08]">Sharbani Bhattarai</h1>
        <p className="text-sm text-[#9C7E6D]">@sharbai</p>
        <div className="text-sm text-[#4A2C1D] flex gap-5 mt-3">
          <div className="text-center">
            <p className="font-black text-lg text-[#1C0F08]">1</p>
            <p className="text-xs text-[#9C7E6D]">following</p>
          </div>
          <div className="text-center">
            <p className="font-black text-lg text-[#1C0F08]">2</p>
            <p className="text-xs text-[#9C7E6D]">followers</p>
          </div>
          <div className="text-center">
            <p className="font-black text-lg text-[#1C0F08]">24</p>
            <p className="text-xs text-[#9C7E6D]">posts</p>
          </div>
        </div>
      </section>

      <section className="mt-6 border-b border-[#EDD9C8]">
        <div className="flex gap-1">
          {tabs.map((tab, index) => (
            <button
              key={index}
              onClick={() => setActive(index)}
              className={`px-4 py-2.5 text-sm font-bold border-b-2 transition-all duration-200 -mb-px ${
                active === index
                  ? "border-[#A43919] text-[#A43919]"
                  : "border-transparent text-[#9C7E6D] hover:text-[#4A2C1D] hover:border-[#C9A88A]"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </section>
    </main>
  );
};

export default UserProfile;
