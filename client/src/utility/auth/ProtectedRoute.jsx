import React, { useEffect } from "react";
import { useNavigate, Outlet } from "react-router-dom";
import { useSelector } from "react-redux";

const ProtectedRoute = () => {
  const navigate = useNavigate();

  // Replace these with your actual authentication logic
  const isAuthenticated = false; // Set to `false` if the user is not authenticated
  const screenLoading = false; // Set to `true` if authentication data is still loading

//   const { isAuthenticated, screenLoading } = useSelector(
//     (state) => state.userReducer
//   );

  useEffect(() => {
    if (!screenLoading && !isAuthenticated) {
      navigate("/login"); // Redirect to login if not authenticated
    }
  }, [isAuthenticated, screenLoading, navigate]);

  // Render the nested routes using <Outlet> if authenticated
  return isAuthenticated ? <Outlet /> : null;
};

export default ProtectedRoute;