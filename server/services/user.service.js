import { User } from "../models/user.model.js";
import { ApiError } from "../utils/ApiError.js";
import {
  sendVerificationEmail,
  OTPAttempt,
  sendPasswordResetEmail,
  sendResetSuccessEmail,
} from "../mail/emails.js";
import { generateToken } from "../utils/generateToken.js";
import crypto from "crypto";
export const signUpService = async (name, email, password) => {
  try {
    if ([name, email, password].some((field) => !field?.trim())) {
      throw new ApiError(400, "All fields are required.");
    }

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      throw new ApiError(409, "User with this email already exists.");
    }

    // const avatarLocalPath = req.files?.avatar[0]?.path;
    // if(avatarLocalPath){
    //     const avatar = await uploadOnCloudinary(avatarLocalPath);
    //     if(!avatar){
    //         throw new ApiError(400 , "Avatar file is required")
    //    }
    // }

    const userData = {
      name,
      email,
      password,
      verificationCodeExpiresAt: Date.now() + 10 * 60 * 1000, // 24 hours
    };

    const user = await User.create(userData);

    const verificationCode = await user.generateVerificationCode();

    await user.save();

    if (await OTPAttempt(user)) {
      //await sendVerificationEmail(user.email , verificationCode);  # TO DO : UNCOMMENT IN PRODUCTION
    } else {
      throw new ApiError(500, "Too many attempts, please try again later.");
    }
    return user;
  } catch (error) {
    throw error;
  }
};

export const verifyOTPService = async (email, otp , res) => {
  try {
    if ([otp, email].some((field) => !field?.trim())) {
      throw new ApiError(400, "All fields are required.");
    }
    let user = await User.findOne({ email, isVerified: false });

    if (!user) {
      throw new ApiError(400, "User Not Found");
    }

    if (user.verificationCode !== Number(otp)) {
      throw new ApiError(400, "Invalid OTP.");
    }

    const currentTime = Date.now();

    const verificationCodeExpiresAt = new Date(
      user.verificationCodeExpiresAt
    ).getTime();

    if (currentTime > verificationCodeExpiresAt) {
      throw new ApiError(400, "OTP Expired.");
    }

    const { token } = await generateToken(user._id , res);

    user.isVerified = true;
    user.verificationCode = null;
    user.verificationCodeExpiresAtsAt = null;
    user.token = token;

    user = await user.save({ validateModifiedOnly: true });

    return { user, token };
  } catch (error) {
    throw error;
  }
};

export const signInService = async (email, password , res) => {
  try {
    if ([email, password].some((field) => !field?.trim())) {
      throw new ApiError(400, "All fields are required.");
    }

    const user = await User.findOne({ email }).select("+password");

    if (!user) {
      throw new ApiError(400, "User does not exist.");
    }

    if (!user.isVerified) {
      throw new ApiError(400, "User is not verified.");
    }

    const isPasswordValid = await user.comparePassword(password);

    if (!isPasswordValid) {
      throw new ApiError(401, "Invalid User Credentials.");
    }

    const { token } = await generateToken(user._id , res );

    user.lastLogin = new Date();
    await user.save();

    return { user, token };
  } catch (error) {
    throw error;
  }
};

export const resendOtpService = async (email) => {
  try {
    if ([email].some((field) => !field?.trim())) {
      throw new ApiError(400, "All fields are required.");
    }

    const user = await User.findOne({ email });

    if (!user) {
      throw new ApiError(409, "User does not exists.");
    }

    const verificationCode = await user.generateVerificationCode();

    user.verificationCode = verificationCode;
    user.verificationCodeExpiresAtsAt = Date.now() + 10 * 60 * 1000;

    await user.save({ validateModifiedOnly: true });

    if (await OTPAttempt(user)) {
      //await sendVerificationEmail(user.email , verificationCode);  # TO DO : UNCOMMENT IN PRODUCTION
    } else {
      throw new ApiError(500, "Too many attempts, please try again later.");
    }
    return user;
  } catch (error) {
    throw error;
  }
};

export const getAllUsersService = async (userId) => {
  try {
    const users = await User.find({
      _id: { $ne: userId },
    }).select("-password -refreshToken");
    if (!users) {
      throw new ApiError(500, "Error while fetching users.");
    }
    return users;
  } catch (error) {
    throw error;
  }
};

export const forgotPasswordService = async (email) => {
  try {
    if ([email].some((field) => !field?.trim())) {
      throw new ApiError(400, "All fields are required.");
    }

    const user = await User.findOne({ email, isVerified: true });

    if (!user) {
      throw new ApiError(400, "User does not exist.");
    }

    const resetToken = user.generateResetPasswordToken();
    await user.save({ validateBeforeSave: false });
    const resetPasswordUrl = `${process.env.FRONTEND_URL}/reset-password/${resetToken}`;

    // await sendPasswordResetEmail(user.email , `${resetPasswordUrl}`);  // TO DO : UNCOMMENT IN PRODUCTION

    return { resetPasswordUrl };
  } catch (error) {
    throw error;
  }
};

export const resetPasswordService = async (token,password,confirmPassword) => {
  try {
    if ([token, password, confirmPassword].some((field) => !field?.trim())) {
      throw new ApiError(400, "All fields are required.");
    }  

    const passwordToken = crypto.createHash("sha256").update(token).digest("hex");

    const user = await User.findOne({
      resetPasswordToken: passwordToken,
      resetPasswordExpiresAt: { $gt: Date.now() },
    }); 

    if (!user) {
      throw new ApiError(400, "Reset token is invalid or has been expired.");
    }

    if (password !== confirmPassword) {
      throw new ApiError(400, "Password & confirm password do not match.");
    }

    user.password = password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpiresAt = undefined;
    await user.save();

    // await sendResetSuccessEmail(user.email);  // TO DO : UNCOMMENT IN PRODUCTION

    return true;
  } catch (error) {
    throw error;
  }
};

export const getProfileService = async (userId) => {
  try{
    const profile = await User.findById(userId); 
    return profile;
  }catch (error) {
    throw error;
  }
};