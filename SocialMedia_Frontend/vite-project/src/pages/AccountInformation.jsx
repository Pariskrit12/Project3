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
    { name: "Update Username", key: "username", type: "text", placeholder: "New Username" },
    { name: "Update Phone Number", key: "phonenumber", type: "number", placeholder: "98********" },
    { name: "Update Email", key: "email", type: "email", placeholder: "New Email" },
    { name: "Update Country", key: "country", type: "text", placeholder: "Choose Country" },
    { name: "Update Gender", key: "gender", type: "text", placeholder: "Gender" },
    { name: "Update Birth Date", key: "birthdate", type: "text", placeholder: "Birth Date" },
  ];

  const [activeField, setActiveField] = useState(null);
  const activeUpdate = updateFields.find((f) => f.key === activeField);
  const navigate = useNavigate();

  return (
    <main className="grid grid-cols-2 gap-6">
      <section>
        <div className="flex items-center gap-3 mb-5">
          <button
            onClick={() => navigate("/settings")}
            className="p-2 rounded-xl hover:bg-[#FAEBD8] transition-colors text-[#1C0F08] border border-[#EDD9C8] bg-[#FFFCF9]"
          >
            <Icon icon="tabler:arrow-left" width="22" height="22" />
          </button>
          <div>
            <h1 className="text-2xl font-black text-[#1C0F08]">Account Info</h1>
            <p className="text-sm text-[#9C7E6D]">Click a field to edit</p>
          </div>
        </div>
        <section className="grid grid-cols-1 gap-2.5 px-1">
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
          <div className="flex flex-col items-center w-90 gap-5 p-8 bg-[#FFFCF9] border border-[#EDD9C8] rounded-2xl shadow-[0_4px_24px_rgba(164,57,25,0.1)]">
            <div className="bg-linear-to-br from-[#AF503A] to-[#C7604A] rounded-2xl p-4 shadow-[0_4px_16px_rgba(164,57,25,0.3)]">
              <Icon icon="mdi:user-edit" width="32" height="32" className="text-white" />
            </div>
            <h2 className="font-black text-lg text-[#1C0F08]">{activeUpdate.name}</h2>
            <div className="w-full">
              <Input type={activeUpdate.type} placeholder={activeUpdate.placeholder} />
            </div>
            <Button name={activeUpdate.name} isActive={true} />
          </div>
        ) : (
          <div className="flex flex-col items-center gap-4 text-center p-8">
            <div className="bg-[#F0E6DD] rounded-full p-6 shadow-inner">
              <Icon icon="mdi:user" width="44" height="44" className="text-[#C9A88A]" />
            </div>
            <div>
              <p className="text-lg font-bold text-[#1C0F08]">Select a field to update</p>
              <p className="text-sm text-[#9C7E6D] mt-1">Choose an option from the left to edit</p>
            </div>
          </div>
        )}
      </section>
    </main>
  );
};

export default AccountInformation;
