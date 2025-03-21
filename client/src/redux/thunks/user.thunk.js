import { createAsyncThunk } from "@reduxjs/toolkit";
import { toast } from "react-hot-toast";
import { axiosInstance } from "@/utility/axios/axiosInstance";
// First, create the thunk
export const loginThunk = createAsyncThunk(
  "user/login", // Action type
  async ({ email, password }, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post("/user/login", {
        email,
        password,
      });
      const {success , message}  = response.data; 
      if(success) {
        toast.success(message);
      }
      return response.data;
    } catch (error) {
      if (error?.response?.data?.errors.length === 0) {
        toast.error(error?.response?.data?.message);
      } else {
        error?.response?.data?.errors.forEach((err) => 
            toast.error(error?.response?.data?.err)
        );
      }
 
      return rejectWithValue(err);
    }
  }
);
