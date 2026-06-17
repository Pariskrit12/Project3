import React, { useState, useRef } from "react";
import { Icon } from "@iconify/react";
import { useNavigate, useSearchParams } from "react-router-dom";
import {
  useCreatePostMutation,
  useCreatePostInCommunityMutation,
} from "../services/postApi";
import { useGetCommunityQuery } from "../services/communitiesApi";

const CreatePost = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const communityId = searchParams.get("communityId") || "";

  const [postTitle, setPostTitle] = useState("");
  const [postDescription, setPostDescription] = useState("");
  const [mediaFiles, setMediaFiles] = useState([]);
  const [previews, setPreviews] = useState([]);
  const [error, setError] = useState("");
  const [selectedTags, setSelectedTags] = useState([]);
  const [tagInput, setTagInput] = useState("");
  const fileInputRef = useRef(null);

  const PRESET_TAGS = [
    "technology", "gaming", "sports", "music", "art", "science",
    "travel", "food", "fitness", "fashion", "movies", "books",
    "coding", "design", "health", "education", "photography", "nature",
  ];

  const toggleTag = (tag) => {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  };

  const addCustomTag = () => {
    const tag = tagInput.trim().toLowerCase();
    if (!tag || selectedTags.includes(tag)) return;
    setSelectedTags((prev) => [...prev, tag]);
    setTagInput("");
  };

  const [createPost, { isLoading: isCreating }] = useCreatePostMutation();
  const [createPostInCommunity, { isLoading: isCreatingInCommunity }] =
    useCreatePostInCommunityMutation();
  const { data: communityData } = useGetCommunityQuery(communityId, { skip: !communityId });
  const community = communityData?.data;
  const isLoading = isCreating || isCreatingInCommunity;

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    setMediaFiles(files);
    const newPreviews = files.map((file) => ({
      url: URL.createObjectURL(file),
      type: file.type.startsWith("image") ? "image" : "video",
    }));
    setPreviews(newPreviews);
  };

  const removeFile = (index) => {
    URL.revokeObjectURL(previews[index].url);
    setMediaFiles((prev) => prev.filter((_, i) => i !== index));
    setPreviews((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    const formData = new FormData();
    if (postTitle.trim()) formData.append("postTitle", postTitle.trim());
    if (postDescription.trim())
      formData.append("postDescription", postDescription.trim());
    mediaFiles.forEach((file) => formData.append("media", file));
    if (selectedTags.length > 0)
      formData.append("tags", JSON.stringify(selectedTags));

    try {
      if (communityId) {
        await createPostInCommunity({ communityId, formData }).unwrap();
      } else {
        await createPost(formData).unwrap();
      }
      navigate("/");
    } catch (err) {
      setError(err?.data?.message || "Failed to create post. Please try again.");
    }
  };

  const hasContent =
    postTitle.trim() || postDescription.trim() || mediaFiles.length > 0;

  return (
    <main className="max-w-2xl mx-auto">
      <div className="flex items-center gap-3 mb-6">
        <button
          onClick={() => navigate(-1)}
          className="p-2 rounded-xl hover:bg-[#E5E6EA] text-[#FF4500] transition-colors duration-200"
        >
          <Icon
            icon="material-symbols:arrow-back-rounded"
            width="20"
            height="20"
          />
        </button>
        <div>
          <h1 className="text-xl font-bold text-[#1C1C1C]">Create Post</h1>
          <p className="text-xs text-[#878A8C]">
            {communityId && community
              ? `Posting to ${community.communityName}`
              : "Share something with everyone"}
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        {/* Community badge — only shown when coming from a community page */}
        {communityId && (
          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] font-extrabold text-[#878A8C] uppercase tracking-[0.2em] px-1">
              Posting in
            </label>
            <div className="flex items-center gap-2.5 border border-[#EDEFF1] bg-[#FFFFFF] rounded-xl p-3">
              <div className="shrink-0 h-7 w-7 rounded-full overflow-hidden bg-[#E5E6EA] border border-[#EDEFF1]">
                {community?.communityProfilePicture ? (
                  <img
                    src={community.communityProfilePicture}
                    alt={community.communityName}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <Icon icon="mdi:account-group" width="14" height="14" className="text-[#FF4500]" />
                  </div>
                )}
              </div>
              <p className="text-sm font-semibold text-[#1C1C1C] flex-1">
                {community?.communityName ?? "Loading…"}
              </p>
              <Icon icon="mdi:lock" width="14" height="14" className="text-[#878A8C]" />
            </div>
          </div>
        )}

        {/* Title */}
        <div className="flex flex-col gap-1.5">
          <label className="text-[10px] font-extrabold text-[#878A8C] uppercase tracking-[0.2em] px-1">
            Title
          </label>
          <div className="flex w-full border border-[#EDEFF1] bg-[#FFFFFF] rounded-xl p-3 gap-2.5 focus-within:border-[#FF4500] focus-within:bg-white focus-within:shadow-[0_0_0_3px_rgba(255,69,0,0.1)] transition-all duration-200">
            <Icon
              icon="fluent:text-header-1-24-filled"
              width="18"
              height="18"
              className="text-[#FF4500] shrink-0 mt-px"
            />
            <input
              value={postTitle}
              onChange={(e) => setPostTitle(e.target.value)}
              placeholder="Give your post a title..."
              className="w-full outline-none bg-transparent text-[#1C1C1C] placeholder:text-[#878A8C] text-sm font-medium"
            />
          </div>
        </div>

        {/* Description */}
        <div className="flex flex-col gap-1.5">
          <label className="text-[10px] font-extrabold text-[#878A8C] uppercase tracking-[0.2em] px-1">
            Description
          </label>
          <div className="flex w-full border border-[#EDEFF1] bg-[#FFFFFF] rounded-xl p-3 gap-2.5 focus-within:border-[#FF4500] focus-within:bg-white focus-within:shadow-[0_0_0_3px_rgba(255,69,0,0.1)] transition-all duration-200">
            <Icon
              icon="material-symbols:description-outline"
              width="18"
              height="18"
              className="text-[#FF4500] shrink-0 mt-px"
            />
            <textarea
              value={postDescription}
              onChange={(e) => setPostDescription(e.target.value)}
              placeholder="What's on your mind?"
              rows={5}
              className="w-full outline-none bg-transparent text-[#1C1C1C] placeholder:text-[#878A8C] text-sm resize-none"
            />
          </div>
        </div>

        {/* Tags */}
        <div className="flex flex-col gap-1.5">
          <label className="text-[10px] font-extrabold text-[#878A8C] uppercase tracking-[0.2em] px-1">
            Tags (optional)
          </label>
          <div className="border border-[#EDEFF1] bg-[#FFFFFF] rounded-xl p-3 flex flex-col gap-3">
            <div className="flex flex-wrap gap-1.5">
              {PRESET_TAGS.map((tag) => {
                const active = selectedTags.includes(tag);
                return (
                  <button
                    key={tag}
                    type="button"
                    onClick={() => toggleTag(tag)}
                    className={`px-2.5 py-1 rounded-full text-xs font-semibold border transition-all capitalize ${
                      active
                        ? "bg-[#FF4500] text-white border-transparent"
                        : "bg-[#E5E6EA] text-[#A83200] border-[#EDEFF1] hover:bg-[#E5E6EA]"
                    }`}
                  >
                    {active && <Icon icon="mdi:check" width="10" height="10" className="inline mr-1 -mt-0.5" />}
                    {tag}
                  </button>
                );
              })}
            </div>
            <div className="flex gap-2">
              <div className="flex-1 flex items-center gap-2 border border-[#EDEFF1] bg-white rounded-lg px-3 py-1.5 focus-within:border-[#FF4500] transition-all">
                <Icon icon="mdi:tag-plus-outline" width="14" height="14" className="text-[#FF4500] shrink-0" />
                <input
                  type="text"
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addCustomTag())}
                  placeholder="Custom tag…"
                  className="flex-1 outline-none bg-transparent text-xs text-[#1C1C1C] placeholder:text-[#878A8C]"
                />
              </div>
              <button
                type="button"
                onClick={addCustomTag}
                disabled={!tagInput.trim()}
                className="px-3 py-1.5 rounded-lg bg-[#E5E6EA] text-[#FF4500] text-xs font-semibold hover:bg-[#E5E6EA] disabled:opacity-40 transition-colors"
              >
                Add
              </button>
            </div>
            {selectedTags.length > 0 && (
              <div className="flex flex-wrap gap-1.5">
                {selectedTags
                  .filter((t) => !PRESET_TAGS.includes(t))
                  .map((tag) => (
                    <span
                      key={tag}
                      className="flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-[#FF4500] text-white"
                    >
                      {tag}
                      <button
                        type="button"
                        onClick={() => toggleTag(tag)}
                        className="hover:opacity-70"
                      >
                        <Icon icon="mdi:close" width="10" height="10" />
                      </button>
                    </span>
                  ))}
              </div>
            )}
          </div>
        </div>

        {/* Media Upload */}
        <div className="flex flex-col gap-1.5">
          <label className="text-[10px] font-extrabold text-[#878A8C] uppercase tracking-[0.2em] px-1">
            Media (optional)
          </label>
          <div
            onClick={() => fileInputRef.current?.click()}
            className="border-2 border-dashed border-[#EDEFF1] bg-[#FFFFFF] rounded-xl p-6 flex flex-col items-center gap-2 cursor-pointer hover:border-[#FF4500] hover:bg-[#DAE0E6] transition-all duration-200 group"
          >
            <div className="p-3 rounded-full bg-[#E5E6EA] group-hover:bg-[#E5E6EA] transition-colors">
              <Icon
                icon="material-symbols:upload-rounded"
                width="22"
                height="22"
                className="text-[#FF4500]"
              />
            </div>
            <p className="text-sm font-semibold text-[#A83200]">
              Click to upload images or videos
            </p>
            <p className="text-xs text-[#878A8C]">Multiple files supported</p>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*,video/*"
              multiple
              onChange={handleFileChange}
              className="hidden"
            />
          </div>

          {previews.length > 0 && (
            <div className="grid grid-cols-3 gap-2 mt-1">
              {previews.map((preview, index) => (
                <div
                  key={index}
                  className="relative rounded-xl overflow-hidden border border-[#EDEFF1] aspect-square bg-[#E5E6EA]"
                >
                  {preview.type === "image" ? (
                    <img
                      src={preview.url}
                      alt="preview"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <video
                      src={preview.url}
                      className="w-full h-full object-cover"
                    />
                  )}
                  <button
                    type="button"
                    onClick={() => removeFile(index)}
                    className="absolute top-1.5 right-1.5 p-1 rounded-full bg-black/50 text-white hover:bg-black/70 transition-colors"
                  >
                    <Icon
                      icon="material-symbols:close-rounded"
                      width="14"
                      height="14"
                    />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {error && (
          <div className="flex items-center gap-2 px-4 py-3 rounded-xl bg-red-50 border border-red-200 text-red-600 text-sm">
            <Icon icon="material-symbols:error-outline" width="16" height="16" />
            {error}
          </div>
        )}

        {/* Actions */}
        <div className="flex gap-3 pt-1">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="flex-1 py-2.5 rounded-full font-semibold text-sm text-[#A83200] bg-[#E5E6EA] hover:bg-[#E5E6EA] hover:text-[#CC3600] border border-transparent hover:border-[#EDEFF1] transition-all duration-200 cursor-pointer"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={!hasContent || isLoading}
            className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-full font-semibold text-sm transition-all duration-200 ${
              hasContent && !isLoading
                ? "bg-[#FF4500] text-white shadow-[0_3px_12px_rgba(255,69,0,0.35)] hover:shadow-[0_5px_18px_rgba(255,69,0,0.5)] hover:-translate-y-0.5 cursor-pointer"
                : "bg-[#EDEFF1] text-[#878A8C] cursor-not-allowed"
            }`}
          >
            {isLoading ? (
              <>
                <svg
                  className="animate-spin h-4 w-4"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8v8H4z"
                  />
                </svg>
                Publishing...
              </>
            ) : (
              <>
                <Icon icon="mingcute:send-fill" width="16" height="16" />
                Publish Post
              </>
            )}
          </button>
        </div>
      </form>
    </main>
  );
};

export default CreatePost;
