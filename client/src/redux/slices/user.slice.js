import { createSlice } from "@reduxjs/toolkit";
import { loginUserThunk , registerUserThunk, otpVerifyThunk,getUserProfileThunk, logoutUserThunk} from "../thunks/user.thunk"; 

const initialState = {
  isAuthenticated: false,
  screenLoading: true,
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
        state.isAuthenticated=true;
        state.userProfile = action?.payload?.user;
        state.buttonLoading = false; 
      });

    //register user 
 
    builder.addCase(registerUserThunk.pending, (state, action) => {
      state.buttonLoading = true;
    });
    builder.addCase(registerUserThunk.fulfilled, (state, action) => {  
      state.userProfile = action.payload?.user; 
      state.buttonLoading = false;
    });
    builder.addCase(registerUserThunk.rejected, (state, action) => {
      state.buttonLoading = false;
    });


    //otp verify

    builder.addCase(otpVerifyThunk.pending, (state, action) => {
      state.buttonLoading = true;
    });
    builder.addCase(otpVerifyThunk.fulfilled, (state, action) => {
      state.userProfile = action.payload?.responseData?.user;
      state.isAuthenticated = true;
      state.buttonLoading = false;
    });
    builder.addCase(otpVerifyThunk.rejected, (state, action) => {
      state.buttonLoading = false;
    });


     // get user profile
     builder.addCase(getUserProfileThunk.pending, (state, action) => {
      state.screenLoading = true;
    });
    builder.addCase(getUserProfileThunk.fulfilled, (state, action) => {
      state.isAuthenticated = true;
      state.screenLoading = false;
      state.userProfile = action.payload?.responseData;
    });
    builder.addCase(getUserProfileThunk.rejected, (state, action) => {
      state.screenLoading = false;
    });

     // logout user
     builder.addCase(logoutUserThunk.pending, (state, action) => {
      state.buttonLoading = true;
    });
    builder.addCase(logoutUserThunk.fulfilled, (state, action) => {
      state.userProfile = null;
      state.selectedUser = null;
      state.otherUsers = null;
      state.isAuthenticated = false;
      state.buttonLoading = false;
      localStorage.clear();
    });
    builder.addCase(logoutUserThunk.rejected, (state, action) => {
      state.buttonLoading = false;
    });
  },
});

// Action creators are generated for each case reducer function
export const { login } = userSlice.actions;

export default userSlice.reducer;
