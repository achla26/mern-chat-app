import axios from "axios";
import store from "@/redux/store";
import { setAccessToken } from "@/redux/slices/user.slice";
import Cookies from "js-cookie";

const DB_URL = import.meta.env.VITE_DB_URL;

const axiosInstance = axios.create({
  baseURL: DB_URL,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

const setAuthToken = (token) => {
  if (token) {
    store.dispatch(setAccessToken(token));
    axiosInstance.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    Cookies.set("accessToken", token, { expires: 1 });
 
  } else {
    store.dispatch(setAccessToken(null));
    delete axiosInstance.defaults.headers.common["Authorization"];
  }
};

let isRefreshing = false;
let refreshSubscribers = [];

const onAccessTokenFetched = (newToken) => {
  refreshSubscribers.forEach((callback) => callback(newToken));
  refreshSubscribers = [];
};

axiosInstance.interceptors.response.use(
  (response) => response, // If the request is successful, return the response
  async (error) => {
    if (error.response?.status === 401) {
      // 401 means the access token is likely expired
      try {
        const refreshResponse = await axiosInstance.post("/user/refresh", {
          refreshToken: getCookie('refreshToken'), // Get refresh token from cookie or state
        });

        const { accessToken } = refreshResponse.data;

        // Store the new access token
        store.dispatch(setAccessToken(accessToken)); // Assuming you have a Redux action to save the access token

        // Retry the original request with the new access token
        error.config.headers["Authorization"] = `Bearer ${accessToken}`;
        document.cookie = `token=${accessToken}; path=/; max-age=3600; Secure; HttpOnly`;

        return axiosInstance(error.config); // Retry the original request with the new token
      } catch (refreshError) {
        toast.error("Session expired. Please log in again.");
        return Promise.reject(refreshError); // Reject if refresh fails
      }
    }
    return Promise.reject(error); // Reject for all other errors
  }
);

export { axiosInstance, setAuthToken };
