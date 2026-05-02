import React, { useState } from "react";
import Button from "../components/common/Button";
import Cards from "../components/HomeComponents/Cards";
import { Icon } from "@iconify/react";
import { useNavigate } from "react-router-dom";
import Input from "../components/common/Input";

const Home = () => {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");

  const posts = [
    {
      communityName: "Personal Life",
      username: "aryan_01",
      uploadedTime: "2h ago",
      titleOfPost: "Trying to fix my routine",
      image: "./Sharbani.png",
      description:
        "Lately I've been trying to wake up early, reduce screen time, and focus more on productivity. It's hard but slowly improving day by day.",
    },
    {
      communityName: "Football",
      username: "goal_master",
      uploadedTime: "3h ago",
      titleOfPost: "What a match last night!",
      image: "./post2.jpg",
      description:
        "That last-minute goal completely changed the game. One of the most intense matches I've seen this season.",
    },
    {
      communityName: "F1",
      username: "speedster",
      uploadedTime: "2h ago",
      titleOfPost: "Crazy qualifying session",
      image: "./post3.jpg",
      description:
        "The lap times were insanely close today. One small mistake and you're out of the top 10.",
    },
  ];

  return (
    <main className="flex flex-col gap-5">
      <section
        onClick={() => setOpen(true)}
        className="rounded-2xl overflow-hidden shadow-[0_3px_16px_rgba(164,57,25,0.15)]"
      >
        {open ? (
          <Input
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search anything..."
            icon="material-symbols:search"
            value={search}
            className="rounded-2xl border-2 border-[#AF503A] bg-white shadow-none"
          />
        ) : (
          <div className="flex items-center gap-3 w-full py-3.5 px-5 rounded-2xl bg-linear-to-r from-[#AF503A] via-[#C7604A] to-[#E8963A] cursor-pointer group">
            <Icon icon="material-symbols:search" width="22" height="22" className="text-white/80" />
            <span className="text-white/80 font-medium text-sm flex-1">Find anything...</span>
            <Icon icon="ph:magnifying-glass-bold" width="18" height="18" className="text-white/60" />
          </div>
        )}
      </section>

      <section className="flex items-center gap-2">
        {["Hot", "New", "Top", "Rising"].map((tab, i) => (
          <button
            key={i}
            onClick={() => i > 0 && navigate(`/${tab.toLowerCase()}`)}
            className={`px-3.5 py-1.5 rounded-full text-sm font-semibold transition-all duration-200 ${
              i === 0
                ? "bg-linear-to-r from-[#AF503A] to-[#C7604A] text-white shadow-[0_2px_8px_rgba(164,57,25,0.3)]"
                : "bg-[#F0E6DD] text-[#4A2C1D] hover:bg-[#FAEBD8] hover:text-[#A43919]"
            }`}
          >
            {tab}
          </button>
        ))}
      </section>

      <section className="grid grid-cols-1 gap-4">
        {posts.map((elem, index) => (
          <Cards
            key={index}
            communitteName={elem.communityName}
            image={elem.image}
            description={elem.description}
            titleOfPost={elem.titleOfPost}
            username={elem.username}
            uploadedTime={elem.uploadedTime}
            onClick={() => navigate("/postPage")}
          />
        ))}
      </section>
    </main>
  );
};

export default Home;
