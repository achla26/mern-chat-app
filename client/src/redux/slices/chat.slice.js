import { createSlice } from "@reduxjs/toolkit";
import { getUserChatsThunk } from "../thunks/chat.thunk";

const initialState = {
  chats: {},
  chatScreenLoading: true,
  chatButtonLoading: false,
  chatComponentLoading: true,
};

export const chatSlice = createSlice({
  name: "chat",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    // get user profile
    builder.addCase(getUserChatsThunk.pending, (state, action) => { 
    });
    builder.addCase(getUserChatsThunk.fulfilled, (state, action) => {
      state.chatComponentLoading = false;
      state.chats = action.payload.data; 
    });
    builder.addCase(getUserChatsThunk.rejected, (state, action) => {
      state.chatComponentLoading = false;
    });
  },
});

// Action creators are generated for each case reducer function
export const {} = chatSlice.actions;

export default chatSlice.reducer;
