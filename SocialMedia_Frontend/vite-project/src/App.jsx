import React from "react";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import { Route, Routes, useLocation } from "react-router-dom";
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

const PageWrapper = ({ children }) => (
  <div className="px-4 py-5">{children}</div>
);

const App = () => {
  const location = useLocation();
  const isAuthenticationPage = ["/register", "/login"].includes(
    location.pathname,
  );
  const hideRecentPost = [
    "/chat",
    "/notification",
    "/userProfile",
    "/settings",
    "/settings/changePassword",
    "/settings/accountInformation",
    "/settings/deactivateAccount",
  ].includes(location.pathname);

  return (
    <>
      <Navbar />

      {isAuthenticationPage ? (
        <Routes>
          <Route
            path="/login"
            element={
              <PageWrapper>
                <Login />
              </PageWrapper>
            }
          />
          <Route
            path="/register"
            element={
              <PageWrapper>
                <Register />
              </PageWrapper>
            }
          />
        </Routes>
      ) : (
        <div
          className={`grid ${hideRecentPost ? "grid-cols-[1fr_4fr]" : "grid-cols-[1fr_3fr_1.25fr]"} `}
        >
          <div className="sticky top-0 h-screen overflow-y-auto">
            <Sidebar />
          </div>

          <Routes>
            <Route
              path="/"
              element={
                <PageWrapper>
                  <Home />
                </PageWrapper>
              }
            />
            <Route
              path="/trending"
              element={
                <PageWrapper>
                  <Trending />
                </PageWrapper>
              }
            />
            <Route
              path="/notification"
              element={
                <PageWrapper>
                  <Notification />
                </PageWrapper>
              }
            />
            <Route
              path="/userProfile"
              element={
                <PageWrapper>
                  <UserProfile />
                </PageWrapper>
              }
            />
            <Route
              path="/chat"
              element={
                <PageWrapper>
                  <Chat />
                </PageWrapper>
              }
            />
            <Route
              path="/settings"
              element={
                <PageWrapper>
                  <Setting />
                </PageWrapper>
              }
            />
            <Route
              path="/settings/changePassword"
              element={
                <PageWrapper>
                  <ChangePassword />
                </PageWrapper>
              }
            />
             <Route
              path="/settings/deactivateAccount"
              element={
                <PageWrapper>
                  <DeactivateAccount />
                </PageWrapper>
              }
            />
            <Route
              path="/settings/accountInformation"
              element={
                <PageWrapper>
                  <AccountInformation />
                </PageWrapper>
              }
            />
            <Route
              path="/postPage"
              element={
                <PageWrapper>
                  <Postpage />
                </PageWrapper>
              }
            />
          </Routes>

          {!hideRecentPost && (
            <div className="sticky top-25 h-screen overflow-y-auto">
              <RecentPostModule />
            </div>
          )}
        </div>
      )}
    </>
  );
};

export default App;
