import { asyncHandler } from "../utils/asyncHandler.js";
// import { ApiError } from "../utils/ApiError.js";
import ErrorValidation from "../utils/ErrorValidation.js";
import {
  signUpService,
  verifyOTPService,
  signInService,
  getAllUsersService,
  resendOtpService,
  forgotPasswordService,
  resetPasswordService,
  getProfileService
} from "../services/user.service.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { generateTokens } from "../utils/generateToken.js";
import jwt from "jsonwebtoken";

export const registerUser = asyncHandler(async (req, res, next) => {
  ErrorValidation(req);

  const { fullName, username, email, password , gender } = req.body;

  const newUser = await signUpService(fullName, username, email, password , gender);

  return res
    .status(201)
    .json(
      new ApiResponse(201, { user: newUser }, "User registered successfully.")
    );
});

export const verifyOTP = asyncHandler(async (req, res, next) => {
  ErrorValidation(req);

  const { email, otp } = req.body;

  const { token, user } = await verifyOTPService(email, otp , res);

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
  const { accessToken, user } = await signInService(identifier, password , res ); 

  return res
    .status(201) 
    .json(new ApiResponse(201, { user , accessToken}, "User Login successfully."));
});

export const logoutUser = asyncHandler(async (req, res) => {
  return res
    .status(200)
    .clearCookie("accessToken")
    .clearCookie("refreshToken")
    .json(new ApiResponse(200, "User Logged Out successfully"));
});

export const getAllUsers = asyncHandler(async (req, res) => {
  
  const userId = req.user?._id;
  if (!userId) {
    throw new ApiError(401, "Unauthorized: User ID not found.");
  }
  const allUsers = await getAllUsersService(userId);

  return res
    .status(200)
    .json(new ApiResponse(200, allUsers, "All Users fetched successfully"));
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
      .json(
        new ApiResponse(
          201,
          {},
          "Password reset successfully"
        )
      );
});

export const getUserProfile = asyncHandler(async (req, res, next) => {
  const userId = req.user._id;
  const user=  await getProfileService(userId);

  return res
  .status(201)
  .json(
    new ApiResponse(
      201,
      {user},
      "User Profile get successfully"
    )
  );
}); 

export const refreshToken = asyncHandler(async (req, res) => {
  try {
    // Extract refresh token from cookies
    const { refreshToken } = req.cookies;
    if (!refreshToken) throw new ApiError(401, "No refresh token provided.");

    // Verify the refresh token
    const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_TOKEN_SECRET);
    if (!decoded?.userId) throw new ApiError(403, "Invalid refresh token.");

    // Use the userId from the decoded refresh token
    const { accessToken, refreshToken: newRefreshToken } = await generateTokens(decoded.userId, res);

    // Return the new access token and optionally the new refresh token
    res.json({ accessToken });

  } catch (error) {
    res.status(error.statusCode || 500).json({ message: error.message });
  }
});
