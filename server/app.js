import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import errorHandler from "./middlewares/error.middleware.js"; // Import the error handler

const app = express();

const corsOptions = {
    origin: process.env.CROSS_ORIGIN,
    credentials: true,
};

app.use(cors(corsOptions)); 

app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true, limit: "16kb" }));
app.use(express.static("public"));
app.use(cookieParser());

// Routes
import userRouter from './routes/user.route.js';
import messageRoute from './routes/message.route.js';

// Routes declaration
app.use("/api/v1/users", userRouter);
app.use("/api/v1/message", messageRoute);
// Error handler middleware (must be after all routes)
app.use(errorHandler);

export default app;