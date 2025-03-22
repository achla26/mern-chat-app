import { configureStore } from "@reduxjs/toolkit";
import authReducer from "@/redux/slices/auth.slice";
import userReducer from "@/redux/slices/user.slice";
import messageReducer from "@/redux/slices/message.slice";

const store = configureStore({
  reducer: {
    auth: authReducer,
    user: userReducer,
    message: messageReducer,
  },
});

export default store;
