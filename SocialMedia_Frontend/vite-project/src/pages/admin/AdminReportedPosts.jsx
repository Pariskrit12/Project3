import React, { useState } from "react";
import { Icon } from "@iconify/react";
import {
  useGetReportedPostsQuery,
  useDismissPostReportMutation,
  useDeleteReportedPostMutation,
} from "../../services/postApi";

const statusBadge = {
  pending: "bg-[#FF4500]/10 text-[#FF6534]",
  dismissed: "bg-[#3A3A3C] text-[#9A9A9A]",
};

const AdminReportedPosts = () => {
  const { data, isLoading, isError } = useGetReportedPostsQuery();
  const [dismissReport, { isLoading: dismissing }] = useDismissPostReportMutation();
  const [deleteReportedPost, { isLoading: deleting }] = useDeleteReportedPostMutation();
  const [filterStatus, setFilterStatus] = useState("all");
  const [actionId, setActionId] = useState(null);

  const reports = data?.data?.reports ?? [];

  const filtered = reports.filter(
    (r) => filterStatus === "all" || r.status === filterStatus
  );

  const pendingCount = reports.filter((r) => r.status === "pending").length;

  const handleDismiss = async (reportId) => {
    setActionId(reportId);
    try { await dismissReport({ reportId }).unwrap(); } catch (_) {}
    setActionId(null);
  };

  const handleDelete = async (reportId) => {
    setActionId(reportId);
    try { await deleteReportedPost({ reportId }).unwrap(); } catch (_) {}
    setActionId(null);
  };

  return (
    <div className="p-6 flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black text-[#D7DADC]">Reported Posts</h1>
          <p className="text-sm text-[#9A9A9A] mt-0.5">
            Review and act on flagged posts
          </p>
        </div>
        {pendingCount > 0 && (
          <div className="flex items-center gap-1.5 bg-[#FF4500]/10 text-[#FF6534] px-3 py-1.5 rounded-full text-xs font-bold">
            <Icon icon="mdi:flag-outline" width="14" height="14" />
            {pendingCount} pending
          </div>
        )}
      </div>

      <div className="flex gap-3">
        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          className="bg-[#1E1E1E] border border-[#3A3A3C] rounded-xl px-3 py-2 text-sm text-[#D7DADC] outline-none cursor-pointer"
        >
          <option value="all">All Reports</option>
          <option value="pending">Pending</option>
          <option value="dismissed">Dismissed</option>
        </select>
      </div>

      <div className="flex flex-col gap-3">
        {isLoading ? (
          <div className="flex justify-center items-center py-20">
            <Icon icon="svg-spinners:ring-resize" width="32" height="32" className="text-[#FF4500]" />
          </div>
        ) : isError ? (
          <div className="flex flex-col items-center gap-2 py-20 text-[#9A9A9A]">
            <Icon icon="mdi:alert-circle-outline" width="32" height="32" />
            <p className="text-sm font-medium">Failed to load reports</p>
          </div>
        ) : filtered.length === 0 ? (
          <div className="flex flex-col items-center gap-2 py-20 text-[#9A9A9A]">
            <Icon icon="mdi:flag-remove-outline" width="40" height="40" />
            <p className="text-sm font-medium">No reports found</p>
          </div>
        ) : (
          filtered.map((report) => (
            <div
              key={report._id}
              className="bg-[#1E1E1E] border border-[#3A3A3C] rounded-2xl p-5 flex flex-col gap-4"
            >
              <div className="flex items-start justify-between gap-3 flex-wrap">
                <div className="flex items-center gap-2">
                  <div className="h-7 w-7 rounded-full overflow-hidden bg-[#3A3A3C] shrink-0">
                    {report.reporter?.userProfilePic ? (
                      <img
                        src={report.reporter.userProfilePic}
                        alt={report.reporter.username}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-[#FF4500]">
                        <Icon icon="mdi:account" width="14" height="14" className="text-white" />
                      </div>
                    )}
                  </div>
                  <div>
                    <p className="text-xs font-bold text-[#D7DADC]">
                      @{report.reporter?.username ?? "unknown"}
                    </p>
                    <p className="text-[10px] text-[#9A9A9A]">reported</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`px-2.5 py-1 rounded-full text-xs font-bold capitalize ${statusBadge[report.status] ?? statusBadge.pending}`}>
                    {report.status}
                  </span>
                  <span className="text-xs text-[#9A9A9A]">
                    {new Date(report.createdAt).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                    })}
                  </span>
                </div>
              </div>

              <div className="bg-[#111111] border border-[#2A2A2A] rounded-xl p-4 flex flex-col gap-2">
                <div className="flex items-center gap-2">
                  <div className="h-6 w-6 rounded-full overflow-hidden bg-[#3A3A3C] shrink-0">
                    {report.post?.creator?.userProfilePic ? (
                      <img
                        src={report.post.creator.userProfilePic}
                        alt={report.post.creator.username}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-[#2A2A2A]">
                        <Icon icon="mdi:account" width="12" height="12" className="text-[#9A9A9A]" />
                      </div>
                    )}
                  </div>
                  <p className="text-xs font-bold text-[#D7DADC]">
                    @{report.post?.creator?.username ?? "deleted user"}
                  </p>
                </div>
                {report.post ? (
                  <>
                    {report.post.postTitle && (
                      <p className="text-sm font-semibold text-[#D7DADC]">{report.post.postTitle}</p>
                    )}
                    {report.post.postDescription && (
                      <p className="text-xs text-[#9A9A9A] leading-relaxed">{report.post.postDescription}</p>
                    )}
                    {report.post.media?.length > 0 && (
                      <div className="flex flex-wrap gap-2 mt-1">
                        {report.post.media.map((m, i) =>
                          m.type === "image" ? (
                            <img
                              key={i}
                              src={m.url}
                              alt="post media"
                              className="max-h-48 max-w-full rounded-lg object-cover border border-[#3A3A3C]"
                            />
                          ) : (
                            <video
                              key={i}
                              src={m.url}
                              controls
                              className="max-h-48 max-w-full rounded-lg border border-[#3A3A3C]"
                            />
                          )
                        )}
                      </div>
                    )}
                    {!report.post.postTitle && !report.post.postDescription && !report.post.media?.length && (
                      <p className="text-sm italic text-[#9A9A9A]">No content</p>
                    )}
                  </>
                ) : (
                  <p className="text-sm italic text-[#9A9A9A]">Post deleted</p>
                )}
              </div>

              <div className="flex flex-col gap-1">
                <p className="text-xs font-bold text-[#A83200] uppercase tracking-wide">Reason</p>
                <p className="text-sm text-[#9A9A9A] leading-relaxed">{report.reason}</p>
              </div>

              {report.status === "pending" && (
                <div className="flex gap-2 pt-2 border-t border-[#2A2A2A]">
                  <button
                    onClick={() => handleDismiss(report._id)}
                    disabled={actionId === report._id}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#2A2A2A] text-[#9A9A9A] text-xs font-semibold hover:bg-[#3A3A3C] hover:text-[#D7DADC] disabled:opacity-50 transition-colors"
                  >
                    <Icon icon="mdi:check" width="14" height="14" />
                    {actionId === report._id && dismissing ? "Dismissing…" : "Dismiss"}
                  </button>
                  {report.post != null && (
                    <button
                      onClick={() => handleDelete(report._id)}
                      disabled={actionId === report._id}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-red-500/10 text-red-400 text-xs font-semibold hover:bg-red-500/20 disabled:opacity-50 transition-colors"
                    >
                      <Icon icon="mdi:trash-can-outline" width="14" height="14" />
                      {actionId === report._id && deleting ? "Deleting…" : "Delete Post"}
                    </button>
                  )}
                </div>
              )}
            </div>
          ))
        )}
      </div>

      {!isLoading && !isError && filtered.length > 0 && (
        <p className="text-xs text-[#9A9A9A] text-center">
          Showing {filtered.length} of {reports.length} reports
        </p>
      )}
    </div>
  );
};

export default AdminReportedPosts;
