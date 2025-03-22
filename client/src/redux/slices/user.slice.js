import { createSlice } from "@reduxjs/toolkit";
import { loginUserThunk , registerUserThunk, otpVerifyThunk,getUserProfileThunk, forgotPasswordThunk, logoutUserThunk} from "../thunks/user.thunk"; 

const initialState = {
  isAuthenticated: false,
  screenLoading: true,
  buttonLoading: false,
  userProfile: null,
  accessToken:null, 
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
      sessionStorage.setItem("email", action.payload?.user?.email); // Save email
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
      state.screenLoading = false; 
      state.userProfile = action.payload?.user;
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
export const { setAccessToken, logout } = userSlice.actions;


export default userSlice.reducer;
