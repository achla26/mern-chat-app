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
  {
    path: "/", 
    children: [
      // Protected routes
      {
        element: <ProtectedRoute />,
        children: [
          {
            index: true,
            element: <Home />,
          },
          // Add other protected routes here
        ],
      },

      
    ],
  },
  // Auth routes
  {
    path: "/",
    element: <AuthLayout />,
    children: [
      { path: "login", element: <Login /> },
      { path: "register", element: <Register /> },
      { path: "forgot-password", element: <ForgotPassword /> },
      { path: "reset-password/:token", element: <ResetPassword /> },
      { path: "otp-verify", element: <OtpVerify /> },
    ],
  },
]);

const Router = () => {
  return <RouterProvider router={router} />;
};

export default Router;
