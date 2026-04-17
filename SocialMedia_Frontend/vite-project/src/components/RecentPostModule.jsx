import React from "react";
import RecentPostCard from "./HomeComponents/RecentPostCard";

const RecentPostModule = () => {
  return (
    <main>
      <section className=" top-25 right-1  h-[calc(100vh-80px)] overflow-y-auto rounded-xl bg-[#FDF6EE] p-2 border border-[#E8D5C0] shadow-[0_2px_12px_rgba(164,57,25,0.08)] mr-2">
        <div className="flex justify-between items-center mb-3">
          <h2 className="text-lg font-bold">Recent Post</h2>
          <p className="text-sm">Clear Posts</p>
        </div>
        <div className="grid grid-cols-1 gap-2">
          <RecentPostCard />
        </div>
      </section>
    </main>
  );
};

export default RecentPostModule;
