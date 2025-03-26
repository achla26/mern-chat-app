// src/hooks/useAuth.js
import { useEffect } from "react";
import Cookies from "js-cookie";
import { safeLocalStorage } from "@/utility/helper";
import { useNavigate } from "react-router-dom";

export const useAuth = () => {
  const navigate = useNavigate();

  // Check if user has both token and user data
  const isAuthenticated = () => {
    try {
      const user = safeLocalStorage.getItem("user");
      const accessToken = Cookies.get("accessToken");
      return !!user && !!accessToken;
    } catch {
      return false;
    }
  };

  return { isAuthenticated };
};