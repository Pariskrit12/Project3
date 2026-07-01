import { randomUUID } from "crypto";
import { User } from "../models/user.models.js";

const activeCalls = new Map();
const userInCall = new Map();
const noAnswerTimers = new Map();

const NO_ANSWER_MS = 30_000;

function cleanup(callId) {
  const call = activeCalls.get(callId);
  if (call) {
    userInCall.delete(call.callerId);
    userInCall.delete(call.calleeId);
  }
  activeCalls.delete(callId);
  const t = noAnswerTimers.get(callId);
  if (t) {
    clearTimeout(t);
    noAnswerTimers.delete(callId);
  }
}

export function registerCallHandlers(io, socket) {
  const userId = socket.userId;

  socket.on("call:initiate", async ({ toUserId, callType = "video" } = {}) => {
    if (!toUserId) return;

    if (toUserId === userId) {
      return socket.emit("call:error", { code: "NOT_ALLOWED" });
    }

    let caller;
    try {
      caller = await User.findById(userId)
        .select("following followers name username userProfilePic")
        .lean();
    } catch {
      return socket.emit("call:error", { code: "NOT_ALLOWED" });
    }
    if (!caller) return socket.emit("call:error", { code: "NOT_ALLOWED" });

    const callerFollowsCallee = caller.following.some((id) => id.toString() === toUserId);
    const calleeFollowsCaller = caller.followers.some((id) => id.toString() === toUserId);
    if (!callerFollowsCallee && !calleeFollowsCaller) {
      return socket.emit("call:error", { code: "NOT_ALLOWED" });
    }

    const calleeSockets = await io.in(toUserId).fetchSockets();
    if (calleeSockets.length === 0) {
      return socket.emit("call:error", { code: "USER_OFFLINE" });
    }

    if (userInCall.has(toUserId)) {
      return socket.emit("call:error", { code: "USER_BUSY" });
    }
    if (userInCall.has(userId)) {
      return socket.emit("call:error", { code: "USER_BUSY" });
    }

    const callId = randomUUID();
    activeCalls.set(callId, {
      callerId: userId,
      calleeId: toUserId,
      callType,
      status: "ringing",
      startedAt: Date.now(),
    });
    userInCall.set(userId, callId);
    userInCall.set(toUserId, callId);

    const timer = setTimeout(() => {
      const call = activeCalls.get(callId);
      if (call && call.status === "ringing") {
        io.to(call.callerId).emit("call:ended", { callId, reason: "NO_ANSWER" });
        io.to(call.calleeId).emit("call:ended", { callId, reason: "NO_ANSWER" });
        cleanup(callId);
      }
    }, NO_ANSWER_MS);
    noAnswerTimers.set(callId, timer);

    io.to(toUserId).emit("call:incoming", {
      callId,
      from: {
        id: userId,
        name: caller.name,
        username: caller.username,
        avatar: caller.userProfilePic,
      },
      callType,
    });
    socket.emit("call:ringing", { callId });
  });

  socket.on("call:accept", ({ callId } = {}) => {
    if (!callId) return;
    const call = activeCalls.get(callId);
    if (!call || call.calleeId !== userId || call.status !== "ringing") {
      return socket.emit("call:error", { callId, code: "NOT_ALLOWED" });
    }
    const t = noAnswerTimers.get(callId);
    if (t) {
      clearTimeout(t);
      noAnswerTimers.delete(callId);
    }
    call.status = "active";
    io.to(call.callerId).emit("call:accepted", { callId });
  });

  socket.on("call:reject", ({ callId } = {}) => {
    if (!callId) return;
    const call = activeCalls.get(callId);
    if (!call || call.calleeId !== userId) return;
    io.to(call.callerId).emit("call:ended", { callId, reason: "REJECTED" });
    cleanup(callId);
  });

  socket.on("call:end", ({ callId } = {}) => {
    if (!callId) return;
    const call = activeCalls.get(callId);
    if (!call) return;
    if (call.callerId !== userId && call.calleeId !== userId) return;
    const peerId = call.callerId === userId ? call.calleeId : call.callerId;
    io.to(peerId).emit("call:ended", { callId, reason: "ENDED" });
    cleanup(callId);
  });

  for (const evt of ["webrtc:offer", "webrtc:answer", "webrtc:ice-candidate"]) {
    socket.on(evt, (data) => {
      if (!data?.callId) return;
      const call = activeCalls.get(data.callId);
      if (!call) return;
      if (call.callerId !== userId && call.calleeId !== userId) return;
      const peerId = call.callerId === userId ? call.calleeId : call.callerId;
      io.to(peerId).emit(evt, data);
    });
  }

  socket.on("disconnect", () => {
    const callId = userInCall.get(userId);
    if (!callId) return;
    const call = activeCalls.get(callId);
    if (!call) return;
    const peerId = call.callerId === userId ? call.calleeId : call.callerId;
    io.to(peerId).emit("call:ended", { callId, reason: "DISCONNECTED" });
    cleanup(callId);
  });
}
