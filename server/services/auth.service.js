import { User } from "../models/user.model.js";
import { ApiError } from "../utils/ApiError.js";
import {
  sendVerificationEmail,
  OTPAttempt,
  sendPasswordResetEmail,
  sendResetSuccessEmail,
} from "../mail/emails.js";
import { generateTokens } from "../utils/generateToken.js";
import crypto from "crypto";

// Utility function to validate required fields
const validateFields = (fields, errorMessage) => {
  if (fields.some((field) => !field?.trim())) {
    throw new ApiError(400, errorMessage);
  }
};

export const signUpService = async (
  fullName,
  username,
  email,
  password,
  gender
) => {
  try {
    validateFields([fullName, username, email, password, gender], "All fields are required.");

    const [existingUserByEmail, existingUserByUsername] = await Promise.all([
      User.findOne({ email }),
      User.findOne({ username }),
    ]);

    if (existingUserByEmail) {
      throw new ApiError(409, "User with this email already exists.");
    }

    if (existingUserByUsername) {
      throw new ApiError(409, "User with this username already exists.");
    }

    const userData = {
      fullName: fullName.trim(),
      username: username.trim(),
      email: email.trim(),
      password,
      gender,
      verificationCodeExpiresAt: Date.now() + 10 * 60 * 1000, // 10 minutes
    };

    const user = await User.create(userData);
    const verificationCode = await user.generateVerificationCode();

    await user.save();

    if (await OTPAttempt(user)) {
      // await sendVerificationEmail(user.email, verificationCode);  // TO DO: UNCOMMENT IN PRODUCTION
    } else {
      throw new ApiError(500, "Too many attempts, please try again later.");
    }

    return user;
  } catch (error) {
    throw error;
  }
};

export const verifyOTPService = async (email, otp, res) => {
  try {
    validateFields([otp, email], "All fields are required.");

    const user = await User.findOne({ email, isVerified: false });

    if (!user) {
      throw new ApiError(400, "User Not Found");
    }

    if (user.verificationCode !== Number(otp)) {
      throw new ApiError(400, "Invalid OTP.");
    }

    if (Date.now() > new Date(user.verificationCodeExpiresAt).getTime()) {
      throw new ApiError(400, "OTP Expired.");
    }

    const { accessToken } = await generateTokens(user._id, res);

    Object.assign(user, {
      isVerified: true,
      verificationCode: null,
      verificationCodeExpiresAt: null,
      accessToken,
    });

    await user.save({ validateModifiedOnly: true });

    return { user, accessToken };
  } catch (error) {
    throw error;
  }
};

export const signInService = async (identifier, password, res) => {
  try {
    validateFields([identifier, password], "All fields are required.");

    const user = await User.findOne({
      $or: [{ email: identifier }, { username: identifier }],
    }).select("+password -__v -createdAt -updatedAt");

    if (!user) {
      throw new ApiError(400, "User does not exist.");
    }

    if (!user.isVerified) {
      throw new ApiError(400, "User is not verified.");
    }

    if (!(await user.comparePassword(password))) {
      throw new ApiError(401, "Invalid User Credentials.");
    }

    const { accessToken } = await generateTokens(user._id, res);

    user.lastLogin = new Date();
    await user.save();

    return {
      user: {
        _id: user._id,
        username: user.username,
        email: user.email,
        fullName: user.fullName,
        avatar: user.avatar,
        lastLogin: user.lastLogin,
      },
      accessToken,
    };
  } catch (error) {
    throw error;
  }
};

export const resendOtpService = async (email) => {
  try {
    validateFields([email], "All fields are required.");

    const user = await User.findOne({ email });

    if (!user) {
      throw new ApiError(409, "User does not exist.");
    }

    const verificationCode = await user.generateVerificationCode();

    Object.assign(user, {
      verificationCode,
      verificationCodeExpiresAt: Date.now() + 10 * 60 * 1000,
    });

    await user.save({ validateModifiedOnly: true });

    if (await OTPAttempt(user)) {
      // await sendVerificationEmail(user.email, verificationCode);  // TO DO: UNCOMMENT IN PRODUCTION
    } else {
      throw new ApiError(500, "Too many attempts, please try again later.");
    }

    return user;
  } catch (error) {
    throw error;
  }
};

export const forgotPasswordService = async (email) => {
  try {
    validateFields([email], "All fields are required.");

    const user = await User.findOne({ email, isVerified: true });

    if (!user) {
      throw new ApiError(400, "User does not exist.");
    }

    const resetToken = user.generateResetPasswordToken();
    await user.save({ validateBeforeSave: false });
    const resetPasswordUrl = `${process.env.CLIENT_ORIGIN}/reset-password/${resetToken}`;

    // await sendPasswordResetEmail(user.email, `${resetPasswordUrl}`);  // TO DO: UNCOMMENT IN PRODUCTION

    return { resetPasswordUrl };
  } catch (error) {
    throw error;
  }
};

export const resetPasswordService = async (
  token,
  password,
  confirmPassword
) => {
  try {
    validateFields([token, password, confirmPassword], "All fields are required.");

    const passwordToken = crypto
      .createHash("sha256")
      .update(token)
      .digest("hex");

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

    // await sendResetSuccessEmail(user.email);  // TO DO: UNCOMMENT IN PRODUCTION

    return true;
  } catch (error) {
    throw error;
  }
};

export const refreshTokenService = async (refreshTokenFromCookie) => {
  try {
    if (!refreshTokenFromCookie)
      throw new ApiError(401, "No refresh token provided.");

    const decoded = jwt.verify(
      refreshTokenFromCookie,
      process.env.JWT_REFRESH_TOKEN_SECRET
    );
    if (!decoded?.userId) throw new ApiError(403, "Invalid refresh token.");

    const { accessToken, refreshToken } = await generateTokens(
      decoded.userId,
      res
    );

    res.json({ accessToken });
  } catch (error) {
    res.status(error.statusCode || 500).json({ message: error.message });
  }
};
