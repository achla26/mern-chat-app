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
import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { setAuthToken } from "@/utility/axios/axiosInstance";  // Import setAuthToken function

import { loginUserThunk } from "@/redux/thunks/auth.thunk";
import { toast } from "react-hot-toast";
import { useNavigation } from "../../hooks/navigation";
import { Link } from "react-router-dom";

const Login = ({ className, ...props }) => {
  const { navigate} = useNavigation();
  // const { isAuthenticated } = useSelector((state) => state.user);
  const dispatch = useDispatch();

  const [loginData, setLoginData] = useState({
    identifier: "",
    password: "",
  });

  const handleFormData = (e) => {
    setLoginData((prev) => {
      return { ...prev, [e.target.name]: e.target.value };
    });
  };

  const handleLogin = async () => {
    try {
      const response = await dispatch(loginUserThunk(loginData)); // Assuming loginUserThunk dispatches the login API request
  
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
                <Label htmlFor="identifier">Email/Username</Label>
                <Input
                  id="identifier"
                  type="text"
                  name="identifier"
                  placeholder="john"
                  required
                  value={loginData.identifier}
                  onChange={handleFormData}
                />
              </div>
              <div className="grid gap-2">
                <div className="flex items-center">
                  <Label htmlFor="password">Password</Label>
                  <Link
                    to="/forgot-password"
                    className="ml-auto inline-block text-sm underline-offset-4 hover:underline"
                  >
                    Forgot your password?
                  </Link>
                </div>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  required
                  onChange={handleFormData}
                />
              </div>
              <Button type="button" className="w-full" onClick={handleLogin}>
                Login
              </Button>
            </div>
            <div className="mt-4 text-center text-sm">
              Don&apos;t have an account?{" "}
              <Link to="register" className="underline underline-offset-4">
                Sign up
              </Link>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};
export default Login;
