import { Icon } from "@iconify/react";
import React from "react";
import Input from "../Input";
import Button from "../Button";
import { useNavigate } from "react-router-dom";

const Register = () => {
    const navigate=useNavigate();
  const formFields = [
    { placeholder: "Full Name", type: "text" },
    { placeholder: "Email", type: "password" },
    { placeholder: "Password", type: "password" },
    { placeholder: "Confirm Password", type: "password" },
  ];
  return (
    <form className="flex justify-center items-center h-150  ">
      <div className="w-100  rounded-xl p-4 flex flex-col gap-4 items-center bg-[#FEF7ED] shadow-[0_9px_12px_rgba(164,57,25,0.14)]">
        <h1 className="text-3xl font-bold">Register</h1>
        <Icon
          icon="solar:login-bold"
          width="60"
          height="60"
          className="text-[#AF503A]"
        />
        {formFields.map((elem,index)=>(
            <Input placeholder={elem.placeholder} type={elem.type}/>
        ))}
<Button name="Register"/>
        <p>
          Already have an account?
          <span onClick={()=>navigate('/login')} className="text-blue-700 cursor-pointer">Login</span>
        </p>
      </div>
    </form>
  );
};

export default Register;
