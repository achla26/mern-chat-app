import { Router } from "express";
import { body } from "express-validator";
import validator from "validator";
import {
  registerUser,
  verifyOTP,
  loginUser,
  resendOTP,
  forgotPassword,
  resetPassword,
  getUserProfile,
  logoutUser,
  getAllUsers,
} from "../controllers/user.controller.js";
import { isUserAuthenticated } from "../middlewares/auth.middleware.js";

const router = Router();

router.post(
  "/register",
  [
    body("fullName").notEmpty().trim().withMessage("Name is required"), 
    body("email").isEmail().trim().withMessage("Enter Valid Email"),
    body("username").notEmpty().trim().withMessage("Username is required"),
    body("gender").notEmpty().trim().withMessage("Gender is required"),
    body("password")
      .isLength({ min: 6 })
      .withMessage("Password must be at least 6 characters long"),
  ],
  registerUser
);

router.post(
  "/email-verify",
  [
    body("otp").notEmpty().trim().withMessage("OTP is required"),
    body("email").isEmail().trim().withMessage("Enter Valid Email"),
  ],
  verifyOTP
);

router.post(
  "/resend-otp",
  [body("email").isEmail().trim().withMessage("Enter Valid Email")],
  resendOTP
);

router.post(
  "/login",
  [
    body("identifier")
      .trim()
      .notEmpty()
      .withMessage("Email or username is required.")
      .custom((value) => {
        const isEmail = validator.isEmail(value); // Check if it's a valid email
        const isUsername = /^[a-zA-Z0-9_]+$/.test(value); // Check if it's a valid username (alphanumeric + underscores)
        if (!isEmail && !isUsername) {
          throw new Error("Invalid email or username format.");
        }
        return true;
      }),
    body("password")
      .isLength({ min: 6 })
      .withMessage("Password must be at least 6 characters long."),
  ],
  loginUser
);

router.post(
  "/forgot-password",
  [body("email").isEmail().trim().withMessage("Invalid Email")],
  forgotPassword
);

router.post(
  "/reset-password/:token",
  [
    body("password")
    .notEmpty()
    .withMessage("Password is required")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters long"),
  body("confirmPassword")
    .notEmpty()
    .withMessage("Confirm Password is required")
    .custom((value, { req }) => value === req.body.password)
    .withMessage("Passwords do not match"), 
  ],
  resetPassword
);

router.get("/profile", isUserAuthenticated, getUserProfile);
router.get("/logout", isUserAuthenticated, logoutUser);

router.get("/all", isUserAuthenticated, getAllUsers);

export default router;
