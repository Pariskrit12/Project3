import React, {
  createContext,
  useContext,
  useState,
  useRef,
  useCallback,
} from "react";

const RTC_CONFIG = {
  iceServers: [
    { urls: "stun:stun.l.google.com:19302" },
  ],
};

const CallContext = createContext(null);

export function CallProvider({ children }) {
  const [callState, setCallState] = useState("idle");
  const [incomingInfo, setIncomingInfo] = useState(null);
  const [outgoingInfo, setOutgoingInfo] = useState(null);
  const [activeInfo, setActiveInfo] = useState(null);
  const [localStream, setLocalStreamState] = useState(null);
  const [remoteStream, setRemoteStream] = useState(null);
  const [isMuted, setIsMuted] = useState(false);
  const [isCameraOff, setIsCameraOff] = useState(false);
  const [callError, setCallError] = useState(null);

  const pcRef = useRef(null);
  const localStreamRef = useRef(null);
  const iceBuf = useRef([]);
  const callIdRef = useRef(null);
  const callTypeRef = useRef("video");
  const callStateRef = useRef("idle");
  const socketRef = useRef(null);

  const acquireMediaRef = useRef(null);
  const createPcRef = useRef(null);
  const resetAllRef = useRef(null);

  const setCS = (s) => {
    callStateRef.current = s;
    setCallState(s);
  };

  const setLocalStream = (s) => {
    localStreamRef.current = s;
    setLocalStreamState(s);
  };

  const releaseMedia = useCallback(() => {
    if (pcRef.current) {
      pcRef.current.close();
      pcRef.current = null;
    }
    iceBuf.current = [];
    localStreamRef.current?.getTracks().forEach((t) => t.stop());
    setLocalStream(null);
    setRemoteStream(null);
  }, []);

  const resetAll = useCallback(() => {
    releaseMedia();
    setCS("idle");
    callIdRef.current = null;
    setIncomingInfo(null);
    setOutgoingInfo(null);
    setActiveInfo(null);
    setIsMuted(false);
    setIsCameraOff(false);
    setCallError(null);
  }, [releaseMedia]);

  const acquireMedia = useCallback(async (callType) => {
    const stream = await navigator.mediaDevices.getUserMedia({
      video: callType === "video",
      audio: true,
    });
    setLocalStream(stream);
    return stream;
  }, []);

  const createPc = useCallback((callId) => {
    const pc = new RTCPeerConnection(RTC_CONFIG);
    pcRef.current = pc;
    iceBuf.current = [];

    pc.ontrack = (e) => {
      if (e.streams?.[0]) setRemoteStream(e.streams[0]);
    };

    pc.onicecandidate = (e) => {
      if (e.candidate && socketRef.current) {
        socketRef.current.emit("webrtc:ice-candidate", {
          callId,
          candidate: e.candidate,
        });
      }
    };

    return pc;
  }, []);

  acquireMediaRef.current = acquireMedia;
  createPcRef.current = createPc;
  resetAllRef.current = resetAll;

  const initiateCall = useCallback((toUserId, callType = "video", calleeInfo = null) => {
    const socket = socketRef.current;
    if (!socket) return;
    setCallError(null);
    callTypeRef.current = callType;
    setOutgoingInfo({ toUserId, callType, callee: calleeInfo });
    setCS("ringing-out");
    socket.emit("call:initiate", { toUserId, callType });
  }, []);

  const acceptCall = useCallback(async () => {
    const socket = socketRef.current;
    const callId = callIdRef.current;
    if (!socket || !callId) return;
    try {
      const stream = await acquireMediaRef.current(callTypeRef.current);
      const pc = createPcRef.current(callId);
      stream.getTracks().forEach((t) => pc.addTrack(t, stream));
      socket.emit("call:accept", { callId });
      setCS("active");
      setActiveInfo({ callId, callType: callTypeRef.current });
    } catch {
      socket.emit("call:end", { callId });
      resetAllRef.current();
    }
  }, []);

  const rejectCall = useCallback(() => {
    const socket = socketRef.current;
    const callId = callIdRef.current;
    if (!socket || !callId) return;
    socket.emit("call:reject", { callId });
    resetAllRef.current();
  }, []);

  const endCall = useCallback(() => {
    const socket = socketRef.current;
    const callId = callIdRef.current;
    if (callId && socket) socket.emit("call:end", { callId });
    resetAllRef.current();
  }, []);

  const toggleMute = useCallback(() => {
    localStreamRef.current?.getAudioTracks().forEach((t) => {
      t.enabled = !t.enabled;
    });
    setIsMuted((m) => !m);
  }, []);

  const toggleCamera = useCallback(() => {
    localStreamRef.current?.getVideoTracks().forEach((t) => {
      t.enabled = !t.enabled;
    });
    setIsCameraOff((c) => !c);
  }, []);

  const bindSocket = useCallback((socket) => {
    socketRef.current = socket;

    const onRinging = ({ callId }) => {
      callIdRef.current = callId;
    };

    const onIncoming = ({ callId, from, callType }) => {
      callIdRef.current = callId;
      callTypeRef.current = callType;
      setIncomingInfo({ callId, from, callType });
      setCS("ringing-in");
    };

    const onAccepted = async ({ callId }) => {
      setCS("active");
      setActiveInfo({ callId, callType: callTypeRef.current });
      try {
        const stream = await acquireMediaRef.current(callTypeRef.current);
        const pc = createPcRef.current(callId);
        stream.getTracks().forEach((t) => pc.addTrack(t, stream));
        const offer = await pc.createOffer();
        await pc.setLocalDescription(offer);
        socket.emit("webrtc:offer", { callId, sdp: offer });
      } catch {
        socket.emit("call:end", { callId });
        resetAllRef.current();
      }
    };

    const onEnded = () => {
      resetAllRef.current();
    };

    const onError = ({ code }) => {
      setCallError(code);
      if (callStateRef.current !== "idle") resetAllRef.current();
    };

    const onOffer = async ({ callId, sdp }) => {
      const pc = pcRef.current;
      if (!pc) return;
      await pc.setRemoteDescription(new RTCSessionDescription(sdp));
      for (const c of iceBuf.current) {
        try {
          await pc.addIceCandidate(new RTCIceCandidate(c));
        } catch {}
      }
      iceBuf.current = [];
      const answer = await pc.createAnswer();
      await pc.setLocalDescription(answer);
      socket.emit("webrtc:answer", { callId, sdp: answer });
    };

    const onAnswer = async ({ sdp }) => {
      const pc = pcRef.current;
      if (!pc) return;
      await pc.setRemoteDescription(new RTCSessionDescription(sdp));
      for (const c of iceBuf.current) {
        try {
          await pc.addIceCandidate(new RTCIceCandidate(c));
        } catch {}
      }
      iceBuf.current = [];
    };

    const onIce = async ({ candidate }) => {
      if (!candidate) return;
      const pc = pcRef.current;
      if (!pc || !pc.remoteDescription) {
        iceBuf.current.push(candidate);
        return;
      }
      try {
        await pc.addIceCandidate(new RTCIceCandidate(candidate));
      } catch {}
    };

    socket.on("call:ringing", onRinging);
    socket.on("call:incoming", onIncoming);
    socket.on("call:accepted", onAccepted);
    socket.on("call:ended", onEnded);
    socket.on("call:error", onError);
    socket.on("webrtc:offer", onOffer);
    socket.on("webrtc:answer", onAnswer);
    socket.on("webrtc:ice-candidate", onIce);

    return () => {
      socket.off("call:ringing", onRinging);
      socket.off("call:incoming", onIncoming);
      socket.off("call:accepted", onAccepted);
      socket.off("call:ended", onEnded);
      socket.off("call:error", onError);
      socket.off("webrtc:offer", onOffer);
      socket.off("webrtc:answer", onAnswer);
      socket.off("webrtc:ice-candidate", onIce);
      socketRef.current = null;
    };
  }, []);

  return (
    <CallContext.Provider
      value={{
        callState,
        incomingInfo,
        outgoingInfo,
        activeInfo,
        localStream,
        remoteStream,
        isMuted,
        isCameraOff,
        callError,
        initiateCall,
        acceptCall,
        rejectCall,
        endCall,
        toggleMute,
        toggleCamera,
        bindSocket,
      }}
    >
      {children}
    </CallContext.Provider>
  );
}

export const useCall = () => useContext(CallContext);
