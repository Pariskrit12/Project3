import { createServer } from "http";
import { Server } from "socket.io";
import jwt from "jsonwebtoken";
import app from "./app.js";
import connection from "./db/connection.js";
import { User } from "./models/user.models.js";
import { initIO } from "./socket/socketManager.js";

const port = process.env.PORT || 8000;

function parseCookies(cookieHeader) {
  const cookies = {};
  if (!cookieHeader) return cookies;
  cookieHeader.split(";").forEach((part) => {
    const [name, ...rest] = part.trim().split("=");
    if (name) cookies[name.trim()] = rest.join("=");
  });
  return cookies;
}

const httpServer = createServer(app);

const io = new Server(httpServer, {
  cors: {
    origin: process.env.CORS_ORIGIN,
    credentials: true,
  },
});

io.use(async (socket, next) => {
  try {
    const cookies = parseCookies(socket.handshake.headers.cookie);
    const token = cookies.accessToken;
    if (!token) return next(new Error("Unauthorized"));

    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    const user = await User.findById(decoded._id).select("_id");
    if (!user) return next(new Error("Unauthorized"));

    socket.userId = user._id.toString();
    next();
  } catch {
    next(new Error("Unauthorized"));
  }
});

io.on("connection", (socket) => {
  socket.join(socket.userId);
  socket.on("disconnect", () => {});
});

initIO(io);

connection()
  .then(() => {
    httpServer.listen(port, () => {
      console.log(`Server connected successfully at port ${port}`);
    });
  })
  .catch((err) => {
    console.log("Failed to connect to database", err);
  });
