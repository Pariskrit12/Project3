import React from "react";
import SettingList from "../components/SettingComponent/SettingList";
import { Icon } from "@iconify/react";

const Setting = () => {
  const settingList = [
    {
      name: "Account Information",
      icon: "mdi:user",
      description: "See your account info like phone number and email",
      path: "settings/accountInformation",
    },
    {
      name: "Change your password",
      icon: "carbon:password",
      description: "Change your password at any time",
      path: "settings/changePassword",
    },
  ];

  return (
    <main className="max-w-2xl">
      <div className="mb-6 flex items-center gap-4">
        <div className="bg-linear-to-br from-[#E11D48] to-[#FB7185] p-3 rounded-2xl shadow-[0_4px_16px_rgba(225,29,72,0.3)]">
          <Icon icon="lets-icons:setting-fill" width="26" height="26" className="text-white" />
        </div>
        <div>
          <h1 className="font-black text-2xl text-[#1C0714]">Settings</h1>
          <p className="text-sm text-[#BE7090]">Manage your account preferences</p>
        </div>
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
