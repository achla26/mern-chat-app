import { createBrowserRouter, RouterProvider } from "react-router-dom";
import ProtectedRoute from "./utility/auth/ProtectedRoute";
import Login from "./pages/auth/Login";
import Home from "./pages/home/Home";
 
const router = createBrowserRouter([
  {
    path: "/",
    element: <ProtectedRoute />, // Protect all nested routes
    children: [
      {
        path: "/",
        element: <Home />, // Protected route
      },
      // {
      //   path: "/dashboard",
      //   element: <Dashboard />, // Protected route
      // },
      // {
      //   path: "/profile",
      //   element: <Profile />, // Protected route
      // },
    ],
  },
  {
    path: "/login",
    element: <Login />, // Public route
  },
]);
const Router = () => {
  return <RouterProvider router={router} />;
};

export default Router;
