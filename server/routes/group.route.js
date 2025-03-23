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

router.get("/:chatId/members", isUserAuthenticated, getGroupMembers);  

/**
 * @route   POST /api/v1/groups
 * @desc    Create a new group chat
 * @access  Private
 */
router.post("/", isUserAuthenticated, createGroup);

/**
 * @route   POST /api/v1/group/:chatId/members
 * @desc    Add a member to a group chat
 * @access  Private
 */
router.post("/:chatId/members", isUserAuthenticated, addMemberToGroup);

/**
 * @route   DELETE /api/v1/group/:chatId/members/:memberId
 * @desc    Remove a member from a group chat
 * @access  Private
 */
router.delete(
  "/:chatId/members/:memberId",
  isUserAuthenticated,
  removeMemberFromGroup
);

/**
 * @route   PUT /api/v1/groups/:chatId/rename
 * @desc    Rename a group chat
 * @access  Private
 */
router.put("/:chatId/rename", isUserAuthenticated, renameGroup);

export default router;