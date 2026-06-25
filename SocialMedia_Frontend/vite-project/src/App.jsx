import React, { useEffect } from "react";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import { Navigate, Route, Routes, useLocation } from "react-router-dom";
import Notification from "./pages/Notification";
import UserProfile from "./pages/UserProfile";
import Chat from "./pages/Chat";
import Postpage from "./pages/Postpage";
import Sidebar from "./components/Sidebar";
import RecentPostModule from "./components/RecentPostModule";
import Login from "./components/common/auth/Login";
import Register from "./components/common/auth/Register";
import Trending from "./pages/Trending";
import Setting from "./pages/Setting";
import ChangePassword from "./pages/ChangePassword";
import DeactivateAccount from "./pages/DeactivateAccount";
import AccountInformation from "./pages/AccountInformation";
import New from "./pages/New";
import Top from "./pages/Top";
import Communites from "./pages/Communites";
import CreatePost from "./pages/CreatePost";
import CommunityCreate from "./pages/CommunityCreate";
import SearchResults from "./pages/SearchResults";
import AdminLayout from "./pages/admin/AdminLayout";
import AdminUsers from "./pages/admin/AdminUsers";
import AdminReportedComments from "./pages/admin/AdminReportedComments";
import { useDispatch, useSelector } from "react-redux";
import { useGetCurrentUserQuery } from "./services/userApi";
import { setUser } from "./slices/authSlice";
import { setUnreadCount } from "./slices/notificationSlice";
import { useGetUnreadCountQuery } from "./services/notificationApi";
import { useSocket } from "./hooks/useSocket";
import { Icon } from "@iconify/react";
import InterestSelectorModal from "./components/InterestSelectorModal";

const PageWrapper = ({ children }) => (
  <div className="px-5 py-6">{children}</div>
);

const AdminRoute = ({ children, user, isLoading }) => {
  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Icon icon="svg-spinners:ring-resize" width="40" height="40" className="text-[#FF4500]" />
      </div>
    );
  }
  if (!user) return <Navigate to="/login" replace />;
  if (user.role !== "admin") return <Navigate to="/" replace />;
  return children;
};

const ProtectedRoute = ({ children, isAuthenticated, isLoading }) => {
  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Icon icon="svg-spinners:ring-resize" width="40" height="40" className="text-[#FF4500]" />
      </div>
    );
  }
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  return children;
};

const App = () => {
  const dispatch = useDispatch();
  const reduxAuthenticated = useSelector((state) => state.auth.isAuthenticated);
  const reduxUser = useSelector((state) => state.auth.user);
  const { data: currentUserData, isLoading: isAuthLoading } = useGetCurrentUserQuery();
  const isAuthenticated = reduxAuthenticated || !!currentUserData?.data;
  const showInterestModal =
    isAuthenticated && !isAuthLoading && reduxUser && reduxUser.hasSelectedInterests === false;

  const { data: unreadData } = useGetUnreadCountQuery(undefined, { skip: !isAuthenticated });

  useEffect(() => {
    if (currentUserData?.data) {
      dispatch(setUser(currentUserData.data));
    }
  }, [currentUserData, dispatch]);

  useEffect(() => {
    if (unreadData?.data !== undefined) {
      dispatch(setUnreadCount(unreadData.data));
    }
  }, [unreadData, dispatch]);

  useSocket();

  const location = useLocation();
  const isAuthenticationPage = ["/register", "/login"].includes(location.pathname);

  const hideRecentPost =
    location.pathname.startsWith("/userProfile") ||
    location.pathname.startsWith("/postPage") ||
    location.pathname.startsWith("/communities") ||
    [
      "/chat",
      "/notification",
      "/settings",
      "/settings/changePassword",
      "/settings/accountInformation",
      "/settings/deactivateAccount",
      "/create-post",
      "/create-community",
    ].includes(location.pathname) ||
    location.pathname === "/search";

  const isAdminPage = location.pathname.startsWith("/admin");

  if (isAdminPage) {
    return (
      <AdminRoute user={reduxUser} isLoading={isAuthLoading}>
        <Routes>
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<Navigate to="/admin/users" replace />} />
            <Route path="users" element={<AdminUsers />} />
            <Route path="reports" element={<AdminReportedComments />} />
          </Route>
        </Routes>
      </AdminRoute>
    );
  }

  return (
    <>
      {showInterestModal && <InterestSelectorModal currentUser={reduxUser} />}
      <Navbar />

      {isAuthenticationPage ? (
        <Routes>
          <Route
            path="/login"
            element={isAuthenticated ? <Navigate to="/" replace /> : <PageWrapper><Login /></PageWrapper>}
          />
          <Route
            path="/register"
            element={isAuthenticated ? <Navigate to="/" replace /> : <PageWrapper><Register /></PageWrapper>}
          />
        </Routes>
      ) : (
        <ProtectedRoute isAuthenticated={isAuthenticated} isLoading={isAuthLoading}>
          <div className={`grid min-h-screen ${hideRecentPost ? "grid-cols-[1fr_4fr]" : "grid-cols-[1fr_3fr_1.25fr]"}`}>
            <div className="sticky top-15 h-[calc(100vh-60px)] overflow-y-auto">
              <Sidebar />
            </div>

            <Routes>
              <Route path="/" element={<PageWrapper><Home /></PageWrapper>} />
              <Route path="/trending" element={<PageWrapper><Trending /></PageWrapper>} />
              <Route path="/new" element={<PageWrapper><New /></PageWrapper>} />
              <Route path="/top" element={<PageWrapper><Top /></PageWrapper>} />
              <Route path="/notification" element={<PageWrapper><Notification /></PageWrapper>} />
              <Route path="/userProfile/:userId" element={<PageWrapper><UserProfile /></PageWrapper>} />
              <Route path="/chat" element={<PageWrapper><Chat /></PageWrapper>} />
              <Route path="/settings" element={<PageWrapper><Setting /></PageWrapper>} />
              <Route path="/settings/changePassword" element={<PageWrapper><ChangePassword /></PageWrapper>} />
              <Route path="/settings/deactivateAccount" element={<PageWrapper><DeactivateAccount /></PageWrapper>} />
              <Route path="/settings/accountInformation" element={<PageWrapper><AccountInformation /></PageWrapper>} />
              <Route path="/postPage/:postId" element={<PageWrapper><Postpage /></PageWrapper>} />
              <Route path="/communities/:communityId" element={<PageWrapper><Communites /></PageWrapper>} />
              <Route path="/create-post" element={<PageWrapper><CreatePost /></PageWrapper>} />
              <Route path="/create-community" element={<PageWrapper><CommunityCreate /></PageWrapper>} />
              <Route path="/search" element={<PageWrapper><SearchResults /></PageWrapper>} />
            </Routes>

            {!hideRecentPost && (
              <div className="sticky top-15 h-[calc(100vh-60px)] overflow-y-auto">
                <RecentPostModule />
              </div>
            )}
          </div>
        </ProtectedRoute>
      )}
    </>
  );
};

export default App;
