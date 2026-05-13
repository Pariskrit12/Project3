import { Icon } from "@iconify/react";
import React, { useRef, useState } from "react";
import Input from "../Input";
import Button from "../Button";
import { useNavigate } from "react-router-dom";

const GENDERS = [
  { value: "male", label: "Male", icon: "mdi:gender-male" },
  { value: "female", label: "Female", icon: "mdi:gender-female" },
  { value: "others", label: "Others", icon: "mdi:gender-non-binary" },
];

const Register = () => {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);
  const [profilePreview, setProfilePreview] = useState(null);
  const [selectedGender, setSelectedGender] = useState("");

  const handleProfilePicChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProfilePreview(URL.createObjectURL(file));
    }
  };

  const topFields = [
    { placeholder: "John Doe", type: "text", icon: "mdi:user-outline", label: "Full Name" },
    { placeholder: "@username", type: "text", icon: "mdi:at", label: "Username" },
    { placeholder: "your@email.com", type: "email", icon: "mdi:email-outline", label: "Email" },
  ];

  const passwordFields = [
    { placeholder: "••••••••", type: "password", icon: "carbon:password", label: "Password" },
    { placeholder: "••••••••", type: "password", icon: "carbon:password", label: "Confirm Password" },
  ];

  return (
    <div className="flex justify-center items-center min-h-screen py-8 relative overflow-hidden">
      <div className="absolute top-0 right-1/4 w-64 h-64 bg-[#AF503A]/10 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-10 left-1/4 w-80 h-80 bg-[#E8963A]/10 rounded-full blur-3xl pointer-events-none"></div>

      <div className="w-96 rounded-3xl p-8 flex flex-col gap-6 items-center bg-[#FFFCF9]/95 backdrop-blur-sm shadow-[0_12px_48px_rgba(164,57,25,0.18)] border border-[#EDD9C8] relative z-10">
        {/* Header */}
        <div className="flex flex-col items-center gap-3">
          <div className="bg-linear-to-br from-[#E8963A] to-[#AF503A] p-4 rounded-2xl shadow-[0_6px_20px_rgba(232,150,58,0.4)]">
            <Icon icon="mdi:account-plus" width="32" height="32" className="text-white" />
          </div>
          <div className="text-center">
            <h1 className="text-2xl font-black text-[#1C0F08]">Create Account</h1>
            <p className="text-sm text-[#9C7E6D] mt-0.5">Join SocialSphere today</p>
          </div>
        </div>

        {/* Profile Picture Upload */}
        <div className="flex flex-col items-center gap-2">
          <p className="text-xs font-bold text-[#4A2C1D] uppercase tracking-wide self-start w-full">Profile Picture</p>
          <div
            onClick={() => fileInputRef.current?.click()}
            className="relative w-24 h-24 rounded-full cursor-pointer group"
          >
            {profilePreview ? (
              <img
                src={profilePreview}
                alt="Profile preview"
                className="w-24 h-24 rounded-full object-cover border-2 border-[#AF503A]"
              />
            ) : (
              <div className="w-24 h-24 rounded-full bg-[#F5EBE0] border-2 border-dashed border-[#C9A88A] flex flex-col items-center justify-center gap-1 group-hover:border-[#AF503A] group-hover:bg-[#EDD9C8] transition-all duration-200">
                <Icon icon="mdi:camera-plus-outline" width="24" height="24" className="text-[#AF503A]" />
                <span className="text-[10px] text-[#9C7E6D] font-medium">Upload</span>
              </div>
            )}
            <div className="absolute bottom-0 right-0 bg-[#AF503A] rounded-full p-1.5 shadow-md group-hover:bg-[#A43919] transition-colors">
              <Icon icon="mdi:pencil" width="12" height="12" className="text-white" />
            </div>
          </div>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleProfilePicChange}
          />
        </div>

        {/* Top Fields */}
        <div className="w-full flex flex-col gap-3">
          {topFields.map((field, index) => (
            <div key={index} className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-[#4A2C1D] uppercase tracking-wide">
                {field.label}
              </label>
              <Input placeholder={field.placeholder} type={field.type} icon={field.icon} />
            </div>
          ))}
        </div>

        {/* Gender */}
        <div className="w-full flex flex-col gap-1.5">
          <label className="text-xs font-bold text-[#4A2C1D] uppercase tracking-wide">Gender</label>
          <div className="flex gap-2">
            {GENDERS.map((g) => (
              <button
                key={g.value}
                type="button"
                onClick={() => setSelectedGender(g.value)}
                className={`flex-1 flex flex-col items-center gap-1 py-2.5 rounded-xl border text-xs font-semibold transition-all duration-200 cursor-pointer ${
                  selectedGender === g.value
                    ? "border-[#AF503A] bg-[#AF503A]/10 text-[#AF503A] shadow-[0_0_0_2px_rgba(175,80,58,0.2)]"
                    : "border-[#EDD9C8] bg-[#FFFCF9] text-[#9C7E6D] hover:border-[#C9A88A] hover:bg-[#F5EBE0]"
                }`}
              >
                <Icon icon={g.icon} width="18" height="18" />
                {g.label}
              </button>
            ))}
          </div>
        </div>

        {/* Password Fields */}
        <div className="w-full flex flex-col gap-3">
          {passwordFields.map((field, index) => (
            <div key={index} className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-[#4A2C1D] uppercase tracking-wide">
                {field.label}
              </label>
              <Input placeholder={field.placeholder} type={field.type} icon={field.icon} />
            </div>
          ))}
        </div>

        {/* Submit */}
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
