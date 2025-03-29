import { io } from "socket.io-client";
import Cookies from "js-cookie";
import { 
  setOnlineUsers, 
  addOnlineUser, 
  removeOnlineUser,
  setConnectionStatus 
} from "@/redux/slices/socket.slice";
import { addNewMessage } from "@/redux/slices/chat.slice";

let socket = null;
let reconnectAttempts = 0;
const MAX_RECONNECT_ATTEMPTS = 5;
const RECONNECT_DELAY = 3000; // 3 seconds

export const getSocket = () => socket;

export const initializeSocket = (dispatch) => {
  if (!socket) {
    socket = io(import.meta.env.VITE_DB_ORIGIN, {
      auth: { token: Cookies.get("accessToken") },
      autoConnect: false,
      reconnectionAttempts: MAX_RECONNECT_ATTEMPTS,
      reconnectionDelay: RECONNECT_DELAY,
    });

    // Connection established
    socket.on("connect", () => { 
      reconnectAttempts = 0; // Reset on successful connection
      dispatch(setConnectionStatus(true)); 
    });

    // Online users management
    socket.on("onlineUsers", (users) => { 
      dispatch(setOnlineUsers(users));
    });

    socket.on("userConnected", (userId) => {
      dispatch(addOnlineUser(userId));
    });

    socket.on("userDisconnected", (userId) => {
      dispatch(removeOnlineUser(userId));
    });

    // Connection lost
    socket.on("disconnect", (reason) => {
      console.log("Disconnected from socket server:", reason);
      dispatch(setConnectionStatus(false));
      if (reason === "io server disconnect") {
        socket.connect(); // Attempt reconnection
      }
    });

    socket.on("newMessage", (message) => { 
      console.log(message)
      dispatch(addNewMessage(message));
    });

    // Reconnect attempts
    socket.on("reconnect_attempt", (attempt) => {
      reconnectAttempts = attempt;
      console.log(`Reconnection attempt ${attempt}/${MAX_RECONNECT_ATTEMPTS}`);
    });

    // Reconnect failed
    socket.on("reconnect_failed", () => {
      console.error("Failed to reconnect to socket server");
    });

    // Error handling
    socket.on("connect_error", (err) => {
      console.error("Connection error:", err.message);
      if (err.message === "Authentication failed") {
        console.warn("Redirecting to login due to authentication failure.");
        // Handle authentication failure (e.g., redirect to login)
      }
    });

    // Connect the socket
    socket.connect();
  }

  return () => {
    if (socket) {
      socket.disconnect();
      socket = null;
    }
  };
};

export const disconnectSocket = () => {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
};