import React, { useState } from "react";
import Button from "../components/common/Button";
import Cards from "../components/HomeComponents/Cards";
import { Icon } from "@iconify/react";
import { useNavigate } from "react-router-dom";
import RecentPostCard from "../components/HomeComponents/RecentPostCard";

const Home = () => {
  // const buttonDetails = [
  //   { name: "Trending", icon: "material-symbols:trending-up" },
  //   { name: "New", icon: "fluent:new-16-filled" },
  //   { name: "Top", icon: "icon-park-solid:align-top-two" },
  // ];
  // const [activeIndex, setActiveIndex] = useState(0);
  const navigate = useNavigate();

  const navigateToPostPage = () => {
    navigate("/postPage");
  };
const posts = [
  {
    communityName: "Personal Life",
    username: "aryan_01",
    uploadedTime: "2h ago",
    titleOfPost: "Trying to fix my routine",
    image: "./Sharbani.png",
    description: "Lately I've been trying to wake up early, reduce screen time, and focus more on productivity. It's hard but slowly improving day by day."
  },
  {
    communityName: "Football",
    username: "goal_master",
    uploadedTime: "3h ago",
    titleOfPost: "What a match last night!",
    image: "./post2.jpg",
    description: "That last-minute goal completely changed the game. One of the most intense matches I've seen this season."
  },
  {
    communityName: "F1",
    username: "speedster",
    uploadedTime: "2h ago",
    titleOfPost: "Crazy qualifying session",
    image: "./post3.jpg",
    description: "The lap times were insanely close today. One small mistake and you're out of the top 10."
  }
];
  return (
    <main className="  ">
      {/* <section className="flex justify-between">
        {buttonDetails.map((elem, index) => (
          <Button
            key={index}
            name={elem.name}
            icon={elem.icon}
            onClick={() => setActiveIndex(index)}
            isActive={activeIndex === index}
          />
        ))}
      </section> */}
     
        <section>
          <div className="p-0.5 rounded-3xl bg-linear-to-r from-[#AF503A] to-[#F4A261]">
            <button className="flex items-center gap-2 w-full justify-center py-3 rounded-3xl bg-[#FEF7ED]  ">
              <Icon
                className="text-[#AF503A]"
                icon="ph:alien-fill"
                width="30"
                height="30"
              />
              <span>Find anything</span>
            </button>
          </div>
        </section>
        <section className="mt-8 grid grid-cols-1 gap-5">
          
          {posts.map((elem,index)=>(
            <Cards communitteName={elem.communityName} image={elem.image} description={elem.description} titleOfPost={elem.titleOfPost} username={elem.username} uploadedTime={elem.uploadedTime} />
          ))}
        </section>
     
      
    </main>
  );
};

export default Home;
