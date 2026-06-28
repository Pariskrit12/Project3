import React, { useState } from "react";
import { Icon } from "@iconify/react";
import { useGetAllUsersQuery } from "../../services/userApi";

const statusColor = {
  active: "bg-emerald-100 text-emerald-700",
  deactivated: "bg-yellow-100 text-yellow-700",
  banned: "bg-red-100 text-red-600",
};

const roleColor = {
  admin: "bg-[#FF4500]/10 text-[#FF4500]",
  user: "bg-[#3A3A3C] text-[#9A9A9A]",
};

const AdminUsers = () => {
  const { data, isLoading, isError } = useGetAllUsersQuery();
  const [search, setSearch] = useState("");
  const [filterRole, setFilterRole] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");

  const users = data?.data ?? [];

  const filtered = users.filter((u) => {
    const matchSearch =
      u.name?.toLowerCase().includes(search.toLowerCase()) ||
      u.username?.toLowerCase().includes(search.toLowerCase()) ||
      u.email?.toLowerCase().includes(search.toLowerCase());
    const matchRole = filterRole === "all" || u.role === filterRole;
    const matchStatus = filterStatus === "all" || u.accountStatus === filterStatus;
    return matchSearch && matchRole && matchStatus;
  });

  return (
    <div className="p-6 flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black text-[#D7DADC]">Users</h1>
          <p className="text-sm text-[#9A9A9A] mt-0.5">
            {users.length} registered users
          </p>
        </div>
        <div className="flex items-center gap-1.5 bg-[#FF4500]/10 text-[#FF4500] px-3 py-1.5 rounded-full text-xs font-bold">
          <Icon icon="mdi:account-group" width="14" height="14" />
          Total: {users.length}
        </div>
      </div>
      <div className="flex flex-wrap gap-3">
        <div className="flex items-center gap-2 bg-[#1E1E1E] border border-[#3A3A3C] rounded-xl px-3 py-2 flex-1 min-w-48">
          <Icon icon="mdi:magnify" width="16" height="16" className="text-[#9A9A9A]" />
          <input
            type="text"
            placeholder="Search name, username, email…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="flex-1 text-sm outline-none bg-transparent text-[#D7DADC] placeholder:text-[#9A9A9A]"
          />
          {search && (
            <button onClick={() => setSearch("")} className="text-[#9A9A9A] hover:text-[#D7DADC]">
              <Icon icon="mdi:close-circle" width="15" height="15" />
            </button>
          )}
        </div>
        <select
          value={filterRole}
          onChange={(e) => setFilterRole(e.target.value)}
          className="bg-[#1E1E1E] border border-[#3A3A3C] rounded-xl px-3 py-2 text-sm text-[#D7DADC] outline-none cursor-pointer"
        >
          <option value="all">All Roles</option>
          <option value="admin">Admin</option>
          <option value="user">User</option>
        </select>
        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          className="bg-[#1E1E1E] border border-[#3A3A3C] rounded-xl px-3 py-2 text-sm text-[#D7DADC] outline-none cursor-pointer"
        >
          <option value="all">All Status</option>
          <option value="active">Active</option>
          <option value="deactivated">Deactivated</option>
          <option value="banned">Banned</option>
        </select>
      </div>
      <div className="bg-[#1E1E1E] rounded-2xl border border-[#3A3A3C] overflow-hidden shadow-sm">
        {isLoading ? (
          <div className="flex justify-center items-center py-20">
            <Icon icon="svg-spinners:ring-resize" width="32" height="32" className="text-[#FF4500]" />
          </div>
        ) : isError ? (
          <div className="flex flex-col items-center gap-2 py-20 text-[#9A9A9A]">
            <Icon icon="mdi:alert-circle-outline" width="32" height="32" />
            <p className="text-sm font-medium">Failed to load users</p>
          </div>
        ) : filtered.length === 0 ? (
          <div className="flex flex-col items-center gap-2 py-20 text-[#9A9A9A]">
            <Icon icon="mdi:account-search-outline" width="32" height="32" />
            <p className="text-sm font-medium">No users match your filters</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-[#3A3A3C] bg-[#111111]/40">
                  <th className="text-left px-4 py-3 text-xs font-extrabold text-[#9A9A9A] uppercase tracking-wider">#</th>
                  <th className="text-left px-4 py-3 text-xs font-extrabold text-[#9A9A9A] uppercase tracking-wider">User</th>
                  <th className="text-left px-4 py-3 text-xs font-extrabold text-[#9A9A9A] uppercase tracking-wider">Email</th>
                  <th className="text-left px-4 py-3 text-xs font-extrabold text-[#9A9A9A] uppercase tracking-wider">Gender</th>
                  <th className="text-left px-4 py-3 text-xs font-extrabold text-[#9A9A9A] uppercase tracking-wider">Role</th>
                  <th className="text-left px-4 py-3 text-xs font-extrabold text-[#9A9A9A] uppercase tracking-wider">Status</th>
                  <th className="text-left px-4 py-3 text-xs font-extrabold text-[#9A9A9A] uppercase tracking-wider">Followers</th>
                  <th className="text-left px-4 py-3 text-xs font-extrabold text-[#9A9A9A] uppercase tracking-wider">Following</th>
                  <th className="text-left px-4 py-3 text-xs font-extrabold text-[#9A9A9A] uppercase tracking-wider">Joined</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((u, i) => (
                  <tr
                    key={u._id}
                    className="border-b border-[#3A3A3C] last:border-0 hover:bg-[#111111]/20 transition-colors"
                  >
                    <td className="px-4 py-3 text-[#9A9A9A] font-medium">{i + 1}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2.5">
                        <div className="shrink-0 h-9 w-9 rounded-full overflow-hidden bg-[#3A3A3C] border border-[#111111]">
                          {u.userProfilePic ? (
                            <img src={u.userProfilePic} alt={u.name} className="w-full h-full object-cover" />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center bg-[#FF4500]">
                              <Icon icon="mdi:account" width="18" height="18" className="text-white" />
                            </div>
                          )}
                        </div>
                        <div>
                          <p className="font-bold text-[#D7DADC] leading-tight">{u.name}</p>
                          <p className="text-xs text-[#9A9A9A]">@{u.username}</p>
                        </div>
                      </div>
                    </td>

                    <td className="px-4 py-3 text-[#D7DADC]">{u.email}</td>
                    <td className="px-4 py-3 text-[#9A9A9A] capitalize">{u.gender}</td>
                    <td className="px-4 py-3">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-bold capitalize ${roleColor[u.role] ?? roleColor.user}`}>
                        {u.role}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-bold capitalize ${statusColor[u.accountStatus] ?? statusColor.active}`}>
                        {u.accountStatus}
                      </span>
                    </td>

                    <td className="px-4 py-3 font-semibold text-[#D7DADC]">{u.followers?.length ?? 0}</td>
                    <td className="px-4 py-3 font-semibold text-[#D7DADC]">{u.following?.length ?? 0}</td>
                    <td className="px-4 py-3 text-[#9A9A9A] text-xs whitespace-nowrap">
                      {new Date(u.createdAt).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                      })}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
      {!isLoading && !isError && filtered.length > 0 && (
        <p className="text-xs text-[#9A9A9A] text-center">
          Showing {filtered.length} of {users.length} users
        </p>
      )}
    </div>
  );
};

export default AdminUsers;
