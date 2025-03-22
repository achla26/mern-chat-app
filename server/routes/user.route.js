import { Router } from "express"; 
import { getAllUsers, getUserProfile } from "../controllers/user.controller.js";
import { isUserAuthenticated } from "../middlewares/auth.middleware.js";

const router = Router();

router.get("/profile", isUserAuthenticated, getUserProfile);
router.get("/all", isUserAuthenticated, getAllUsers);

// PATCH /users/:userId → Update user profile #TO DO

// DELETE /users/:userId → Delete user account  #TO DO

export default router;
