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
const activeUpdate=updateFields.find((f)=>f.key===activeField);
console.log(activeUpdate);

  const navigate = useNavigate();
  return (
    <main className="grid grid-cols-2">
      <section>
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
      <section className="flex items-center justify-center  px-5">
        {activeUpdate?(

        <div className="flex flex-col items-center w-100 gap-5">
          <Input type={activeUpdate.type} placeholder={activeUpdate.placeholder} />
          <Button name={activeUpdate.name} isActive={true} />
        </div>
        ):(
          <p className="text-2xl font-bold">Select a field to update</p>
        )}
      </section>
    </main>
  );
};

export default AccountInformation;
