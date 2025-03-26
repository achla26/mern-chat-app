import { combineReducers } from "redux";
import authReducer from "@/redux/slices/auth.slice";
import userReducer from "@/redux/slices/user.slice";
import chatReducer from "@/redux/slices/chat.slice";

const rootReducer = combineReducers({
  auth: authReducer,
  user: userReducer,
  chat: chatReducer,
});

export default rootReducer;