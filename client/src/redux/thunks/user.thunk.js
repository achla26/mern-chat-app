import { createAsyncThunk } from "@reduxjs/toolkit";

// First, create the thunk
export const loginThunk = createAsyncThunk(
    "user/login", // Action type
    async () => {
        console.log('user thunk')
    }
);
