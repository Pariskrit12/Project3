import React, { useEffect } from "react";
import { Icon } from "@iconify/react";
import { useDispatch } from "react-redux";
import NotificationCard from "../components/Notifications/NotificationCard";
import { useGetNotificationsQuery, useMarkAllReadMutation } from "../services/notificationApi";
import { resetUnread } from "../slices/notificationSlice";

const Notification = () => {
  const dispatch = useDispatch();
  const { data, isLoading } = useGetNotificationsQuery();
  const [markAllRead, { isLoading: marking }] = useMarkAllReadMutation();

  const notifications = data?.data ?? [];
  const unread = notifications.filter((n) => !n.isRead).length;

  useEffect(() => {
    dispatch(resetUnread());
  }, [dispatch]);

  const handleMarkAllRead = async () => {
    await markAllRead();
    dispatch(resetUnread());
  };

  return (
    <main className="grid grid-cols-1 gap-5 max-w-2xl">
      <section className="flex justify-between items-center">
        <div>
          <h1 className="font-black text-2xl text-[#1C1C1C]">Notifications</h1>
          <p className="text-sm text-[#878A8C] mt-0.5">Stay up to date</p>
        </div>
        <div className="flex gap-2 items-center">
          <button
            onClick={handleMarkAllRead}
            disabled={marking || unread === 0}
            className="text-sm text-[#FF4500] font-semibold px-3 py-1.5 rounded-full hover:bg-[#E5E6EA] transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
          >
            Mark all read
          </button>
          <button className="p-2 rounded-xl hover:bg-[#E5E6EA] transition-colors text-[#FF4500]">
            <Icon icon="material-symbols:settings-rounded" width="20" height="20" />
          </button>
        </div>
      </section>

      {unread > 0 && (
        <div className="flex items-center gap-2">
          <span className="bg-[#FF4500] text-white text-xs font-bold px-2.5 py-0.5 rounded-full">
            {unread} new
          </span>
          <span className="text-xs text-[#878A8C]">Today</span>
        </div>
      )}

      {isLoading && (
        <div className="flex justify-center py-10">
          <Icon icon="svg-spinners:ring-resize" width="30" height="30" className="text-[#FF4500]" />
        </div>
      )}

      {!isLoading && notifications.length === 0 && (
        <div className="flex flex-col items-center gap-2 py-16 text-[#878A8C]">
          <Icon icon="clarity:notification-solid" width="40" height="40" />
          <p className="text-sm font-semibold text-[#A83200]">No notifications yet</p>
          <p className="text-xs text-[#878A8C]">You're all caught up!</p>
        </div>
      )}

      <section className="grid grid-cols-1 gap-3">
        {notifications.map((notification) => (
          <NotificationCard key={notification._id} notification={notification} />
        ))}
      </section>
    </main>
  );
};

export default Notification;
