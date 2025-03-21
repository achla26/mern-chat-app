import { createSlice } from "@reduxjs/toolkit";
import { loginUserThunk } from "../thunks/user.thunk";
import { registerUserThunk } from "../thunks/user.thunk";

const initialState = {
  isAuthenticated: false,
  screenLoading: false,
  buttonLoading: false,
  userProfile: null,
};

export const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    // login user 
    builder.addCase(loginUserThunk.pending, (state, action) => {
      state.buttonLoading = true;
    }),
      builder.addCase(loginUserThunk.rejected, (state, action) => {
        state.buttonLoading = false;
      }),
      builder.addCase(loginUserThunk.fulfilled, (state, action) => {
        console.log(action?.payload.user);
        state.userProfile = action?.payload?.responseData?.user;
        state.buttonLoading = false;
      });

    //register user 
 
    builder.addCase(registerUserThunk.pending, (state, action) => {
      state.buttonLoading = true;
    });
    builder.addCase(registerUserThunk.fulfilled, (state, action) => {
      state.userProfile = action.payload?.responseData?.user;
      state.isAuthenticated = true;
      state.buttonLoading = false;
    });
    builder.addCase(registerUserThunk.rejected, (state, action) => {
      state.buttonLoading = false;
    });
  },
});

// Action creators are generated for each case reducer function
export const { login } = userSlice.actions;

export default userSlice.reducer;
