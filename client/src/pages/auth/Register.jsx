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
import { registerUserThunk } from "@/redux/thunks/user.thunk";
import { useNavigate } from "react-router-dom";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import toast from "react-hot-toast";

const Register = ({ className, ...props }) => {
  const navigate = useNavigate();
  const { isAuthenticated } = useSelector((state) => state.user);
  const dispatch = useDispatch();

  const [registerData, setRegisterData] = useState({
    fullName: "",
    email: "",
    password: "",
    username: "",
    confirmPassword:"",
    gender: "male", 
  });

  const handleFormData = (e) => {
    setRegisterData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleRegister = async () => {
    try {
      if(registerData.password !== registerData.confirmPassword){
        return toast.error("password and confirm password does not match.");
      }

      const response = await dispatch(registerUserThunk(registerData));
      if (response?.payload?.success) {
        navigate("/otp-verify");
      }  
    } catch(err){
      return toast.error(`An error occurred.${err}`);
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
          <CardTitle className="text-2xl">Register</CardTitle>
          <CardDescription>
            Enter your Details below to Register to your account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={(e) => e.preventDefault()}>
            <div className="flex flex-col gap-6">
              <div className="grid gap-2">
                <div className="grid gap-2">
                  <Label htmlFor="fullName">Name</Label>
                  <Input
                    id="fullName"
                    type="text"
                    name="fullName"
                    placeholder="John"
                    required
                    value={registerData.fullName}
                    onChange={handleFormData}
                  />
                </div>
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  name="email"
                  placeholder="john@gmail.com"
                  required
                  value={registerData.email}
                  onChange={handleFormData}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="username">Username</Label>
                <Input
                  id="username"
                  type="text"
                  name="username"
                  placeholder="john123"
                  required
                  value={registerData.username}
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
                  value={registerData.password}
                  onChange={handleFormData}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="confirmPassword">Confirm Password</Label>
                <Input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  required
                  value={registerData.confirmPassword}
                  onChange={handleFormData}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="gender">Gender</Label>
                <RadioGroup
                  defaultValue="male"
                  onValueChange={(value) => {
                    setRegisterData((prev) => ({ ...prev, gender: value }));
                  }}
                  className="flex gap-3"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="male" id="male" />
                    <Label htmlFor="male">Male</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="female" id="female" />
                    <Label htmlFor="female">Female</Label>
                  </div>
                </RadioGroup>
              </div>
              <Button type="button" className="w-full" onClick={handleRegister}>
                Register
              </Button>
            </div>
            <div className="mt-4 text-center text-sm">
              Already have an account?{" "}
              <a
                href="#"
                className="underline underline-offset-4"
                onClick={(e) => {
                  e.preventDefault();
                  navigate("/login");
                }}
              >
                Sign In
              </a>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default Register;