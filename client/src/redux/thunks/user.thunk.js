import { createAsyncThunk } from "@reduxjs/toolkit";
import { toast } from "react-hot-toast";
import { axiosInstance } from "@/utility/axios/axiosInstance";
import { createThunk , handleThunkError } from "@/utility/thunkUtil";

export const getUserProfileThunk = createThunk("getProfile", () =>
  axiosInstance.get("/user/profile")
);

export const getAllUsersThunk = createThunk("all", () =>
  axiosInstance.get("/user/all")
);
