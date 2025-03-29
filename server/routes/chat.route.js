import express from "express";
import {
  getChats,
  createChat,
  sendMessage,
  deleteChat,
  getMessagesByConversationId,
  markMessagesAsRead, 
} from "../controllers/chat.controller.js";
import { isUserAuthenticated } from "../middlewares/auth.middleware.js";

const router = express.Router();

// ==================================================
// Private Chat Routes
// ==================================================

/**
 * @route   GET /api/v1/chats
 * @desc    Get all chats for the authenticated user
 * @access  Private
 */
router.get("/", isUserAuthenticated, getChats);

/**
 * @route   POST /api/v1/chats
 * @desc    Create a new private chat
 * @access  Private
 */
router.post("/", isUserAuthenticated, createChat);

/**
 * @route   POST /api/v1/chats/send
 * @desc    Send a message in a chat (private or group)
 * @access  Private
 */
router.post("/send", isUserAuthenticated, sendMessage);

/**
 * @route   DELETE /api/v1/chats/:conversationId
 * @desc    Delete a chat
 * @access  Private
 */
router.delete("/:conversationId", isUserAuthenticated, deleteChat);

/**
 * @route   GET /api/v1/chats/:conversationId/messages
 * @desc    Get all messages for a specific conversation
 * @access  Private
 */
router.get("/:conversationId/messages", isUserAuthenticated, getMessagesByConversationId);

/**
 * @route   POST /api/v1/chats/:conversationId/read
 * @desc    Mark messages as read in a chat
 * @access  Private
 */

//TO DO CHECKING
router.post("/:conversationId/read", isUserAuthenticated, markMessagesAsRead);

export default router;