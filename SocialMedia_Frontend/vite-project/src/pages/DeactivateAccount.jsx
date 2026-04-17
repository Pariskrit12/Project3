import { Icon } from "@iconify/react";
import React from "react";
import Button from "../components/common/Button";
import { useNavigate } from "react-router-dom";

const DeactivateAccount = () => {
    const navigate=useNavigate();
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
        <h1 className="text-2xl">Deactivate Account</h1>
      </div>
      <section className="p-5">
        <div className="flex items-center gap-2">
          <img
            src="../Sharbani.png"
            alt=""
            className="w-18 h-18 object-cover rounded-full"
          />
          <div>
            <p className="text-lg font-bold">username</p>
            <p className="text-sm text-gray-400">email@gmail.com</p>
          </div>
        </div>
        <div className="p-2 w-150 flex flex-col gap-4">
          <h2 className="font-bold text-2xl">
            This will deactivate your account
          </h2>
          <p className="text-sm text-gray-400">
            You’re about to start the process of deactivating your account.
            Your display name, @username, and public profile will no longer be
            viewable on the website.
          </p>
        </div>
        <div className="flex px-2  text-red-700 cursor-pointer hover:bg-gray-200 max-w-fit p-2 rounded-xl">
            Deactivate
        </div>
      </section>
    </main>
  );
};

export default DeactivateAccount;
