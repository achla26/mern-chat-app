import { asyncHandler } from "../utils/asyncHandler.js"; 
import ErrorValidation from "../utils/ErrorValidation.js";
import { 
  getAllUsersService, 
  getUserByIdService,
  updateUserService,
  searchUsersService,
  updateUserProfileService,
  deleteUserAccountService
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
 
/**
 * @route   PUT /api/v1/users/update
 * @desc    Update the current user's profile
 * @access  Private
 */
export const updateUser = asyncHandler(async (req, res) => {
  const userId = req.user._id; // Get the authenticated user's ID
  const updateData = req.body; // Get the update data from the request body

  const updatedUser = await updateUserService(userId, updateData);

  return res
    .status(200)
    .json(new ApiResponse(200, { updatedUser }, "User profile updated successfully."));
});

/**
 * @route   GET /api/v1/users/search
 * @desc    Search for users by name or username
 * @access  Private
 */
export const searchUsers = asyncHandler(async (req, res) => {
  const { query } = req.query; // Get the search query from the request query

  const users = await searchUsersService(query);

  return res
    .status(200)
    .json(new ApiResponse(200, { users }, "Users fetched successfully."));
});

/**
 * @route   PATCH /api/v1/users/:userId
 * @desc    Update a user's profile by ID
 * @access  Private
 */
export const updateUserProfile = asyncHandler(async (req, res) => {
  const { userId } = req.params; // Get the user ID from the request params
  const updateData = req.body; // Get the update data from the request body

  const updatedUser = await updateUserProfileService(userId, updateData);

  return res
    .status(200)
    .json(new ApiResponse(200, { updatedUser }, "User profile updated successfully."));
});

/**
 * @route   DELETE /api/v1/users/:userId
 * @desc    Delete a user account by ID
 * @access  Private
 */
export const deleteUserAccount = asyncHandler(async (req, res) => {
  const { userId } = req.params; // Get the user ID from the request params

  await deleteUserAccountService(userId);

  return res
    .status(200)
    .json(new ApiResponse(200, {}, "User account deleted successfully."));
});