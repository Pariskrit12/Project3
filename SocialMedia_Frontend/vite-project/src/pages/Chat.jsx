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
    <main className="grid grid-cols-[1fr_2fr] gap-5">
      <div className="flex flex-col w-full md:w-100">
        <h1 className="text-xl font-bold mb-3 text-[#2C1A0E]">Chats</h1>
        <Input
          placeholder="Search..."
          value={searchValue}
          onChange={(e) => setSearchValue(e.target.value)}
          icon="material-symbols:search"
          type="text"
          className="w-full"
        />
        <section className="flex mt-4 gap-2 max-w-fit">
          {buttonFields.map((elem, index) => (
            <Button
              key={index}
              name={elem.name}
              onClick={() => setActiveIndex(index)}
              isActive={activeIndex === index}
            />
          ))}
        </section>
        <section className="grid grid-cols-1 mt-4 gap-1">
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

      <section>
        <div className="border border-[#E8D5C0] mt-20 h-150 rounded-2xl bg-[#FDF6EE] overflow-hidden flex flex-col">
          <div className="border-b border-[#E8D5C0] p-3 flex justify-between items-center bg-[#FEF7ED]">
            <div className="flex items-center gap-3">
              <div className="relative">
                <img
                  className="h-12 w-12 rounded-full object-cover border-2 border-[#AF503A]"
                  src="./Sharbani.png"
                  alt="photo"
                />
                <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-400 rounded-full border-2 border-[#FEF7ED]"></div>
              </div>
              <div className="flex flex-col">
                <p className="font-semibold text-[#2C1A0E]">Pariskrit Bhagat</p>
                <p className="text-xs text-[#B89880]">Active 1 hours ago</p>
              </div>
            </div>
            <div className="text-[#A43919] flex items-center gap-1">
              <button className="p-2 rounded-lg hover:bg-[#F4D9C6] transition-colors">
                <Icon icon="weui:video-call-filled" width="28" height="28" />
              </button>
              <button className="p-2 rounded-lg hover:bg-[#F4D9C6] transition-colors">
                <Icon icon="material-symbols:call" width="24" height="24" />
              </button>
              <button className="p-2 rounded-lg hover:bg-[#F4D9C6] transition-colors text-[#B89880]">
                <Icon icon="charm:cross" width="24" height="24" />
              </button>
            </div>
          </div>

          <div className="border-b border-[#E8D5C0] h-115 overflow-y-auto">
            <div className="flex-1 p-4 space-y-3">
              <div className="flex items-end gap-2">
                <img className="w-7 h-7 rounded-full object-cover shrink-0" src="./Sharbani.png" />
                <div className="bg-[#EEE7DB] w-fit px-4 py-2.5 rounded-2xl rounded-bl-sm max-w-xs">
                  <p className="text-sm text-[#2C1A0E]">Hello!</p>
                </div>
              </div>
              <div className="flex items-end gap-2 justify-end">
                <div className="bg-[#A43919] w-fit px-4 py-2.5 rounded-2xl rounded-br-sm max-w-xs">
                  <p className="text-sm text-white">Hi, what's up?</p>
                </div>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3 p-3 bg-[#FEF7ED] relative">
            <button className="text-[#A43919] p-1.5 rounded-lg hover:bg-[#F4D9C6] transition-colors shrink-0">
              <Icon icon="material-symbols:image" width="26" height="26" />
            </button>
            <div className="flex-1">
              <Input placeholder="Type a message..." />
            </div>
            <button
              onClick={() => setShowPicker((prev) => !prev)}
              className="text-[#A43919] p-1.5 rounded-lg hover:bg-[#F4D9C6] transition-colors shrink-0"
            >
              <Icon icon="mdi:emoji" width="26" height="26" />
            </button>
            {showPicker && (
              <div className="absolute bottom-90 right-10 z-50 h-40">
                <EmojiPicker theme="dark" />
              </div>
            )}
          </div>
        </div>
      </section>
    </main>
  );
};

export default Chat;
