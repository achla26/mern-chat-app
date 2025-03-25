import { configureStore } from "@reduxjs/toolkit";
import authReducer from "@/redux/slices/auth.slice";
import userReducer from "@/redux/slices/user.slice";
import chatReducer from "@/redux/slices/chat.slice";

const store = configureStore({
  reducer: {
    auth: authReducer,
    user: userReducer,
    chat: chatReducer,
  },
});

export default store;
