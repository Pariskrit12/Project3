import React from "react";
import Cards from "../components/HomeComponents/Cards";
import { Icon } from "@iconify/react";

const posts = [
  {
    communityName: "Personal Life",
    username: "aryan_01",
    uploadedTime: "Just now",
    titleOfPost: "Trying to fix my routine",
    image: "./Sharbani.png",
    description: "Lately I've been trying to wake up early, reduce screen time, and focus more on productivity.",
  },
];

const New = () => {
  return (
    <main className="flex flex-col gap-5">
      <div className="flex items-center gap-3">
        <div className="bg-linear-to-br from-[#C7604A] to-[#AF503A] p-2.5 rounded-xl shadow-[0_3px_12px_rgba(164,57,25,0.3)]">
          <Icon icon="fluent:new-16-filled" width="20" height="20" className="text-white" />
        </div>
        <div>
          <h1 className="font-black text-2xl text-[#1C0F08]">New Posts</h1>
          <p className="text-sm text-[#9C7E6D]">Fresh from the community</p>
        </div>
      </div>
      <section className="grid grid-cols-1 gap-4">
        {posts.map((post, i) => (
          <Cards key={i} {...post} communitteName={post.communityName} />
        ))}
      </section>
    </main>
  );
};

export default New;
