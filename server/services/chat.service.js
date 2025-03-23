import { Message } from "../models/message.model.js";
import { Conversation } from "../models/conversation.model.js";
import { ApiError } from "../utils/ApiError.js";

/**
 * Get all chats for a user.
 * @param {string} userId - The ID of the user.
 * @returns {Promise<Array>} - The list of conversations.
 */
export const getChatsService = async (userId) => {
  try {
    // Fetch all conversations where the user is a participant
    const conversations = await Conversation.find({
      members: userId,
    }).populate("lastMessage"); // Populate last message to get message details

    return conversations;
  } catch (error) {
    throw new Error("Error while fetching conversations: " + error.message);
  }
};


/**
 * Create a new private chat.
 * @param {string} userId - The ID of the user creating the chat.
 * @param {string} receiverId - The ID of the receiver.
 * @returns {Promise<Object>} - The created conversation.
 */
export const createPrivateChatService = async (userId, receiverId) => {
  try {
    // Validate input
    if (!userId || !receiverId) {
      throw new ApiError(400, "User ID and receiver ID are required.");
    }

    // Check if a conversation already exists
    const existingConversation = await Conversation.findOne({
      members: { $all: [userId, receiverId] },
      isGroup: false,
    });

    if (existingConversation) {
      return existingConversation;
    }

    // Create a new conversation
    const newConversation = await Conversation.create({
      members: [userId, receiverId],
      isGroup: false,
    });

    return newConversation;
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

    // Find or create a conversation
    let conversation;
    if (isGroup) {
      // For group chats, use the receiverIds as members
      conversation = await Conversation.findOne({
        members: { $all: [senderId, ...receiverIds] },
        isGroup: true,
      });
    } else {
      // For private chats, find a conversation between two users
      conversation = await Conversation.findOne({
        members: { $all: [senderId, receiverIds[0]] },
        isGroup: false,
      });
    }

    // If no conversation exists, create one
    if (!conversation) {
      conversation = await Conversation.create({
        members: isGroup
          ? [senderId, ...receiverIds]
          : [senderId, receiverIds[0]],
        isGroup,
      });
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