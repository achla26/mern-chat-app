import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { useSelector, useDispatch } from "react-redux"; 
import { otpVerifyThunk } from "@/redux/thunks/auth.thunk";
import { toast } from "react-hot-toast";
import { useNavigation } from "../../hooks/navigation";
import { setAuthToken } from "@/utility/axios/axiosInstance";  // Import setAuthToken function

const OtpVerify = ({ className, ...props }) => { 

  const { navigate } = useNavigation();
  const dispatch = useDispatch();

  let email = sessionStorage.getItem("email"); // Save email
  

  const [userData, setUserData] = useState({
    email,
    otp: "", 
  });

  const handleFormData = (e) => {
    setUserData((prev) => {
      return { ...prev, [e.target.name]: e.target.value };
    }); 
  };

  const handleLogin = async () => {
    try {
      const response = await dispatch(otpVerifyThunk(userData)); // Assuming loginUserThunk dispatches the login API request
  
      if (response?.payload?.success) { 
        const token = response.payload.accessToken; // Replace with actual token from API response
        setAuthToken(token);  // Set the token in Redux and axios headers
        navigate("/"); // Navigate to the home page
      }
    } catch (err) {
      return toast.error(`An error occurred. ${err}`);
    }
  };
  return (
    <div
      className={cn(
        "flex flex-col gap-6 items-center justify-center h-screen w-full",
        className
      )}
      {...props}
    >
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">Login</CardTitle>
          <CardDescription>
            Enter your Email or Username below to login to your account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form>
            <div className="flex flex-col gap-6"> 
              <div className="grid gap-2"> 
                <Input
                  id="otp"
                  name="otp"
                  type="otp"
                  required
                  onChange={handleFormData}
                />
              </div>
              <Button
                type="button"
                className="w-full"
                onClick={handleLogin} 
              >
                Login
              </Button>
            </div>
            <div className="mt-4 text-center text-sm">
              Don&apos;t have an account?{" "}
              <a href="#" className="underline underline-offset-4">
                Sign up
              </a>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};
export default OtpVerify;
