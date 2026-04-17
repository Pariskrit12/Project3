import { Icon } from "@iconify/react";
import React from "react";
import { useNavigate } from "react-router-dom";
import SettingList from "../components/SettingComponent/SettingList";

const AccountInformation = () => {
    const accountSettingList=[
        {name:"username",description:"sharbani"},
        {name:"Phone number",description:"+977 980123456788"},
        {name:"Email",description:"email@gmail.com"},
        {name:"Country",description:"Nepal"},
        {name:"Gender",description:"Female"},
        {name:"Birth Date",description:"14 Nov, 2002"},
    ]
  const navigate = useNavigate();
  return (
    <main>
      <div className="flex w-70 justify-between items-center font-bold gap-3">
        <Icon
          onClick={() => navigate("/settings")}
          icon="tabler:arrow-left"
          width="30"
          height="30"
          className="cursor-pointer"
        />
        <h1 className="text-2xl">Account Information</h1>
      </div>
      <section className="grid grid-cols-1 gap-4 w-150 px-12 py-5">
        {accountSettingList.map((elem,index)=>(
            <SettingList key={index} name={elem.name} description={elem.description}/>
        ))}
      </section>
    </main>
  );
};

export default AccountInformation;
