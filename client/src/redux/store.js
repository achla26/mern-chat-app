import { configureStore } from "@reduxjs/toolkit";
import userReducer from "@/redux/slices/user.slice";
import messageReducer from "@/redux/slices/message.slice";

const store = configureStore({
  reducer: {
    user: userReducer,
    message: messageReducer,
  },
});

export default store;
