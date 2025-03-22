import { useEffect } from "react";
import { useSelector } from "react-redux";
import { useNavigate, Outlet } from "react-router-dom";
// #TO DO
const ProtectedRoute = () => {
  // const { isAuthenticated, screenLoading } = useSelector(
  //   (state) => state.user
  // );
  let isAuthenticated = true;
  let screenLoading=false;
  const navigate = useNavigate();
  console.log("isAuthenticated:", isAuthenticated);
  console.log("screenLoading:", screenLoading);
  useEffect(() => {
    if (!screenLoading && !isAuthenticated) {
      navigate("/login"); // Redirect to login if not authenticated
    }
  }, [isAuthenticated, screenLoading, navigate]);

  // If still loading, show a loading spinner or placeholder
  if (screenLoading) {
    return <div>Loading...</div>; // Or a loading spinner
  }

  // If authenticated, render the nested routes using <Outlet />
  return isAuthenticated ? <Outlet /> : null;
};

export default ProtectedRoute;