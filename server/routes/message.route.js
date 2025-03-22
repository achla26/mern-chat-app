import express from "express";
import { body } from "express-validator";
import {
  sendMessage,
  getUserChats,
  getUserConversation,
  createGroupChat,
} from "../controllers/message.controller.js";
import { isUserAuthenticated } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.post(
  "/send",
  [
    body("receiverIds")
      .isArray({ min: 1 })
      .withMessage("Receiver IDs must be an array with at least one user ID"),
    body("message").notEmpty().withMessage("Message is required"),
  ],

  isUserAuthenticated,
  sendMessage
);

router.post("/chats", isUserAuthenticated, getUserChats);
router.get(
  "/conversation/:conversationId",
  isUserAuthenticated,
  getUserConversation
);

router.post(
  "/create-group",
  [
    body("receiverIds")
      .isArray({ min: 2 })
      .withMessage("Receiver IDs must be an array with at least two user ID"), 
    body("groupName").notEmpty().withMessage("Group Name is required"),
  ],
  isUserAuthenticated,
  createGroupChat
);

export default router;
