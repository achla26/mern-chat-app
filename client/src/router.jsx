import { createBrowserRouter, RouterProvider } from "react-router-dom";
import ProtectedRoute from "./utility/auth/ProtectedRoute";
import Login from "./pages/auth/Login";
import Home from "./pages/home/Home";
import Register from "./pages/auth/Register";
import OtpVerify from "./pages/auth/OtpVerify";
 
const router = createBrowserRouter([
  {
    path: "/",
    element: <ProtectedRoute />, // Protect all nested routes
    children: [
      {
        path: "/",
        element: <Home />, // Protected route
      },
    ],
  },
  {
    path: "/login",
    element: <Login />, // Public route
  },
  {
    path: "/register",
    element: <Register />, // Public route
  },
  {
    path: "/otp-verify",
    element: <OtpVerify />, // Public route
  }
]);
const Router = () => {
  return <RouterProvider router={router} />;
};

export default Router;
