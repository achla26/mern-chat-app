import {
  PASSWORD_RESET_REQUEST_TEMPLATE,
  PASSWORD_RESET_SUCCESS_TEMPLATE,
  VERIFICATION_EMAIL_TEMPLATE,
} from "./emailTemplates.js";
import { mailClient, sender } from "./mail.config.js";
import { ApiError } from "../utils/ApiError.js";

// Utility function to check OTP attempts
export const OTPAttempt = (user) => {
  const MAX_ATTEMPTS = 3;
  const LOCK_TIME = 60 * 60 * 1000; // 1 hour in milliseconds

  const currentTime = new Date();

  user.otpAttempts.count += 1;
  user.otpAttempts.lastAttempt = currentTime;

  const timeSinceLastAttempt =
    currentTime - new Date(user.otpAttempts.lastAttempt);

  if (
    user.otpAttempts.count >= MAX_ATTEMPTS &&
    timeSinceLastAttempt < LOCK_TIME
  ) {
    return false; // Exceeded attempts within the lock time
  } else if (timeSinceLastAttempt >= LOCK_TIME) {
    user.otpAttempts.count = 0; // Reset attempts after 1 hour
  }
  user.save();

  return true; // Proceed with OTP sending
};

export const sendVerificationEmail = async (email, verificationToken) => {
  try {
    const htmlContent = VERIFICATION_EMAIL_TEMPLATE.replace(
      "{verificationCode}",
      verificationToken
    );

    let info = await mailClient.sendMail({
      from: sender,
      to: email,
      subject: "Verify Your Email",
      html: htmlContent,
    });
    console.log("Email sent successfully:", info.messageId);
  } catch (error) {
    console.error("Error sending verification email:", error);
    throw new ApiError(
      500,
      `Error sending verification email: ${error.message}`
    );
  }
}; 
export const sendPasswordResetEmail = async (email, resetURL) => {
  try {
    const htmlContent = PASSWORD_RESET_REQUEST_TEMPLATE.replace(
      "{resetURL}",
      resetURL
    );

    let info = await mailClient.sendMail({
      from: sender,
      to: email,
      subject: "Reset your password",
      html: htmlContent,
      // category: "Password Reset",
    });
    console.log("Email sent successfully:", info.messageId);
  } catch (error) {
    console.error("Error sending verification email:", error);
    throw new ApiError(
      500,
      `Error sending password reset email: ${error.message}`
    );
  }
};

export const sendResetSuccessEmail = async (email) => {
  try {
    const htmlContent = PASSWORD_RESET_SUCCESS_TEMPLATE;

    let info = await mailClient.sendMail({
      from: sender,
      to: email,
      subject: "Password Reset Successful",
      html: htmlContent, 
    });
    console.log("Password reset email sent successfully", info.messageId);
  } catch (error) { 
    throw new ApiError(
      500,
      `Error sending password reset success email: ${error.message}`
    );
  }
};
