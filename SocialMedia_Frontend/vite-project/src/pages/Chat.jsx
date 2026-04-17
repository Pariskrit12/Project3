import React, { useState } from "react";

import { Icon } from "@iconify/react";
import Button from "../components/common/Button";
import ChatCard from "../components/ChatComponents/ChatCard";
import Input from "../components/common/Input";

const Chat = () => {
  const buttonFields = [{ name: "All" }, { name: "Groups" }];
  const [searchValue, setSearchValue] = useState("");
  const [activeIndex, setActiveIndex] = useState(0);

  return (
    <main className="flex justify-center ">
      <div className="flex flex-col w-full md:w-150">

      <h1 className="text-2xl font-bold mb-2">Chats</h1>
      <Input
        placeholder="Search"
        value={searchValue}
        onChange={(e) => setSearchValue(e.target.value)}
        icon="material-symbols:search"
        type="text"
        className="w-full outline-none md:w-150"
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
    </main>
  );
};

export default Chat;
