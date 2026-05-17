import { Icon } from "@iconify/react";
import React, { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { clearUser } from "../slices/authSlice";
import SettingList from "../components/SettingComponent/SettingList";
import Input from "../components/common/Input";
import Button from "../components/common/Button";
import {
  useChangeUsernameMutation,
  useChangeEmailMutation,
  useChangeProfilePicMutation,
  useDeactivateAccountMutation,
} from "../services/userApi";

const AccountInformation = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);

  const [changeUsername, { isLoading: usernameLoading }] = useChangeUsernameMutation();
  const [changeEmail, { isLoading: emailLoading }] = useChangeEmailMutation();
  const [changeProfilePic, { isLoading: picLoading }] = useChangeProfilePicMutation();
  const [deactivateAccount, { isLoading: deactivateLoading }] = useDeactivateAccountMutation();

  const [deactivateMessage, setDeactivateMessage] = useState(null);

  const handleDeactivate = async () => {
    try {
      await deactivateAccount().unwrap();
      dispatch(clearUser());
      navigate("/login", { replace: true });
    } catch (err) {
      setDeactivateMessage(err?.data?.message || "Something went wrong");
    }
  };

  const fileInputRef = useRef(null);
  const [picPreview, setPicPreview] = useState(null);
  const [picFile, setPicFile] = useState(null);
  const [picMessage, setPicMessage] = useState(null);

  const handlePicSelect = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setPicFile(file);
    setPicPreview(URL.createObjectURL(file));
    setPicMessage(null);
  };

  const handlePicUpload = async () => {
    if (!picFile) return;
    const formData = new FormData();
    formData.append("userProfilePic", picFile);
    try {
      await changeProfilePic(formData).unwrap();
      setPicMessage({ type: "success", text: "Profile picture updated" });
      setPicFile(null);
    } catch (err) {
      setPicMessage({ type: "error", text: err?.data?.message || "Upload failed" });
    }
  };

  const accountSettingList = [
    {
      name: "Name",
      key: "name",
      icon: "mdi:account-outline",
      description: user?.name,
      editable: false,
    },
    {
      name: "Username",
      key: "username",
      icon: "mdi:at",
      description: `@${user?.username ?? ""}`,
      editable: true,
    },
    {
      name: "Email",
      key: "email",
      icon: "material-symbols:mail-outline",
      description: user?.email,
      editable: true,
    },
    {
      name: "Gender",
      key: "gender",
      icon: "mdi:gender-male-female",
      description: user?.gender,
      editable: false,
    },
    {
      name: "Joined",
      key: "joined",
      icon: "material-symbols:calendar-today-outline",
      description: user?.createdAt
        ? new Date(user.createdAt).toLocaleDateString("en-US", {
            month: "long",
            year: "numeric",
          })
        : "",
      editable: false,
    },
  ];

  const [activeField, setActiveField] = useState(null);
  const activeEntry = accountSettingList.find((f) => f.key === activeField);

  const [inputValue, setInputValue] = useState("");
  const [newEmailValue, setNewEmailValue] = useState("");
  const [message, setMessage] = useState(null);

  const handleFieldClick = (key, editable) => {
    if (!editable) return;
    setActiveField(key);
    setInputValue("");
    setNewEmailValue("");
    setMessage(null);
  };

  const isLoading = usernameLoading || emailLoading;

  const handleSubmit = async () => {
    setMessage(null);
    try {
      if (activeField === "username") {
        if (!inputValue.trim()) {
          setMessage({ type: "error", text: "Username cannot be empty" });
          return;
        }
        await changeUsername({ username: inputValue.trim() }).unwrap();
        setMessage({ type: "success", text: "Username updated successfully" });
        setInputValue("");
      } else if (activeField === "email") {
        if (!newEmailValue.trim()) {
          setMessage({ type: "error", text: "New email cannot be empty" });
          return;
        }
        await changeEmail({
          oldEmail: user?.email,
          newEmail: newEmailValue.trim(),
        }).unwrap();
        setMessage({ type: "success", text: "Email updated successfully" });
        setNewEmailValue("");
      }
    } catch (err) {
      setMessage({
        type: "error",
        text: err?.data?.message || "Something went wrong",
      });
    }
  };

  return (
    <main className="grid grid-cols-2 gap-6">
      <section>
        <div className="flex items-center gap-3 mb-5">
          <button
            onClick={() => navigate("/settings")}
            className="p-2 rounded-xl hover:bg-[#FFE4E6] transition-colors text-[#1C0714] border border-[#FECDD3] bg-[#FFF5F6]"
          >
            <Icon icon="tabler:arrow-left" width="22" height="22" />
          </button>
          <div>
            <h1 className="text-2xl font-black text-[#1C0714]">Account Info</h1>
            <p className="text-sm text-[#BE7090]">Click a field to edit</p>
          </div>
        </div>
        {/* Profile pic */}
        <div className="flex flex-col items-center gap-2 mb-5">
          <div className="relative group cursor-pointer" onClick={() => fileInputRef.current?.click()}>
            <div className="h-20 w-20 rounded-full overflow-hidden border-4 border-[#FECDD3] shadow-md">
              {picPreview || user?.userProfilePic ? (
                <img
                  src={picPreview ?? user.userProfilePic}
                  alt="profile"
                  className="h-full w-full object-cover"
                />
              ) : (
                <div className="h-full w-full bg-linear-to-br from-[#FB7185] to-[#BE123C] flex items-center justify-center">
                  <Icon icon="mdi:account" width="36" height="36" className="text-white" />
                </div>
              )}
            </div>
            <div className="absolute inset-0 rounded-full bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
              <Icon icon="mdi:camera" width="22" height="22" className="text-white" />
            </div>
          </div>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handlePicSelect}
          />
          {picFile && (
            <div className="flex flex-col items-center gap-1.5">
              <Button
                name="Save Photo"
                isActive={true}
                loading={picLoading}
                onClick={handlePicUpload}
              />
              <button
                onClick={() => { setPicFile(null); setPicPreview(null); setPicMessage(null); }}
                className="text-xs text-[#BE7090] hover:text-[#BE123C] transition-colors"
              >
                Cancel
              </button>
            </div>
          )}
          {picMessage && (
            <p className={`text-xs font-medium ${picMessage.type === "success" ? "text-green-600" : "text-red-500"}`}>
              {picMessage.text}
            </p>
          )}
        </div>

        <section className="grid grid-cols-1 gap-2.5 px-1">
          {accountSettingList.map((elem, index) => (
            <SettingList
              type="AccountInfo"
              key={index}
              icon={elem.icon}
              name={elem.name}
              description={elem.description}
              onClick={() => handleFieldClick(elem.key, elem.editable)}
            />
          ))}
        </section>

        <div className="mt-5 px-1">
          <button
            onClick={() => { setActiveField("deactivate"); setMessage(null); }}
            className="w-full flex items-center gap-3 p-4 rounded-2xl border border-red-200 bg-red-50 text-red-600 hover:bg-red-100 hover:border-red-300 transition-all duration-200 cursor-pointer"
          >
            <div className="p-2 bg-red-100 rounded-xl">
              <Icon icon="mdi:power" width="20" height="20" />
            </div>
            <div className="text-left">
              <p className="font-bold text-sm">Deactivate Account</p>
              <p className="text-xs text-red-400">Temporarily disable your account</p>
            </div>
          </button>
        </div>
      </section>

      <section className="flex items-center justify-center px-5">
        {activeField === "deactivate" ? (
          <div className="flex flex-col items-center w-90 gap-5 p-8 bg-[#FFF5F6] border border-red-200 rounded-2xl shadow-[0_4px_24px_rgba(239,68,68,0.1)]">
            <div className="bg-red-100 rounded-2xl p-4">
              <Icon icon="mdi:alert-circle" width="32" height="32" className="text-red-500" />
            </div>

            <div className="flex items-center gap-3 w-full p-3 bg-red-50 rounded-xl border border-red-100">
              <div className="h-12 w-12 rounded-full overflow-hidden shrink-0 border-2 border-red-200">
                {user?.userProfilePic ? (
                  <img src={user.userProfilePic} alt="profile" className="h-full w-full object-cover" />
                ) : (
                  <div className="h-full w-full bg-linear-to-br from-[#FB7185] to-[#BE123C] flex items-center justify-center">
                    <Icon icon="mdi:account" width="24" height="24" className="text-white" />
                  </div>
                )}
              </div>
              <div>
                <p className="font-bold text-sm text-[#1C0714]">{user?.name}</p>
                <p className="text-xs text-[#BE7090]">{user?.email}</p>
              </div>
            </div>

            <div className="text-center">
              <h2 className="font-black text-lg text-[#1C0714] mb-1">Deactivate Account?</h2>
              <p className="text-sm text-[#BE7090] leading-relaxed">
                Your profile and posts will be hidden. You can reactivate anytime by logging back in.
              </p>
            </div>

            {deactivateMessage && (
              <p className="text-sm font-medium text-red-500 text-center">{deactivateMessage}</p>
            )}

            <div className="w-full flex flex-col gap-2">
              <button
                onClick={handleDeactivate}
                disabled={deactivateLoading}
                className="w-full py-2.5 rounded-full bg-red-500 hover:bg-red-600 text-white font-bold text-sm transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed cursor-pointer"
              >
                {deactivateLoading ? (
                  <Icon icon="svg-spinners:ring-resize" width="18" height="18" />
                ) : (
                  <Icon icon="mdi:power" width="18" height="18" />
                )}
                {deactivateLoading ? "Deactivating..." : "Yes, Deactivate"}
              </button>
              <button
                onClick={() => { setActiveField(null); setDeactivateMessage(null); }}
                className="w-full py-2.5 rounded-full border border-[#FECDD3] text-[#9F1239] font-bold text-sm hover:bg-[#FFE4E6] transition-all duration-200 cursor-pointer"
              >
                Cancel
              </button>
            </div>
          </div>
        ) : activeEntry ? (
          <div className="flex flex-col items-center w-90 gap-5 p-8 bg-[#FFF5F6] border border-[#FECDD3] rounded-2xl shadow-[0_4px_24px_rgba(225,29,72,0.1)]">
            <div className="bg-linear-to-br from-[#E11D48] to-[#FB7185] rounded-2xl p-4 shadow-[0_4px_16px_rgba(225,29,72,0.3)]">
              <Icon icon="mdi:user-edit" width="32" height="32" className="text-white" />
            </div>
            <h2 className="font-black text-lg text-[#1C0714]">
              Update {activeEntry.name}
            </h2>

            {activeField === "email" ? (
              <div className="w-full flex flex-col gap-3">
                <Input
                  type="email"
                  placeholder="Current email"
                  value={user?.email ?? ""}
                  onChange={() => {}}
                  className="opacity-60 pointer-events-none"
                />
                <Input
                  type="email"
                  placeholder="New email"
                  value={newEmailValue}
                  onChange={(e) => setNewEmailValue(e.target.value)}
                />
              </div>
            ) : (
              <div className="w-full">
                <Input
                  type="text"
                  placeholder={`New ${activeEntry.name.toLowerCase()}`}
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                />
              </div>
            )}

            {message && (
              <p
                className={`text-sm font-medium text-center ${
                  message.type === "success" ? "text-green-600" : "text-red-500"
                }`}
              >
                {message.text}
              </p>
            )}

            <Button
              name={`Update ${activeEntry.name}`}
              isActive={true}
              loading={isLoading}
              onClick={handleSubmit}
            />
          </div>
        ) : (
          <div className="flex flex-col items-center gap-4 text-center p-8">
            <div className="bg-[#FFE4E6] rounded-full p-6 shadow-inner">
              <Icon icon="mdi:user" width="44" height="44" className="text-[#FDA4AF]" />
            </div>
            <div>
              <p className="text-lg font-bold text-[#1C0714]">
                Select a field to update
              </p>
              <p className="text-sm text-[#BE7090] mt-1">
                Choose an option from the left to edit
              </p>
            </div>
          </div>
        )}
      </section>
    </main>
  );
};

export default AccountInformation;
