import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { BrowserRouter } from "react-router-dom";
import { Provider } from "react-redux";
import { store } from "./store/store.js";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { CallProvider } from "./context/CallContext.jsx";
import { SocketProvider } from "./socket/SocketProvider.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <Provider store={store}>
      <GoogleOAuthProvider clientId="1026423497886-vi7n4go8ei5gnofhdnc7apum45pmvrc9.apps.googleusercontent.com">
        <BrowserRouter>
          <CallProvider>
            <SocketProvider>
              <App />
            </SocketProvider>
          </CallProvider>
        </BrowserRouter>
      </GoogleOAuthProvider>
    </Provider>
  </StrictMode>,
);
