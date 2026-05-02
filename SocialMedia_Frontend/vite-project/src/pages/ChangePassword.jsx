import { Icon } from "@iconify/react";
import React from "react";
import Input from "../components/common/Input";
import Button from "../components/common/Button";
import { useNavigate } from "react-router-dom";

const ChangePassword = () => {
  const navigate = useNavigate();
  return (
    <main className="max-w-lg">
      <div className="flex items-center gap-3 mb-6">
        <button
          onClick={() => navigate("/settings")}
          className="p-2 rounded-xl hover:bg-[#FAEBD8] transition-colors text-[#1C0F08] border border-[#EDD9C8] bg-[#FFFCF9]"
        >
          <Icon icon="tabler:arrow-left" width="22" height="22" />
        </button>
        <div>
          <h1 className="text-2xl font-black text-[#1C0F08]">Change Password</h1>
          <p className="text-sm text-[#9C7E6D]">Keep your account secure</p>
        </div>
      </div>

      <div className="bg-[#FFFCF9] border border-[#EDD9C8] rounded-2xl p-6 shadow-[0_4px_20px_rgba(164,57,25,0.08)]">
        <form className="flex flex-col gap-5">
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-bold text-[#4A2C1D]">Current Password</label>
            <Input type="password" placeholder="Enter current password" icon="carbon:password" />
            <p className="text-[#E8963A] text-xs font-semibold px-1 cursor-pointer hover:text-[#C7782A] transition-colors">
              Forgot password?
            </p>
          </div>
          <div className="flex flex-col gap-3">
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-bold text-[#4A2C1D]">New Password</label>
              <Input type="password" placeholder="Enter new password" icon="carbon:password" />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-bold text-[#4A2C1D]">Confirm Password</label>
              <Input type="password" placeholder="Confirm new password" icon="carbon:password" />
            </div>
          </div>
          <div className="pt-1">
            <Button isActive={true} name="Save Changes" />
          </div>
        </form>
      </div>
    </main>
  );
};

export default ChangePassword;
