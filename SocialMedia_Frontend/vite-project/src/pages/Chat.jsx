import React, { useState, useEffect, useRef } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { Icon } from "@iconify/react";
import EmojiPicker from "emoji-picker-react";
import {
  useGetConversationsQuery,
  useGetOrCreateConversationMutation,
  useGetMessagesQuery,
  useSendMessageMutation,
  useMarkConversationReadMutation,
} from "../services/chatApi";
import { useGetFollowersQuery, useGetFollowingQuery } from "../services/userApi";
import formatTime from "../utils/formatTime";
import { useCall } from "../context/CallContext";
const NewMessageModal = ({ onClose, onSelect }) => {
  const [search, setSearch] = useState("");
  const { data: followersData } = useGetFollowersQuery();
  const { data: followingData } = useGetFollowingQuery();

  const followers = followersData?.data ?? [];
  const following = followingData?.data ?? [];
  const all = [...followers, ...following].reduce((acc, u) => {
    if (!acc.find((x) => x._id === u._id)) acc.push(u);
    return acc;
  }, []);

  const filtered = all.filter((u) =>
    u.username?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="bg-[#1E1E1E] border border-[#3A3A3C] rounded-2xl w-full max-w-sm mx-4 shadow-[0_8px_40px_rgba(255,69,0,0.18)] overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-5 py-4 border-b border-[#3A3A3C]">
          <h2 className="font-black text-[#D7DADC]">New Message</h2>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-[#2A2A2A] transition-colors text-[#FF4500]"
          >
            <Icon icon="mdi:close" width="18" height="18" />
          </button>
        </div>
        <div className="px-4 py-3 border-b border-[#3A3A3C]">
          <input
            autoFocus
            className="w-full bg-[#2A2A2A] rounded-xl px-3 py-2 text-sm outline-none text-[#D7DADC] placeholder:text-[#9A9A9A]"
            placeholder="Search followers..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div className="overflow-y-auto max-h-72">
          {filtered.length === 0 ? (
            <div className="flex flex-col items-center gap-2 py-10 text-[#9A9A9A]">
              <Icon icon="mdi:account-group-outline" width="32" height="32" />
              <p className="text-sm">No followers yet</p>
            </div>
          ) : (
            filtered.map((u) => (
              <button
                key={u._id}
                onClick={() => onSelect(u._id)}
                className="flex items-center gap-3 w-full px-5 py-3 hover:bg-[#2A2A2A] transition-colors text-left"
              >
                <div className="shrink-0 h-10 w-10 rounded-full overflow-hidden bg-linear-to-br from-[#FF6534] to-[#CC3600] border-2 border-[#3A3A3C] flex items-center justify-center">
                  {u.userProfilePic ? (
                    <img src={u.userProfilePic} alt={u.username} className="w-full h-full object-cover" />
                  ) : (
                    <Icon icon="mdi:account" width="20" height="20" className="text-white" />
                  )}
                </div>
                <div className="min-w-0">
                  <p className="font-bold text-sm text-[#D7DADC] truncate">{u.username}</p>
                </div>
              </button>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
const Chat = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { user: me } = useSelector((state) => state.auth);

  const { callState, initiateCall, callError } = useCall();
  const [selectedConvId, setSelectedConvId] = useState(null);
  const [search, setSearch] = useState("");
  const [message, setMessage] = useState("");
  const [showPicker, setShowPicker] = useState(false);
  const [showNewMsg, setShowNewMsg] = useState(false);
  const messagesEndRef = useRef(null);

  const { data: convsData, isLoading: convsLoading } = useGetConversationsQuery();
  const [getOrCreate, { isLoading: opening }] = useGetOrCreateConversationMutation();
  const [sendMsg, { isLoading: sending }] = useSendMessageMutation();
  const [markRead] = useMarkConversationReadMutation();

  const { data: messagesData, isLoading: msgsLoading } = useGetMessagesQuery(
    selectedConvId,
    { skip: !selectedConvId }
  );

  const conversations = convsData?.data ?? [];
  const messages = messagesData?.data ?? [];

  const selectedConv = conversations.find((c) => c._id === selectedConvId);
  useEffect(() => {
    const targetUserId = searchParams.get("userId");
    if (!targetUserId) return;
    getOrCreate(targetUserId)
      .unwrap()
      .then((res) => {
        setSelectedConvId(res.data._id);
        navigate("/chat", { replace: true });
      })
      .catch(() => {});
  }, [searchParams]);
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);
  useEffect(() => {
    if (selectedConvId) markRead(selectedConvId);
  }, [selectedConvId]);

  const handleSelectUser = async (userId) => {
    setShowNewMsg(false);
    try {
      const res = await getOrCreate(userId).unwrap();
      setSelectedConvId(res.data._id);
    } catch (e) {
      alert(e?.data?.message ?? "Cannot start chat");
    }
  };

  const handleSend = async () => {
    if (!message.trim() || !selectedConvId || sending) return;
    const text = message.trim();
    setMessage("");
    setShowPicker(false);
    await sendMsg({ conversationId: selectedConvId, text });
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const filteredConvs = conversations.filter((c) =>
    c.otherUser?.username?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <main className="grid grid-cols-[300px_1fr] gap-0 h-[calc(100vh-80px)] overflow-hidden rounded-2xl border border-[#3A3A3C] shadow-[0_4px_24px_rgba(255,69,0,0.1)] bg-[#1E1E1E]">
      <div className="flex flex-col border-r border-[#3A3A3C] overflow-hidden">
        <div className="p-4 border-b border-[#3A3A3C]">
          <div className="flex items-center justify-between mb-3">
            <h1 className="text-xl font-black text-[#D7DADC]">Messages</h1>
            <button
              onClick={() => setShowNewMsg(true)}
              className="p-2 rounded-xl bg-[#FF4500] text-white hover:bg-[#CC3600] transition-colors"
              title="New message"
            >
              <Icon icon="mdi:pencil-plus-outline" width="18" height="18" />
            </button>
          </div>
          <div className="flex items-center gap-2 bg-[#2A2A2A] rounded-xl px-3 py-2">
            <Icon icon="material-symbols:search" width="16" height="16" className="text-[#9A9A9A]" />
            <input
              className="flex-1 bg-transparent text-sm outline-none text-[#D7DADC] placeholder:text-[#9A9A9A]"
              placeholder="Search..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto">
          {convsLoading && (
            <div className="flex justify-center py-10">
              <Icon icon="svg-spinners:ring-resize" width="24" height="24" className="text-[#FF4500]" />
            </div>
          )}
          {!convsLoading && filteredConvs.length === 0 && (
            <div className="flex flex-col items-center gap-2 py-12 text-[#9A9A9A]">
              <Icon icon="mdi:chat-outline" width="36" height="36" />
              <p className="text-sm text-center px-4">No conversations yet. Start one with a follower!</p>
            </div>
          )}
          {filteredConvs.map((conv) => {
            const other = conv.otherUser;
            const isActive = conv._id === selectedConvId;
            const unread = conv.unreadCount ?? 0;
            return (
              <button
                key={conv._id}
                onClick={() => setSelectedConvId(conv._id)}
                className={`flex items-center gap-3 w-full px-4 py-3 transition-colors text-left ${
                  isActive ? "bg-[#2A2A2A]" : "hover:bg-[#111111]"
                }`}
              >
                <div className="relative shrink-0">
                  <div className="h-11 w-11 rounded-full overflow-hidden bg-linear-to-br from-[#FF6534] to-[#CC3600] border-2 border-[#3A3A3C] flex items-center justify-center">
                    {other?.userProfilePic ? (
                      <img src={other.userProfilePic} alt={other.username} className="w-full h-full object-cover" />
                    ) : (
                      <Icon icon="mdi:account" width="22" height="22" className="text-white" />
                    )}
                  </div>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-bold text-sm text-[#D7DADC] truncate">{other?.username}</p>
                  <p className="text-xs text-[#9A9A9A] truncate">{conv.lastMessage || "Say hi!"}</p>
                </div>
                <div className="flex flex-col items-end gap-1 shrink-0">
                  {conv.lastMessageAt && (
                    <span className="text-[10px] text-[#9A9A9A]">
                      {formatTime(conv.lastMessageAt)}
                    </span>
                  )}
                  {unread > 0 && (
                    <span className="w-5 h-5 bg-[#FF4500] rounded-full text-white text-[10px] flex items-center justify-center font-bold">
                      {unread > 9 ? "9+" : unread}
                    </span>
                  )}
                </div>
              </button>
            );
          })}
        </div>
      </div>
      {!selectedConvId ? (
        <div className="flex flex-col items-center justify-center gap-4 text-[#9A9A9A]">
          <div className="p-5 rounded-full bg-[#2A2A2A]">
            <Icon icon="mdi:chat-processing-outline" width="48" height="48" className="text-[#FF4500]" />
          </div>
          <div className="text-center">
            <p className="font-black text-lg text-[#D7DADC]">Your Messages</p>
            <p className="text-sm text-[#9A9A9A] mt-1">Send a message to a follower to start chatting</p>
          </div>
          <button
            onClick={() => setShowNewMsg(true)}
            className="px-5 py-2 rounded-full bg-[#FF4500] text-white text-sm font-semibold hover:bg-[#CC3600] transition-colors"
          >
            Send Message
          </button>
        </div>
      ) : (
        <div className="flex flex-col overflow-hidden">
          <div className="relative flex items-center justify-between px-5 py-3.5 border-b border-[#3A3A3C] bg-[#111111]">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-full overflow-hidden bg-linear-to-br from-[#FF6534] to-[#CC3600] border-2 border-[#FF4500] flex items-center justify-center">
                {selectedConv?.otherUser?.userProfilePic ? (
                  <img
                    src={selectedConv.otherUser.userProfilePic}
                    alt=""
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <Icon icon="mdi:account" width="20" height="20" className="text-white" />
                )}
              </div>
              <div>
                <p className="font-bold text-[#D7DADC] text-sm">
                  {selectedConv?.otherUser?.username}
                </p>
                <p
                  className="text-xs text-[#FF4500] hover:underline cursor-pointer"
                  onClick={() => navigate(`/userProfile/${selectedConv?.otherUser?._id}`)}
                >
                  View profile
                </p>
              </div>
            </div>
            <div className="flex items-center gap-1">
              <button
                onClick={() => initiateCall(
                  selectedConv?.otherUser?._id,
                  "video",
                  { name: selectedConv?.otherUser?.name || selectedConv?.otherUser?.username, username: selectedConv?.otherUser?.username, avatar: selectedConv?.otherUser?.userProfilePic }
                )}
                disabled={callState !== "idle" || !selectedConv?.otherUser?._id}
                className="p-2 rounded-xl hover:bg-[#2A2A2A] transition-colors text-[#9A9A9A] hover:text-[#FF4500] disabled:opacity-40 disabled:cursor-not-allowed"
                title="Video call"
              >
                <Icon icon="mdi:video" width="20" height="20" />
              </button>
              <button
                onClick={() => initiateCall(
                  selectedConv?.otherUser?._id,
                  "audio",
                  { name: selectedConv?.otherUser?.name || selectedConv?.otherUser?.username, username: selectedConv?.otherUser?.username, avatar: selectedConv?.otherUser?.userProfilePic }
                )}
                disabled={callState !== "idle" || !selectedConv?.otherUser?._id}
                className="p-2 rounded-xl hover:bg-[#2A2A2A] transition-colors text-[#9A9A9A] hover:text-[#FF4500] disabled:opacity-40 disabled:cursor-not-allowed"
                title="Audio call"
              >
                <Icon icon="mdi:phone" width="20" height="20" />
              </button>
              <button
                onClick={() => setSelectedConvId(null)}
                className="p-2 rounded-xl hover:bg-[#2A2A2A] transition-colors text-[#9A9A9A]"
              >
                <Icon icon="charm:cross" width="20" height="20" />
              </button>
            </div>
            {callError && (
              <p className="absolute top-full right-0 mt-1 text-xs text-red-400 bg-[#1E1E1E] border border-[#3A3A3C] rounded-lg px-3 py-1.5 shadow-lg z-10">
                {callError === "NOT_ALLOWED" && "You must follow this user to call them"}
                {callError === "USER_OFFLINE" && "User is offline"}
                {callError === "USER_BUSY" && "User is busy"}
              </p>
            )}
          </div>
          <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-3">
            {msgsLoading && (
              <div className="flex justify-center py-10">
                <Icon icon="svg-spinners:ring-resize" width="24" height="24" className="text-[#FF4500]" />
              </div>
            )}
            {!msgsLoading && messages.length === 0 && (
              <div className="flex flex-col items-center gap-2 py-10 text-[#9A9A9A]">
                <Icon icon="mdi:chat-outline" width="32" height="32" />
                <p className="text-sm">No messages yet. Say hi!</p>
              </div>
            )}
            {messages.map((msg) => {
              const isMe = msg.sender?._id?.toString() === me?._id?.toString();
              return (
                <div
                  key={msg._id}
                  className={`flex items-end gap-2 ${isMe ? "justify-end" : "justify-start"}`}
                >
                  {!isMe && (
                    <div className="shrink-0 h-7 w-7 rounded-full overflow-hidden bg-linear-to-br from-[#FF6534] to-[#CC3600] flex items-center justify-center border border-[#3A3A3C]">
                      {msg.sender?.userProfilePic ? (
                        <img src={msg.sender.userProfilePic} alt="" className="w-full h-full object-cover" />
                      ) : (
                        <Icon icon="mdi:account" width="14" height="14" className="text-white" />
                      )}
                    </div>
                  )}
                  <div
                    className={`max-w-xs px-4 py-2.5 rounded-2xl shadow-sm ${
                      isMe
                        ? "bg-[#FF4500] rounded-br-sm text-white shadow-[0_2px_8px_rgba(255,69,0,0.25)]"
                        : "bg-[#2A2A2A] rounded-bl-sm text-[#D7DADC]"
                    }`}
                  >
                    <p className="text-sm leading-relaxed">{msg.text}</p>
                    <p className={`text-[10px] mt-1 ${isMe ? "text-white/60 text-right" : "text-[#9A9A9A]"}`}>
                      {formatTime(msg.createdAt)}
                    </p>
                  </div>
                </div>
              );
            })}
            <div ref={messagesEndRef} />
          </div>
          <div className="relative flex items-center gap-2 px-3 py-3 bg-[#111111] border-t border-[#3A3A3C]">
            {showPicker && (
              <div className="absolute bottom-16 right-4 z-50">
                <EmojiPicker
                  theme="light"
                  height={350}
                  onEmojiClick={(emojiData) =>
                    setMessage((prev) => prev + emojiData.emoji)
                  }
                />
              </div>
            )}
            <textarea
              rows={1}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Type a message..."
              className="flex-1 bg-[#2A2A2A] rounded-xl px-4 py-2.5 text-sm text-[#D7DADC] placeholder:text-[#9A9A9A] outline-none resize-none leading-relaxed"
            />
            <button
              onClick={() => setShowPicker((p) => !p)}
              className="text-[#FF4500] p-2 rounded-xl hover:bg-[#2A2A2A] transition-colors shrink-0"
            >
              <Icon icon="mdi:emoji" width="22" height="22" />
            </button>
            <button
              onClick={handleSend}
              disabled={!message.trim() || sending}
              className="bg-[#FF4500] text-white p-2.5 rounded-xl shadow-[0_2px_8px_rgba(255,69,0,0.3)] hover:shadow-[0_3px_12px_rgba(255,69,0,0.4)] transition-all shrink-0 disabled:opacity-50"
            >
              <Icon icon="material-symbols:send" width="20" height="20" />
            </button>
          </div>
        </div>
      )}
      {opening && (
        <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/20">
          <Icon icon="svg-spinners:ring-resize" width="36" height="36" className="text-[#FF4500]" />
        </div>
      )}

      {showNewMsg && (
        <NewMessageModal
          onClose={() => setShowNewMsg(false)}
          onSelect={handleSelectUser}
        />
      )}
    </main>
  );
};

export default Chat;
