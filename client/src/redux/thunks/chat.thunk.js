import { createAsyncThunk } from "@reduxjs/toolkit";
import { toast } from "react-hot-toast";
import { axiosInstance } from "@/utility/axios/axiosInstance";
import { createThunk, handleThunkError } from "@/utility/thunkUtil";
 

export const getUserChatsThunk = createThunk(
  "getUserChats",
  (payload) => axiosInstance.get("/chats", payload),
  "fetch Chats successfully!"
);
 