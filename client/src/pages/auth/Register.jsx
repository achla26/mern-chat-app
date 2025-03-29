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
import { registerUserThunk } from "@/redux/thunks/auth.thunk";
import { useNavigate } from "react-router-dom";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import toast from "react-hot-toast";

const Register = ({ className, ...props }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [registerData, setRegisterData] = useState({
    fullName: "",
    email: "",
    password: "",
    username: "",
    confirmPassword: "",
    gender: "male",
  });

  const handleFormData = useCallback((e) => {
    const { name, value } = e.target;
    setRegisterData((prev) => ({ ...prev, [name]: value }));
  }, []);

  const handleRegister = useCallback(async () => {
    try {
      if (registerData.password !== registerData.confirmPassword) {
        return toast.error("Password and confirm password do not match.");
      }

      const response = await dispatch(registerUserThunk(registerData));
      if (response?.payload?.success) {
        navigate("/otp-verify");
      }
    } catch (err) {
      toast.error(`An error occurred. ${err}`);
    }
  }, [dispatch, registerData, navigate]);

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
            Enter your details below to register your account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={(e) => e.preventDefault()}>
            <div className="flex flex-col gap-6">
              <div className="grid gap-2">
                <Label htmlFor="fullName">Full Name</Label>
                <Input
                  id="fullName"
                  name="fullName"
                  type="text"
                  required
                  value={registerData.fullName}
                  onChange={handleFormData}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="username">Username</Label>
                <Input
                  id="username"
                  name="username"
                  type="text"
                  required
                  value={registerData.username}
                  onChange={handleFormData}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  required
                  value={registerData.email}
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
                <Label>Gender</Label>
                <RadioGroup
                  value={registerData.gender}
                  onValueChange={(value) =>
                    setRegisterData((prev) => ({ ...prev, gender: value }))
                  }
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
              <Button
                type="button"
                className="w-full"
                onClick={handleRegister}
              >
                Register
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default Register;