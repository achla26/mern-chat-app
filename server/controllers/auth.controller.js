import { asyncHandler } from "../utils/asyncHandler.js"; 
import ErrorValidation from "../utils/ErrorValidation.js";
import {
  signUpService,
  verifyOTPService,
  signInService,
  resendOtpService,
  forgotPasswordService,
  resetPasswordService,
  refreshTokenService,
} from "../services/auth.service.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { generateTokens } from "../utils/generateToken.js";
import jwt from "jsonwebtoken";

export const registerUser = asyncHandler(async (req, res, next) => {
  ErrorValidation(req);

  const { fullName, username, email, password, gender } = req.body;

  const newUser = await signUpService(
    fullName,
    username,
    email,
    password,
    gender
  );

  return res
    .status(201)
    .json(
      new ApiResponse(201, { user: newUser }, "User registered successfully.")
    );
});

export const verifyOTP = asyncHandler(async (req, res, next) => {
  ErrorValidation(req);

  const { email, otp } = req.body;

  const { token, user } = await verifyOTPService(email, otp, res);

  return res
    .status(201)
    .json(new ApiResponse(201, { token, user }, "User Login successfully."));
});

export const resendOTP = asyncHandler(async (req, res, next) => {
  ErrorValidation(req);

  const { email } = req.body;

  const data = await resendOtpService(email);

  return res
    .status(201)
    .json(new ApiResponse(201, { data }, "Otp Sent successfully."));
});

export const loginUser = asyncHandler(async (req, res) => {
  const { identifier, password } = req.body;

  ErrorValidation(req);
  const { accessToken, user } = await signInService(identifier, password, res);

  return res
    .status(201)
    .json(
      new ApiResponse(201, { user, accessToken }, "User Login successfully.")
    );
});

export const logoutUser = asyncHandler(async (req, res) => {
  return res
    .status(200)
    .clearCookie("accessToken")
    .clearCookie("refreshToken")
    .json(new ApiResponse(200, "User Logged Out successfully"));
});

export const forgotPassword = asyncHandler(async (req, res, next) => {
  const { email } = req.body;

  ErrorValidation(req);

  const { resetPasswordUrl } = await forgotPasswordService(email);
  return res
    .status(201)
    .json(
      new ApiResponse(
        201,
        { resetPasswordUrl },
        "Password reset link sent to your email"
      )
    );
});

export const resetPassword = asyncHandler(async (req, res, next) => {
  const { password, confirmPassword } = req.body;
  const { token } = req.params;

  ErrorValidation(req);

  if (await resetPasswordService(token, password, confirmPassword))
    return res
      .status(201)
      .json(new ApiResponse(201, {}, "Password reset successfully"));
});

export const refreshToken = asyncHandler(async (req, res) => {
  const { refreshToken } = req.cookies;
  const { accessToken } = await refreshTokenService(refreshToken);
  if (accessToken)
    return res
      .status(201)
      .json(
        new ApiResponse(201, { accessToken }, "Token Refresh successfully")
      );
});
