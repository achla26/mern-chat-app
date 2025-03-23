import { Notification } from "../models/notification.model.js";
import { ApiError } from "../utils/ApiError.js";

/**
 * Get all notifications for a user.
 * @param {string} userId - The ID of the user.
 * @returns {Promise<Array>} - The list of notifications.
 */
export const getNotificationsService = async (userId) => {
  try {
    const notifications = await Notification.find({ userId }).sort({
      createdAt: -1,
    }); // Sort by createdAt in descending order (newest first)
    return notifications;
  } catch (error) {
    throw new ApiError(500, "Error while fetching notifications.");
  }
};

/**
 * Mark a notification as read.
 * @param {string} userId - The ID of the user.
 * @param {string} notificationId - The ID of the notification.
 * @returns {Promise<Object>} - The updated notification.
 */
export const markNotificationAsReadService = async (userId, notificationId) => {
  try {
    const notification = await Notification.findOneAndUpdate(
      { _id: notificationId, userId }, // Ensure the notification belongs to the user
      { isRead: true }, // Mark the notification as read
      { new: true } // Return the updated document
    );

    if (!notification) {
      throw new ApiError(404, "Notification not found.");
    }

    return notification;
  } catch (error) {
    throw new ApiError(500, "Error while marking notification as read.");
  }
};

/**
 * Clear all notifications for a user.
 * @param {string} userId - The ID of the user.
 * @returns {Promise<void>}
 */
export const clearNotificationsService = async (userId) => {
  try {
    await Notification.deleteMany({ userId }); // Delete all notifications for the user
  } catch (error) {
    throw new ApiError(500, "Error while clearing notifications.");
  }
};