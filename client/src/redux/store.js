import { configureStore } from "@reduxjs/toolkit";
import rootReducer from "./rootReducer";

const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        // ignoredActions: ["socket/initializeSocket"],
        // ignoredActionPaths: ["socket.socket"],
        ignoredPaths: ["socket.socket"],
      },
    }),
});

export default store;