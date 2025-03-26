import { createBrowserRouter, RouterProvider } from "react-router-dom";
import ProtectedRoute from "./utility/auth/ProtectedRoute";
import Login from "./pages/auth/Login";
import Home from "./pages/home/Home";
import Register from "./pages/auth/Register";
import OtpVerify from "./pages/auth/OtpVerify";
import ForgotPassword from "./pages/auth/ForgotPassword";
import ResetPassword from "./pages/auth/ResetPassword"; 
import AuthLayout from "./layouts/AuthLayout";

const router = createBrowserRouter([
  // Protected Routes (require authentication)
  {
    path: "/",
    element: <ProtectedRoute />,
    children: [
      {
        index: true,  // equivalent to path: ""
        element: <Home />,
      },
      // Add other protected routes here (relative paths)
       
    ],
  },
  
  // Auth Routes (redirect if authenticated)
  {
    path: "/",
    element: <AuthLayout />,  // Wraps all auth routes
    children: [
      {
        path: "/login",
        element: <Login /> // Public route
      },
      {
        path: "/register",
        element: <Register />, // Public route
      },
      {
        path: "/forgot-password",
        element: <ForgotPassword />, // Public route
      },
      {
        path: "/reset-password/:token",
        element: <ResetPassword />, // Public route
      },
      {
        path: "/otp-verify",
        element: <OtpVerify />, // Public route
      }
    ],
  },
  
  // Public Routes (no protection)
  // {
  //   path: "/about",
  //   element: <About />,  // Example of public route
  // },
]);
 
const Router = () => {
  return <RouterProvider router={router} />;
};

export default Router;
