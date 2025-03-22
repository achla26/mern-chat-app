import axios from "axios"; 
import  store  from "@/redux/store"; // Assuming you are using Redux for state management
import { setAccessToken } from "@/redux/slices/user.slice"; // Create an action for setting the access token in Redux
// import { setAccessToken } from "../../redux/slices/user.slice";

const DB_URL = import.meta.env.VITE_DB_URL;

const axiosInstance = axios.create({
  baseURL: DB_URL,
  withCredentials: true,
  headers: {
    ContentType: "application/json",
  },
});


const setAuthToken = (token) => {
  if (token) {
    // Store token in Redux store
    store.dispatch(setAccessToken(token));

    // Set token in axios default headers
    axiosInstance.defaults.headers.common["Authorization"] = `Bearer ${token}`;
  } else {
    // Remove token from Redux and axios if no token
    store.dispatch(setAccessToken(null));
    delete axiosInstance.defaults.headers.common["Authorization"];
  }
};
// Axios Response Interceptor for handling token expiry
// axiosInstance.interceptors.response.use(
//   (response) => response, // If the request is successful, return the response
//   async (error) => {
//     if (error.response?.status === 401) {
//       // 401 means the access token is likely expired
//       try {
//         // Attempt to refresh the access token
//         const refreshResponse = await axiosInstance.get("/user/refresh");
//         const { accessToken } = refreshResponse.data;

//         // Save the new access token in Redux or localStorage
//         store.dispatch(setAccessToken(accessToken)); // Assuming you have a Redux action to save the access token

//         // Retry the original request with the new token
//         error.config.headers["Authorization"] = `Bearer ${accessToken}`;
//         return axiosInstance(error.config); // Retry the original request
//       } catch (refreshError) {
//         toast.error("Session expired. Please log in again.");
//         return Promise.reject(refreshError); // Reject if refresh fails
//       }
//     }
//     return Promise.reject(error); // Reject for all other errors
//   }
// );

export {axiosInstance , setAuthToken};
