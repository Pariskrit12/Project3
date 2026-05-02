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
    if (!ruleInput.trim()) return;
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
      description: "Lately I've been trying to wake up early, reduce screen time, and focus more on productivity. It's hard but slowly improving day by day.",
    },
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

  const [filter, setFilter] = useState("Best");

  return (
    <main>
      <section className="relative rounded-2xl overflow-hidden shadow-[0_4px_20px_rgba(164,57,25,0.15)]">
        <img className="w-full h-48 object-cover" src="./Banner1.jpg" alt="banner" />
        <div className="absolute inset-0 bg-linear-to-t from-[#1C0F08]/40 to-transparent"></div>
        <div className="absolute left-5 -bottom-10 border-[5px] border-[#FFF7F0] rounded-full shadow-[0_4px_20px_rgba(164,57,25,0.25)]">
          <img className="w-20 h-20 object-cover rounded-full" src="./Sharbani.png" alt="community" />
        </div>
      </section>

      <section className="ml-32 mt-5 mb-4">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-black text-[#1C0F08]">Personal Life</h1>
            <p className="text-sm text-[#9C7E6D] flex items-center gap-1 mt-0.5">
              <Icon icon="mdi:account-group" width="14" height="14" />
              124 members
            </p>
          </div>
          <div className="flex gap-2 items-center">
            <button className="p-2 rounded-xl hover:bg-[#FAEBD8] transition-colors border border-[#EDD9C8] bg-[#FFFCF9]">
              <Icon className="text-[#AF503A]" icon="clarity:notification-solid" width="20" height="20" />
            </button>
            <Button name="Create Post" icon="ic:round-plus" isActive={true} />
            <Button name="Join" />
            <button className="p-2 rounded-xl hover:bg-[#FAEBD8] transition-colors border border-[#EDD9C8] bg-[#FFFCF9]">
              <Icon className="text-[#AF503A]" icon="pepicons-pop:dots-x" width="18" height="18" />
            </button>
          </div>
        </div>
      </section>

      <section className="grid grid-cols-[2.3fr_1fr] mt-4 gap-5">
        <section className="grid grid-cols-1 gap-4">
          <Dropdown
            icon="ep:arrow-down-bold"
            value={filter}
            options={["Best", "Hot", "Top", "New"]}
            onSelect={(val) => setFilter(val)}
          />
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

        <section className="border border-[#EDD9C8] bg-[#FFFCF9] rounded-2xl max-h-fit sticky top-20 overflow-hidden shadow-[0_4px_20px_rgba(164,57,25,0.08)]">
          <div className="p-4 border-b border-[#EDD9C8]">
            <p className="font-black text-[#1C0F08]">About Community</p>
            <p className="text-sm text-[#4A2C1D] mt-2.5 leading-relaxed">
              A community for discussing anything related to personal life, daily
              experiences, relationships, and self-growth.
            </p>
            <p className="text-xs text-[#C9A88A] mt-2 flex items-center gap-1">
              <Icon icon="mdi:calendar" width="12" height="12" />
              Created Dec 31, 2026
            </p>
            <div className="flex gap-4 mt-3">
              <div>
                <p className="font-black text-xl text-[#1C0F08]">124</p>
                <p className="text-xs text-[#9C7E6D]">Members</p>
              </div>
              <div>
                <p className="font-black text-xl text-[#1C0F08]">48</p>
                <p className="text-xs text-[#9C7E6D]">Online</p>
              </div>
            </div>
          </div>

          <div className="p-4">
            <p className="font-black text-sm text-[#1C0F08] uppercase tracking-wide mb-3 flex items-center gap-2">
              <Icon icon="mdi:shield-check" width="16" height="16" className="text-[#AF503A]" />
              Community Rules
            </p>
            <div className="flex flex-col gap-2">
              {rules.length === 0 && (
                <p className="text-sm text-[#C9A88A] italic">No rules added yet</p>
              )}
              {rules.map((elem, index) => (
                <div className="text-sm text-[#4A2C1D] flex gap-2" key={index}>
                  <span className="font-black text-[#AF503A] shrink-0">{index + 1}.</span>
                  <span>{elem}</span>
                </div>
              ))}
            </div>
            {open && (
              <div className="mt-3">
                <Input
                  placeholder="Enter rule..."
                  value={ruleInput}
                  onChange={(e) => setRuleInput(e.target.value)}
                />
              </div>
            )}
            <div className="flex w-full justify-center mt-4">
              <Button
                name={open ? "Add Rule" : "Add Rules"}
                isActive={true}
                onClick={open ? addRuleHandler : () => setOpen(true)}
                icon={open ? "ic:round-plus" : "ic:round-plus"}
              />
            </div>
          </div>
        </section>
      </section>
    </main>
  );
};

export default Communites;
