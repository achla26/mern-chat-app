import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import errorHandler from "./middlewares/error.middleware.js"; // Import the error handler

const app = express();

const corsOptions = {
    origin: process.env.CLIENT_ORIGIN,
    credentials: true,
};

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

// Routes declaration
app.use("/api/v1/auth", authRouter);
app.use("/api/v1/user", userRouter);
app.use("/api/v1/chats", chatRouter);
app.use("/api/v1/groups", groupRouter);
app.use("/api/v1/message", messageRoute);
// Error handler middleware (must be after all routes)
app.use(errorHandler);

export default app;