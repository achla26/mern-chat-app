import { createSlice } from "@reduxjs/toolkit";
import {
  loginUserThunk,
  registerUserThunk,
  otpVerifyThunk,
  forgotPasswordThunk,
  logoutUserThunk,
} from "../thunks/auth.thunk";
import Cookies from "js-cookie";
import { safeLocalStorage } from "@/utility/helper";
 
const loadInitialState = () => {
  const accessToken = Cookies.get("accessToken");
  const refreshToken = Cookies.get("refreshToken");
  const user = JSON.parse(safeLocalStorage.getItem("user"));

  return {
    user: user || null,
    accessToken: accessToken || null,
    refreshToken: refreshToken || null,
    isLoading: false,
    error: null,
    isAuthenticated: false,
    screenLoading: true,
    buttonLoading: false,
  };
};

export const authSlice = createSlice({
  name: "auth",
  initialState: loadInitialState(),
  reducers: {
    setAuthUser: (state, action) => { 
      state.user = action.payload;
      safeLocalStorage.setItem("user", JSON.stringify(action.payload));
    },
    setTokens: (state, action) => {
      const { accessToken, refreshToken } = action.payload;

      // Update Redux state
      state.accessToken = accessToken;
      state.refreshToken = refreshToken;

      // Set cookies
      Cookies.set("accessToken", accessToken, { 
        expires: 1, // 1 day expiry
      });
      
      Cookies.set("refreshToken", refreshToken, { 
        expires: 7, // 7 days expiry
      });
      
    },
    clearTokens: (state) => {
      // Clear Redux state
      state.accessToken = null;
      state.refreshToken = null;

      // Remove cookies
      Cookies.remove("accessToken");
      Cookies.remove("refreshToken");
 
    },
    logout: (state) => {
      state.isAuthenticated = false;
      state.user = null;
      state.accessToken = null;
      state.refreshToken = null;
      localStorage.removeItem("user");
      Cookies.remove("accessToken");
      Cookies.remove("refreshToken");
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
        state.isAuthenticated = true;
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
      state.isAuthenticated = true;
    });
    builder.addCase(otpVerifyThunk.rejected, (state, action) => {
      state.buttonLoading = false;
    });

    // logout user
    builder.addCase(logoutUserThunk.pending, (state, action) => {
      state.buttonLoading = true;
    });
    builder.addCase(logoutUserThunk.fulfilled, (state, action) => {
      state.userProfile = null;
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
export const { setTokens, clearTokens, setAuthUser, logout } = authSlice.actions;

export default authSlice.reducer;
