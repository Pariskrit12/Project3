import React from "react";
import RecentPostCard from "./HomeComponents/RecentPostCard";

const RecentPostModule = () => {
  return (
    <main className="py-4 pr-2">
      <section className="rounded-2xl bg-[#FDF6EE] px-3 py-4 border border-[#E8D5C0] shadow-[0_2px_12px_rgba(164,57,25,0.08)]">
        <div className="flex justify-between items-center mb-1 pb-3 border-b border-[#E8D5C0]">
          <h2 className="text-sm font-bold text-[#2C1A0E]">Recent Posts</h2>
          <p className="text-xs text-[#AF503A] font-semibold cursor-pointer hover:text-[#A43919] transition-colors">Clear Posts</p>
        </div>
        <div className="grid grid-cols-1">
          <RecentPostCard />
        </div>
      </section>
    </main>
  );
};

export default RecentPostModule;
