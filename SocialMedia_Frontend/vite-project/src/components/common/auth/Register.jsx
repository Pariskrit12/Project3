import { Icon } from "@iconify/react";
import React, { useRef, useState } from "react";
import Input from "../Input";
import Button from "../Button";
import { useNavigate } from "react-router-dom";
import { useRegisterUserMutation } from "../../../services/userApi";

const GENDERS = [
  { value: "male", label: "Male", icon: "mdi:gender-male" },
  { value: "female", label: "Female", icon: "mdi:gender-female" },
  { value: "others", label: "Others", icon: "mdi:gender-non-binary" },
];

const Register = () => {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);
  const [registerUser, { isLoading }] = useRegisterUserMutation();

  const [profilePreview, setProfilePreview] = useState(null);
  const [profileFile, setProfileFile] = useState(null);
  const [selectedGender, setSelectedGender] = useState("");
  const [form, setForm] = useState({ name: "", username: "", email: "", password: "", confirmPassword: "" });
  const [error, setError] = useState("");

  const handleChange = (field) => (e) => {
    setForm((prev) => ({ ...prev, [field]: e.target.value }));
    setError("");
  };

  const handleProfilePicChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProfileFile(file);
      setProfilePreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e?.preventDefault();
    if (!form.name || !form.username || !form.email || !form.password || !form.confirmPassword || !selectedGender) {
      setError("Please fill in all fields.");
      return;
    }
    if (form.password !== form.confirmPassword) {
      setError("Passwords do not match.");
      return;
    }
    if (!profileFile) {
      setError("Please upload a profile picture.");
      return;
    }
    const formData = new FormData();
    formData.append("name", form.name);
    formData.append("username", form.username);
    formData.append("email", form.email);
    formData.append("password", form.password);
    formData.append("gender", selectedGender);
    formData.append("userProfilePic", profileFile);
    try {
      await registerUser(formData).unwrap();
      navigate("/login");
    } catch (err) {
      setError(err?.data?.message || "Registration failed. Please try again.");
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen py-8 relative overflow-hidden">
      <div className="absolute top-0 right-1/4 w-64 h-64 bg-[#FF4500]/10 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-10 left-1/4 w-80 h-80 bg-[#CC3600]/10 rounded-full blur-3xl pointer-events-none"></div>

      <form onSubmit={handleSubmit} className="w-96 rounded-3xl p-8 flex flex-col gap-6 items-center bg-[#1E1E1E]/95 backdrop-blur-sm shadow-[0_12px_48px_rgba(255,69,0,0.18)] border border-[#3A3A3C] relative z-10">        <div className="flex flex-col items-center gap-3">
          <div className="bg-[#FF4500] p-4 rounded-2xl shadow-[0_6px_20px_rgba(255,69,0,0.4)]">
            <Icon icon="mdi:account-plus" width="32" height="32" className="text-white" />
          </div>
          <div className="text-center">
            <h1 className="text-2xl font-black text-[#D7DADC]">Create Account</h1>
            <p className="text-sm text-[#9A9A9A] mt-0.5">Join SocialSphere today</p>
          </div>
        </div>
        <div className="flex flex-col items-center gap-2">
          <p className="text-xs font-bold text-[#A83200] uppercase tracking-wide self-start w-full">Profile Picture</p>
          <div
            onClick={() => fileInputRef.current?.click()}
            className="relative w-24 h-24 rounded-full cursor-pointer group"
          >
            {profilePreview ? (
              <img
                src={profilePreview}
                alt="Profile preview"
                className="w-24 h-24 rounded-full object-cover border-2 border-[#FF4500]"
              />
            ) : (
              <div className="w-24 h-24 rounded-full bg-[#2A2A2A] border-2 border-dashed border-[#9A9A9A] flex flex-col items-center justify-center gap-1 group-hover:border-[#FF4500] group-hover:bg-[#3A3A3C] transition-all duration-200">
                <Icon icon="mdi:camera-plus-outline" width="24" height="24" className="text-[#FF4500]" />
                <span className="text-[10px] text-[#9A9A9A] font-medium">Upload</span>
              </div>
            )}
            <div className="absolute bottom-0 right-0 bg-[#FF4500] rounded-full p-1.5 shadow-md group-hover:bg-[#CC3600] transition-colors">
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
        <div className="w-full flex flex-col gap-3">
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold text-[#A83200] uppercase tracking-wide">Full Name</label>
            <Input placeholder="John Doe" type="text" icon="mdi:user-outline" value={form.name} onChange={handleChange("name")} />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold text-[#A83200] uppercase tracking-wide">Username</label>
            <Input placeholder="@username" type="text" icon="mdi:at" value={form.username} onChange={handleChange("username")} />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold text-[#A83200] uppercase tracking-wide">Email</label>
            <Input placeholder="your@email.com" type="email" icon="mdi:email-outline" value={form.email} onChange={handleChange("email")} />
          </div>
        </div>
        <div className="w-full flex flex-col gap-1.5">
          <label className="text-xs font-bold text-[#A83200] uppercase tracking-wide">Gender</label>
          <div className="flex gap-2">
            {GENDERS.map((g) => (
              <button
                key={g.value}
                type="button"
                onClick={() => setSelectedGender(g.value)}
                className={`flex-1 flex flex-col items-center gap-1 py-2.5 rounded-xl border text-xs font-semibold transition-all duration-200 cursor-pointer ${
                  selectedGender === g.value
                    ? "border-[#FF4500] bg-[#FF4500]/10 text-[#FF4500] shadow-[0_0_0_2px_rgba(255,69,0,0.2)]"
                    : "border-[#3A3A3C] bg-[#1E1E1E] text-[#9A9A9A] hover:border-[#9A9A9A] hover:bg-[#2A2A2A]"
                }`}
              >
                <Icon icon={g.icon} width="18" height="18" />
                {g.label}
              </button>
            ))}
          </div>
        </div>
        <div className="w-full flex flex-col gap-3">
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold text-[#A83200] uppercase tracking-wide">Password</label>
            <Input placeholder="••••••••" type="password" icon="carbon:password" value={form.password} onChange={handleChange("password")} />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold text-[#A83200] uppercase tracking-wide">Confirm Password</label>
            <Input placeholder="••••••••" type="password" icon="carbon:password" value={form.confirmPassword} onChange={handleChange("confirmPassword")} />
          </div>
        </div>
        <div className="w-full">
          <Button name={isLoading ? "Creating Account..." : "Create Account"} isActive={!isLoading} loading={isLoading} />
        </div>

        {error && (
          <p className="text-xs text-red-500 font-medium w-full text-center -mt-2">{error}</p>
        )}

        <p className="text-sm text-[#A83200]">
          Already have an account?{" "}
          <span
            onClick={() => navigate("/login")}
            className="text-[#FF4500] font-bold cursor-pointer hover:text-[#CC3600] transition-colors"
          >
            Sign in
          </span>
        </p>
      </form>
    </div>
  );
};

export default Register;
