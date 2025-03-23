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

export const updateUserService = async (userId) => {
  try {
    const user = await User.findById(userId);
    return user;
  } catch (error) {
    throw error;
  }
};

export const searchUsersService = async (userId) => {
  try {
    const user = await User.findById(userId);
    return user;
  } catch (error) {
    throw error;
  }
};
