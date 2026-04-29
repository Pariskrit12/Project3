import React, { useState } from "react";
import Button from "../components/common/Button";
import Cards from "../components/HomeComponents/Cards";
import { Icon } from "@iconify/react";
import { useNavigate } from "react-router-dom";
import RecentPostCard from "../components/HomeComponents/RecentPostCard";
import Input from "../components/common/Input";

const Home = () => {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  const navigateToPostPage = () => {
    navigate("/postPage");
  };
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
      <section>
        <div
          onClick={() => setOpen(true)}
          className="p-0.5 rounded-2xl bg-linear-to-r from-[#AF503A] to-[#F4A261] shadow-[0_3px_16px_rgba(164,57,25,0.18)]"
        >
          {open ? (
            <Input
              onChange={(e) => setSearch(e.target.value)}
              className="bg-[#FEF7ED] rounded-2xl px-4 py-3 border-0"
              placeholder="Search anything..."
              icon="ph:alien-fill"
              value={search}
            />
          ) : (
            <button className="flex items-center gap-2.5 w-full justify-center py-3.5 rounded-2xl bg-[#FEF7ED]">
              <Icon
                className="text-[#AF503A]"
                icon="ph:alien-fill"
                width="24"
                height="24"
              />
              <span className="text-[#5C4033] font-medium text-sm">Find anything</span>
            </button>
          )}
        </div>
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
          />
        ))}
      </section>
    </main>
  );
};

export default Home;
