import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import {
  getNotificationsService,
  markNotificationAsReadService,
  clearNotificationsService,
} from "../services/notification.service.js";

/**
 * @route   GET /api/v1/notifications
 * @desc    Get all notifications for the authenticated user
 * @access  Private
 */
export const getNotifications = asyncHandler(async (req, res) => {
  const userId = req.user._id; // Get the authenticated user's ID

  const notifications = await getNotificationsService(userId);

  return res
    .status(200)
    .json(
      new ApiResponse(200, { notifications }, "Notifications fetched successfully.")
    );
});

/**
 * @route   PUT /api/v1/notifications/:notificationId
 * @desc    Mark a notification as read
 * @access  Private
 */
export const markNotificationAsRead = asyncHandler(async (req, res) => {
  const userId = req.user._id; // Get the authenticated user's ID
  const { notificationId } = req.params; // Get the notification ID from the request params

  const updatedNotification = await markNotificationAsReadService(
    userId,
    notificationId
  );

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        { updatedNotification },
        "Notification marked as read successfully."
      )
    );
});

/**
 * @route   DELETE /api/v1/notifications
 * @desc    Clear all notifications for the authenticated user
 * @access  Private
 */
export const clearNotifications = asyncHandler(async (req, res) => {
  const userId = req.user._id; // Get the authenticated user's ID

  await clearNotificationsService(userId);

  return res
    .status(200)
    .json(new ApiResponse(200, {}, "All notifications cleared successfully."));
});