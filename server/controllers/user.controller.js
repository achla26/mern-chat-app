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

export const registerUser = asyncHandler(async (req, res, next) => {
  ErrorValidation(req);

  const { name, email, password } = req.body;

  const newUser = await signUpService(name, email, password);

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
  const { email, password } = req.body;

  ErrorValidation(req);
  const { token, user } = await signInService(email, password , res ); 

  return res
    .status(201) 
    .json(new ApiResponse(201, { user }, "User Login successfully."));
});

export const logoutUser = asyncHandler(async (req, res) => {
  const token =
    req.cookies.token || req.headers.authorization?.replace("Bearer ", "");

  return res
    .status(200)
    .clearCookie("token")
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
  const profile=  await getProfileService(userId);

  return res
  .status(201)
  .json(
    new ApiResponse(
      201,
      {profile},
      "Password reset successfully"
    )
  );
}); 