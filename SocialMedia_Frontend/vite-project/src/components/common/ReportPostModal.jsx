import React, { useState } from "react";
import { Icon } from "@iconify/react";
import { useReportPostMutation } from "../../services/postApi";

const ReportPostModal = ({ postId, onClose }) => {
  const [reason, setReason] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [reportPost, { isLoading, error }] = useReportPostMutation();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!reason.trim()) return;
    try {
      await reportPost({ postId, reason }).unwrap();
      setSubmitted(true);
    } catch (_) {}
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-[#1E1E1E] border border-[#3A3A3C] rounded-2xl shadow-[0_16px_48px_rgba(0,0,0,0.6)] w-full max-w-md z-10">
        <div className="flex items-center justify-between px-5 py-4 border-b border-[#2A2A2A]">
          <div className="flex items-center gap-2.5">
            <div className="bg-[#FF4500]/10 p-1.5 rounded-lg">
              <Icon icon="mdi:flag-outline" width="18" height="18" className="text-[#FF6534]" />
            </div>
            <h2 className="font-black text-[#D7DADC] text-base">Report Post</h2>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-[#2A2A2A] text-[#9A9A9A] hover:text-[#D7DADC] transition-colors"
          >
            <Icon icon="mdi:close" width="18" height="18" />
          </button>
        </div>

        {submitted ? (
          <div className="flex flex-col items-center gap-3 px-5 py-10">
            <div className="bg-emerald-500/10 p-3 rounded-full">
              <Icon icon="mdi:check-circle" width="32" height="32" className="text-emerald-400" />
            </div>
            <p className="font-bold text-[#D7DADC]">Report submitted</p>
            <p className="text-sm text-[#9A9A9A] text-center">
              Our admins will review this post and take action if needed.
            </p>
            <button
              onClick={onClose}
              className="mt-2 px-5 py-2 bg-[#2A2A2A] text-[#D7DADC] rounded-xl text-sm font-semibold hover:bg-[#3A3A3C] transition-colors"
            >
              Close
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col gap-4 px-5 py-5">
            <p className="text-sm text-[#9A9A9A]">
              Tell us why this post violates our community guidelines.
            </p>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-[#A83200] uppercase tracking-wide">
                Reason <span className="text-red-500">*</span>
              </label>
              <textarea
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                placeholder="Describe why you're reporting this post…"
                maxLength={500}
                rows={4}
                autoFocus
                className="w-full bg-[#111111] border border-[#3A3A3C] rounded-xl px-3.5 py-2.5 text-sm text-[#D7DADC] placeholder:text-[#9A9A9A] outline-none focus:border-[#FF4500] resize-none transition-colors"
              />
              <p className="text-right text-xs text-[#9A9A9A]">{reason.length}/500</p>
            </div>

            {error && (
              <p className="text-xs text-red-400 font-medium">
                {error?.data?.message ?? "Failed to submit report. Try again."}
              </p>
            )}

            <div className="flex gap-2 justify-end">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-xl bg-[#2A2A2A] text-[#9A9A9A] text-sm font-semibold hover:bg-[#3A3A3C] hover:text-[#D7DADC] transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isLoading || !reason.trim()}
                className="px-4 py-2 rounded-xl bg-[#FF4500] text-white text-sm font-bold disabled:opacity-50 hover:bg-[#CC3600] transition-colors"
              >
                {isLoading ? "Submitting…" : "Submit Report"}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default ReportPostModal;
