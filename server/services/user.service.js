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
export const getProfileService = async (userId) => {
  try {
    const profile = await User.findById(userId);
    return profile;
  } catch (error) {
    throw error;
  }
};
