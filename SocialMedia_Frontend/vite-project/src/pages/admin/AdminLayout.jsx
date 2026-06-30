import React, { useState } from "react";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { Icon } from "@iconify/react";
import { useSelector } from "react-redux";

const sidebarLinks = [
  { label: "Users", icon: "mdi:account-group", path: "/admin/users" },
  { label: "Post Reports", icon: "mdi:file-document-alert-outline", path: "/admin/post-reports" },
  { label: "Comment Reports", icon: "mdi:flag-outline", path: "/admin/reports" },
];

const AdminLayout = () => {
  const navigate = useNavigate();
  const [collapsed, setCollapsed] = useState(false);
  const { user } = useSelector((state) => state.auth);

  return (
    <div className="flex min-h-screen bg-[#111111]">
      <aside
        className={`flex flex-col bg-[#1C1C1C] text-white transition-all duration-300 ${
          collapsed ? "w-16" : "w-60"
        } min-h-screen shrink-0`}
      >
        <div className="flex items-center justify-between px-4 py-4 border-b border-white/10">
          {!collapsed && (
            <div>
              <h1 className="font-black text-base tracking-tight">
                <span className="text-white">Social</span>
                <span className="text-[#FF4500]">Sphere</span>
              </h1>
              <p className="text-[10px] text-white/40 font-semibold uppercase tracking-widest mt-0.5">
                Admin Panel
              </p>
            </div>
          )}
          <button
            onClick={() => setCollapsed((p) => !p)}
            className="p-1.5 rounded-lg hover:bg-white/10 transition-colors text-white/60 hover:text-white shrink-0"
          >
            <Icon
              icon={collapsed ? "mdi:chevron-right" : "mdi:chevron-left"}
              width="18"
              height="18"
            />
          </button>
        </div>
        <nav className="flex flex-col gap-1 px-2 py-4 flex-1">
          {sidebarLinks.map((link) => (
            <NavLink
              key={link.path}
              to={link.path}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 font-medium text-sm ${
                  isActive
                    ? "bg-[#FF4500] text-white"
                    : "text-white/60 hover:bg-white/10 hover:text-white"
                }`
              }
            >
              <Icon icon={link.icon} width="18" height="18" className="shrink-0" />
              {!collapsed && <span>{link.label}</span>}
            </NavLink>
          ))}
        </nav>
        <div className="px-2 py-4 border-t border-white/10 flex flex-col gap-2">
          <button
            onClick={() => navigate("/")}
            className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-white/60 hover:bg-white/10 hover:text-white transition-all duration-200 text-sm font-medium"
          >
            <Icon icon="mdi:arrow-left" width="18" height="18" className="shrink-0" />
            {!collapsed && <span>Back to Site</span>}
          </button>
          {!collapsed && (
            <div className="flex items-center gap-2.5 px-3 py-2">
              <img
                src={user?.userProfilePic || `https://ui-avatars.com/api/?name=${user?.name}&background=FF4500&color=fff`}
                alt="admin"
                className="h-7 w-7 rounded-full object-cover border border-white/20"
              />
              <div className="min-w-0">
                <p className="text-xs font-semibold text-white truncate">{user?.name}</p>
                <p className="text-[10px] text-[#FF4500] font-bold uppercase">Admin</p>
              </div>
            </div>
          )}
        </div>
      </aside>
      <main className="flex-1 overflow-y-auto">
        <Outlet />
      </main>
    </div>
  );
};

export default AdminLayout;
