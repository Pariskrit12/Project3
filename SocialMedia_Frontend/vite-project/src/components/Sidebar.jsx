import { Icon } from "@iconify/react";
import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import NavigationLink from "./common/NavigationLink";
import { useSelector, useDispatch } from "react-redux";
import { clearUser } from "../slices/authSlice";
import { usersApi, useLogoutUserMutation } from "../services/userApi";
import { useGetMyCommunitiesQuery } from "../services/communitiesApi";

const Sidebar = () => {
  const sideBarLinks = [
    { icon: "boxicons:home-filled", label: "Home", path: "/" },
    { icon: "mingcute:trending-up-fill", label: "Trending", path: "/trending" },
    { icon: "fluent:new-16-filled", label: "New", path: "/new" },
    { icon: "fluent:align-top-24-filled", label: "Top", path: "/top" },
    { icon: "lets-icons:setting-fill", label: "Settings", path: "/settings" },
  ];
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const [logoutUser] = useLogoutUserMutation();
  const [openDropdown, setOpenDropdown] = useState(false);
  const { isAuthenticated } = useSelector((state) => state.auth);
  const { data: communitiesData, isLoading: communitiesLoading } =
    useGetMyCommunitiesQuery(undefined, { skip: !isAuthenticated });
  const joinedCommunities = communitiesData?.data ?? [];

  const handleLogout = async () => {
    try {
      await logoutUser().unwrap();
    } catch (_) {}
    dispatch(clearUser());
    dispatch(usersApi.util.resetApiState());
    navigate("/login");
  };
  return (
    <aside className="bg-[#DAE0E6] flex flex-col px-3 py-6 w-full gap-0.5 h-screen border-r border-[#EDEFF1] shadow-[1px_0_12px_rgba(255,69,0,0.05)]">
      <p className="text-[9px] font-extrabold text-[#878A8C] uppercase tracking-[0.2em] px-3 mb-2">
        Menu
      </p>
      {sideBarLinks.map((elem, index) => (
        <NavigationLink
          key={index}
          label={elem.label}
          icon={elem.icon}
          isActive={location.pathname === elem.path}
          path={elem.path}
        />
      ))}
      {isAuthenticated ? (
        <NavigationLink
          label="Logout"
          icon="material-symbols:logout"
          onClick={handleLogout}
          isActive={false}
          path="#"
        />
      ) : (
        <NavigationLink
          label="Login"
          icon="material-symbols:login"
          isActive={location.pathname === "/login"}
          path="/login"
        />
      )}

      {isAuthenticated && (
        <button
          onClick={() => navigate("/create-post")}
          className="mx-2 mt-3 flex items-center justify-center gap-2 py-2.5 rounded-xl bg-[#FF4500] text-white font-semibold text-sm shadow-[0_3px_12px_rgba(255,69,0,0.35)] hover:shadow-[0_5px_18px_rgba(255,69,0,0.5)] hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200"
        >
          <Icon icon="mingcute:add-fill" width="16" height="16" />
          Create Post
        </button>
      )}

      <div className="mx-3 my-4 h-px bg-linear-to-r from-transparent via-[#EDEFF1] to-transparent"></div>

      <p className="text-[9px] font-extrabold text-[#878A8C] uppercase tracking-[0.2em] px-3 mb-1">
        Communities
      </p>

      {isAuthenticated && (
        <button
          onClick={() => navigate("/create-community")}
          className="mx-2 mb-1 flex items-center justify-center gap-2 py-2 rounded-xl bg-[#E5E6EA] text-[#FF4500] font-semibold text-sm hover:bg-[#E5E6EA] hover:shadow-[0_2px_8px_rgba(255,69,0,0.15)] transition-all duration-200 border border-[#EDEFF1]"
        >
          <Icon icon="mingcute:add-fill" width="15" height="15" />
          Create Community
        </button>
      )}
      <div
        onClick={() => setOpenDropdown((prev) => !prev)}
        className="flex items-center px-3 justify-between cursor-pointer py-2.5 rounded-xl hover:bg-[#E5E6EA] transition-all duration-200 group"
      >
        <div className="flex items-center gap-3">
          <div className="bg-linear-to-br from-[#FF4500] to-[#CC3600] p-1.5 rounded-lg">
            <Icon icon="mdi:account-group" width="16" height="16" className="text-white" />
          </div>
          <p className="text-sm font-semibold text-[#1C1C1C]">Browse All</p>
        </div>
        <Icon
          className={`text-[#FF4500] transition-transform duration-300 ${openDropdown ? "rotate-180" : ""}`}
          icon="ep:arrow-down-bold"
          width="13"
          height="13"
        />
      </div>

      {openDropdown && (
        <div className="px-1 flex flex-col gap-0.5 mt-0.5">
          {communitiesLoading ? (
            <div className="flex justify-center py-3">
              <Icon icon="svg-spinners:ring-resize" width="18" height="18" className="text-[#FF4500]" />
            </div>
          ) : joinedCommunities.length === 0 ? (
            <p className="text-xs text-[#878A8C] text-center py-3 px-3">
              You haven't joined any communities yet
            </p>
          ) : (
            joinedCommunities.map((community) => (
              <div
                key={community._id}
                onClick={() => navigate(`/communities/${community._id}`)}
                className="flex items-center gap-3 cursor-pointer px-3 py-2 rounded-xl hover:bg-[#E5E6EA] transition-all duration-200"
              >
                <div className="shrink-0 h-7 w-7 rounded-full overflow-hidden bg-linear-to-br from-[#FF6534] to-[#CC3600] flex items-center justify-center border border-[#EDEFF1]">
                  {community.communityProfilePicture ? (
                    <img
                      src={community.communityProfilePicture}
                      alt={community.communityName}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <Icon icon="mdi:account-group" width="13" height="13" className="text-white" />
                  )}
                </div>
                <p className="text-sm font-medium text-[#1C1C1C] truncate">
                  {community.communityName}
                </p>
              </div>
            ))
          )}
        </div>
      )}
    </aside>
  );
};

export default Sidebar;
