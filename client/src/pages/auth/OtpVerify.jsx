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
import { otpVerifyThunk } from "@/redux/thunks/auth.thunk";
import { toast } from "react-hot-toast";
import { useNavigation } from "../../hooks/navigation";
import { setAuthToken } from "@/utility/axios/axiosInstance";

const OtpVerify = ({ className, ...props }) => {
  const { navigate } = useNavigation();
  const dispatch = useDispatch();

  const email = sessionStorage.getItem("email");

  const [userData, setUserData] = useState({
    email,
    otp: "",
  });

  const handleFormData = useCallback((e) => {
    const { name, value } = e.target;
    setUserData((prev) => ({ ...prev, [name]: value }));
  }, []);

  const handleOtpVerification = useCallback(async () => {
    try {
      const response = await dispatch(otpVerifyThunk(userData));
      if (response?.payload?.success) {
        const token = response.payload.accessToken;
        setAuthToken(token);
        navigate("/");
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
          <CardTitle className="text-2xl">Verify OTP</CardTitle>
          <CardDescription>
            Enter the OTP sent to your email to verify your account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={(e) => e.preventDefault()}>
            <div className="flex flex-col gap-6">
              <div className="grid gap-2">
                <Label htmlFor="otp">OTP</Label>
                <Input
                  id="otp"
                  name="otp"
                  type="text"
                  required
                  value={userData.otp}
                  onChange={handleFormData}
                />
              </div>
              <Button
                type="button"
                className="w-full"
                onClick={handleOtpVerification}
              >
                Verify OTP
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default OtpVerify;
