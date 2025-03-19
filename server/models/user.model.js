import mongoose from "mongoose";
import bcrypt from "bcrypt";
import crypto from 'crypto';

const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      lowecase: true,
      trim: true,
      match: [/.+@.+\..+/, 'Please enter a valid email address'],
    },
    name: {
      type: String,
      required: true,
      trim: true,
      index: true,
    },
    profilePicture: {
      type: String,  
    },
    password: {
      type: String,
      required: [true, "Password is required"], 
      select: false, 
    },
    lastLogin: {
      type: Date,
      default: Date.now,
    },
    otpAttempts: {
      count: { type: Number, default: 0 },
      lastAttempt: { type: Date , default: Date.now},
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    token:String,
    verificationCode: Number,
    verificationCodeExpiresAt: Date,
    resetPasswordToken: String,
    resetPasswordExpiresAt: Date, 
  },
  {
    timestamps: true,
  }
);

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();

  this.password = await bcrypt.hash(this.password, 10);
  next();
});

userSchema.methods.comparePassword = async function (password) {
  return await bcrypt.compare(password, this.password);
};
 
userSchema.methods.generateVerificationCode = function () {
  function generateRandomFiveDigitNumber() {
    const firstDigit = Math.floor(Math.random() * 9) + 1;
    const remainingDigits = Math.floor(Math.random() * 10000)
      .toString()
      .padStart(4, 0);

    return parseInt(firstDigit + remainingDigits);
  }
  const verificationCode = generateRandomFiveDigitNumber();
  this.verificationCode = verificationCode;
  this.verificationCodeExpire = Date.now() + 10 * 60 * 1000;

  return verificationCode;
};

userSchema.methods.generateResetPasswordToken = function () {
  const resetToken = crypto.randomBytes(20).toString("hex");
  console.log("resetToken "+resetToken)
  this.resetPasswordToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");

  console.log("this.resetPasswordToken  "+this.resetPasswordToken )


  this.resetPasswordExpiresAt = Date.now() + 15 * 60 * 1000;

  return resetToken;
};

export const User = mongoose.model("user", userSchema);
