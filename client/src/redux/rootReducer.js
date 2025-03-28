import { combineReducers } from "redux";
import authReducer from "@/redux/slices/auth.slice";
import userReducer from "@/redux/slices/user.slice";
import chatReducer from "@/redux/slices/chat.slice";
import socketReducer from "@/redux/slices/socket.slice";

const rootReducer = combineReducers({
  auth: authReducer,
  user: userReducer,
  chat: chatReducer,
  socket: socketReducer,
});

export default rootReducer;