import { Router } from "express";
import {
  getCurrentUser,
  getUserById,
  updateUser,
  searchUsers,
  getAllUsers,
  updateUserProfile,
  deleteUserAccount,
} from "../controllers/user.controller.js";
import { isUserAuthenticated } from "../middlewares/auth.middleware.js";

const router = Router();

router.get("/me", isUserAuthenticated, getCurrentUser); // Get current user's profile
router.get("/all", isUserAuthenticated, getAllUsers);
router.get("/:userId", isUserAuthenticated, getUserById); // Get a specific user's profile
router.put("/update", isUserAuthenticated, updateUser); // Update current user's profile
router.get("/search", isUserAuthenticated, searchUsers); // Search for users
router.patch("/:userId", isUserAuthenticated, updateUserProfile); // Update user profile by ID
router.delete("/:userId", isUserAuthenticated, deleteUserAccount); // Delete user account by ID

export default router;
