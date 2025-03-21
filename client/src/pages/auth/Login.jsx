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
import { login } from "../../redux/slices/user.slice";
import { loginThunk } from "@/redux/thunks/user.thunk";
import { toast } from "react-hot-toast";
import { useNavigation } from "../../hooks/navigation"
const Login = ({ className, ...props }) => { 

  const { navigate, resetAndNavigate, goBack, push } = useNavigation();
  const { isAuthenticated } = useSelector((state) => state.user);
  // console.log(isAuthenticated)
  const dispatch = useDispatch();

  const [loginData, setLoginData] = useState({
    email: "",
    password: "", 
  });

  const handleFormData = (e) => {
    setLoginData((prev) => {
      return { ...prev, [e.target.name]: e.target.value };
    }); 
  };

  const handleLogin = async () => {
    const response = await dispatch(loginThunk(loginData));
    if (response?.payload?.success) {
      navigate("/");
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
            Enter your email below to login to your account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form>
            <div className="flex flex-col gap-6">
              <div className="grid gap-2">
                <Label htmlFor="email">email</Label>
                <Input
                  id="email"
                  type="email"
                  name="email"
                  placeholder="john@gmail.com"
                  required
                  value={loginData.email}
                  onChange={handleFormData}
                />
              </div>
              <div className="grid gap-2">
                <div className="flex items-center">
                  <Label htmlFor="password">Password</Label>
                  <a
                    href="#"
                    className="ml-auto inline-block text-sm underline-offset-4 hover:underline"
                  >
                    Forgot your password?
                  </a>
                </div>
                <Input
                  id="password"
                  name="password"
                  type="password"
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
export default Login;
