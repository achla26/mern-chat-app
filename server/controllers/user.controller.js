import { asyncHandler } from "../utils/asyncHandler.js"; 
import ErrorValidation from "../utils/ErrorValidation.js";
import { 
  getAllUsersService, 
  getUserByIdService,
  updateUserService,
  searchUsersService
} from "../services/user.service.js";
import { ApiResponse } from "../utils/ApiResponse.js"; 

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
 
export const getCurrentUser = asyncHandler(async (req, res, next) => {
  const userId = req.user._id;
  const user=  await getUserByIdService(userId);

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

export const getUserById = asyncHandler(async (req, res, next) => {
  const userId = req.user._id;
  const user=  await getUserByIdService(userId);

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

//TO DO
export const updateUser = asyncHandler(async (req, res, next) => {
  const userId = req.user._id;
  // const user=  await updateUserService(userId);

  return res
  .status(201)
  .json(
    new ApiResponse(
      201,
      {},
      "User Profile get successfully"
    )
  );
}); 

export const searchUsers = asyncHandler(async (req, res, next) => {
  const userId = req.user._id;
  // const user=  await searchUsersService(userId);

  return res
  .status(201)
  .json(
    new ApiResponse(
      201,
      {},
      "User Profile get successfully"
    )
  );
}); 

