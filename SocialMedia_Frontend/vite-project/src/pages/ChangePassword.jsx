import { Icon } from "@iconify/react";
import React, { useState } from "react";
import Input from "../components/common/Input";
import Button from "../components/common/Button";
import { useNavigate } from "react-router-dom";
import { useChangePasswordMutation } from "../services/userApi";

const ChangePassword = () => {
  const navigate = useNavigate();
  const [changePassword, { isLoading }] = useChangePasswordMutation();

  const [form, setForm] = useState({ oldPassword: "", newPassword: "", confirmPassword: "" });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const handleChange = (field) => (e) => {
    setError("");
    setSuccess(false);
    setForm((prev) => ({ ...prev, [field]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess(false);

    if (!form.oldPassword || !form.newPassword || !form.confirmPassword) {
      setError("All fields are required");
      return;
    }
    if (form.newPassword !== form.confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    try {
      await changePassword({
        oldPassword: form.oldPassword,
        newPassword: form.newPassword,
        confirmPassword: form.confirmPassword,
      }).unwrap();
      setSuccess(true);
      setForm({ oldPassword: "", newPassword: "", confirmPassword: "" });
    } catch (err) {
      setError(err?.data?.message || "Something went wrong. Please try again.");
    }
  };

  return (
    <main className="max-w-lg">
      <div className="flex items-center gap-3 mb-6">
        <button
          onClick={() => navigate("/settings")}
          className="p-2 rounded-xl hover:bg-[#E5E6EA] transition-colors text-[#1C1C1C] border border-[#EDEFF1] bg-[#FFFFFF]"
        >
          <Icon icon="tabler:arrow-left" width="22" height="22" />
        </button>
        <div>
          <h1 className="text-2xl font-black text-[#1C1C1C]">Change Password</h1>
          <p className="text-sm text-[#878A8C]">Keep your account secure</p>
        </div>
      </div>

      <div className="bg-[#FFFFFF] border border-[#EDEFF1] rounded-2xl p-6 shadow-[0_4px_20px_rgba(255,69,0,0.08)]">
        <form className="flex flex-col gap-5" onSubmit={handleSubmit}>
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-bold text-[#A83200]">Current Password</label>
            <Input
              type="password"
              placeholder="Enter current password"
              icon="carbon:password"
              value={form.oldPassword}
              onChange={handleChange("oldPassword")}
            />
            <p className="text-[#CC3600] text-xs font-semibold px-1 cursor-pointer hover:text-[#A83200] transition-colors">
              Forgot password?
            </p>
          </div>

          <div className="flex flex-col gap-3">
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-bold text-[#A83200]">New Password</label>
              <Input
                type="password"
                placeholder="Enter new password"
                icon="carbon:password"
                value={form.newPassword}
                onChange={handleChange("newPassword")}
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-bold text-[#A83200]">Confirm Password</label>
              <Input
                type="password"
                placeholder="Confirm new password"
                icon="carbon:password"
                value={form.confirmPassword}
                onChange={handleChange("confirmPassword")}
              />
            </div>
          </div>

          {error && (
            <div className="flex items-center gap-2 px-3 py-2.5 rounded-xl bg-red-50 border border-red-200 text-red-600 text-sm font-medium">
              <Icon icon="material-symbols:error-outline" width="16" height="16" className="shrink-0" />
              {error}
            </div>
          )}

          {success && (
            <div className="flex items-center gap-2 px-3 py-2.5 rounded-xl bg-green-50 border border-green-200 text-green-700 text-sm font-medium">
              <Icon icon="material-symbols:check-circle-outline" width="16" height="16" className="shrink-0" />
              Password changed successfully!
            </div>
          )}

          <div className="pt-1">
            <Button isActive={!isLoading} name={isLoading ? "Saving..." : "Save Changes"} />
          </div>
        </form>
      </div>
    </main>
  );
};

export default ChangePassword;
