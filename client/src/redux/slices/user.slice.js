import { createSlice } from "@reduxjs/toolkit";
import { getUserProfileThunk } from "../thunks/user.thunk";

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
    setAccessToken: (state, action) => {
      state.accessToken = action.payload;
    },
    logout: (state) => {
      state.isAuthenticated = false;
      state.accessToken = null;
      state.userProfile = null;
      localStorage.clear(); // Clear localStorage on logout
    },
  },
  extraReducers: (builder) => {
    // get user profile
    builder.addCase(getUserProfileThunk.pending, (state, action) => {
      state.screenLoading = true;
    });
    builder.addCase(getUserProfileThunk.fulfilled, (state, action) => {
      state.screenLoading = false;
      state.userProfile = action.payload?.user;
    });
    builder.addCase(getUserProfileThunk.rejected, (state, action) => {
      state.screenLoading = false;
    });
  },
});

// Action creators are generated for each case reducer function
export const { setAccessToken, logout } = userSlice.actions;

export default userSlice.reducer;
