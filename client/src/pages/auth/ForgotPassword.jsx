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
import { forgotPasswordThunk } from "@/redux/thunks/auth.thunk";
import { toast } from "react-hot-toast";
import { useNavigation } from "../../hooks/navigation";
import { Link } from "react-router-dom";

const ForgotPassword = ({ className, ...props }) => {
  const { navigate } = useNavigation();
  const dispatch = useDispatch();

  const [userData, setUserData] = useState({
    email: "",
  });

  const handleFormData = useCallback((e) => {
    const { name, value } = e.target;
    setUserData((prev) => ({ ...prev, [name]: value }));
  }, []);

  const handleForgotPassword = useCallback(async () => {
    try {
      const response = await dispatch(forgotPasswordThunk(userData));
      if (response?.payload?.success) {
        toast.success("Password reset email sent successfully.");
        navigate("/login");
      }
    } catch (err) {
      toast.error(`An error occurred. ${err}`);
    }
  }, [dispatch, userData, navigate]);

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
          <CardTitle className="text-2xl">Forgot Password</CardTitle>
          <CardDescription>
            Enter your email below to reset your password
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={(e) => e.preventDefault()}>
            <div className="flex flex-col gap-6">
              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  required
                  value={userData.email}
                  onChange={handleFormData}
                />
              </div>
              <Button
                type="button"
                className="w-full"
                onClick={handleForgotPassword}
              >
                Reset Password
              </Button>
              <div className="text-sm text-center">
                <Link to="/login" className="text-blue-500 hover:underline">
                  Back to Login
                </Link>
              </div>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default ForgotPassword;
