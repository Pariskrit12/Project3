import { Icon } from "@iconify/react";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import SettingList from "../components/SettingComponent/SettingList";
import Input from "../components/common/Input";
import Button from "../components/common/Button";

const AccountInformation = () => {
  const accountSettingList = [
    { name: "Username", description: "sharbani" },
    { name: "Phone number", description: "+977 980123456788" },
    { name: "Email", description: "email@gmail.com" },
    { name: "Country", description: "Nepal" },
    { name: "Gender", description: "Female" },
    { name: "Birth Date", description: "14 Nov, 2002" },
  ];

  const updateFields = [
    {
      name: "Update Username",
      key: "username",
      type: "text",
      placeholder: "New Username",
    },
    {
      name: "Update Phone Number",
      key: "phonenumber",
      type: "number",
      placeholder: "98********",
    },
    {
      name: "Update Email",
      key: "email",
      type: "email",
      placeholder: "New Email",
    },
    {
      name: "Update Country",
      key: "country",
      type: "text",
      placeholder: "Choose Country",
    },
    {
      name: "Update Gender",
      key: "gender",
      type: "text",
      placeholder: "Gender",
    },
    {
      name: "Update Birth Date",
      key: "birthdate",
      type: "text",
      placeholder: "Birth Date",
    },
  ];

  const [activeField, setActiveField] = useState(null);
  const activeUpdate = updateFields.find((f) => f.key === activeField);
  console.log(activeUpdate);

  const navigate = useNavigate();

  return (
    <main className="grid grid-cols-2 gap-6">
      <section>
        <div className="flex items-center gap-3 mb-5">
          <button
            onClick={() => navigate("/settings")}
            className="p-2 rounded-xl hover:bg-[#F4D9C6] transition-colors text-[#2C1A0E] cursor-pointer"
          >
            <Icon icon="tabler:arrow-left" width="24" height="24" />
          </button>
          <h1 className="text-2xl font-bold text-[#2C1A0E]">Account Information</h1>
        </div>
        <section className="grid grid-cols-1 gap-3 px-2">
          {accountSettingList.map((elem, index) => (
            <SettingList
              type="AccountInfo"
              key={index}
              name={elem.name}
              description={elem.description}
              onClick={() => {
                setActiveField(elem.name.toLowerCase().replace(/\s/, ""));
              }}
            />
          ))}
        </section>
      </section>

      <section className="flex items-center justify-center px-5">
        {activeUpdate ? (
          <div className="flex flex-col items-center w-90 gap-5 p-8 bg-[#FDF6EE] border border-[#E8D5C0] rounded-2xl">
            <div className="bg-[#EEE7DB] rounded-full p-4">
              <Icon icon="mdi:user-edit" width="32" height="32" className="text-[#A43919]" />
            </div>
            <h2 className="font-bold text-lg text-[#2C1A0E]">{activeUpdate.name}</h2>
            <Input type={activeUpdate.type} placeholder={activeUpdate.placeholder} />
            <Button name={activeUpdate.name} isActive={true} />
          </div>
        ) : (
          <div className="flex flex-col items-center gap-3 text-center">
            <div className="bg-[#EEE7DB] rounded-full p-5">
              <Icon icon="mdi:user" width="40" height="40" className="text-[#B89880]" />
            </div>
            <p className="text-lg font-bold text-[#2C1A0E]">Select a field to update</p>
            <p className="text-sm text-[#B89880]">Choose an option from the left to edit</p>
          </div>
        )}
      </section>
    </main>
  );
};

export default AccountInformation;
