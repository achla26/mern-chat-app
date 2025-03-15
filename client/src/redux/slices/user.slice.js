import { createSlice } from "@reduxjs/toolkit";
import { loginThunk } from "../thunks/user.thunk";

const initialState = {
  username: "",
  password: "",
};

export const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    login: (state, action) => {
      console.log("hello user");
    },
  },
  extraReducers: (builder) => {
    // Add reducers for additional action types here, and handle loading state as needed
    builder.addCase(loginThunk.pending, (state, action) => { 
      console.log("pending");
    }),
      builder.addCase(loginThunk.rejected, (state, action) => { 
        console.log("rejected");
      }),
      builder.addCase(loginThunk.fulfilled, (state, action) => {
        // Add user to the state array
        //   state.entities.push(action.payload)
        console.log("fulfilled");
      });
  },
});

// Action creators are generated for each case reducer function
export const { login } = userSlice.actions;

export default userSlice.reducer;
