import React, { useState, useRef } from "react";
import { Icon } from "@iconify/react";
import { useNavigate } from "react-router-dom";
import { useCreateCommunityMutation } from "../services/communitiesApi";

const CommunityCreate = () => {
  const navigate = useNavigate();
  const [communityName, setCommunityName] = useState("");
  const [communityDescription, setCommunityDescription] = useState("");
  const [profileFile, setProfileFile] = useState(null);
  const [profilePreview, setProfilePreview] = useState(null);
  const [bannerFile, setBannerFile] = useState(null);
  const [bannerPreview, setBannerPreview] = useState(null);
  const [error, setError] = useState("");

  const profileRef = useRef(null);
  const bannerRef = useRef(null);

  const [createCommunity, { isLoading }] = useCreateCommunityMutation();

  const handleProfileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (profilePreview) URL.revokeObjectURL(profilePreview);
    setProfileFile(file);
    setProfilePreview(URL.createObjectURL(file));
  };

  const handleBannerChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (bannerPreview) URL.revokeObjectURL(bannerPreview);
    setBannerFile(file);
    setBannerPreview(URL.createObjectURL(file));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    const formData = new FormData();
    formData.append("communityName", communityName.trim());
    formData.append("communityDescription", communityDescription.trim());
    if (profileFile) formData.append("profilePicture", profileFile);
    if (bannerFile) formData.append("banner", bannerFile);

    try {
      const result = await createCommunity(formData).unwrap();
      navigate(`/communities/${result.data._id}`);
    } catch (err) {
      setError(err?.data?.message || "Failed to create community. Please try again.");
    }
  };

  const canSubmit = communityName.trim() && communityDescription.trim() && profileFile && bannerFile;

  return (
    <main className="max-w-2xl mx-auto">
      <div className="flex items-center gap-3 mb-6">
        <button
          onClick={() => navigate(-1)}
          className="p-2 rounded-xl hover:bg-[#2A2A2A] text-[#FF4500] transition-colors duration-200"
        >
          <Icon icon="material-symbols:arrow-back-rounded" width="20" height="20" />
        </button>
        <div>
          <h1 className="text-xl font-bold text-[#D7DADC]">Create Community</h1>
          <p className="text-xs text-[#9A9A9A]">Build a space for people who share your interests</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-5">
        <div className="flex flex-col gap-1.5">
          <label className="text-[10px] font-extrabold text-[#9A9A9A] uppercase tracking-[0.2em] px-1">
            Banner Image <span className="text-[#FF4500]">*</span>
          </label>
          <div
            onClick={() => bannerRef.current?.click()}
            className="relative h-36 rounded-2xl overflow-hidden border-2 border-dashed border-[#3A3A3C] bg-[#1E1E1E] cursor-pointer hover:border-[#FF4500] hover:bg-[#111111] transition-all duration-200 group"
          >
            {bannerPreview ? (
              <>
                <img src={bannerPreview} alt="banner" className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <Icon icon="material-symbols:edit" width="24" height="24" className="text-white" />
                </div>
              </>
            ) : (
              <div className="h-full flex flex-col items-center justify-center gap-2">
                <Icon icon="material-symbols:image-outline" width="28" height="28" className="text-[#9A9A9A]" />
                <p className="text-sm font-medium text-[#9A9A9A]">Click to upload banner</p>
                <p className="text-xs text-[#3A3A3C]">Recommended: 1500 × 500px</p>
              </div>
            )}
            <input ref={bannerRef} type="file" accept="image/*" onChange={handleBannerChange} className="hidden" />
          </div>
        </div>
        <div className="flex flex-col gap-1.5">
          <label className="text-[10px] font-extrabold text-[#9A9A9A] uppercase tracking-[0.2em] px-1">
            Profile Picture <span className="text-[#FF4500]">*</span>
          </label>
          <div className="flex items-center gap-4">
            <div
              onClick={() => profileRef.current?.click()}
              className="relative h-20 w-20 rounded-full overflow-hidden border-2 border-dashed border-[#3A3A3C] bg-[#1E1E1E] cursor-pointer hover:border-[#FF4500] transition-all duration-200 group shrink-0"
            >
              {profilePreview ? (
                <>
                  <img src={profilePreview} alt="profile" className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center rounded-full">
                    <Icon icon="material-symbols:edit" width="18" height="18" className="text-white" />
                  </div>
                </>
              ) : (
                <div className="h-full flex flex-col items-center justify-center">
                  <Icon icon="mdi:account-group" width="28" height="28" className="text-[#9A9A9A]" />
                </div>
              )}
              <input ref={profileRef} type="file" accept="image/*" onChange={handleProfileChange} className="hidden" />
            </div>
            <div className="text-sm text-[#9A9A9A]">
              <p className="font-medium text-[#A83200]">Community avatar</p>
              <p className="text-xs mt-0.5">Square image recommended</p>
              <p className="text-xs text-[#9A9A9A]">Click the circle to upload</p>
            </div>
          </div>
        </div>
        <div className="flex flex-col gap-1.5">
          <label className="text-[10px] font-extrabold text-[#9A9A9A] uppercase tracking-[0.2em] px-1">
            Community Name <span className="text-[#FF4500]">*</span>
          </label>
          <div className="flex w-full border border-[#3A3A3C] bg-[#1E1E1E] rounded-xl p-3 gap-2.5 focus-within:border-[#FF4500] focus-within:bg-[#2A2A2A] focus-within:shadow-[0_0_0_3px_rgba(255,69,0,0.1)] transition-all duration-200">
            <Icon icon="mdi:account-group" width="18" height="18" className="text-[#FF4500] shrink-0 mt-px" />
            <input
              value={communityName}
              onChange={(e) => setCommunityName(e.target.value)}
              placeholder="e.g. Football, Photography, Travel..."
              className="w-full outline-none bg-transparent text-[#D7DADC] placeholder:text-[#9A9A9A] text-sm font-medium"
            />
          </div>
        </div>
        <div className="flex flex-col gap-1.5">
          <label className="text-[10px] font-extrabold text-[#9A9A9A] uppercase tracking-[0.2em] px-1">
            Description <span className="text-[#FF4500]">*</span>
          </label>
          <div className="flex w-full border border-[#3A3A3C] bg-[#1E1E1E] rounded-xl p-3 gap-2.5 focus-within:border-[#FF4500] focus-within:bg-[#2A2A2A] focus-within:shadow-[0_0_0_3px_rgba(255,69,0,0.1)] transition-all duration-200">
            <Icon icon="material-symbols:description-outline" width="18" height="18" className="text-[#FF4500] shrink-0 mt-px" />
            <textarea
              value={communityDescription}
              onChange={(e) => setCommunityDescription(e.target.value)}
              placeholder="What is this community about? What can members expect?"
              rows={4}
              className="w-full outline-none bg-transparent text-[#D7DADC] placeholder:text-[#9A9A9A] text-sm resize-none"
            />
          </div>
        </div>

        {error && (
          <div className="flex items-center gap-2 px-4 py-3 rounded-xl bg-red-50 border border-red-200 text-red-600 text-sm">
            <Icon icon="material-symbols:error-outline" width="16" height="16" />
            {error}
          </div>
        )}
        <div className="flex gap-3 pt-1">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="flex-1 py-2.5 rounded-full font-semibold text-sm text-[#A83200] bg-[#2A2A2A] hover:bg-[#2A2A2A] hover:text-[#CC3600] border border-transparent hover:border-[#3A3A3C] transition-all duration-200 cursor-pointer"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={!canSubmit || isLoading}
            className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-full font-semibold text-sm transition-all duration-200 ${
              canSubmit && !isLoading
                ? "bg-[#FF4500] text-white shadow-[0_3px_12px_rgba(255,69,0,0.35)] hover:shadow-[0_5px_18px_rgba(255,69,0,0.5)] hover:-translate-y-0.5 cursor-pointer"
                : "bg-[#3A3A3C] text-[#9A9A9A] cursor-not-allowed"
            }`}
          >
            {isLoading ? (
              <>
                <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                </svg>
                Creating...
              </>
            ) : (
              <>
                <Icon icon="mdi:account-group" width="16" height="16" />
                Create Community
              </>
            )}
          </button>
        </div>
      </form>
    </main>
  );
};

export default CommunityCreate;