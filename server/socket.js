import jwt from "jsonwebtoken";

const userSocketMap = {
  // userId: socketID
};
export default function initializeSocket(io) {
  // Socket.io middleware for authentication
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

      userSocketMap[socket.userId] = socket.id; // Store the socket ID for the user

      next();
    } catch (err) {
      next(new Error("Authentication failed"));
    }
  });

  // Connection handler
  io.on("connection", (socket) => {
    console.log(`server=> User connected: ${socket.id}`);

    io.emit("onlineUsers", Object.keys(userSocketMap)); // Emit online users to all clients

    socket.on("send_message", (data) => {
      // Broadcast to project room
      //   io.to(`project_${data.projectId}`).emit("receive_message", {
      //     ...data,
      //     sender: socket.userId
      //   });
    });

    socket.on("disconnect", () => {
      delete  userSocketMap[socket.userId]; // Remove the user from the map
      io.emit("onlineUser", Object.keys(userSocketMap)); // Notify all clients about the disconnection
      console.log(`User disconnected: ${socket.id}`);
    });

    // Error handling
    socket.on("error", (err) => {
      console.error(`Socket error (${socket.id}):`, err);
    });
  });
}
