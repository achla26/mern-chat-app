import { createSlice } from "@reduxjs/toolkit";
import { getUserChatsThunk, getUserMessagesThunk , sendMessageThunk} from "../thunks/chat.thunk";
import { safeSessionStorage } from "@/utility/helper"; 

const getInitialselectedChatId = () => {
  try {
    const selectedChatId = safeSessionStorage.getItem("selectedChatId");
    return selectedChatId ? JSON.parse(selectedChatId) : null;
  } catch (error) {
    console.error("Failed to parse selectedChatId:", error);
    return null;
  }
};

const initialState = {
  chats: {},
  messages: {},
  chatScreenLoading: true,
  chatAreaComponentLoading: true,
  chatButtonLoading: false,
  chatListComponentLoading: true,
  selectedChatId: getInitialselectedChatId(),
};

export const chatSlice = createSlice({
  name: "chat",
  initialState,
  reducers: {
    setselectedChatId: (state, action) => { 
      if (action.payload) {
        try {
          const serializedUser = JSON.stringify(action.payload);
          safeSessionStorage.setItem("selectedChatId", serializedUser);
          state.selectedChatId = action.payload;
        } catch (error) {
          console.error("Failed to set selectedChatId:", error);
          state.selectedChatId = null;
        }
      } else {
        // Handle null/undefined payload
        safeSessionStorage.setItem("selectedChatId", "");
        state.selectedChatId = null;
      }
    },
    clearselectedChatId: (state) => {
      safeSessionStorage.setItem("selectedChatId", "");
      state.selectedChatId = null;
    },
  },
  extraReducers: (builder) => {
    // get user chats
    builder.addCase(getUserChatsThunk.pending, (state, action) => {});
    builder.addCase(getUserChatsThunk.fulfilled, (state, action) => {
      state.chatListComponentLoading = false;
      state.chats = action.payload.data;
    });
    builder.addCase(getUserChatsThunk.rejected, (state, action) => {
      state.chatListComponentLoading = false;
    });

    // get user chat messages
    builder.addCase(getUserMessagesThunk.pending, (state, action) => {});
    builder.addCase(getUserMessagesThunk.fulfilled, (state, action) => { 
      const { chatId, messages } = action.payload.data;
      state.messages[chatId] = messages; // Store messages by chatId
      state.chatAreaComponentLoading = false;
    });
    builder.addCase(getUserMessagesThunk.rejected, (state, action) => {
      state.chatListComponentLoading = false;
    });

    // send user chat messages
    builder.addCase(sendMessageThunk.pending, (state, action) => {});
    builder.addCase(sendMessageThunk.fulfilled, (state, action) => { 
      const { chatId, messages } = action.payload.data;
      state.messages[chatId] = messages; // Store messages by  
    });
    builder.addCase(sendMessageThunk.rejected, (state, action) => {
      state.chatListComponentLoading = false;
    });
  },
});

export const { setselectedChatId, clearselectedChatId } = chatSlice.actions;
export default chatSlice.reducer;
