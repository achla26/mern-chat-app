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
import { forgotPasswordThunk } from "@/redux/thunks/auth.thunk";
import { toast } from "react-hot-toast";
import { useNavigation } from "../../hooks/navigation";   // Import setAuthToken function
import { Link } from "react-router-dom";

const ForgotPassword = ({ className, ...props }) => { 

  const { navigate } = useNavigation();
  const dispatch = useDispatch(); 
  

  const [userData, setUserData] = useState({
    email:"", 
  });

  const handleFormData = (e) => {
    setUserData((prev) => {
      return { ...prev, [e.target.name]: e.target.value };
    }); 
  };

  const handleForgotPssword = async () => {
    try {
      const response = await dispatch(forgotPasswordThunk(userData));
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
          <CardTitle className="text-2xl">Forgot Password</CardTitle>
          <CardDescription>
            Enter your Email below 
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form>
            <div className="flex flex-col gap-6"> 
              <div className="grid gap-2"> 
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
                onClick={handleForgotPssword} 
              >
                Login
              </Button>
            </div>
            <div className="mt-4 text-center text-sm">
              Don&apos;t have an account?{" "}
              <Link to="/register" className="underline underline-offset-4">
                Sign up
              </Link>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};
export default ForgotPassword;
