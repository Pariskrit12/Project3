import React, { useState } from "react";
import { Icon } from "@iconify/react";
import {
  useGetReportedCommentsQuery,
  useDismissReportMutation,
  useDeleteReportedCommentMutation,
} from "../../services/commentsApi";

const statusBadge = {
  pending: "bg-yellow-500/10 text-yellow-400",
  dismissed: "bg-[#3A3A3C] text-[#9A9A9A]",
};

const AdminReportedComments = () => {
  const { data, isLoading, isError } = useGetReportedCommentsQuery();
  const [dismissReport, { isLoading: dismissing }] = useDismissReportMutation();
  const [deleteReportedComment, { isLoading: deleting }] = useDeleteReportedCommentMutation();
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
    try { await deleteReportedComment({ reportId }).unwrap(); } catch (_) {}
    setActionId(null);
  };

  return (
    <div className="p-6 flex flex-col gap-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black text-[#D7DADC]">Reported Comments</h1>
          <p className="text-sm text-[#9A9A9A] mt-0.5">
            Review and act on flagged comments
          </p>
        </div>
        {pendingCount > 0 && (
          <div className="flex items-center gap-1.5 bg-yellow-500/10 text-yellow-400 px-3 py-1.5 rounded-full text-xs font-bold">
            <Icon icon="mdi:flag-outline" width="14" height="14" />
            {pendingCount} pending
          </div>
        )}
      </div>

      {/* Filter */}
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

      {/* Cards */}
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
              {/* Top: reporter + date + status */}
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

              {/* Comment box */}
              <div className="bg-[#111111] border border-[#2A2A2A] rounded-xl p-4 flex flex-col gap-2">
                <div className="flex items-center gap-2">
                  <div className="h-6 w-6 rounded-full overflow-hidden bg-[#3A3A3C] shrink-0">
                    {report.comment?.creator?.userProfilePic ? (
                      <img
                        src={report.comment.creator.userProfilePic}
                        alt={report.comment.creator.username}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-[#2A2A2A]">
                        <Icon icon="mdi:account" width="12" height="12" className="text-[#9A9A9A]" />
                      </div>
                    )}
                  </div>
                  <p className="text-xs font-bold text-[#D7DADC]">
                    @{report.comment?.creator?.username ?? "deleted user"}
                  </p>
                  {report.post?.postTitle && (
                    <>
                      <span className="text-[#3A3A3C]">·</span>
                      <p className="text-xs text-[#9A9A9A] truncate max-w-48">
                        on "{report.post.postTitle}"
                      </p>
                    </>
                  )}
                </div>
                <p className="text-sm text-[#D7DADC] leading-relaxed">
                  {report.comment?.description ?? (
                    <span className="italic text-[#9A9A9A]">Comment deleted</span>
                  )}
                </p>
              </div>

              {/* Reason */}
              <div className="flex flex-col gap-1">
                <p className="text-xs font-bold text-[#A83200] uppercase tracking-wide">Reason</p>
                <p className="text-sm text-[#9A9A9A] leading-relaxed">{report.reason}</p>
              </div>

              {/* Actions */}
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
                  {report.comment?.description !== undefined && (
                    <button
                      onClick={() => handleDelete(report._id)}
                      disabled={actionId === report._id}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-red-500/10 text-red-400 text-xs font-semibold hover:bg-red-500/20 disabled:opacity-50 transition-colors"
                    >
                      <Icon icon="mdi:trash-can-outline" width="14" height="14" />
                      {actionId === report._id && deleting ? "Deleting…" : "Delete Comment"}
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

export default AdminReportedComments;
