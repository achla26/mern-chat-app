import { Message } from "../models/message.model.js";
import { Conversation } from "../models/conversation.model.js";
import { ApiError } from "../utils/ApiError.js";
export const sendMessageService = async (senderId, receiverIds, message, isGroup = false) => {
  try {
    if ([senderId.toString(), message].some((field) => !field?.trim())) {
      throw new ApiError(400, "Sender ID and message are required.");
    }

    if (!isGroup && (!receiverIds || receiverIds.length !== 1)) {
      throw new ApiError(400, "For private chats, exactly one receiver is required.");
    }

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
        members: isGroup ? [senderId, ...receiverIds] : [senderId, receiverIds[0]],
        isGroup,
      });
    }

    const newMessage = await Message.create({
      senderId,
      conversationId: conversation._id, // Store all receivers for group chats
      receiverIds: isGroup ? [...receiverIds] : [receiverIds[0]],
      message,
      isGroup,
    });

    if (newMessage) {
      // Update the conversation's last message
      await Conversation.findByIdAndUpdate(conversation._id, {
        lastMessage: newMessage._id,
      });
    }

    return newMessage;

  } catch (error) {
    throw error;
  }
};

export const getUserChatsService = async (myId) => {
  try {
    // Fetch all conversations where the user is a participant
    const conversations = await Conversation.find({
      members: myId,
    }).populate("lastMessage"); // Populate last message to get message details

    return conversations;
  } catch (error) {
    throw new Error("Error while fetching conversations: " + error.message);
  }
};


/**
 * Get all messages for a particular conversation.
 * @param {string} conversationId - The ID of the conversation.
 * @param {number} [page=1] - The page number for pagination (default: 1).
 * @param {number} [limit=20] - The number of messages per page (default: 20).
 * @returns {Promise<Object>} - An object containing the messages and pagination details.
 */
export const getMessagesByConversationIdService = async (myId, conversationId, page = 1, limit = 20) => {
  try {
    // Validate conversationId
    if (!conversationId?.trim()) {
      throw new ApiError(400, "Conversation ID is required.");
    }

    // Calculate the number of documents to skip (for pagination)
    const skip = (page - 1) * limit;

    // Find all messages for the conversation, sorted by createdAt (newest first)
    const messages = await Message.find({ senderId: myId, conversationId })
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


export const createGroupChatService = async (creatorId, members, groupName) => {
  try {
    if (!creatorId || !members || members.length > 2) {
      throw new ApiError(400, "Creator ID and at least two members are required.");
    }

    const groupChat = await Conversation.create({
      members: [creatorId, ...members],
      isGroup: true,
      groupName,
    });

    return groupChat;
  } catch (error) {
    throw error;
  }
};