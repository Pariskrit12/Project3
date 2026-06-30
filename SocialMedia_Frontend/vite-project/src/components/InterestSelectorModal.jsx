import React, { useState } from "react";
import { Icon } from "@iconify/react";
import { useDispatch } from "react-redux";
import { setUser } from "../slices/authSlice";
import { useSaveInterestsMutation } from "../services/userApi";
import { postsApi } from "../services/postApi";

const PRESET_TAGS = [
  "technology", "gaming", "sports", "music", "art",
  "science", "travel", "food", "fitness", "fashion",
  "movies", "books", "politics", "business", "health",
  "education", "photography", "nature", "coding", "design",
  "finance", "history", "philosophy", "anime", "cooking",
];

const InterestSelectorModal = ({ currentUser }) => {
  const dispatch = useDispatch();
  const [selected, setSelected] = useState(new Set());
  const [customInput, setCustomInput] = useState("");
  const [customTags, setCustomTags] = useState([]);
  const [saveInterests, { isLoading }] = useSaveInterestsMutation();

  const toggle = (tag) => {
    setSelected((prev) => {
      const next = new Set(prev);
      next.has(tag) ? next.delete(tag) : next.add(tag);
      return next;
    });
  };

  const addCustomTag = () => {
    const tag = customInput.trim().toLowerCase();
    if (!tag || selected.has(tag) || customTags.includes(tag)) return;
    setCustomTags((prev) => [...prev, tag]);
    setSelected((prev) => new Set([...prev, tag]));
    setCustomInput("");
  };

  const removeCustomTag = (tag) => {
    setCustomTags((prev) => prev.filter((t) => t !== tag));
    setSelected((prev) => {
      const next = new Set(prev);
      next.delete(tag);
      return next;
    });
  };
  const handleSave = async () => {
    const interests = [...selected];
    try {
      await saveInterests(interests).unwrap();
      dispatch(setUser({ ...currentUser, interests, hasSelectedInterests: true }));
      dispatch(postsApi.util.invalidateTags(["Post"]));
    } catch {      dispatch(setUser({ ...currentUser, hasSelectedInterests: true }));
    }
  };

  const handleSkip = () => {
    dispatch(setUser({ ...currentUser, hasSelectedInterests: true }));
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="bg-[#1E1E1E] rounded-3xl shadow-2xl w-full max-w-lg max-h-[90vh] flex flex-col overflow-hidden border border-[#3A3A3C]">
        <div className="px-6 pt-6 pb-4 border-b border-[#3A3A3C] bg-linear-to-br from-[#111111] to-[#1E1E1E]">
          <div className="flex items-center gap-3 mb-1">
            <div className="p-2 rounded-xl bg-[#FF4500]">
              <Icon icon="mdi:tag-heart" width="20" height="20" className="text-white" />
            </div>
            <h2 className="text-xl font-black text-[#D7DADC]">What are you into?</h2>
          </div>
          <p className="text-sm text-[#9A9A9A] ml-11">
            Pick topics to personalise your home feed. You can always change these later.
          </p>
        </div>
        <div className="flex-1 overflow-y-auto px-6 py-4 flex flex-col gap-5">
          <div>
            <p className="text-[10px] font-extrabold text-[#9A9A9A] uppercase tracking-[0.2em] mb-2">
              Popular topics
            </p>
            <div className="flex flex-wrap gap-2">
              {PRESET_TAGS.map((tag) => {
                const active = selected.has(tag);
                return (
                  <button
                    key={tag}
                    type="button"
                    onClick={() => toggle(tag)}
                    className={`px-3 py-1.5 rounded-full text-sm font-semibold border transition-all duration-150 capitalize ${
                      active
                        ? "bg-[#FF4500] text-white border-transparent shadow-[0_2px_8px_rgba(255,69,0,0.35)]"
                        : "bg-[#2A2A2A] text-[#A83200] border-[#3A3A3C] hover:bg-[#2A2A2A] hover:border-[#9A9A9A]"
                    }`}
                  >
                    {active && (
                      <Icon icon="mdi:check" width="12" height="12" className="inline mr-1 -mt-0.5" />
                    )}
                    {tag}
                  </button>
                );
              })}
            </div>
          </div>
          <div>
            <p className="text-[10px] font-extrabold text-[#9A9A9A] uppercase tracking-[0.2em] mb-2">
              Add your own
            </p>
            <div className="flex gap-2">
              <div className="flex-1 flex items-center gap-2 border border-[#3A3A3C] bg-[#1E1E1E] rounded-xl px-3 py-2 focus-within:border-[#FF4500] focus-within:shadow-[0_0_0_3px_rgba(255,69,0,0.1)] transition-all">
                <Icon icon="mdi:tag-plus-outline" width="16" height="16" className="text-[#FF4500] shrink-0" />
                <input
                  type="text"
                  value={customInput}
                  onChange={(e) => setCustomInput(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && addCustomTag()}
                  placeholder="e.g. astronomy, skateboarding…"
                  className="flex-1 outline-none bg-transparent text-sm text-[#D7DADC] placeholder:text-[#9A9A9A]"
                />
              </div>
              <button
                type="button"
                onClick={addCustomTag}
                disabled={!customInput.trim()}
                className="px-4 py-2 rounded-xl bg-[#2A2A2A] text-[#FF4500] font-semibold text-sm hover:bg-[#2A2A2A] disabled:opacity-40 transition-colors"
              >
                Add
              </button>
            </div>

            {customTags.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-2">
                {customTags.map((tag) => (
                  <span
                    key={tag}
                    className="flex items-center gap-1 px-3 py-1.5 rounded-full text-sm font-semibold bg-[#FF4500] text-white"
                  >
                    {tag}
                    <button
                      type="button"
                      onClick={() => removeCustomTag(tag)}
                      className="hover:opacity-70 transition-opacity ml-0.5"
                    >
                      <Icon icon="mdi:close" width="12" height="12" />
                    </button>
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>
        <div className="px-6 py-4 border-t border-[#3A3A3C] bg-[#1E1E1E] flex items-center justify-between gap-3">
          <div className="text-sm text-[#9A9A9A]">
            {selected.size > 0 ? (
              <span>
                <span className="font-bold text-[#FF4500]">{selected.size}</span> topic{selected.size !== 1 ? "s" : ""} selected
              </span>
            ) : (
              "No topics selected"
            )}
          </div>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={handleSkip}
              className="px-4 py-2 rounded-full text-sm font-semibold text-[#9A9A9A] hover:text-[#A83200] hover:bg-[#2A2A2A] transition-all"
            >
              Skip
            </button>
            <button
              type="button"
              onClick={handleSave}
              disabled={selected.size === 0 || isLoading}
              className={`flex items-center gap-2 px-5 py-2 rounded-full text-sm font-semibold transition-all duration-200 ${
                selected.size > 0 && !isLoading
                  ? "bg-[#FF4500] text-white shadow-[0_3px_12px_rgba(255,69,0,0.35)] hover:shadow-[0_5px_18px_rgba(255,69,0,0.5)] hover:-translate-y-0.5"
                  : "bg-[#3A3A3C] text-[#9A9A9A] cursor-not-allowed"
              }`}
            >
              {isLoading ? (
                <Icon icon="svg-spinners:ring-resize" width="14" height="14" />
              ) : (
                <Icon icon="mingcute:arrow-right-fill" width="14" height="14" />
              )}
              Get Started
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InterestSelectorModal;