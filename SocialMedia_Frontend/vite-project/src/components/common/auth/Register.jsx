import { Icon } from "@iconify/react";
import React from "react";
import Input from "../Input";
import Button from "../Button";
import { useNavigate } from "react-router-dom";

const Register = () => {
  const navigate = useNavigate();
  const formFields = [
    { placeholder: "Full Name", type: "text", icon: "mdi:user-outline", label: "Full Name" },
    { placeholder: "your@email.com", type: "email", icon: "mdi:email-outline", label: "Email" },
    { placeholder: "••••••••", type: "password", icon: "carbon:password", label: "Password" },
    { placeholder: "••••••••", type: "password", icon: "carbon:password", label: "Confirm Password" },
  ];

  return (
    <div className="flex justify-center items-center min-h-screen -mt-14 relative overflow-hidden">
      <div className="absolute top-0 right-1/4 w-64 h-64 bg-[#AF503A]/10 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-10 left-1/4 w-80 h-80 bg-[#E8963A]/10 rounded-full blur-3xl pointer-events-none"></div>

      <div className="w-96 rounded-3xl p-8 flex flex-col gap-6 items-center bg-[#FFFCF9]/95 backdrop-blur-sm shadow-[0_12px_48px_rgba(164,57,25,0.18)] border border-[#EDD9C8] relative z-10">
        <div className="flex flex-col items-center gap-3">
          <div className="bg-linear-to-br from-[#E8963A] to-[#AF503A] p-4 rounded-2xl shadow-[0_6px_20px_rgba(232,150,58,0.4)]">
            <Icon icon="mdi:account-plus" width="32" height="32" className="text-white" />
          </div>
          <div className="text-center">
            <h1 className="text-2xl font-black text-[#1C0F08]">Create Account</h1>
            <p className="text-sm text-[#9C7E6D] mt-0.5">Join SocialSphere today</p>
          </div>
        </div>

        <div className="w-full flex flex-col gap-3">
          {formFields.map((elem, index) => (
            <div key={index} className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-[#4A2C1D] uppercase tracking-wide">
                {elem.label}
              </label>
              <Input placeholder={elem.placeholder} type={elem.type} icon={elem.icon} />
            </div>
          ))}
        </div>

        <div className="w-full">
          <Button name="Create Account" isActive={true} />
        </div>

        <p className="text-sm text-[#4A2C1D]">
          Already have an account?{" "}
          <span
            onClick={() => navigate("/login")}
            className="text-[#AF503A] font-bold cursor-pointer hover:text-[#A43919] transition-colors"
          >
            Sign in
          </span>
        </p>
      </div>
    </div>
  );
};

export default Register;
