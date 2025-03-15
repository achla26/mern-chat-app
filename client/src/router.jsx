import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Login from "./pages/auth/Login";  
import Home from "./pages/home/Home";   
const router = createBrowserRouter([
  {
    path: "/",
    element: <Home />,
  },
  {
    path: "/login",
    element: <Login />, // Now it's a top-level route
  },
]);
const Router = () => {
  return <RouterProvider router={router} />;
};

export default Router;
