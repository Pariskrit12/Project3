import React from "react";
import { Icon } from "@iconify/react";
import NotificationCard from "../components/Notifications/NotificationCard";

const Notification = () => {
  return (
    <main className="grid grid-cols-1 gap-5 max-w-2xl">
      <section className="flex justify-between items-center">
        <div>
          <h1 className="font-black text-2xl text-[#1C0F08]">Notifications</h1>
          <p className="text-sm text-[#9C7E6D] mt-0.5">Stay up to date</p>
        </div>
        <div className="flex gap-2 items-center">
          <button className="text-sm text-[#AF503A] font-semibold px-3 py-1.5 rounded-full hover:bg-[#FAEBD8] transition-colors">
            Mark all read
          </button>
          <button className="p-2 rounded-xl hover:bg-[#FAEBD8] transition-colors text-[#AF503A]">
            <Icon icon="material-symbols:settings-rounded" width="20" height="20" />
          </button>
        </div>
      </section>

      <div className="flex items-center gap-2">
        <span className="bg-linear-to-r from-[#AF503A] to-[#C7604A] text-white text-xs font-bold px-2.5 py-0.5 rounded-full">
          3 new
        </span>
        <span className="text-xs text-[#C9A88A]">Today</span>
      </div>

      <section className="grid grid-cols-1 gap-3">
        <NotificationCard />
        <NotificationCard />
        <NotificationCard />
      </section>
    </main>
  );
};

export default Notification;
