// chat.slice.js
import { createSlice } from "@reduxjs/toolkit";
import {
  getUserChatsThunk,
  getUserMessagesThunk,
  sendMessageThunk,
} from "../thunks/chat.thunk";
import { safeSessionStorage } from "@/utility/helper";

const getInitialSelectedChatId = () => {
  try {
    const selectedChatId = safeSessionStorage.getItem("selectedChatId");
    return selectedChatId ? JSON.parse(selectedChatId) : null;
  } catch (error) {
    console.error("Failed to parse selectedChatId:", error);
    return null;
  }
};

const initialState = {
  chats: {}, // { [chatId]: chatObject }
  messages: {}, // { [chatId]: messageArray }
  otherParticipants: {}, // { [chatId]: { [userId]: userObject } }
  chatScreenLoading: true,
  chatAreaComponentLoading: true,
  chatButtonLoading: false,
  chatListComponentLoading: true,
  selectedChatId: getInitialSelectedChatId(),
};

export const chatSlice = createSlice({
  name: "chat",
  initialState,
  reducers: {
    setSelectedChatId: (state, action) => {
      const chatId = action.payload;
      state.selectedChatId = chatId;
      try {
        if (chatId) {
          safeSessionStorage.setItem("selectedChatId", JSON.stringify(chatId));
        } else {
          safeSessionStorage.removeItem("selectedChatId");
        }
      } catch (error) {
        console.error("Failed to persist selectedChatId:", error);
      }
    },
    clearSelectedChatId: (state) => {
      state.selectedChatId = null;
      safeSessionStorage.removeItem("selectedChatId");
    },
    addNewMessage: (state, action) => {
      const { chatId, message } = action.payload;

      // Initialize message array if doesn't exist
      if (!Array.isArray(state.messages[chatId])) {
        state.messages[chatId] = [];
      }

      // Add new message at beginning (chronological order)
      state.messages[chatId].unshift(message);

      // Update last message in chat object
      if (state.chats[chatId]) {
        state.chats[chatId].lastMessage = message;
      }
    },
    resetChatState: () => initialState,
  },
  extraReducers: (builder) => {
    builder
      // Get User Chats
      .addCase(getUserChatsThunk.pending, (state) => {
        state.chatListComponentLoading = true;
      })
      .addCase(getUserChatsThunk.fulfilled, (state, action) => {
        state.chatListComponentLoading = false;

        // Convert array to normalized object
        state.chats = action.payload.data.reduce((acc, chat) => {
          acc[chat._id] = chat;
          return acc;
        }, {});
      })
      .addCase(getUserChatsThunk.rejected, (state) => {
        state.chatListComponentLoading = false;
      })

      // Get Messages
      .addCase(getUserMessagesThunk.pending, (state) => {
        state.chatAreaComponentLoading = true;
      })
      .addCase(getUserMessagesThunk.fulfilled, (state, action) => {
        console.log(action.payload.data);
        const { conversationId, messages, participants } = action.payload.data;

        // Store messages
        state.messages[conversationId] = messages;
        state.otherParticipants = Object.keys(participants);

        state.chatAreaComponentLoading = false;
      })
      .addCase(getUserMessagesThunk.rejected, (state) => {
        state.chatAreaComponentLoading = false;
      })

      // Send Message
      .addCase(sendMessageThunk.pending, (state) => {
        state.chatButtonLoading = true;
      })
      .addCase(sendMessageThunk.fulfilled, (state, action) => {
        const { chatId, message } = action.payload.data;

        // Initialize if doesn't exist
        if (!Array.isArray(state.messages[chatId])) {
          state.messages[chatId] = [];
        }

        // Add new message at beginning (assuming newest first)
        state.messages[chatId].unshift({
          ...message,
          // Ensure these fields exist
          _id: message._id || Date.now().toString(), // temporary ID if missing
          createdAt: message.createdAt || new Date().toISOString(),
          senderId: message.senderId || state.selectedUser?._id,
          receiverIds: Array.isArray(message.receiverIds)
            ? message.receiverIds
            : [message.receiverIds],
        });

        // Update last message in chat
        if (state.chats[chatId]) {
          state.chats[chatId].lastMessage = message;
        }

        state.chatButtonLoading = false;
      })
      .addCase(sendMessageThunk.rejected, (state) => {
        state.chatButtonLoading = false;
      });
  },
});

export const {
  setSelectedChatId,
  clearSelectedChatId,
  addNewMessage,
  resetChatState,
} = chatSlice.actions;

// Selectors
export const selectChatById = (chatId) => (state) => state.chat.chats[chatId];
export const selectMessagesByChatId = (chatId) => (state) =>
  state.chat.messages[chatId] || [];
export const selectParticipantsByChatId = (chatId) => (state) =>
  state.chat.participants[chatId] || {};

export const selectMessagesWithUsers = (chatId) => (state) => {
  const messages = selectMessagesByChatId(chatId)(state);
  const participants = selectParticipantsByChatId(chatId)(state);

  return messages.map((msg) => ({
    ...msg,
    sender: participants[msg.senderId],
    receivers: msg.receiverIds.map((id) => participants[id]),
  }));
};

export default chatSlice.reducer;
