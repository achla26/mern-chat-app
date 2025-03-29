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
  chats: {}, // { [conversationId]: chatObject }
  messages: {}, // { [conversationId]: messageArray }
  otherParticipants: {}, // { [conversationId]: { [userId]: userObject } }
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
      const conversationId = action.payload;
      state.selectedChatId = conversationId;
      try {
        if (conversationId) {
          safeSessionStorage.setItem("selectedChatId", JSON.stringify(conversationId));
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
      const { conversationId, ...message } = action.payload;
      const chat = state.chats[conversationId]; // Access chat by conversationId
      if (chat) {
        if (!Array.isArray(state.messages[conversationId])) {
          state.messages[conversationId] = [];
        }
        state.messages[conversationId].push(message); // Add the message to the messages array
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
        const { conversationId, message } = action.payload.data;

        // Initialize if doesn't exist
        if (!Array.isArray(state.messages[conversationId])) {
          state.messages[conversationId] = [];
        }

        // Add new message at beginning (assuming newest first)
        state.messages[conversationId].unshift({
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
        if (state.chats[conversationId]) {
          state.chats[conversationId].lastMessage = message;
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
export const selectChatById = (conversationId) => (state) => state.chat.chats[conversationId];
export const selectMessagesByChatId = (conversationId) => (state) =>
  state.chat.messages[conversationId] || [];
export const selectParticipantsByChatId = (conversationId) => (state) =>
  state.chat.participants[conversationId] || {};

export const selectMessagesWithUsers = (conversationId) => (state) => {
  const messages = selectMessagesByChatId(conversationId)(state);
  const participants = selectParticipantsByChatId(conversationId)(state);

  return messages.map((msg) => ({
    ...msg,
    sender: participants[msg.senderId],
    receivers: msg.receiverIds.map((id) => participants[id]),
  }));
};

export default chatSlice.reducer;
