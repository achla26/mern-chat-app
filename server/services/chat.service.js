import { Message } from "../models/message.model.js";
import { User } from "../models/user.model.js";
import { Conversation } from "../models/conversation.model.js";
import mongoose from "mongoose";
import { ApiError } from "../utils/ApiError.js";

/**
 * Get all chats for a user, including the chat name (group name or other person's name).
 * @param {string} userId - The ID of the user.
 * @returns {Promise<Array>} - The list of conversations with chat names.
 */
export const getChatsService = async (userId) => {
  try {
    // Fetch conversations with last message populated
    const conversations = await Conversation.find({
      members: userId,
    }).populate("lastMessage");

    // Get unique user IDs from all chats
    const userIds = conversations.flatMap((chat) => chat.members); 

    const uniqueUserIds = [...new Set(userIds.map(id => id.toString()))]
      .map(id => new mongoose.Types.ObjectId(id));

    // Fetch user details
    const users = await User.find({ _id: { $in: uniqueUserIds } })
      .select("_id fullName avatar");

    // Create user map for quick lookup
    const usersMap = users.reduce((map, user) => {
      map[user._id.toString()] = user;
      return map;
    }, {});

    // Format chats with essential data
    const chats = conversations.map((chat) => {
      const isGroup = chat.isGroup;
      const otherUserId = isGroup 
        ? null 
        : chat.members.find(member => member.toString() !== userId);
      
      const lastMessageContent = chat.lastMessage?.message 
        ? chat.lastMessage.message.substring(0, 30) + (chat.lastMessage.message.length > 30 ? '...' : '')
        : 'No messages yet';

      return {
        _id: chat._id,
        isGroup,
        chatName: isGroup
          ? chat.groupName || "Group Chat"
          : usersMap[otherUserId?.toString()]?.fullName || "Unknown User",
        avatar: isGroup
          ? chat.groupAvatar
          : usersMap[otherUserId?.toString()]?.avatar,
        lastMessage: lastMessageContent,
        unreadCount: chat.unreadCount || 0,
        members: chat.members,
        createdAt: chat.createdAt
      };
    });

    return chats;
  } catch (error) {
    throw new ApiError(
      500,
      "Error while fetching conversations: " + error.message
    );
  }
};

export const FindConversation = async (senderId,receiverIds, isGroup = false) => {
  let members = [senderId, receiverIds[0]];
  if (isGroup) {
    members = [senderId, ...receiverIds];
  }

  let conversation = await Conversation.findOne({
    members: { $all: members },
    isGroup,
  });

  return conversation;
};

/**
 * Create a new private chat.
 * @param {string} userId - The ID of the user creating the chat.
 * @param {string} receiverId - The ID of the receiver.
 * @returns {Promise<Object>} - The created conversation.
 */
export const createConversationService = async (senderId, receiverIds , isGroup = false) => {
  try { 
    let existingConversation = await FindConversation(senderId , receiverIds , isGroup);

    if (existingConversation) {
      return existingConversation;
    }

    // Create a new conversation

    const conversation = await Conversation.create({
      members: isGroup
        ? [senderId, ...receiverIds]
        : [senderId, receiverIds[0]],
      isGroup,
    });

    return conversation;
  } catch (error) {
    throw error;
  }
};

/**
 * Send a message in a chat (private or group).
 * @param {string} senderId - The ID of the sender.
 * @param {string[]} receiverIds - The IDs of the receivers.
 * @param {string} message - The message content.
 * @param {boolean} isGroup - Whether the chat is a group chat.
 * @returns {Promise<Object>} - The created message.
 */
export const sendMessageService = async (
  senderId,
  receiverIds,
  message,
  isGroup = false
) => {
  try {
    // Validate input
    if ([senderId.toString(), message].some((field) => !field?.trim())) {
      throw new ApiError(400, "Sender ID and message are required.");
    }

    if (!isGroup && (!receiverIds || receiverIds.length !== 1)) {
      throw new ApiError(
        400,
        "For private chats, exactly one receiver is required."
      );
    }

    let conversation = await FindConversation(senderId , receiverIds , isGroup); 
    
    // If no conversation exists, create one
    if (!conversation) {
      conversation = await createConversationService(senderId , receiverIds , isGroup);
    } 

    // Create the message
    const newMessage = await Message.create({
      senderId,
      conversationId: conversation._id,
      receiverIds: isGroup ? [...receiverIds] : [receiverIds[0]],
      message,
      isGroup,
    });

    // Update the conversation's last message
    if (newMessage) {
      await Conversation.findByIdAndUpdate(conversation._id, {
        lastMessage: newMessage._id,
      });
    }

    return newMessage;
  } catch (error) {
    throw error;
  }
};

/**
 * Get all messages for a conversation.
 * @param {string} conversationId - The ID of the conversation.
 * @param {number} [page=1] - The page number for pagination (default: 1).
 * @param {number} [limit=20] - The number of messages per page (default: 20).
 * @returns {Promise<Object>} - An object containing the messages and pagination details.
 */
export const getMessagesByConversationIdService = async (
  conversationId,
  page = 1,
  limit = 20
) => {
  try {
    // Validate conversationId
    if (!conversationId?.trim()) {
      throw new ApiError(400, "Conversation ID is required.");
    }

    // Calculate the number of documents to skip (for pagination)
    const skip = (page - 1) * limit;

    // Find all messages for the conversation, sorted by createdAt (newest first)
    const messages = await Message.find({ conversationId })
      .sort({ createdAt: -1 }) // Sort by createdAt in descending order (newest first)
      .skip(skip) // Skip documents for pagination
      .limit(limit) // Limit the number of documents per page
      .populate({
        path: "senderId",
        select: "email name", // Include only email and name fields
      })
      .populate({
        path: "receiverIds",
        select: "email name", // Include only email and name fields
      })
      .populate({
        path: "readBy",
        select: "email name", // Include only email and name fields
      })
      .select("message senderId readBy receiverIds createdAt"); // Include only required fields

    // Get the total count of messages for the conversation (for pagination)
    const totalMessages = await Message.countDocuments({ conversationId });

    // Calculate total pages
    const totalPages = Math.ceil(totalMessages / limit);

    return {
      messages,
      chatId : conversationId,
      pagination: {
        currentPage: page,
        totalPages,
        totalMessages,
        messagesPerPage: limit,
      },
    };
  } catch (error) {
    throw new ApiError(500, error.message || "Error while fetching messages.");
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
