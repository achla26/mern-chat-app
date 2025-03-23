import { Router } from "express";
import {
  getNotifications,
  markNotificationAsRead,
  clearNotifications,
} from "../controllers/notification.controller.js";
import { isUserAuthenticated } from "../middlewares/auth.middleware.js";

const router = Router();

// Notification routes
router.get("/", isUserAuthenticated, getNotifications); // Get all notifications
router.put("/:notificationId", isUserAuthenticated, markNotificationAsRead); // Mark a notification as read
router.delete("/", isUserAuthenticated, clearNotifications); // Clear all notifications

export default router;