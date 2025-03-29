import { Router } from "express";
import {
  getGroupMembers,
  addMemberToGroup,
  removeMemberFromGroup,
  renameGroup,
  createGroup,
} from "../controllers/group.controller.js";
import { isUserAuthenticated } from "../middlewares/auth.middleware.js";

const router = Router();

/**
 * @route   GET /api/v1/groups
 * @desc    Create a new group chat
 * @access  Private
 */

router.get("/:conversationId/members", isUserAuthenticated, getGroupMembers);  

/**
 * @route   POST /api/v1/groups
 * @desc    Create a new group chat
 * @access  Private
 */
router.post("/", isUserAuthenticated, createGroup);

/**
 * @route   POST /api/v1/group/:conversationId/members
 * @desc    Add a member to a group chat
 * @access  Private
 */
router.post("/:conversationId/members", isUserAuthenticated, addMemberToGroup);

/**
 * @route   DELETE /api/v1/group/:conversationId/members/:memberId
 * @desc    Remove a member from a group chat
 * @access  Private
 */
router.delete(
  "/:conversationId/members/:memberId",
  isUserAuthenticated,
  removeMemberFromGroup
);

/**
 * @route   PUT /api/v1/groups/:conversationId/rename
 * @desc    Rename a group chat
 * @access  Private
 */
router.put("/:conversationId/rename", isUserAuthenticated, renameGroup);

export default router;