import { User } from "../models/user.model.js";
import { ApiError } from "../utils/ApiError.js";
 
export const getAllUsersService = async (userId) => {
  try {
    const users = await User.find({ _id: { $ne: userId } })
      .select("fullName username profilePicture")
      .lean(); 

    if (!users) {
      throw new ApiError(500, "Error while fetching users.");
    }
    return users;
  } catch (error) {
    throw error;
  }
}; 
export const getUserByIdService = async (userId) => {
  try {
    const user = await User.findById(userId);
    return user;
  } catch (error) {
    throw error;
  }
}; 

/**
 * Update the current user's profile.
 * @param {string} userId - The ID of the user.
 * @param {Object} updateData - The data to update (e.g., { fullName, email, avatar }).
 * @returns {Promise<Object>} - The updated user.
 */
export const updateUserService = async (userId, updateData) => {
  try {
    const user = await User.findByIdAndUpdate(
      userId,
      { $set: updateData }, // Update only the provided fields
      { new: true } // Return the updated document
    ).select("-password"); // Exclude the password field

    if (!user) {
      throw new ApiError(404, "User not found.");
    }

    return user;
  } catch (error) {
    throw new ApiError(500, "Error while updating user profile.");
  }
};

/**
 * Search for users by name or username.
 * @param {string} query - The search query.
 * @returns {Promise<Array>} - The list of matching users.
 */
export const searchUsersService = async (query) => {
  try {
    const users = await User.find({
      $or: [
        { fullName: { $regex: query, $options: "i" } }, // Case-insensitive search
        { username: { $regex: query, $options: "i" } }, // Case-insensitive search
      ],
    }).select("-password"); // Exclude the password field

    return users;
  } catch (error) {
    throw new ApiError(500, "Error while searching for users.");
  }
};

/**
 * Update a user's profile by ID.
 * @param {string} userId - The ID of the user to update.
 * @param {Object} updateData - The data to update (e.g., { fullName, email, avatar }).
 * @returns {Promise<Object>} - The updated user.
 */
export const updateUserProfileService = async (userId, updateData) => {
  try {
    const user = await User.findByIdAndUpdate(
      userId,
      { $set: updateData }, // Update only the provided fields
      { new: true } // Return the updated document
    ).select("-password"); // Exclude the password field

    if (!user) {
      throw new ApiError(404, "User not found.");
    }

    return user;
  } catch (error) {
    throw new ApiError(500, "Error while updating user profile.");
  }
};

/**
 * Delete a user account by ID.
 * @param {string} userId - The ID of the user to delete.
 * @returns {Promise<void>}
 */
export const deleteUserAccountService = async (userId) => {
  try {
    const user = await User.findByIdAndDelete(userId);

    if (!user) {
      throw new ApiError(404, "User not found.");
    }
  } catch (error) {
    throw new ApiError(500, "Error while deleting user account.");
  }
};