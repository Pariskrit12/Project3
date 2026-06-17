import React from "react";
import RecentPostCard from "./HomeComponents/RecentPostCard";
import { Icon } from "@iconify/react";
import { useNavigate } from "react-router-dom";
import { useGetRecentlyVisitedPostsQuery } from "../services/postApi";

const SkeletonCard = () => (
  <div className="py-3 border-b border-[#3A3A3C] last:border-0 flex gap-3 animate-pulse">
    <div className="flex flex-col gap-2 flex-1">
      <div className="flex gap-1.5 items-center">
        <div className="h-4 w-4 rounded-full bg-[#3A3A3C]" />
        <div className="h-3 w-20 rounded bg-[#3A3A3C]" />
      </div>
      <div className="h-3.5 w-full rounded bg-[#3A3A3C]" />
      <div className="h-3.5 w-2/3 rounded bg-[#3A3A3C]" />
      <div className="flex gap-3">
        <div className="h-3 w-8 rounded bg-[#3A3A3C]" />
        <div className="h-3 w-8 rounded bg-[#3A3A3C]" />
      </div>
    </div>
    <div className="shrink-0 w-16 h-14 rounded-xl bg-[#3A3A3C]" />
  </div>
);

const RecentPostModule = () => {
  const navigate = useNavigate();
  const { data, isLoading } = useGetRecentlyVisitedPostsQuery();
  const posts = data?.data ?? [];

  return (
    <aside className="py-5 pr-3">
      <section className="rounded-2xl bg-[#1E1E1E] border border-[#3A3A3C] shadow-[0_2px_16px_rgba(255,69,0,0.07)] overflow-hidden">
        {/* Header */}
        <div className="flex justify-between items-center px-4 py-3 border-b border-[#3A3A3C] bg-linear-to-r from-[#111111] to-[#1E1E1E]">
          <div className="flex items-center gap-2">
            <div className="p-1 rounded-lg bg-[#2A2A2A]">
              <Icon icon="mdi:history" width="14" height="14" className="text-[#FF4500]" />
            </div>
            <h2 className="text-sm font-bold text-[#D7DADC]">Recently Visited</h2>
          </div>
          {posts.length > 0 && (
            <span className="text-[10px] font-bold text-[#9A9A9A] bg-[#2A2A2A] px-2 py-0.5 rounded-full">
              {posts.length}
            </span>
          )}
        </div>

        {/* Content */}
        <div className="px-4">
          {isLoading ? (
            <>
              <SkeletonCard />
              <SkeletonCard />
              <SkeletonCard />
            </>
          ) : posts.length === 0 ? (
            <div className="flex flex-col items-center gap-2 py-8 text-center">
              <div className="p-3 rounded-full bg-[#2A2A2A]">
                <Icon icon="mdi:newspaper-variant-outline" width="24" height="24" className="text-[#9A9A9A]" />
              </div>
              <p className="text-sm font-semibold text-[#A83200]">No history yet</p>
              <p className="text-xs text-[#9A9A9A] leading-relaxed">
                Posts you visit will appear here
              </p>
            </div>
          ) : (
            posts.map((post) => (
              <RecentPostCard
                key={post._id}
                post={post}
                onClick={() => navigate(`/postPage/${post._id}`)}
              />
            ))
          )}
        </div>

        {/* Footer — only when there are posts */}
        {!isLoading && posts.length > 0 && (
          <div className="px-4 py-2.5 border-t border-[#3A3A3C] bg-[#1E1E1E]">
            <p className="text-xs text-center text-[#9A9A9A]">
              Showing last {posts.length} visited post{posts.length !== 1 ? "s" : ""}
            </p>
          </div>
        )}
      </section>
    </aside>
  );
};

export default RecentPostModule;
