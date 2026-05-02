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
  const [message, setMessage] = useState("");

  return (
    <main className="grid grid-cols-[1fr_2fr] gap-5 h-full">
      <div className="flex flex-col w-full">
        <h1 className="text-2xl font-black mb-4 text-[#1C0F08]">Messages</h1>
        <Input
          placeholder="Search conversations..."
          value={searchValue}
          onChange={(e) => setSearchValue(e.target.value)}
          icon="material-symbols:search"
          type="text"
        />
        <div className="flex mt-4 gap-2 max-w-fit">
          {buttonFields.map((elem, index) => (
            <Button
              key={index}
              name={elem.name}
              onClick={() => setActiveIndex(index)}
              isActive={activeIndex === index}
            />
          ))}
        </div>
        <div className="mt-4 flex flex-col gap-0.5">
          {Array(7).fill(null).map((_, i) => (
            <ChatCard
              key={i}
              username="Pariskrit Bhagat"
              image="./Sharbani.png"
              messageSnip="Lorem ipsum dolor sit amet consectetur adipisicing elit. Ab, earum!"
            />
          ))}
        </div>
      </div>

      <section>
        <div className="border border-[#EDD9C8] mt-12 h-150 rounded-2xl bg-[#FFFCF9] overflow-hidden flex flex-col shadow-[0_4px_24px_rgba(164,57,25,0.1)]">
          <div className="border-b border-[#EDD9C8] p-3.5 flex justify-between items-center bg-[#FFF7F0]">
            <div className="flex items-center gap-3">
              <div className="relative">
                <img
                  className="h-11 w-11 rounded-full object-cover border-2 border-[#AF503A]"
                  src="./Sharbani.png"
                  alt="photo"
                />
                <div className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-400 rounded-full border-2 border-[#FFF7F0]"></div>
              </div>
              <div className="flex flex-col">
                <p className="font-bold text-[#1C0F08]">Pariskrit Bhagat</p>
                <p className="text-xs text-emerald-500 font-medium flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 inline-block"></span>
                  Active now
                </p>
              </div>
            </div>
            <div className="text-[#AF503A] flex items-center gap-0.5">
              <button className="p-2 rounded-xl hover:bg-[#FAEBD8] transition-colors">
                <Icon icon="weui:video-call-filled" width="26" height="26" />
              </button>
              <button className="p-2 rounded-xl hover:bg-[#FAEBD8] transition-colors">
                <Icon icon="material-symbols:call" width="22" height="22" />
              </button>
              <button className="p-2 rounded-xl hover:bg-[#FAEBD8] transition-colors text-[#C9A88A]">
                <Icon icon="charm:cross" width="22" height="22" />
              </button>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            <div className="flex items-end gap-2">
              <img className="w-7 h-7 rounded-full object-cover shrink-0" src="./Sharbani.png" alt="avatar" />
              <div className="bg-[#F0E6DD] w-fit px-4 py-2.5 rounded-2xl rounded-bl-sm max-w-xs shadow-sm">
                <p className="text-sm text-[#1C0F08]">Hello! 👋</p>
                <p className="text-[10px] text-[#C9A88A] mt-1">10:32 AM</p>
              </div>
            </div>
            <div className="flex items-end gap-2 justify-end">
              <div className="bg-linear-to-br from-[#AF503A] to-[#C7604A] w-fit px-4 py-2.5 rounded-2xl rounded-br-sm max-w-xs shadow-[0_2px_8px_rgba(164,57,25,0.25)]">
                <p className="text-sm text-white">Hi, what's up?</p>
                <p className="text-[10px] text-white/60 mt-1 text-right">10:33 AM</p>
              </div>
            </div>
            <div className="flex items-end gap-2">
              <img className="w-7 h-7 rounded-full object-cover shrink-0" src="./Sharbani.png" alt="avatar" />
              <div className="bg-[#F0E6DD] w-fit px-4 py-2.5 rounded-2xl rounded-bl-sm max-w-xs shadow-sm">
                <p className="text-sm text-[#1C0F08]">Not much, just checking in 😊</p>
                <p className="text-[10px] text-[#C9A88A] mt-1">10:35 AM</p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 p-3 bg-[#FFF7F0] border-t border-[#EDD9C8] relative">
            <button className="text-[#AF503A] p-2 rounded-xl hover:bg-[#FAEBD8] transition-colors shrink-0">
              <Icon icon="material-symbols:image" width="22" height="22" />
            </button>
            <div className="flex-1">
              <Input
                placeholder="Type a message..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
              />
            </div>
            <button
              onClick={() => setShowPicker((prev) => !prev)}
              className="text-[#AF503A] p-2 rounded-xl hover:bg-[#FAEBD8] transition-colors shrink-0"
            >
              <Icon icon="mdi:emoji" width="22" height="22" />
            </button>
            <button className="bg-linear-to-br from-[#AF503A] to-[#C7604A] text-white p-2 rounded-xl shadow-[0_2px_8px_rgba(164,57,25,0.3)] hover:shadow-[0_3px_12px_rgba(164,57,25,0.4)] transition-all shrink-0">
              <Icon icon="material-symbols:send" width="20" height="20" />
            </button>
            {showPicker && (
              <div className="absolute bottom-16 right-4 z-50">
                <EmojiPicker theme="light" height={350} />
              </div>
            )}
          </div>
        </div>
      </section>
    </main>
  );
};

export default Chat;
