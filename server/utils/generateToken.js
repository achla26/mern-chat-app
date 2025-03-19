import jwt from "jsonwebtoken";
export const generateToken = async (userId, res) => { 
  try {
    if (!userId) throw new Error("User is required");

    const token = jwt.sign({ userId }, process.env.JWT_ACCESS_TOKEN_SECRET, {
        expiresIn: process.env.JWT_ACCESS_TOKEN_EXPIRY,
    });

    res.cookie("jwt", token, {
      maxAge: 7 * 24 * 60 * 60 * 1000, // MS
      httpOnly: true, // prevent XSS attacks cross-site scripting attacks
      sameSite: "strict", // CSRF attacks cross-site request forgery attacks
      secure: process.env.NODE_ENV === "production",
    });

    return token;
  } catch (error) {
    throw error;
  }
};
