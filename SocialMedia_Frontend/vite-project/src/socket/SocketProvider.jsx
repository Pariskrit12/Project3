import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { io } from "socket.io-client";
import { incrementUnread, incrementUnreadMessages } from "../slices/notificationSlice";
import { notificationApi } from "../services/notificationApi";
import { chatApi } from "../services/chatApi";
import { useCall } from "../context/CallContext";

export function SocketProvider({ children }) {
  const { isAuthenticated } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const { bindSocket } = useCall();

  useEffect(() => {
    if (!isAuthenticated) return;

    const socket = io({ withCredentials: true });

    socket.on("notification", () => {
      dispatch(incrementUnread());
      dispatch(notificationApi.util.invalidateTags(["Notification"]));
    });

    socket.on("new_message", ({ conversationId, message }) => {
      dispatch(
        chatApi.util.updateQueryData("getMessages", conversationId, (draft) => {
          if (draft?.data) draft.data.push(message);
        })
      );
      dispatch(chatApi.util.invalidateTags(["Conversation"]));
      if (!window.location.pathname.startsWith("/chat")) {
        dispatch(incrementUnreadMessages());
      }
    });

    const unbindCall = bindSocket(socket);

    return () => {
      unbindCall?.();
      socket.disconnect();
    };
  }, [isAuthenticated, dispatch, bindSocket]);

  return children;
}
