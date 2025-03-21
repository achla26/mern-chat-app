import { createSlice } from "@reduxjs/toolkit";
import { loginThunk } from "../thunks/user.thunk";
import { act } from "react";

const initialState = {
  isAuthenticated: false,
  screenLoading: false,
  buttonLoading:false,
  userProfile:null
};

export const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: { 
  },
  extraReducers: (builder) => {
    // Add reducers for additional action types here, and handle loading state as needed
    builder.addCase(loginThunk.pending, (state, action) => { 
        state.buttonLoading=true;
    }),
      builder.addCase(loginThunk.rejected, (state, action) => { 
        state.buttonLoading=false;
      }),
      builder.addCase(loginThunk.fulfilled, (state, action) => {
        console.log(action?.payload.user)
        state.userProfile = action?.payload?.responseData?.user;
        state.buttonLoading=false;

      });
  },
});

// Action creators are generated for each case reducer function
export const { login } = userSlice.actions;

export default userSlice.reducer;
