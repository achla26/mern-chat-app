import jwt from "jsonwebtoken";

const userSocketMap = {}; // userId: socketId

export default function initializeSocket(io) {
  // Authentication middleware
  io.use(async (socket, next) => {
    try {
      const token = socket.handshake.auth.token;
      if (!token) {
        return next(new Error("Authentication required"));
      }

      const decoded = jwt.verify(token, process.env.JWT_ACCESS_TOKEN_SECRET);
      if (!decoded) {
        return next(new Error("Invalid token"));
      }

      socket.userId = decoded.userId;
      userSocketMap[socket.userId] = socket.id;
      next();
    } catch (err) {
      if (err.name === "TokenExpiredError") {
        return next(new Error("Token expired"));
      }
      return next(new Error("Authentication failed"));
    }
  });

  io.on("connection", (socket) => {
    console.log(`User connected: ${socket.id} (User ID: ${socket.userId})`);

    // Notify all clients about the new connection
    io.emit("onlineUsers", Object.keys(userSocketMap));

    // Message handling
    socket.on("send_message", (data) => {
      // Example: Broadcast to a project room
      // io.to(`project_${data.projectId}`).emit("receive_message", {
      //   ...data,
      //   sender: socket.userId
      // });
    });

    // Join room handler
    socket.on("join_room", (roomId) => {
      socket.join(roomId);
      console.log(`User ${socket.userId} joined room ${roomId}`);
    });

    // Leave room handler
    socket.on("leave_room", (roomId) => {
      socket.leave(roomId);
      console.log(`User ${socket.userId} left room ${roomId}`);
    });

    // Disconnection handler
    socket.on("disconnect", () => {
      console.log(`User disconnected: ${socket.id} (User ID: ${socket.userId})`);
      delete userSocketMap[socket.userId];
      io.emit("onlineUsers", Object.keys(userSocketMap));
    });

    // Error handling
    socket.on("error", (err) => {
      console.error(`Socket error (${socket.id}):`, err);
    });
  });

  // Optional: Cleanup interval for stale connections
  setInterval(() => {
    io.emit("onlineUsers", Object.keys(userSocketMap));
  }, 60000); // Update online users every minute
}