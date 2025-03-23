import { Message } from "../models/message.model.js";
import { Conversation } from "../models/conversation.model.js";
import { ApiError } from "../utils/ApiError.js";
 
/**
 * Create a new group chat.
 * @param {string} creatorId - The ID of the creator.
 * @param {string[]} members - The IDs of the members.
 * @param {string} groupName - The name of the group.
 * @returns {Promise<Object>} - The created group chat.
 */
export const createGroupService = async (creatorId, members, groupName) => {
  try {
    // Validate input
    if (!creatorId || !members || members.length < 2) {
      throw new ApiError(
        400,
        "Creator ID and at least two members are required."
      );
    }

    // Create the group chat
    const group = await Conversation.create({
      members: [creatorId, ...members],
      isGroup: true,
      groupName,
    });

    return group;
  } catch (error) {
    throw error;
  }
};

/**
 * Add a member to a group chat.
 * @param {string} chatId - The ID of the group chat.
 * @param {string} memberId - The ID of the member to add.
 * @returns {Promise<Object>} - The updated group chat.
 */
export const addMemberToGroupService = async (chatId, memberId) => {
  try {
    // Validate input
    if (!chatId || !memberId) {
      throw new ApiError(400, "Chat ID and member ID are required.");
    }

    // Add the member to the group chat
    const updatedChat = await Conversation.findByIdAndUpdate(
      chatId,
      { $addToSet: { members: memberId } }, // Add member if not already present
      { new: true }
    );

    return updatedChat;
  } catch (error) {
    throw error;
  }
};

/**
 * Remove a member from a group chat.
 * @param {string} chatId - The ID of the group chat.
 * @param {string} memberId - The ID of the member to remove.
 * @returns {Promise<Object>} - The updated group chat.
 */
export const removeMemberFromGroupService = async (chatId, memberId) => {
  try {
    // Validate input
    if (!chatId || !memberId) {
      throw new ApiError(400, "Chat ID and member ID are required.");
    }

    // Remove the member from the group chat
    const updatedChat = await Conversation.findByIdAndUpdate(
      chatId,
      { $pull: { members: memberId } }, // Remove the member
      { new: true }
    );

    return updatedChat;
  } catch (error) {
    throw error;
  }
};

/**
 * Rename a group chat.
 * @param {string} chatId - The ID of the group chat.
 * @param {string} groupName - The new name of the group.
 * @returns {Promise<Object>} - The updated group chat.
 */
export const renameGroupService = async (chatId, groupName) => {
  try {
    // Validate input
    if (!chatId || !groupName?.trim()) {
      throw new ApiError(400, "Chat ID and group name are required.");
    }

    // Rename the group chat
    const updatedChat = await Conversation.findByIdAndUpdate(
      chatId,
      { groupName },
      { new: true }
    );

    return updatedChat;
  } catch (error) {
    throw error;
  }
};

/**
 * Delete a chat by ID.
 * @param {string} chatId - The ID of the chat to delete.
 * @param {string} userId - The ID of the authenticated user.
 * @returns {Promise<Object>} - The deleted chat.
 */
export const deleteChatService = async (chatId, userId) => {
  try {
    // Find and delete the chat if the user is a member
    const chat = await Conversation.findOneAndDelete({
      _id: chatId,
      members: userId, // Ensure the user is a member of the chat
    });

    if (!chat) {
      throw new ApiError(404, "Chat not found or you are not a member.");
    }

    // Delete all messages in the chat
    await Message.deleteMany({ conversationId: chatId });

    return chat;
  } catch (error) {
    throw new ApiError(500, "Error while deleting chat.");
  }
};

/**
 * Mark messages as read in a chat.
 * @param {string} chatId - The ID of the chat.
 * @param {string} userId - The ID of the authenticated user.
 * @returns {Promise<Object>} - The updated chat.
 */
export const markMessagesAsReadService = async (chatId, userId) => {
  try {
    // Mark all unread messages in the chat as read
    const updatedMessages = await Message.updateMany(
      {
        conversationId: chatId,
        readBy: { $ne: userId }, // Messages not already read by the user
      },
      { $addToSet: { readBy: userId } } // Add the user to the readBy array
    );

    if (updatedMessages.modifiedCount === 0) {
      throw new ApiError(404, "No unread messages found.");
    }

    // Return the updated chat
    const chat = await Conversation.findById(chatId).populate("lastMessage");
    return chat;
  } catch (error) {
    throw new ApiError(500, "Error while marking messages as read.");
  }
};