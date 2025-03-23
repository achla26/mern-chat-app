import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { 
  createGroupService,
  addMemberToGroupService,
  removeMemberFromGroupService,
  renameGroupService,
} from "../services/group.service.js";

/**
 * get group .
 */
export const getGroupMembers = asyncHandler(async (req, res) => {
  const creatorId = req.user._id; // Get the authenticated user's ID
  const { members, groupName } = req.body; // Get members and group name from the request body

  // const group = await createGroupService(creatorId, members, groupName);

  return res
    .status(201)
    .json(new ApiResponse(201, {  }, "Group chat created successfully."));
});

/**
 * Create a new group chat.
 */
export const createGroup = asyncHandler(async (req, res) => {
  const creatorId = req.user._id; // Get the authenticated user's ID
  const { members, groupName } = req.body; // Get members and group name from the request body

  const group = await createGroupService(creatorId, members, groupName);

  return res
    .status(201)
    .json(new ApiResponse(201, { group }, "Group chat created successfully."));
});

/**
 * Add a member to a group chat.
 */
export const addMemberToGroup = asyncHandler(async (req, res) => {
  const { chatId } = req.params; // Get the chat ID from the request params
  const { memberId } = req.body; // Get the member ID from the request body

  const updatedChat = await addMemberToGroupService(chatId, memberId);

  return res
    .status(200)
    .json(
      new ApiResponse(200, { updatedChat }, "Member added to group successfully.")
    );
});

/**
 * Remove a member from a group chat.
 */
export const removeMemberFromGroup = asyncHandler(async (req, res) => {
  const { chatId } = req.params; // Get the chat ID from the request params
  const { memberId } = req.body; // Get the member ID from the request body

  const updatedChat = await removeMemberFromGroupService(chatId, memberId);

  return res
    .status(200)
    .json(
      new ApiResponse(200, { updatedChat }, "Member removed from group successfully.")
    );
});

/**
 * Rename a group chat.
 */
export const renameGroup = asyncHandler(async (req, res) => {
  const { chatId } = req.params; // Get the chat ID from the request params
  const { groupName } = req.body; // Get the new group name from the request body

  const updatedChat = await renameGroupService(chatId, groupName);

  return res
    .status(200)
    .json(
      new ApiResponse(200, { updatedChat }, "Group chat renamed successfully.")
    );
});