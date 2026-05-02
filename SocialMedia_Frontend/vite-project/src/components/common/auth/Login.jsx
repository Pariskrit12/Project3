import React from "react";
import Input from "../Input";
import Button from "../Button";
import { Icon } from "@iconify/react";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const navigate = useNavigate();

  return (
    <div className="flex justify-center items-center min-h-screen -mt-14 relative overflow-hidden">
      <div className="absolute top-0 left-1/4 w-64 h-64 bg-[#AF503A]/10 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-10 right-1/4 w-80 h-80 bg-[#E8963A]/10 rounded-full blur-3xl pointer-events-none"></div>

      <div className="w-96 rounded-3xl p-8 flex flex-col gap-6 items-center bg-[#FFFCF9]/95 backdrop-blur-sm shadow-[0_12px_48px_rgba(164,57,25,0.18)] border border-[#EDD9C8] relative z-10">
        <div className="flex flex-col items-center gap-3">
          <div className="bg-linear-to-br from-[#AF503A] to-[#C7604A] p-4 rounded-2xl shadow-[0_6px_20px_rgba(164,57,25,0.4)]">
            <Icon icon="solar:login-bold" width="32" height="32" className="text-white" />
          </div>
          <div className="text-center">
            <h1 className="text-2xl font-black text-[#1C0F08]">Welcome back</h1>
            <p className="text-sm text-[#9C7E6D] mt-0.5">Sign in to SocialSphere</p>
          </div>
        </div>

        <div className="w-full flex flex-col gap-3">
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold text-[#4A2C1D] uppercase tracking-wide">Email</label>
            <Input placeholder="your@email.com" type="email" icon="mdi:email-outline" />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold text-[#4A2C1D] uppercase tracking-wide">Password</label>
            <Input placeholder="••••••••" type="password" icon="carbon:password" />
          </div>
          <div className="flex justify-end">
            <p className="text-xs text-[#E8963A] font-semibold cursor-pointer hover:text-[#C7782A] transition-colors">
              Forgot password?
            </p>
          </div>
        </div>

        <div className="w-full">
          <Button name="Sign In" isActive={true} />
        </div>

        <div className="flex items-center gap-3 w-full">
          <div className="h-px flex-1 bg-[#EDD9C8]"></div>
          <span className="text-xs text-[#C9A88A] font-medium">or continue with</span>
          <div className="h-px flex-1 bg-[#EDD9C8]"></div>
        </div>

        <button className="w-full flex items-center justify-center gap-3 py-2.5 rounded-xl border border-[#EDD9C8] bg-white hover:bg-[#FAEBD8] transition-colors text-sm font-semibold text-[#1C0F08]">
          <Icon icon="flat-color-icons:google" width="20" height="20" />
          Google
        </button>

        <p className="text-sm text-[#4A2C1D]">
          Don't have an account?{" "}
          <span
            onClick={() => navigate("/register")}
            className="text-[#AF503A] font-bold cursor-pointer hover:text-[#A43919] transition-colors"
          >
            Create one
          </span>
        </p>
      </div>
    </div>
  );
};

export default Login;
