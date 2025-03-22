import { createAsyncThunk } from "@reduxjs/toolkit";
import { toast } from "react-hot-toast";
import { axiosInstance } from "@/utility/axios/axiosInstance";
import { handleThunkError } from "@/utility/thunkUtil";

// Reusable thunk logic
const createThunk = (type, apiCall, successMessage) =>
  createAsyncThunk(`message/${type}`, async (payload, { rejectWithValue }) => {
    try {
      const response = await apiCall(payload);
      if (successMessage) toast.success(successMessage);
      return response.data;
    } catch (error) {
      return rejectWithValue(handleThunkError(error));
    }
  });

export const getUserChatsThunk = createThunk(
  "getUserChats",
  (payload) => axiosInstance.post(_,"/message/chats", payload),
  "fetch Chats successfully!"
);
 