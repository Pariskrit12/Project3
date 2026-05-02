import { Icon } from "@iconify/react";
import React from "react";
import { useNavigate } from "react-router-dom";

const DeactivateAccount = () => {
  const navigate = useNavigate();
  return (
    <main className="max-w-xl">
      <div className="flex items-center gap-3 mb-6">
        <button
          onClick={() => navigate("/settings")}
          className="p-2 rounded-xl hover:bg-[#FAEBD8] transition-colors text-[#1C0F08] border border-[#EDD9C8] bg-[#FFFCF9]"
        >
          <Icon icon="tabler:arrow-left" width="22" height="22" />
        </button>
        <div>
          <h1 className="text-2xl font-black text-[#1C0F08]">Deactivate Account</h1>
          <p className="text-sm text-[#9C7E6D]">This action is reversible</p>
        </div>
      </div>

      <div className="bg-[#FFFCF9] border border-[#EDD9C8] rounded-2xl p-6 flex flex-col gap-5 shadow-[0_4px_20px_rgba(164,57,25,0.08)]">
        <div className="flex items-center gap-4">
          <div className="border-3 border-[#AF503A] rounded-full shadow-[0_2px_12px_rgba(164,57,25,0.2)]">
            <img
              src="../Sharbani.png"
              alt="profile"
              className="w-16 h-16 object-cover rounded-full"
            />
          </div>
          <div>
            <p className="font-bold text-[#1C0F08] text-lg">username</p>
            <p className="text-sm text-[#9C7E6D]">email@gmail.com</p>
          </div>
        </div>

        <div className="border-t border-[#EDD9C8] pt-5 flex flex-col gap-3">
          <div className="flex items-center gap-2">
            <div className="p-1.5 bg-red-50 rounded-lg">
              <Icon icon="mdi:alert-circle" width="20" height="20" className="text-red-500" />
            </div>
            <h2 className="font-bold text-lg text-[#1C0F08]">This will deactivate your account</h2>
          </div>
          <p className="text-sm text-[#9C7E6D] leading-relaxed">
            You're about to start the process of deactivating your account. Your
            display name, @username, and public profile will no longer be viewable
            on the website.
          </p>
        </div>

        <div className="pt-1">
          <button className="px-5 py-2.5 bg-red-50 text-red-600 border border-red-200 rounded-xl font-bold text-sm cursor-pointer hover:bg-red-100 hover:border-red-300 transition-all duration-200 flex items-center gap-2">
            <Icon icon="mdi:power" width="18" height="18" />
            Deactivate Account
          </button>
        </div>
      </div>
    </main>
  );
};

export default DeactivateAccount;
