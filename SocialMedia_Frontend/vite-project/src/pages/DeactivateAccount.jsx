import { Icon } from "@iconify/react";
import React from "react";
import Button from "../components/common/Button";
import { useNavigate } from "react-router-dom";

const DeactivateAccount = () => {
  const navigate = useNavigate();
  return (
    <main className="max-w-xl">
      <div className="flex items-center gap-3 mb-6">
        <button
          onClick={() => navigate("/settings")}
          className="p-2 rounded-xl hover:bg-[#F4D9C6] transition-colors text-[#2C1A0E] cursor-pointer"
        >
          <Icon icon="tabler:arrow-left" width="24" height="24" />
        </button>
        <h1 className="text-2xl font-bold text-[#2C1A0E]">Deactivate Account</h1>
      </div>

      <div className="bg-[#FDF6EE] border border-[#E8D5C0] rounded-2xl p-6 flex flex-col gap-5">
        <div className="flex items-center gap-3">
          <img
            src="../Sharbani.png"
            alt=""
            className="w-16 h-16 object-cover rounded-full border-2 border-[#AF503A]"
          />
          <div>
            <p className="font-bold text-[#2C1A0E]">username</p>
            <p className="text-sm text-[#B89880]">email@gmail.com</p>
          </div>
        </div>

        <div className="border-t border-[#E8D5C0] pt-4 flex flex-col gap-3">
          <h2 className="font-bold text-xl text-[#2C1A0E]">
            This will deactivate your account
          </h2>
          <p className="text-sm text-[#B89880] leading-relaxed">
            You're about to start the process of deactivating your account.
            Your display name, @username, and public profile will no longer be
            viewable on the website.
          </p>
        </div>

        <div>
          <button className="px-4 py-2.5 bg-red-50 text-red-700 border border-red-200 rounded-xl font-semibold text-sm cursor-pointer hover:bg-red-100 transition-colors duration-200">
            Deactivate
          </button>
        </div>
      </div>
    </main>
  );
};

export default DeactivateAccount;
