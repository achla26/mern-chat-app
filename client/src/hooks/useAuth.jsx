import Cookies from "js-cookie";
import { safeLocalStorage } from "@/utility/helper"; 

export const useAuth = () => { 
  // Check if user has both token and user data
  const isAuthenticated = () => {
    try {
      const user = safeLocalStorage.getItem("user");
      const accessToken = Cookies.get("accessToken");
      return !!user && !!accessToken; // !! convert a value into a boolean
    } catch {
      return false;
    }
  };

  return { isAuthenticated };
};