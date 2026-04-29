import { Icon } from "@iconify/react";
import React, { useState } from "react";
import Button from "../components/common/Button";
import Dropdown from "../components/common/Dropdown";
import Cards from "../components/HomeComponents/Cards";
import Input from "../components/common/Input";

const Communites = () => {
  const [open, setOpen] = useState(false);
  const [rules, setRules] = useState([]);
  const [ruleInput, setRuleInput] = useState("");

  const addRuleHandler = () => {
    setRules([...rules, ruleInput]);
    setRuleInput("");
    setOpen(false);
  };

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

  const [filter, setFilter] = useState("Best");

  return (
    <main>
      <section className="relative rounded-2xl overflow-hidden">
        <img className="w-full h-48 object-cover" src="./Banner1.jpg" />
        <div className="absolute left-5 -bottom-10 border-[6px] border-[#FEF7ED] rounded-full shadow-lg">
          <img
            className="w-20 h-20 object-cover rounded-full"
            src="./Sharbani.png"
            alt=""
          />
        </div>
      </section>

      <section className="ml-32 mt-4 mb-4">
        <div className="flex justify-between items-center">
          <h1 className="text-xl font-bold text-[#2C1A0E]">Personal Life</h1>
          <div className="flex gap-2 items-center">
            <button className="p-2 rounded-xl hover:bg-[#F4D9C6] transition-colors">
              <Icon
                className="text-[#AF503A]"
                icon="clarity:notification-solid"
                width="22"
                height="22"
              />
            </button>
            <Button name="Create Post" icon="ic:round-plus" isActive={true} />
            <Button name="Join" />
            <button className="p-2 rounded-xl hover:bg-[#F4D9C6] transition-colors">
              <Icon
                className="text-[#AF503A]"
                icon="pepicons-pop:dots-x"
                width="20"
                height="20"
              />
            </button>
          </div>
        </div>
      </section>

      <section className="grid grid-cols-[2.3fr_1fr] mt-3 gap-4">
        <section className="grid grid-cols-1 gap-3">
          <div>
            <Dropdown
              icon="ep:arrow-down-bold"
              value={filter}
              options={["Best", "Hot", "Top", "New"]}
              onSelect={(val) => setFilter(val)}
            />
          </div>
          <div className="grid grid-cols-1 gap-4">
            {posts.map((elem, index) => (
              <Cards
                key={index}
                titleOfPost={elem.titleOfPost}
                uploadedTime={elem.uploadedTime}
                username={elem.username}
                description={elem.description}
                image={elem.image}
                communitteName={elem.communityName}
              />
            ))}
          </div>
        </section>

        <section className="border border-[#E8D5C0] bg-[#FDF6EE] rounded-2xl max-h-fit sticky top-25 overflow-hidden">
          <div className="p-4 border-b border-[#E8D5C0]">
            <p className="font-bold text-[#2C1A0E]">Personal Life</p>
            <p className="text-sm text-[#B89880] mt-2 leading-relaxed">
              A community for discussing anything related to personal life,
              daily experiences, relationships, and self-growth. Share your
              thoughts, stories, and advice. Join the conversation and connect
              with others going through similar journeys.
            </p>
            <p className="text-xs text-[#B89880] mt-2">Created Dec 31, 2026</p>
            <div className="flex flex-col mt-3">
              <p className="font-bold text-lg text-[#2C1A0E]">124</p>
              <p className="text-xs text-[#B89880]">Members</p>
            </div>
          </div>

          <div className="p-4">
            <p className="font-bold text-sm text-[#2C1A0E] uppercase tracking-wide mb-3">Personal Life Rules</p>
            <div className="grid grid-cols-1 gap-2">
              {rules.map((elem, index) => (
                <div className="text-sm text-[#5C4033] flex gap-2" key={index}>
                  <span className="font-bold text-[#A43919]">{index + 1}.</span>
                  <span>{elem}</span>
                </div>
              ))}
            </div>
            {open && (
              <div className="mt-3">
                <Input
                  placeholder="Enter Rules"
                  value={ruleInput}
                  onChange={(e) => setRuleInput(e.target.value)}
                />
              </div>
            )}
            <div className="flex w-full justify-center mt-4">
              <Button
                name={open ? "Enter" : "Add Rules"}
                isActive={true}
                onClick={open ? addRuleHandler : () => setOpen(true)}
              />
            </div>
          </div>
        </section>
      </section>
    </main>
  );
};

export default Communites;
