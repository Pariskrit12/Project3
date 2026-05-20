import React from "react";
import { useNavigate } from "react-router-dom";
import { Icon } from "@iconify/react";
import { useGetSuggestedUsersQuery, useFollowUserMutation } from "../../services/userApi";

const SuggestedUsers = () => {
  const navigate = useNavigate();
  const { data, isLoading, isError } = useGetSuggestedUsersQuery();
  const [followUser, { isLoading: following }] = useFollowUserMutation();

  const users = data?.data ?? [];

  return (
    <div className="border border-[#FECDD3] bg-[#FFF5F6] rounded-2xl overflow-hidden shadow-[0_4px_20px_rgba(225,29,72,0.08)] sticky top-20">
      <div className="px-4 py-3 border-b border-[#FECDD3]">
        <p className="font-black text-sm text-[#1C0714] flex items-center gap-2">
          <Icon icon="mdi:account-star-outline" width="16" height="16" className="text-[#E11D48]" />
          People you may know
        </p>
        <p className="text-xs text-[#BE7090] mt-0.5">Based on shared interests</p>
      </div>

      {isLoading && (
        <div className="flex justify-center py-6">
          <Icon icon="svg-spinners:ring-resize" width="24" height="24" className="text-[#E11D48]" />
        </div>
      )}

      {!isLoading && (isError || users.length === 0) && (
        <div className="flex flex-col items-center gap-2 py-8 text-[#FDA4AF] px-4">
          <Icon icon="mdi:account-search-outline" width="28" height="28" />
          <p className="text-xs text-center text-[#BE7090]">No suggestions right now</p>
        </div>
      )}

      {!isLoading && users.length > 0 && (
        <div className="flex flex-col divide-y divide-[#FECDD3]">
          {users.map((u) => (
            <div key={u._id} className="flex items-center gap-3 px-4 py-3">
              <button
                onClick={() => navigate(`/userProfile/${u._id}`)}
                className="shrink-0 h-9 w-9 rounded-full overflow-hidden bg-linear-to-br from-[#FB7185] to-[#BE123C] flex items-center justify-center border-2 border-[#FECDD3]"
              >
                {u.userProfilePic ? (
                  <img src={u.userProfilePic} alt={u.username} className="w-full h-full object-cover" />
                ) : (
                  <Icon icon="mdi:account" width="18" height="18" className="text-white" />
                )}
              </button>

              <div className="flex-1 min-w-0">
                <button
                  onClick={() => navigate(`/userProfile/${u._id}`)}
                  className="font-bold text-sm text-[#1C0714] truncate block hover:text-[#E11D48] transition-colors text-left w-full"
                >
                  {u.username}
                </button>
                {u.commonInterestsCount > 0 && (
                  <p className="text-xs text-[#BE7090] truncate">
                    {u.commonInterestsCount} shared interest{u.commonInterestsCount !== 1 ? "s" : ""}
                  </p>
                )}
              </div>

              <button
                onClick={() => followUser(u._id)}
                disabled={following}
                className="shrink-0 px-3 py-1 rounded-full text-xs font-semibold bg-[#E11D48] text-white hover:bg-[#BE123C] transition-colors disabled:opacity-60"
              >
                Follow
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SuggestedUsers;
