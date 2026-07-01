import React, { useEffect, useState } from "react";
import { Icon } from "@iconify/react";
import { useCall } from "../../context/CallContext";

const ERROR_LABELS = {
  NOT_ALLOWED: "You must follow each other to call",
  USER_OFFLINE: "User is offline",
  USER_BUSY: "User is busy in another call",
};

const OutgoingCallModal = () => {
  const { callState, outgoingInfo, callError, clearCallError, endCall } = useCall();
  const [dots, setDots] = useState(".");

  useEffect(() => {
    if (callState !== "ringing-out") return;
    const id = setInterval(() => {
      setDots((d) => (d.length >= 3 ? "." : d + "."));
    }, 500);
    return () => clearInterval(id);
  }, [callState]);

  if (callError && callState === "idle") {
    return (
      <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/80 backdrop-blur-md">
        <div className="flex flex-col items-center gap-6 bg-[#1E1E1E] border border-[#3A3A3C] rounded-3xl px-8 py-8 max-w-xs w-full mx-4 shadow-2xl">
          <div className="h-16 w-16 rounded-full bg-red-500/20 flex items-center justify-center">
            <Icon icon="mdi:phone-off" width="32" height="32" className="text-red-400" />
          </div>
          <div className="text-center">
            <p className="text-[#D7DADC] font-bold text-base">Call Failed</p>
            <p className="text-[#9A9A9A] text-sm mt-1">
              {ERROR_LABELS[callError] || "Something went wrong"}
            </p>
          </div>
          <button
            onClick={clearCallError}
            className="w-full py-2.5 rounded-xl bg-[#FF4500] text-white font-bold text-sm hover:bg-[#CC3600] transition-colors"
          >
            Dismiss
          </button>
        </div>
      </div>
    );
  }

  if (callState !== "ringing-out" || !outgoingInfo) return null;

  const { callee, callType } = outgoingInfo;

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/80 backdrop-blur-md">
      <div className="flex flex-col items-center gap-8">
        <div className="relative flex items-center justify-center">
          <span className="absolute inline-flex h-36 w-36 rounded-full bg-[#FF4500]/20 animate-ping" />
          <span className="absolute inline-flex h-28 w-28 rounded-full bg-[#FF4500]/15 animate-ping [animation-delay:300ms]" />
          <div className="relative h-24 w-24 rounded-full overflow-hidden border-4 border-[#FF4500] z-10">
            {callee?.avatar ? (
              <img
                src={callee.avatar}
                alt={callee.name}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full bg-[#2A2A2A] flex items-center justify-center">
                <Icon
                  icon="mdi:account"
                  width="40"
                  height="40"
                  className="text-[#9A9A9A]"
                />
              </div>
            )}
          </div>
        </div>

        <div className="flex flex-col items-center gap-1 text-center">
          {callee?.name && (
            <p className="text-2xl font-black text-white">{callee.name}</p>
          )}
          {callee?.username && (
            <p className="text-sm text-white/50">@{callee.username}</p>
          )}
          {!callee && (
            <p className="text-xl font-black text-white">Calling…</p>
          )}
          <div className="flex items-center gap-1.5 mt-1 text-white/50 text-sm">
            <Icon
              icon={callType === "video" ? "mdi:video" : "mdi:phone"}
              width="14"
              height="14"
            />
            <span>
              {callType === "video" ? "Video" : "Audio"} call{dots}
            </span>
          </div>
        </div>

        <button
          onClick={endCall}
          className="h-16 w-16 rounded-full bg-red-500 hover:bg-red-600 flex items-center justify-center transition-colors shadow-[0_0_32px_rgba(239,68,68,0.4)]"
          title="Cancel call"
        >
          <Icon icon="mdi:phone-hangup" width="28" height="28" className="text-white" />
        </button>
      </div>
    </div>
  );
};

export default OutgoingCallModal;
