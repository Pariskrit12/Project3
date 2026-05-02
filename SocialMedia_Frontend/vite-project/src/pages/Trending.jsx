import React from "react";
import Cards from "../components/HomeComponents/Cards";
import { Icon } from "@iconify/react";

const posts = [
  {
    communityName: "Football",
    username: "goal_master",
    uploadedTime: "3h ago",
    titleOfPost: "What a match last night!",
    image: "./post2.jpg",
    description: "That last-minute goal completely changed the game. One of the most intense matches I've seen this season.",
  },
  {
    communityName: "F1",
    username: "speedster",
    uploadedTime: "2h ago",
    titleOfPost: "Crazy qualifying session",
    image: "./post3.jpg",
    description: "The lap times were insanely close today. One small mistake and you're out of the top 10.",
  },
];

const Trending = () => {
  return (
    <main className="flex flex-col gap-5">
      <div className="flex items-center gap-3">
        <div className="bg-linear-to-br from-[#AF503A] to-[#E8963A] p-2.5 rounded-xl shadow-[0_3px_12px_rgba(164,57,25,0.3)]">
          <Icon icon="mingcute:trending-up-fill" width="20" height="20" className="text-white" />
        </div>
        <div>
          <h1 className="font-black text-2xl text-[#1C0F08]">Trending</h1>
          <p className="text-sm text-[#9C7E6D]">What everyone is talking about</p>
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

export default Trending;
