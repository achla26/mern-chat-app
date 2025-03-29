import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  onlineUsers: [],
  isConnected: false,
};

export const socketSlice = createSlice({
  name: "socket",
  initialState,
  reducers: {
    setOnlineUsers: (state, action) => {
      state.onlineUsers = action.payload;
    },
    addOnlineUser: (state, action) => {
      if (!state.onlineUsers.includes(action.payload)) {
        state.onlineUsers.push(action.payload);
      }
    },
    removeOnlineUser: (state, action) => {
      state.onlineUsers = state.onlineUsers.filter(
        (userId) => userId !== action.payload
      );
    },
    setConnectionStatus: (state, action) => {
      state.isConnected = action.payload;
    },
  },
});

export const { 
  setOnlineUsers, 
  addOnlineUser, 
  removeOnlineUser,
  setConnectionStatus 
} = socketSlice.actions;

export default socketSlice.reducer;