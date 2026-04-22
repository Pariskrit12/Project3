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
      <section className="relative">
        <div className="">
          <img className="w-full h-50 object-fill" src="./Banner1.jpg" />
        </div>
        <div className=" absolute left-5 -bottom-12 border-8 rounded-full border-[#FEF7ED]">
          <img
            className=" w-25 h-25 object-cover rounded-full"
            src="./Sharbani.png"
            alt=""
          />
        </div>
      </section>
      <section className="ml-35 mt-5">
        <div className="flex justify-between">
          <h1 className="text-2xl font-bold">Personal Life</h1>
          <div className="flex gap-4 items-center">
            <Icon
              className="text-[#AF503A]"
              icon="clarity:notification-solid"
              width="24"
              height="24"
            />
            <Button name="Create Post" icon="ic:round-plus" />
            <Button name="Join" />
            <Icon
              className="text-[#AF503A]"
              icon="pepicons-pop:dots-x"
              width="24"
              height="24"
            />
          </div>
        </div>
      </section>
      <section className="grid grid-cols-[2.3fr_1fr] mt-5 gap-2">
        <section className="grid grid-cols-1 gap-2">
          <Dropdown
            icon="ep:arrow-down-bold"
            value={filter}
            options={["Best", "Hot", "Top", "New"]}
            onSelect={(val) => setFilter(val)}
          />

          <div className="grid grid-cols-1 gap-5">
            {posts.map((elem, index) => (
              <Cards
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
        <section className="border rounded-xl max-h-fit sticky top-25">
          <div className="p-2">
            <p className="font-bold">Personal Life</p>

            <div className="flex flex-col gap-2 mt-2">
              <p className="text-gray-400 text-sm">
                A community for discussing anything related to personal life,
                daily experiences, relationships, and self-growth. Share your
                thoughts, stories, and advice. Join the conversation and connect
                with others going through similar journeys.
              </p>

              <p className="text-sm text-gray-400">Created Dec 31, 2026</p>
            </div>
            <div className="flex flex-col mt-2">
              <p className="font-bold ">124</p>
              <p className="text-sm text-gray-400">Members</p>
            </div>
          </div>
          <div className="border border-gray-400 mt-1"></div>
          <div className="pl-2 py-2 ">
            <p className="font-bold">PERSONAL LIFE RULES</p>
            <div className="grid grid-cols-1 gap-2 mt-2">

            {rules.map((elem, index) => (
              <div className="text-sm w-full text-gray-400" key={index}>
                  {index+1}.&nbsp;{elem}
              </div>
            ))}
            </div>
            {open && (
              <div className="mt-2">
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
