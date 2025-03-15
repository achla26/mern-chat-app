import { createAsyncThunk } from "@reduxjs/toolkit";

// First, create the thunk
export const loginThunk = createAsyncThunk(
    "auth/login", // Action type
    async (userData, { rejectWithValue }) => {
        try {
            console.log("Test");
            // Simulating an API request
            return { message: "Login Successful" };
        } catch (error) {
            return rejectWithValue("Login Failed");
        }
    }
);
