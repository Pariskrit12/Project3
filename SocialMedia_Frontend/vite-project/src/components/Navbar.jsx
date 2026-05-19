import { Icon } from "@iconify/react";
import React, { useState, useEffect, useRef } from "react";
import IconLink from "./common/IconLink";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import Sidebar from "./Sidebar";
import { useSearchAllQuery } from "../services/postApi";

const DUMMY_AVATAR = "https://ui-avatars.com/api/?name=Guest&background=FECDD3&color=E11D48";

function useDebounce(value, delay = 300) {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const t = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(t);
  }, [value, delay]);
  return debounced;
}

const Navbar = () => {
  const navbarLink = [
    { icon: "clarity:notification-solid", pageLink: "/notification" },
    { icon: "mdi:chat", pageLink: "/chat" },
  ];

  const [toggleSidebar, setToggleSidebar] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);
  const searchRef = useRef(null);
  const navigate = useNavigate();
  const { user, isAuthenticated } = useSelector((state) => state.auth);
  const unreadCount = useSelector((state) => state.notifications.unreadCount);
  const profilePic = isAuthenticated && user?.userProfilePic ? user.userProfilePic : DUMMY_AVATAR;

  const debouncedQuery = useDebounce(searchQuery, 300);
  const shouldFetch = debouncedQuery.trim().length >= 2;

  const { data, isFetching } = useSearchAllQuery(debouncedQuery.trim(), {
    skip: !shouldFetch,
  });

  const suggestedCommunities = data?.data?.communities?.slice(0, 3) ?? [];
  const suggestedPosts = data?.data?.posts?.slice(0, 4) ?? [];
  const hasResults = suggestedCommunities.length > 0 || suggestedPosts.length > 0;

  // Close dropdown when clicking outside
  useEffect(() => {
    const handler = (e) => {
      if (searchRef.current && !searchRef.current.contains(e.target)) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    const q = searchQuery.trim();
    if (q) {
      setShowSuggestions(false);
      navigate(`/search?q=${encodeURIComponent(q)}`);
    }
  };

  const goToResult = (path) => {
    setShowSuggestions(false);
    setSearchQuery("");
    navigate(path);
  };

  return (
    <>
      <nav className="sticky top-0 z-50 flex px-5 py-3 gap-4 justify-between bg-[#FFF1F2]/85 backdrop-blur-md border-b border-[#FECDD3] items-center shadow-[0_2px_16px_rgba(225,29,72,0.08)]">
        {/* Left: hamburger + logo */}
        <div className="flex items-center gap-2 shrink-0">
          <div
            onClick={() => setToggleSidebar((prev) => !prev)}
            className="text-[#E11D48] lg:hidden p-2 rounded-xl hover:bg-[#FFE4E6] cursor-pointer transition-colors duration-200"
          >
            <Icon icon="fontisto:nav-icon-a" width="20" height="20" />
          </div>
          <div
            onClick={() => navigate("/")}
            className="flex flex-col items-center cursor-pointer select-none"
          >
            <h1 className="font-black font-serif text-xl tracking-tight">
              <span className="text-[#1C0714]">Social</span>
              <span className="text-[#E11D48]">Sphere</span>
            </h1>
            <div className="flex items-center gap-1.5 mt-0.5">
              <div className="h-px w-6 bg-linear-to-r from-transparent to-[#E11D48]/40"></div>
              <p className="text-[9px] text-[#E11D48] font-bold tracking-[0.2em] uppercase">
                Community
              </p>
              <div className="h-px w-6 bg-linear-to-l from-transparent to-[#E11D48]/40"></div>
            </div>
          </div>
        </div>

        {/* Center: search bar + suggestions */}
        <form
          ref={searchRef}
          onSubmit={handleSearch}
          className="flex-1 max-w-md hidden sm:flex relative"
        >
          <div className="relative w-full">
            {/* Search icon / spinner */}
            <div className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none">
              {isFetching && shouldFetch ? (
                <Icon icon="svg-spinners:ring-resize" width="16" height="16" className="text-[#E11D48]" />
              ) : (
                <Icon icon="mdi:magnify" width="18" height="18" className="text-[#FDA4AF]" />
              )}
            </div>

            <input
              type="text"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setShowSuggestions(true);
              }}
              onFocus={() => {
                if (searchQuery.trim().length >= 2) setShowSuggestions(true);
              }}
              placeholder="Search posts and communities…"
              className="w-full pl-9 pr-10 py-2 rounded-full bg-[#FFE4E6] border border-[#FECDD3] text-sm text-[#1C0714] placeholder-[#FDA4AF] focus:outline-none focus:border-[#E11D48] focus:bg-[#FFF5F6] focus:ring-2 focus:ring-[#E11D48]/20 transition-all duration-200"
            />

            {searchQuery && (
              <button
                type="button"
                onClick={() => {
                  setSearchQuery("");
                  setShowSuggestions(false);
                }}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[#FDA4AF] hover:text-[#E11D48] transition-colors"
              >
                <Icon icon="mdi:close-circle" width="17" height="17" />
              </button>
            )}

            {/* Suggestions dropdown */}
            {showSuggestions && shouldFetch && (
              <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-[#FECDD3] rounded-2xl shadow-[0_8px_32px_rgba(225,29,72,0.15)] overflow-hidden z-50">

                {/* Loading skeleton */}
                {isFetching && !hasResults && (
                  <div className="flex items-center justify-center gap-2 py-5 text-[#FDA4AF]">
                    <Icon icon="svg-spinners:ring-resize" width="18" height="18" className="text-[#E11D48]" />
                    <span className="text-xs font-medium">Searching…</span>
                  </div>
                )}

                {/* No results */}
                {!isFetching && !hasResults && (
                  <div className="flex flex-col items-center gap-1.5 py-5 text-[#FDA4AF]">
                    <Icon icon="mdi:magnify-close" width="22" height="22" />
                    <p className="text-xs font-medium">No results for "{debouncedQuery}"</p>
                  </div>
                )}

                {hasResults && (
                  <>
                    {/* Communities */}
                    {suggestedCommunities.length > 0 && (
                      <div>
                        <p className="px-3 pt-3 pb-1 text-[10px] font-extrabold text-[#FDA4AF] uppercase tracking-widest">
                          Communities
                        </p>
                        {suggestedCommunities.map((c) => (
                          <button
                            key={c._id}
                            type="button"
                            onClick={() => goToResult(`/communities/${c._id}`)}
                            className="flex items-center gap-2.5 w-full px-3 py-2 hover:bg-[#FFF1F2] transition-colors text-left"
                          >
                            <div className="shrink-0 h-8 w-8 rounded-full overflow-hidden bg-[#FFE4E6] border border-[#FECDD3]">
                              {c.communityProfilePicture ? (
                                <img src={c.communityProfilePicture} alt="" className="w-full h-full object-cover" />
                              ) : (
                                <div className="w-full h-full flex items-center justify-center bg-[#E11D48]">
                                  <Icon icon="mdi:account-group" width="14" height="14" className="text-white" />
                                </div>
                              )}
                            </div>
                            <div className="min-w-0">
                              <p className="text-sm font-semibold text-[#1C0714] truncate">
                                c/{c.communityName}
                              </p>
                              <p className="text-xs text-[#BE7090]">
                                {c.members?.length ?? 0} members
                              </p>
                            </div>
                          </button>
                        ))}
                      </div>
                    )}

                    {/* Divider */}
                    {suggestedCommunities.length > 0 && suggestedPosts.length > 0 && (
                      <div className="mx-3 my-1 h-px bg-[#FFE4E6]" />
                    )}

                    {/* Posts */}
                    {suggestedPosts.length > 0 && (
                      <div>
                        <p className="px-3 pt-2 pb-1 text-[10px] font-extrabold text-[#FDA4AF] uppercase tracking-widest">
                          Posts
                        </p>
                        {suggestedPosts.map((p) => (
                          <button
                            key={p._id}
                            type="button"
                            onClick={() => goToResult(`/postPage/${p._id}`)}
                            className="flex items-center gap-2.5 w-full px-3 py-2 hover:bg-[#FFF1F2] transition-colors text-left"
                          >
                            {/* Thumbnail or fallback icon */}
                            <div className="shrink-0 h-8 w-8 rounded-lg overflow-hidden bg-[#FFE4E6] border border-[#FECDD3] flex items-center justify-center">
                              {p.media?.[0]?.type === "image" ? (
                                <img src={p.media[0].url} alt="" className="w-full h-full object-cover" />
                              ) : p.media?.[0]?.type === "video" ? (
                                <Icon icon="mdi:play-circle" width="18" height="18" className="text-[#E11D48]" />
                              ) : (
                                <Icon icon="mdi:post-outline" width="16" height="16" className="text-[#FDA4AF]" />
                              )}
                            </div>
                            <div className="min-w-0 flex-1">
                              <p className="text-sm font-semibold text-[#1C0714] truncate leading-snug">
                                {p.postTitle || p.postDescription}
                              </p>
                              <p className="text-xs text-[#BE7090] truncate">
                                {p.community
                                  ? `c/${p.community.communityName} · `
                                  : ""}
                                u/{p.creator?.username}
                              </p>
                            </div>
                          </button>
                        ))}
                      </div>
                    )}

                    {/* Footer: see all results */}
                    <button
                      type="submit"
                      className="flex items-center justify-center gap-2 w-full px-3 py-2.5 mt-1 bg-[#FFF1F2] border-t border-[#FFE4E6] text-xs font-semibold text-[#E11D48] hover:bg-[#FFE4E6] transition-colors"
                    >
                      <Icon icon="mdi:magnify" width="14" height="14" />
                      See all results for "{debouncedQuery}"
                    </button>
                  </>
                )}
              </div>
            )}
          </div>
        </form>

        {/* Right: notifications + profile */}
        <div className="flex items-center gap-0.5 shrink-0">
          {/* Mobile search icon */}
          <button
            onClick={() => navigate("/search")}
            className="sm:hidden p-2 rounded-xl hover:bg-[#FFE4E6] cursor-pointer transition-all duration-200 text-[#E11D48]"
          >
            <Icon icon="mdi:magnify" width="20" height="20" />
          </button>

          {navbarLink.map((elem, index) => (
            <div
              key={index}
              className="relative p-2 rounded-xl hover:bg-[#FFE4E6] cursor-pointer transition-all duration-200 group"
            >
              <IconLink pageLink={elem.pageLink} icon={elem.icon} />
              {index === 0 && unreadCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] flex items-center justify-center bg-[#BE123C] text-white text-[10px] font-bold rounded-full border-2 border-[#FFF1F2] px-1">
                  {unreadCount > 99 ? "99+" : unreadCount}
                </span>
              )}
            </div>
          ))}
          <button
            onClick={() => navigate(`/userProfile/${user?._id}`)}
            className="ml-1.5 relative group"
          >
            <img
              src={profilePic}
              alt={isAuthenticated ? user?.username || "profile" : "guest"}
              className="h-9 w-9 rounded-full object-cover border-2 border-[#E11D48] transition-all duration-200 group-hover:ring-3 group-hover:ring-[#E11D48]/25"
            />
            <div className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-400 rounded-full border-2 border-[#FFF1F2]"></div>
          </button>
        </div>
      </nav>
      {toggleSidebar && <Sidebar />}
    </>
  );
};

export default Navbar;
