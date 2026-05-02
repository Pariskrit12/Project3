import React, { useState } from "react";
import Cards from "../components/HomeComponents/Cards";
import CommentInput from "../components/common/CommentInput";
import { Icon } from "@iconify/react";

const Postpage = () => {
  const [comment, setComment] = useState("");

  return (
    <main className="flex flex-col gap-5 max-w-2xl">
      <section>
        <Cards
          showFull={true}
          communitteName="Personal Life"
          username="aryan_01"
          uploadedTime="2h ago"
          titleOfPost="Trying to fix my routine"
          image="./Sharbani.png"
          description="Lately I've been trying to wake up early, reduce screen time, and focus more on productivity. It's hard but slowly improving day by day."
        />
      </section>

      <section className="flex flex-col gap-4">
        <div className="flex items-center gap-2">
          <h2 className="font-black text-lg text-[#1C0F08]">Comments</h2>
          <span className="bg-[#F0E6DD] text-[#A43919] text-xs font-bold px-2.5 py-0.5 rounded-full">12</span>
        </div>
        <CommentInput
          placeholder="Write a comment..."
          onChange={(e) => setComment(e.target.value)}
          value={comment}
        />

        <div className="flex flex-col gap-3 mt-2">
          {[1, 2].map((_, i) => (
            <div key={i} className="flex gap-3 p-4 bg-[#FFFCF9] border border-[#EDD9C8] rounded-2xl">
              <img src="./Sharbani.png" alt="avatar" className="w-9 h-9 rounded-full object-cover border border-[#EDD9C8] shrink-0" />
              <div className="flex flex-col gap-1 flex-1">
                <div className="flex items-center gap-2">
                  <p className="font-bold text-sm text-[#1C0F08]">user_{i + 1}</p>
                  <p className="text-xs text-[#C9A88A]">1h ago</p>
                </div>
                <p className="text-sm text-[#4A2C1D] leading-relaxed">
                  Great post! Really resonates with what I've been going through lately.
                </p>
                <div className="flex items-center gap-3 mt-1">
                  <button className="flex items-center gap-1 text-xs text-[#9C7E6D] hover:text-[#A43919] transition-colors">
                    <Icon icon="boxicons:like" width="14" height="14" />
                    <span>24</span>
                  </button>
                  <button className="text-xs text-[#9C7E6D] hover:text-[#A43919] transition-colors font-medium">
                    Reply
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
};

export default Postpage;
