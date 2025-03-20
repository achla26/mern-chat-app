import { asyncHandler } from "../utils/asyncHandler.js";
import ErrorValidation from "../utils/ErrorValidation.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import {
  sendMessageService,
  getUserChatsService,
  getMessagesByConversationIdService,
  createGroupChatService
} from "../services/message.service.js";

export const sendMessage = asyncHandler(async (req, res, next) => {
  // Extract senderId from authenticated user
  const senderId = req.user._id; 
  const { receiverIds, message } = req.body;  
  const conversation = await sendMessageService(senderId, receiverIds, message);
 
  return res
    .status(201)
    .json(new ApiResponse(201, { conversation }, "Message sent successfully"));
});



export const getUserChats = asyncHandler(async (req, res, next) => {
  const myId = req.user._id; 

  const chats = await getUserChatsService(myId);

  return res
    .status(201)
    .json(new ApiResponse(201, { chats }, "Conversation get Successfully."));
});

export const getUserConversation = asyncHandler(async (req, res, next) => {
  const myId = req.user._id; 
  const conversationId = req.params.conversationId;
  const page = 1; // Page number (default: 1)
  const limit = 10; // Number of messages per page (default: 20)
  
  const conversation = await getMessagesByConversationIdService(myId, conversationId, page, limit);

  return res
    .status(201)
    .json(new ApiResponse(201, { conversation }, "Conversation get Successfully."));
});


export const createGroupChat = asyncHandler(async (req, res, next) => {
  const creatorId = req.user._id; 
  const { receiverIds , groupName} = req.body;  

  const group = await createGroupChatService(
    creatorId,
    receiverIds,
    groupName
  );

  return res
    .status(201)
    .json(new ApiResponse(201, { group }, "Group Created Successfully."));
});
