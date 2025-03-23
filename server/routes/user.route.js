import { Router } from "express";
import {
  getCurrentUser,
  getUserById,
  updateUser,
  searchUsers,
  getAllUsers,
  getUserProfile,
} from "../controllers/user.controller.js";
import { isUserAuthenticated } from "../middlewares/auth.middleware.js";

const router = Router();

router.get("/me", isUserAuthenticated, getCurrentUser); // Get current user's profile
router.get("/all", isUserAuthenticated, getAllUsers);
router.get("/:userId", isUserAuthenticated, getUserById); // Get a specific user's profile
router.put("/update", isUserAuthenticated, updateUser); // Update current user's profile
router.get("/search", isUserAuthenticated, searchUsers); // Search for users

// PATCH /users/:userId → Update user profile #TO DO

// DELETE /users/:userId → Delete user account  #TO DO

export default router;
