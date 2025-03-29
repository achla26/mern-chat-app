import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import {
  getChatsService,
  createConversationService,
  sendMessageService,
  deleteChatService,
  getMessagesByConversationIdService,
  markMessagesAsReadService, 
} from "../services/chat.service.js";

/**
 * Get all chats for the authenticated user.
 */
export const getChats = asyncHandler(async (req, res) => {
  const userId = req.user._id; // Get the authenticated user's ID

  const data = await getChatsService(userId);

  return res
    .status(200)
    .json(new ApiResponse(200, { data }, "Chats fetched successfully."));
});

/**
 * Create a new private chat.
 */
export const createChat = asyncHandler(async (req, res) => {
  const userId = req.user._id; // Get the authenticated user's ID
  const { receiverId } = req.body; // Get the receiver's ID from the request body

  const data = await createConversationService(userId, receiverId);

  return res
    .status(201)
    .json(new ApiResponse(201, { data }, "Private chat created successfully."));
});

/**
 * Send a message in a chat (private or group).
 */
export const sendMessage = asyncHandler(async (req, res) => {
  const senderId = req.user._id; // Get the authenticated user's ID
  const { receiverIds, message, isGroup } = req.body; // Get receiver IDs, message, and chat type

  const data = await sendMessageService(
    senderId,
    receiverIds,
    message,
    isGroup
  );

  return res
    .status(201)
    .json(new ApiResponse(201, { data }, "Message sent successfully."));
});

/**
 * Delete a chat.
 */
export const deleteChat = asyncHandler(async (req, res) => {
  const userId = req.user._id; // Get the authenticated user's ID
  const { conversationId } = req.params; // Get the chat ID from the request params

  const data = await deleteChatService(conversationId, userId);

  return res
    .status(200)
    .json(new ApiResponse(200, { data }, "Chat deleted successfully."));
});

/**
 * Mark messages as read in a chat.
 */
export const markMessagesAsRead = asyncHandler(async (req, res) => {
  const userId = req.user._id; // Get the authenticated user's ID
  const { conversationId } = req.params; // Get the chat ID from the request params

  const data = await markMessagesAsReadService(conversationId, userId);

  return res
    .status(200)
    .json(
      new ApiResponse(200, { data }, "Messages marked as read successfully.")
    );
});

/**
 * Get all messages for a specific conversation.
 */
export const getMessagesByConversationId = asyncHandler(async (req, res) => {
  const { conversationId } = req.params; // Get the conversation ID from the request params
  const senderId = req.user._id; // Get the authenticated user's ID
  const { page = 1, limit = 20 } = req.query; // Get pagination parameters

  const data = await getMessagesByConversationIdService(
    conversationId,
    senderId,
    parseInt(page),
    parseInt(limit)
  );

  return res
    .status(200)
    .json(new ApiResponse(200, { data }, "Messages fetched successfully."));
});
 