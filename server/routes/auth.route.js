import { Router } from "express";

import {
  registerUser,
  verifyOTP,
  loginUser,
  resendOTP,
  forgotPassword,
  resetPassword,
  logoutUser,
  refreshToken,
} from "../controllers/auth.controller.js";
import { isUserAuthenticated } from "../middlewares/auth.middleware.js";
import {
  registerUserValidation,
  emailVerifyValidation,
  resndOtpValidation,
  loginValidation,
  forgotPasswordValidation,
  resetPasswordValidation,
} from "../utils/Validator.js";
const router = Router();

router.post("/register", registerUserValidation, registerUser);

router.post("/email-verify", emailVerifyValidation, verifyOTP);

router.post("/resend-otp", resndOtpValidation, resendOTP);

router.post("/login", loginValidation, loginUser);

router.post("/forgot-password", forgotPasswordValidation, forgotPassword);

router.post("/reset-password/:token", resetPasswordValidation, resetPassword);

router.post("/logout", isUserAuthenticated, logoutUser);
router.get("/refresh", refreshToken);

export default router;
