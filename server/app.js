import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import errorHandler from "./middlewares/error.middleware.js";
import http from "http";
import { initializeSocket } from "./socket.js";

const app = express();
const server = http.createServer(app);

const corsOptions = {
  origin: process.env.CLIENT_ORIGIN || "http://localhost:4000",
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE"],
};

// Middlewares
app.use(cors(corsOptions));
app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true, limit: "16kb" }));
app.use(express.static("public"));
app.use(cookieParser());

// Routes
import authRouter from "./routes/auth.route.js";
import userRouter from "./routes/user.route.js";
import chatRouter from "./routes/chat.route.js";
import groupRouter from "./routes/group.route.js"; 

// API Routes
app.use("/api/v1/auth", authRouter);
app.use("/api/v1/user", userRouter);
app.use("/api/v1/chats", chatRouter);
app.use("/api/v1/groups", groupRouter); 

// Health check
app.get("/health", (req, res) => res.status(200).json({ status: "OK" }));

// Initialize socket AFTER server is created
initializeSocket(server);

// Error handler (must be last)
app.use(errorHandler);

export { app, server };
