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

// ── New Message modal ───────────────────────────────────────────────────────
const NewMessageModal = ({ onClose, onSelect }) => {
  const [search, setSearch] = useState("");
  const { data: followersData } = useGetFollowersQuery();
  const { data: followingData } = useGetFollowingQuery();

  const followers = followersData?.data ?? [];
  const following = followingData?.data ?? [];

  // Union: de-dup by _id
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
        className="bg-[#FFF5F6] border border-[#FECDD3] rounded-2xl w-full max-w-sm mx-4 shadow-[0_8px_40px_rgba(225,29,72,0.18)] overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-5 py-4 border-b border-[#FECDD3]">
          <h2 className="font-black text-[#1C0714]">New Message</h2>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-[#FFE4E6] transition-colors text-[#E11D48]"
          >
            <Icon icon="mdi:close" width="18" height="18" />
          </button>
        </div>
        <div className="px-4 py-3 border-b border-[#FECDD3]">
          <input
            autoFocus
            className="w-full bg-[#FFE4E6] rounded-xl px-3 py-2 text-sm outline-none text-[#1C0714] placeholder:text-[#FDA4AF]"
            placeholder="Search followers..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div className="overflow-y-auto max-h-72">
          {filtered.length === 0 ? (
            <div className="flex flex-col items-center gap-2 py-10 text-[#FDA4AF]">
              <Icon icon="mdi:account-group-outline" width="32" height="32" />
              <p className="text-sm">No followers yet</p>
            </div>
          ) : (
            filtered.map((u) => (
              <button
                key={u._id}
                onClick={() => onSelect(u._id)}
                className="flex items-center gap-3 w-full px-5 py-3 hover:bg-[#FFE4E6] transition-colors text-left"
              >
                <div className="shrink-0 h-10 w-10 rounded-full overflow-hidden bg-linear-to-br from-[#FB7185] to-[#BE123C] border-2 border-[#FECDD3] flex items-center justify-center">
                  {u.userProfilePic ? (
                    <img src={u.userProfilePic} alt={u.username} className="w-full h-full object-cover" />
                  ) : (
                    <Icon icon="mdi:account" width="20" height="20" className="text-white" />
                  )}
                </div>
                <div className="min-w-0">
                  <p className="font-bold text-sm text-[#1C0714] truncate">{u.username}</p>
                </div>
              </button>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

// ── Main Chat page ───────────────────────────────────────────────────────────
const Chat = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { user: me } = useSelector((state) => state.auth);

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

  // Handle ?userId= param (navigating from a profile page)
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

  // Auto-scroll to bottom when messages update
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Mark as read when opening a conversation
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
    <main className="grid grid-cols-[300px_1fr] gap-0 h-[calc(100vh-80px)] overflow-hidden rounded-2xl border border-[#FECDD3] shadow-[0_4px_24px_rgba(225,29,72,0.1)] bg-[#FFF5F6]">

      {/* ── Left panel: conversation list ── */}
      <div className="flex flex-col border-r border-[#FECDD3] overflow-hidden">
        <div className="p-4 border-b border-[#FECDD3]">
          <div className="flex items-center justify-between mb-3">
            <h1 className="text-xl font-black text-[#1C0714]">Messages</h1>
            <button
              onClick={() => setShowNewMsg(true)}
              className="p-2 rounded-xl bg-[#E11D48] text-white hover:bg-[#BE123C] transition-colors"
              title="New message"
            >
              <Icon icon="mdi:pencil-plus-outline" width="18" height="18" />
            </button>
          </div>
          <div className="flex items-center gap-2 bg-[#FFE4E6] rounded-xl px-3 py-2">
            <Icon icon="material-symbols:search" width="16" height="16" className="text-[#FDA4AF]" />
            <input
              className="flex-1 bg-transparent text-sm outline-none text-[#1C0714] placeholder:text-[#FDA4AF]"
              placeholder="Search..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto">
          {convsLoading && (
            <div className="flex justify-center py-10">
              <Icon icon="svg-spinners:ring-resize" width="24" height="24" className="text-[#E11D48]" />
            </div>
          )}
          {!convsLoading && filteredConvs.length === 0 && (
            <div className="flex flex-col items-center gap-2 py-12 text-[#FDA4AF]">
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
                  isActive ? "bg-[#FFE4E6]" : "hover:bg-[#FFF1F2]"
                }`}
              >
                <div className="relative shrink-0">
                  <div className="h-11 w-11 rounded-full overflow-hidden bg-linear-to-br from-[#FB7185] to-[#BE123C] border-2 border-[#FECDD3] flex items-center justify-center">
                    {other?.userProfilePic ? (
                      <img src={other.userProfilePic} alt={other.username} className="w-full h-full object-cover" />
                    ) : (
                      <Icon icon="mdi:account" width="22" height="22" className="text-white" />
                    )}
                  </div>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-bold text-sm text-[#1C0714] truncate">{other?.username}</p>
                  <p className="text-xs text-[#BE7090] truncate">{conv.lastMessage || "Say hi!"}</p>
                </div>
                <div className="flex flex-col items-end gap-1 shrink-0">
                  {conv.lastMessageAt && (
                    <span className="text-[10px] text-[#FDA4AF]">
                      {formatTime(conv.lastMessageAt)}
                    </span>
                  )}
                  {unread > 0 && (
                    <span className="w-5 h-5 bg-[#E11D48] rounded-full text-white text-[10px] flex items-center justify-center font-bold">
                      {unread > 9 ? "9+" : unread}
                    </span>
                  )}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* ── Right panel: message thread ── */}
      {!selectedConvId ? (
        <div className="flex flex-col items-center justify-center gap-4 text-[#FDA4AF]">
          <div className="p-5 rounded-full bg-[#FFE4E6]">
            <Icon icon="mdi:chat-processing-outline" width="48" height="48" className="text-[#E11D48]" />
          </div>
          <div className="text-center">
            <p className="font-black text-lg text-[#1C0714]">Your Messages</p>
            <p className="text-sm text-[#BE7090] mt-1">Send a message to a follower to start chatting</p>
          </div>
          <button
            onClick={() => setShowNewMsg(true)}
            className="px-5 py-2 rounded-full bg-[#E11D48] text-white text-sm font-semibold hover:bg-[#BE123C] transition-colors"
          >
            Send Message
          </button>
        </div>
      ) : (
        <div className="flex flex-col overflow-hidden">
          {/* Header */}
          <div className="flex items-center justify-between px-5 py-3.5 border-b border-[#FECDD3] bg-[#FFF1F2]">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-full overflow-hidden bg-linear-to-br from-[#FB7185] to-[#BE123C] border-2 border-[#E11D48] flex items-center justify-center">
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
                <p className="font-bold text-[#1C0714] text-sm">
                  {selectedConv?.otherUser?.username}
                </p>
                <p
                  className="text-xs text-[#E11D48] hover:underline cursor-pointer"
                  onClick={() => navigate(`/userProfile/${selectedConv?.otherUser?._id}`)}
                >
                  View profile
                </p>
              </div>
            </div>
            <button
              onClick={() => setSelectedConvId(null)}
              className="p-2 rounded-xl hover:bg-[#FFE4E6] transition-colors text-[#FDA4AF]"
            >
              <Icon icon="charm:cross" width="20" height="20" />
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-3">
            {msgsLoading && (
              <div className="flex justify-center py-10">
                <Icon icon="svg-spinners:ring-resize" width="24" height="24" className="text-[#E11D48]" />
              </div>
            )}
            {!msgsLoading && messages.length === 0 && (
              <div className="flex flex-col items-center gap-2 py-10 text-[#FDA4AF]">
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
                    <div className="shrink-0 h-7 w-7 rounded-full overflow-hidden bg-linear-to-br from-[#FB7185] to-[#BE123C] flex items-center justify-center border border-[#FECDD3]">
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
                        ? "bg-linear-to-br from-[#E11D48] to-[#FB7185] rounded-br-sm text-white shadow-[0_2px_8px_rgba(225,29,72,0.25)]"
                        : "bg-[#FFE4E6] rounded-bl-sm text-[#1C0714]"
                    }`}
                  >
                    <p className="text-sm leading-relaxed">{msg.text}</p>
                    <p className={`text-[10px] mt-1 ${isMe ? "text-white/60 text-right" : "text-[#FDA4AF]"}`}>
                      {formatTime(msg.createdAt)}
                    </p>
                  </div>
                </div>
              );
            })}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="relative flex items-center gap-2 px-3 py-3 bg-[#FFF1F2] border-t border-[#FECDD3]">
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
              className="flex-1 bg-[#FFE4E6] rounded-xl px-4 py-2.5 text-sm text-[#1C0714] placeholder:text-[#FDA4AF] outline-none resize-none leading-relaxed"
            />
            <button
              onClick={() => setShowPicker((p) => !p)}
              className="text-[#E11D48] p-2 rounded-xl hover:bg-[#FFE4E6] transition-colors shrink-0"
            >
              <Icon icon="mdi:emoji" width="22" height="22" />
            </button>
            <button
              onClick={handleSend}
              disabled={!message.trim() || sending}
              className="bg-linear-to-br from-[#E11D48] to-[#FB7185] text-white p-2.5 rounded-xl shadow-[0_2px_8px_rgba(225,29,72,0.3)] hover:shadow-[0_3px_12px_rgba(225,29,72,0.4)] transition-all shrink-0 disabled:opacity-50"
            >
              <Icon icon="material-symbols:send" width="20" height="20" />
            </button>
          </div>
        </div>
      )}

      {/* Opening indicator */}
      {opening && (
        <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/20">
          <Icon icon="svg-spinners:ring-resize" width="36" height="36" className="text-[#E11D48]" />
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
