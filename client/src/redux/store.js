import { configureStore } from "@reduxjs/toolkit";
import userReducer from "@/redux/slices/user.slice";

const store = configureStore({
  reducer: {
    user: userReducer,
  },
});

export default store;
