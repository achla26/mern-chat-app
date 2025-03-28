import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import errorHandler from "./middlewares/error.middleware.js";
import { Server } from "socket.io";
import http from "http";
import initializeSocket from "./socket.js";

const app = express();
const server = http.createServer(app);

const corsOptions = {
  origin: process.env.CLIENT_ORIGIN || "http://localhost:3000",
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE"]
};

// Middlewares
app.use(cors(corsOptions));
app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true, limit: "16kb" }));
app.use(express.static("public"));
app.use(cookieParser());

// Routes
import authRouter from './routes/auth.route.js';
import userRouter from './routes/user.route.js';
import chatRouter from './routes/chat.route.js';
import groupRouter from './routes/group.route.js';
import messageRoute from './routes/message.route.js';

// API Routes
app.use("/api/v1/auth", authRouter);
app.use("/api/v1/user", userRouter);
app.use("/api/v1/chats", chatRouter);
app.use("/api/v1/groups", groupRouter);
app.use("/api/v1/message", messageRoute);

// Health check
app.get("/health", (req, res) => res.status(200).json({ status: "OK" }));

// Initialize Socket.io
const io = new Server(server, {
  cors: corsOptions,
  connectionStateRecovery: {
    maxDisconnectionDuration: 2 * 60 * 1000, // 2 minutes
    skipMiddlewares: true
  }
});

initializeSocket(io);

// Error handler (must be last)
app.use(errorHandler);

export { app, server, io }; // Export io if needed elsewhere