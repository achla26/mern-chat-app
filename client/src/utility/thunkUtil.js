// utils/thunkUtils.js
import { toast } from "react-hot-toast";
import { createAsyncThunk } from "@reduxjs/toolkit";

// Utility to create a Redux thunk with error handling and optional success messages
export const createThunk = (type, apiCall, successMessage) =>
  createAsyncThunk(type, async (payload, { rejectWithValue }) => {
    try {
      const response = await apiCall(payload);
      if (successMessage) toast.success(successMessage);
      return response.data;
    } catch (error) {
      return rejectWithValue(handleThunkError(error));
    }
  });

// Handle errors and show toast notifications
export const handleThunkError = (error) => {
  const errorData = error?.response?.data;
  if (errorData?.errors?.length) {
    errorData.errors.forEach((err) => toast.error(err));
  } else {
    toast.error(errorData?.message || "An unexpected error occurred.");
  }
  return errorData || error.message;
};

// Handle loading states in thunks
export const handleThunkLoading = (builder, thunk, stateKey) => {
  builder
    .addCase(thunk.pending, (state) => {
      state[stateKey] = true;
    })
    .addCase(thunk.fulfilled, (state) => {
      state[stateKey] = false;
    })
    .addCase(thunk.rejected, (state) => {
      state[stateKey] = false;
    });
};
