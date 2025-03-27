import { axiosInstance } from "@/utility/axios/axiosInstance";
import { createThunk } from "@/utility/thunkUtil";
 

export const getUserChatsThunk = createThunk(
  "getUserChats",
  (payload) => axiosInstance.get("/chats", payload),
  "fetch Chats successfully!"
);
 

export const getUserMessagesThunk = createThunk(
  "getUserMessages",
  (payload) => axiosInstance.get(`chats/${payload.chatId}/messages`, payload),
  "fetch Messages successfully!"
);
 

export const sendMessageThunk = createThunk(
  "sendMessageThunk",
  (payload) => axiosInstance.post(`chats/send`, payload),
  "send Message successfully!"
);
 