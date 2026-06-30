import React from "react";
import { Icon } from "@iconify/react";
import { useCall } from "../../context/CallContext";

const IncomingCallModal = () => {
  const { callState, incomingInfo, acceptCall, rejectCall } = useCall();

  if (callState !== "ringing-in" || !incomingInfo) return null;

  const { from, callType } = incomingInfo;

  return (
    <div className="fixed inset-0 z-[200] flex items-end sm:items-center justify-center p-4 bg-black/70 backdrop-blur-md">
      <div className="bg-[#1E1E1E] border border-[#3A3A3C] rounded-3xl w-full max-w-xs shadow-[0_24px_64px_rgba(0,0,0,0.8)] flex flex-col items-center gap-6 px-6 py-8">
        <div className="flex flex-col items-center gap-3">
          <div className="relative">
            <div className="h-20 w-20 rounded-full overflow-hidden border-4 border-[#FF4500]">
              {from.avatar ? (
                <img
                  src={from.avatar}
                  alt={from.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full bg-[#2A2A2A] flex items-center justify-center">
                  <Icon
                    icon="mdi:account"
                    width="36"
                    height="36"
                    className="text-[#9A9A9A]"
                  />
                </div>
              )}
            </div>
            <div className="absolute -bottom-1 -right-1 h-7 w-7 rounded-full bg-[#FF4500] flex items-center justify-center border-2 border-[#1E1E1E]">
              <Icon
                icon={callType === "video" ? "mdi:video" : "mdi:phone"}
                width="14"
                height="14"
                className="text-white"
              />
            </div>
          </div>
          <div className="text-center">
            <p className="font-black text-lg text-[#D7DADC]">
              {from.name || from.username}
            </p>
            <p className="text-sm text-[#9A9A9A]">@{from.username}</p>
          </div>
          <p className="text-sm text-[#9A9A9A]">
            Incoming {callType} call…
          </p>
        </div>

        <div className="flex items-center justify-center gap-10 w-full">
          <button
            onClick={rejectCall}
            className="flex flex-col items-center gap-2 group"
          >
            <div className="h-14 w-14 rounded-full bg-red-500 hover:bg-red-600 flex items-center justify-center transition-colors">
              <Icon
                icon="mdi:phone-hangup"
                width="24"
                height="24"
                className="text-white"
              />
            </div>
            <span className="text-xs text-[#9A9A9A]">Decline</span>
          </button>

          <button
            onClick={acceptCall}
            className="flex flex-col items-center gap-2 group"
          >
            <div className="h-14 w-14 rounded-full bg-emerald-500 hover:bg-emerald-600 flex items-center justify-center transition-colors">
              <Icon
                icon={callType === "video" ? "mdi:video" : "mdi:phone"}
                width="24"
                height="24"
                className="text-white"
              />
            </div>
            <span className="text-xs text-[#9A9A9A]">Accept</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default IncomingCallModal;
