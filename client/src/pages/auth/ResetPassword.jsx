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
import { resetPasswordThunk } from "@/redux/thunks/user.thunk";
import { useNavigate , useParams , Link} from "react-router-dom";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import toast from "react-hot-toast";

const Register = ({ className, ...props }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { token } = useParams(); // Get token from URL

  const [formData, setFormData] = useState({
    password: "",
    confirmPassword: "",
    token
  });

  const handleFormData = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleRegister = async () => {
    try {
      if (formData.password !== formData.confirmPassword) {
        return toast.error("password and confirm password does not match.");
      }

      const response = await dispatch(resetPasswordThunk(formData));
      if (response?.payload?.success) {
        navigate("/login");
      }
    } catch (err) {
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
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  required
                  value={formData.password}
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
                  value={formData.confirmPassword}
                  onChange={handleFormData}
                />
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
