import { createSlice } from "@reduxjs/toolkit";
import { getCurrentUserThunk } from "../thunks/user.thunk";

const initialState = {
  isAuthenticated: false,
  screenLoading: true,
  buttonLoading: false,
  userProfile: null,
  accessToken: null,
};

export const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: { 
  },
  extraReducers: (builder) => {
    // get user profile
    builder.addCase(getCurrentUserThunk.pending, (state, action) => {
      state.screenLoading = true;
    });
    builder.addCase(getCurrentUserThunk.fulfilled, (state, action) => {
      state.screenLoading = false;
      state.userProfile = action.payload?.user;
    });
    builder.addCase(getCurrentUserThunk.rejected, (state, action) => {
      state.screenLoading = false;
    });
  },
});

// Action creators are generated for each case reducer function
export const {  } = userSlice.actions;

export default userSlice.reducer;
