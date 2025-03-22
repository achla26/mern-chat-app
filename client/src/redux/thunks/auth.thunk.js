import { createAsyncThunk } from "@reduxjs/toolkit";
import { toast } from "react-hot-toast";
import { axiosInstance } from "@/utility/axios/axiosInstance";
import { createThunk , handleThunkError } from "@/utility/thunkUtil";
 
export const loginUserThunk = createThunk(
  "login",
  (payload) => axiosInstance.post("/auth/login", payload),
  "Login successfully!"
);

export const registerUserThunk = createThunk(
  "register",
  (payload) => axiosInstance.post("/auth/register", payload),
  "Account created successfully!"
);

export const logoutUserThunk = createThunk(
  "logout",
  () => axiosInstance.post("/auth/logout"),
  "Logout successful!"
);

export const otpVerifyThunk = createThunk(
  "email-verify",
  (payload) => axiosInstance.post("/auth/email-verify", payload),
  "OTP verified successfully!"
);

export const forgotPasswordThunk = createThunk(
  "forgot-password",
  (payload) => axiosInstance.post("/auth/forgot-password", payload),
  "Reset Link sent to your email successfully!"
);


export const resetPasswordThunk = createThunk(
  "reset-password",
  (payload) => axiosInstance.post(`/auth/reset-password/${payload.token}`, payload),
  "Password Reset successfully!"
); 
