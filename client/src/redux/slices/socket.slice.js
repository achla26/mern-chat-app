import { createSlice } from "@reduxjs/toolkit";
import { io } from "socket.io-client";
import Cookies from "js-cookie";
const initialState = {
  socket: null,
  onlineUsers: [],
};

export const socketSlice = createSlice({
  name: "socket",
  initialState,
  reducers: {
    initializeSocket: (state, action) => {
      const socket = io(import.meta.env.VITE_DB_ORIGIN, {
        auth: {
          token: Cookies.get("accessToken"),
        },
      });

      socket.on("connect", () => {
        console.log("connected to socket server");
      });

      state.socket = socket;
    },
    setOnlineUsers: (state, action) => {
      state.onlineUsers = action.payload;
    },
  },
});

// Action creators are generated for each case reducer function
export const { initializeSocket, setOnlineUsers } = socketSlice.actions;

export default socketSlice.reducer;
