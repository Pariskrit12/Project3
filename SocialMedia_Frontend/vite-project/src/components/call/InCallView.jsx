import React, { useRef, useEffect } from "react";
import { Icon } from "@iconify/react";
import { useCall } from "../../context/CallContext";

const InCallView = () => {
  const {
    callState,
    activeInfo,
    localStream,
    remoteStream,
    isMuted,
    isCameraOff,
    endCall,
    toggleMute,
    toggleCamera,
  } = useCall();

  const remoteVideoRef = useRef(null);
  const localVideoRef = useRef(null);

  useEffect(() => {
    if (remoteVideoRef.current && remoteStream) {
      remoteVideoRef.current.srcObject = remoteStream;
    }
  }, [remoteStream]);

  useEffect(() => {
    if (localVideoRef.current && localStream) {
      localVideoRef.current.srcObject = localStream;
    }
  }, [localStream]);

  if (callState !== "active") return null;

  const isVideo = activeInfo?.callType === "video";

  return (
    <div className="fixed inset-0 z-[190] bg-[#111111] flex flex-col select-none">
      {isVideo ? (
        <video
          ref={remoteVideoRef}
          autoPlay
          playsInline
          className="absolute inset-0 w-full h-full object-cover"
        />
      ) : (
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 bg-[#111111]">
          <div className="h-24 w-24 rounded-full bg-[#2A2A2A] flex items-center justify-center">
            <Icon
              icon="mdi:account"
              width="48"
              height="48"
              className="text-[#9A9A9A]"
            />
          </div>
          <p className="text-[#9A9A9A] text-sm font-medium">Audio call in progress</p>
        </div>
      )}

      <div className="absolute inset-x-0 bottom-0 h-48 bg-linear-to-t from-black/80 to-transparent pointer-events-none" />

      {isVideo && !isCameraOff && (
        <div className="absolute top-4 right-4 w-28 h-40 rounded-2xl overflow-hidden border-2 border-[#3A3A3C] shadow-2xl bg-[#2A2A2A]">
          <video
            ref={localVideoRef}
            autoPlay
            playsInline
            muted
            className="w-full h-full object-cover"
          />
        </div>
      )}

      {isVideo && isCameraOff && (
        <div className="absolute top-4 right-4 w-28 h-40 rounded-2xl border-2 border-[#3A3A3C] bg-[#2A2A2A] flex items-center justify-center">
          <Icon
            icon="mdi:video-off"
            width="28"
            height="28"
            className="text-[#9A9A9A]"
          />
        </div>
      )}

      <div className="absolute bottom-10 inset-x-0 flex items-center justify-center gap-5">
        <button
          onClick={toggleMute}
          className={`h-14 w-14 rounded-full flex items-center justify-center transition-colors ${
            isMuted
              ? "bg-[#FF4500] text-white"
              : "bg-white/10 text-white hover:bg-white/20"
          }`}
          title={isMuted ? "Unmute" : "Mute"}
        >
          <Icon
            icon={isMuted ? "mdi:microphone-off" : "mdi:microphone"}
            width="22"
            height="22"
          />
        </button>

        <button
          onClick={endCall}
          className="h-16 w-16 rounded-full bg-red-500 hover:bg-red-600 flex items-center justify-center transition-colors shadow-lg"
          title="End call"
        >
          <Icon icon="mdi:phone-hangup" width="28" height="28" className="text-white" />
        </button>

        {isVideo && (
          <button
            onClick={toggleCamera}
            className={`h-14 w-14 rounded-full flex items-center justify-center transition-colors ${
              isCameraOff
                ? "bg-[#FF4500] text-white"
                : "bg-white/10 text-white hover:bg-white/20"
            }`}
            title={isCameraOff ? "Turn camera on" : "Turn camera off"}
          >
            <Icon
              icon={isCameraOff ? "mdi:video-off" : "mdi:video"}
              width="22"
              height="22"
            />
          </button>
        )}
      </div>
    </div>
  );
};

export default InCallView;
