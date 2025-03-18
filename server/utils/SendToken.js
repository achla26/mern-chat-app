export const sendToken = (user) => {
    if (!user) throw new Error("User is required");
  
    const token = user.generateAccessToken();
  
    const options = {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    };
   
    return { token , options}
  };
  