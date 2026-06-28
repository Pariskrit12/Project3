import { useEffect, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import { io } from "socket.io-client";
import { incrementUnread } from "../slices/notificationSlice";
import { notificationApi } from "../services/notificationApi";
import { chatApi } from "../services/chatApi";

export function useSocket() {
  const { isAuthenticated } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const socketRef = useRef(null);

  useEffect(() => {
    if (!isAuthenticated) return;
    if (socketRef.current?.connected) return;

    const socket = io({ withCredentials: true });
    socketRef.current = socket;

    socket.on("notification", () => {
      dispatch(incrementUnread());
      dispatch(notificationApi.util.invalidateTags(["Notification"]));
    });

    socket.on("new_message", ({ conversationId, message }) => {      dispatch(
        chatApi.util.updateQueryData("getMessages", conversationId, (draft) => {
          if (draft?.data) draft.data.push(message);
        })
      );      dispatch(chatApi.util.invalidateTags(["Conversation"]));
    });

    return () => {
      socket.disconnect();
      socketRef.current = null;
    };
  }, [isAuthenticated, dispatch]);
}
