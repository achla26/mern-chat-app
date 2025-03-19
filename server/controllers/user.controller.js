import { asyncHandler } from "../utils/asyncHandler.js";
// import { ApiError } from "../utils/ApiError.js";
import ErrorValidation from "../utils/ErrorValidation.js";
import {
  signUpService,
  verifyOTPService,
  signInService, 
  getAllUsersService,
  resendOtpService
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

  const { token, user, options } = await verifyOTPService(email, otp);

  return res
    .status(201)
    .cookie("token", token, options)
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

  const  { token, user, options }  = await signInService(email, password); 

  return res
    .status(201)
    .cookie("token", token, options)
    .json(new ApiResponse(201, { token, user }, "User Login successfully."));
});

export const getUserProfile = asyncHandler(async (req, res) => {
  return res
    .status(200)
    .json(new ApiResponse(200, allUsers, "User fetched successfully"));
});

export const logoutUser = asyncHandler(async (req, res) => {
  const token =  req.cookies.token || req.headers.authorization?.replace("Bearer ", ""); 
 

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
