import { Router } from "express";
import {
  uploadAvatar,
  uploadChatFile,
} from "../controllers/upload.controller.js";
import { isUserAuthenticated } from "../middlewares/auth.middleware.js";
import upload from "../middlewares/multer.middleware.js"; // Multer middleware for file uploads

const router = Router();

// File upload routes
router.post("/avatar", isUserAuthenticated, upload.single("avatar"), uploadAvatar); // Upload profile picture
router.post("/chat/:conversationId", isUserAuthenticated, upload.single("file"), uploadChatFile); // Upload file to a chat

export default router;