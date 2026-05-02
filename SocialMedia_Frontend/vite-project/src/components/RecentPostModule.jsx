import React from "react";
import RecentPostCard from "./HomeComponents/RecentPostCard";
import { Icon } from "@iconify/react";

const RecentPostModule = () => {
  return (
    <main className="py-5 pr-3">
      <section className="rounded-2xl bg-[#FFFCF9] border border-[#EDD9C8] shadow-[0_2px_16px_rgba(164,57,25,0.07)] overflow-hidden">
        <div className="flex justify-between items-center px-4 py-3 border-b border-[#EDD9C8] bg-linear-to-r from-[#FFF7F0] to-[#FFFCF9]">
          <div className="flex items-center gap-2">
            <Icon icon="mdi:clock-outline" width="15" height="15" className="text-[#AF503A]" />
            <h2 className="text-sm font-bold text-[#1C0F08]">Recent Posts</h2>
          </div>
          <p className="text-xs text-[#AF503A] font-semibold cursor-pointer hover:text-[#A43919] transition-colors">
            Clear
          </p>
        </div>
        <div className="px-4 flex flex-col">
          <RecentPostCard />
          <RecentPostCard />
          <RecentPostCard />
        </div>
      </section>
    </main>
  );
};

export default RecentPostModule;
