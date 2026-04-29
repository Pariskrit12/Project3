import React from "react";
import SettingList from "../components/SettingComponent/SettingList";

const Setting = () => {
  const settingList = [
    {
      name: "Account Information",
      icon: "mdi:user",
      description:
        "See your account information like your phone number and email address",
      path: "/settings/accountInformation",
    },
    {
      name: "Change your password",
      icon: "carbon:password",
      description: "Change your password any time",
      path: "/settings/changePassword",
    },
    {
      name: "Deactivate your account",
      icon: "picon:heartbroken",
      description: "Find out how you can deactivate your account",
      path: "/settings/deactivateAccount",
    },
  ];

  return (
    <main className="w-200 max-w-full">
      <div className="mb-5">
        <h1 className="font-bold text-2xl text-[#2C1A0E]">Settings</h1>
        <p className="text-sm text-[#B89880] mt-0.5">Manage your account preferences</p>
      </div>
      <section className="grid grid-cols-1 gap-3">
        {settingList.map((elem, index) => (
          <SettingList
            type="Setting"
            key={index}
            name={elem.name}
            description={elem.description}
            icon={elem.icon}
            path={elem.path}
          />
        ))}
      </section>
    </main>
  );
};

export default Setting;
