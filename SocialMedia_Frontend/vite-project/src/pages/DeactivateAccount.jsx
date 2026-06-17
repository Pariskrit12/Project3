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
          className="p-2 rounded-xl hover:bg-[#2A2A2A] transition-colors text-[#D7DADC] border border-[#3A3A3C] bg-[#1E1E1E]"
        >
          <Icon icon="tabler:arrow-left" width="22" height="22" />
        </button>
        <div>
          <h1 className="text-2xl font-black text-[#D7DADC]">Deactivate Account</h1>
          <p className="text-sm text-[#9A9A9A]">This action is reversible</p>
        </div>
      </div>

      <div className="bg-[#1E1E1E] border border-[#3A3A3C] rounded-2xl p-6 flex flex-col gap-5 shadow-[0_4px_20px_rgba(255,69,0,0.08)]">
        <div className="flex items-center gap-4">
          <div className="border-3 border-[#FF4500] rounded-full shadow-[0_2px_12px_rgba(255,69,0,0.2)]">
            <img
              src="../Sharbani.png"
              alt="profile"
              className="w-16 h-16 object-cover rounded-full"
            />
          </div>
          <div>
            <p className="font-bold text-[#D7DADC] text-lg">username</p>
            <p className="text-sm text-[#9A9A9A]">email@gmail.com</p>
          </div>
        </div>

        <div className="border-t border-[#3A3A3C] pt-5 flex flex-col gap-3">
          <div className="flex items-center gap-2">
            <div className="p-1.5 bg-red-50 rounded-lg">
              <Icon icon="mdi:alert-circle" width="20" height="20" className="text-red-500" />
            </div>
            <h2 className="font-bold text-lg text-[#D7DADC]">This will deactivate your account</h2>
          </div>
          <p className="text-sm text-[#9A9A9A] leading-relaxed">
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
