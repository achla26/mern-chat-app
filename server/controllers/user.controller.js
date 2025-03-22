import { asyncHandler } from "../utils/asyncHandler.js"; 
import ErrorValidation from "../utils/ErrorValidation.js";
import { 
  getAllUsersService, 
  getProfileService
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