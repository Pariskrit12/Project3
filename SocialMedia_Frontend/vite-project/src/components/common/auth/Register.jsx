import { Icon } from "@iconify/react";
import React from "react";
import Input from "../Input";
import Button from "../Button";
import { useNavigate } from "react-router-dom";

const Register = () => {
  const navigate = useNavigate();
  const formFields = [
    { placeholder: "Full Name", type: "text" },
    { placeholder: "Email", type: "password" },
    { placeholder: "Password", type: "password" },
    { placeholder: "Confirm Password", type: "password" },
  ];

  return (
    <form className="flex justify-center items-center h-150">
      <div className="w-96 rounded-2xl p-8 flex flex-col gap-5 items-center bg-[#FEF7ED] shadow-[0_8px_32px_rgba(164,57,25,0.15)] border border-[#E8D5C0]">
        <div className="flex flex-col items-center gap-2">
          <div className="bg-linear-to-br from-[#AF503A] to-[#A43919] p-4 rounded-2xl shadow-[0_4px_12px_rgba(164,57,25,0.3)]">
            <Icon
              icon="solar:login-bold"
              width="32"
              height="32"
              className="text-white"
            />
          </div>
          <h1 className="text-2xl font-bold text-[#2C1A0E]">Create Account</h1>
          <p className="text-sm text-[#B89880]">Join SocialSphere today</p>
        </div>
        <div className="w-full flex flex-col gap-3">
          {formFields.map((elem, index) => (
            <Input key={index} placeholder={elem.placeholder} type={elem.type} />
          ))}
        </div>
        <div className="w-full">
          <Button name="Register" isActive={true} />
        </div>
        <p className="text-sm text-[#5C4033]">
          Already have an account?{" "}
          <span onClick={() => navigate('/login')} className="text-[#AF503A] font-semibold cursor-pointer hover:text-[#A43919]">Login</span>
        </p>
      </div>
    </form>
  );
};

export default Register;
