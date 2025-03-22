import { createAsyncThunk } from "@reduxjs/toolkit";
import { toast } from "react-hot-toast";
import { axiosInstance } from "@/utility/axios/axiosInstance";
import { handleThunkError } from "@/utility/thunkUtil";

// Reusable thunk logic
const createThunk = (type, apiCall, successMessage) =>
  createAsyncThunk(`user/${type}`, async (payload, { rejectWithValue }) => {
    try {
      const response = await apiCall(payload);
      if (successMessage) toast.success(successMessage);
      return response.data;
    } catch (error) {
      return rejectWithValue(handleThunkError(error));
    }
  });

export const loginUserThunk = createThunk(
  "login",
  (payload) => axiosInstance.post("/user/login", payload),
  "Login successfully!"
);

export const registerUserThunk = createThunk(
  "register",
  (payload) => axiosInstance.post("/user/register", payload),
  "Account created successfully!"
);

export const logoutUserThunk = createThunk(
  "logout",
  () => axiosInstance.post("/user/logout"),
  "Logout successful!"
);

export const otpVerifyThunk = createThunk(
  "email-verify",
  (payload) => axiosInstance.post("/user/email-verify", payload),
  "OTP verified successfully!"
);

export const forgotPasswordThunk = createThunk(
  "forgot-password",
  (payload) => axiosInstance.post("/user/forgot-password", payload),
  "Reset Link sent to your email successfully!"
);


export const resetPasswordThunk = createThunk(
  "reset-password",
  (payload) => axiosInstance.post(`/user/reset-password/${payload.token}`, payload),
  "Password Reset successfully!"
);

export const getUserProfileThunk = createThunk("getProfile", () =>
  axiosInstance.get("/user/profile")
);
