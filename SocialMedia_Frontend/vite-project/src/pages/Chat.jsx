import React, { useState } from "react";

import { Icon } from "@iconify/react";
import Button from "../components/common/Button";
import ChatCard from "../components/ChatComponents/ChatCard";
import Input from "../components/common/Input";
import EmojiPicker from "emoji-picker-react";
const Chat = () => {
  const buttonFields = [{ name: "All" }, { name: "Groups" }];
  const [searchValue, setSearchValue] = useState("");
  const [activeIndex, setActiveIndex] = useState(0);
  const [showPicker, setShowPicker] = useState(false);
  return (
    <main className=" grid grid-cols-[1fr_2fr] gap-5">
      <div className="flex flex-col w-full md:w-100  ">
        <h1 className="text-2xl font-bold mb-2">Chats</h1>
        <Input
          placeholder="Search"
          value={searchValue}
          onChange={(e) => setSearchValue(e.target.value)}
          icon="material-symbols:search"
          type="text"
          className="w-full outline-none "
        />
        <section className="flex mt-5 gap-5 max-w-fit ">
          {buttonFields.map((elem, index) => (
            <Button
              key={index}
              name={elem.name}
              onClick={() => setActiveIndex(index)}
              isActive={activeIndex === index}
            />
          ))}
        </section>
        <section className="grid grid-cols-1 mt-5 gap-4">
          <ChatCard
            username="Pariskrit Bhagat"
            image="./Sharbani.png"
            messageSnip="Lorem ipsum dolor sit amet consectetur adipisicing elit. Ab, earum!"
          />
          <ChatCard
            username="Pariskrit Bhagat"
            image="./Sharbani.png"
            messageSnip="Lorem ipsum dolor sit amet consectetur adipisicing elit. Ab, earum!"
          />
          <ChatCard
            username="Pariskrit Bhagat"
            image="./Sharbani.png"
            messageSnip="Lorem ipsum dolor sit amet consectetur adipisicing elit. Ab, earum!"
          />
          <ChatCard
            username="Pariskrit Bhagat"
            image="./Sharbani.png"
            messageSnip="Lorem ipsum dolor sit amet consectetur adipisicing elit. Ab, earum!"
          />
          <ChatCard
            username="Pariskrit Bhagat"
            image="./Sharbani.png"
            messageSnip="Lorem ipsum dolor sit amet consectetur adipisicing elit. Ab, earum!"
          />
          <ChatCard
            username="Pariskrit Bhagat"
            image="./Sharbani.png"
            messageSnip="Lorem ipsum dolor sit amet consectetur adipisicing elit. Ab, earum!"
          />
          <ChatCard
            username="Pariskrit Bhagat"
            image="./Sharbani.png"
            messageSnip="Lorem ipsum dolor sit amet consectetur adipisicing elit. Ab, earum!"
          />
        </section>
      </div>
      <section className="">
        <div className="border mt-20 h-150 rounded-2xl">
          <div className="border-b p-2 flex justify-between">
            <div className="flex items-center gap-2">
              <img
                className="h-15 w-15 rounded-full object-cover border-2"
                src="./Sharbani.png"
                alt="photo"
              />
              <div className="flex flex-col items-center">
                <p>Pariskrit Bhagat</p>
                <p className="text-sm text-gray-400">Active 1 hours ago</p>
              </div>
            </div>
            <div className="text-[#A43919] flex items-center gap-5">
              <Icon icon="weui:video-call-filled" width="35" height="35" />
              <Icon icon="material-symbols:call" width="30" height="30" />
              <Icon icon="charm:cross" width="40" height="40" />
            </div>
          </div>
          <div className="border-b h-115">
            <div className="flex-1 p-4 overflow-y-auto space-y-3">
              <div className="bg-[#D9D9D9] w-fit px-4 py-2 rounded-lg">
                Hello!
              </div>

              <div className="bg-[#F2E3D5] w-fit px-4 py-2 rounded-lg ml-auto">
                Hi, what's up?
              </div>
            </div>
          </div>
          <div className="flex items-center gap-5 p-2 relative ">
            <Icon
              className="text-[#A43919]"
              icon="material-symbols:image"
              width="35"
              height="35"
            />
            <Input placeholder="Enter message" />
            <Icon
              onClick={() => setShowPicker((prev) => !prev)}
              className="text-[#A43919] relative"
              icon="mdi:emoji"
              width="35"
              height="35"
            />
            {showPicker && (
              <div className="absolute bottom-90 right-10 z-50 h-40">
                <EmojiPicker  theme="dark" />
              </div>
            )}
          </div>
        </div>
      </section>
    </main>
  );
};

export default Chat;
