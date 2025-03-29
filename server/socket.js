import jwt from "jsonwebtoken";
import { Server } from "socket.io";

const userSocketMap = {}; // userId: socketId
let io; // Declare io globally

const initializeSocket = (server) => {
  io = new Server(server, {
    cors: {
      origin: process.env.CLIENT_ORIGIN || "http://localhost:3000",
      credentials: true,
      methods: ["GET", "POST", "PUT", "DELETE"],
    },
    connectionStateRecovery: {
      maxDisconnectionDuration: 2 * 60 * 1000, // 2 minutes
      skipMiddlewares: true,
    },
  });

  // Middleware for authentication
  io.use(async (socket, next) => {
    try {
      const token = socket.handshake.auth.token;
      if (!token) return next(new Error("Authentication required"));

      const decoded = jwt.verify(token, process.env.JWT_ACCESS_TOKEN_SECRET);
      socket.userId = decoded.userId;
      userSocketMap[socket.userId] = socket.id;
      next();
    } catch (err) {
      const errorMessage = err.name === "TokenExpiredError" ? "Token expired" : "Authentication failed";
      return next(new Error(errorMessage));
    }
  });

  // Socket event handlers
  io.on("connection", (socket) => {
    console.log(`User connected: ${socket.id} (User ID: ${socket.userId})`);
    io.emit("onlineUsers", Object.keys(userSocketMap));

    socket.on("send_message", (data) => {
      console.log("Message received:", data);
    });

    socket.on("join_room", (roomId) => {
      socket.join(roomId);
      console.log(`User ${socket.userId} joined room ${roomId}`);
    });

    socket.on("leave_room", (roomId) => {
      socket.leave(roomId);
      console.log(`User ${socket.userId} left room ${roomId}`);
    });

    socket.on("disconnect", () => {
      console.log(`User disconnected: ${socket.id} (User ID: ${socket.userId})`);
      delete userSocketMap[socket.userId];
      io.emit("onlineUsers", Object.keys(userSocketMap));
    });

    socket.on("error", (err) => {
      console.error(`Socket error (${socket.id}):`, err);
    });
  });

  // Periodic cleanup of stale connections
  setInterval(() => {
    io.emit("onlineUsers", Object.keys(userSocketMap));
  }, 60000);
};

const getSocketId = (userId) => userSocketMap[userId];

export { initializeSocket, getSocketId, io };
