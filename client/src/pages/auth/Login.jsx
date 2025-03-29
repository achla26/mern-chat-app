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
import { useState, useCallback } from "react";
import { useDispatch } from "react-redux";
import { setAuthToken } from "@/utility/axios/axiosInstance";
import { loginUserThunk } from "@/redux/thunks/auth.thunk";
import { toast } from "react-hot-toast";
import { useNavigation } from "../../hooks/navigation";
import { Link } from "react-router-dom";

const Login = ({ className, ...props }) => {
  const { navigate } = useNavigation();
  const dispatch = useDispatch();

  const [loginData, setLoginData] = useState({
    identifier: "",
    password: "",
  });

  const handleFormData = useCallback((e) => {
    const { name, value } = e.target;
    setLoginData((prev) => ({ ...prev, [name]: value }));
  }, []);

  const handleLogin = useCallback(async () => {
    try {
      const response = await dispatch(loginUserThunk(loginData));
      if (response?.payload?.success) {
        const token = response.payload.accessToken;
        setAuthToken(token);
        navigate("/");
      }
    } catch (err) {
      toast.error(`An error occurred. ${err}`);
    }
  }, [dispatch, loginData, navigate]);

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
          <form onSubmit={(e) => e.preventDefault()}>
            <div className="flex flex-col gap-6">
              <div className="grid gap-2">
                <Label htmlFor="identifier">Email or Username</Label>
                <Input
                  id="identifier"
                  name="identifier"
                  type="text"
                  required
                  value={loginData.identifier}
                  onChange={handleFormData}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  required
                  value={loginData.password}
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
              <div className="text-sm text-center">
                <Link to="/forgot-password" className="text-blue-500 hover:underline">
                  Forgot Password?
                </Link>
              </div>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default Login;
