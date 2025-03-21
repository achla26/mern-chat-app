import { createAsyncThunk } from "@reduxjs/toolkit";
import { toast } from "react-hot-toast";
import { axiosInstance } from "@/utility/axios/axiosInstance";
// First, create the thunk
export const loginUserThunk = createAsyncThunk(
  "user/login", // Action type
  async ({ identifier, password }, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post("/user/login", {
        identifier,
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


export const registerUserThunk = createAsyncThunk(
  "user/signup",
  async ({ fullName, email, password , username , gender}, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post("/user/register", {
        fullName,
        email,
        password,
        username,
        gender        
      });
      toast.success("Account created successfully!!");
      return response.data;
    } catch (error) {
      console.error(error);
      const errorOutput = error?.response?.data?.errMessage;
      toast.error(errorOutput);
      return rejectWithValue(errorOutput);
    }
  }
);