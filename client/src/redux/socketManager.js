import { io } from "socket.io-client";
import Cookies from "js-cookie";
import { setOnlineUsers, addOnlineUser, removeOnlineUser } from "@/redux/slices/socket.slice";

let socket = null;

export const getSocket = () => socket;

export const initializeSocket = (dispatch) => {
  if (!socket) {
    socket = io(import.meta.env.VITE_DB_ORIGIN, {
      auth: { token: Cookies.get("accessToken") },
      autoConnect: false, // Prevent auto-connect before setup
    });

    socket.on("connect", () => {
      console.log("client = Connected to socket server");
      socket.emit("setup", Cookies.get("userId")); // Send user ID if needed
    });

    // Listen for online users list
    socket.on("onlineUsers", (users) => {
      console.log("onlineUsers", users);

      dispatch(setOnlineUsers(users));
    });

    // Listen for new user coming online
    socket.on("userConnected", (userId) => {
      dispatch(addOnlineUser(userId));
    });

    // Listen for user going offline
    socket.on("userDisconnected", (userId) => {
      dispatch(removeOnlineUser(userId));
    });

    socket.on("disconnect", () => {
      console.log("Disconnected from socket server");
    });

    socket.connect();
  }
};
