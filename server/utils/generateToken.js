import jwt from "jsonwebtoken";

export const generateTokens = async (userId, res) => {
  try {
    if (!userId) throw new Error("User ID is required");

    // Generate Access Token (Short-lived)
    const accessToken = jwt.sign(
      { userId },
      process.env.JWT_ACCESS_TOKEN_SECRET,
      { expiresIn: process.env.JWT_ACCESS_TOKEN_EXPIRY || "15m" } // 15 min
    );

    // Generate Refresh Token (Long-lived)
    const refreshToken = jwt.sign(
      { userId },
      process.env.JWT_REFRESH_TOKEN_SECRET,
      { expiresIn: process.env.JWT_REFRESH_TOKEN_EXPIRY || "7d" } // 7 days
    );

    // Store Refresh Token in HTTP-Only Cookie
    res.cookie("refreshToken", refreshToken, {
      httpOnly: false, // true if Secure from XSS
      sameSite: "strict", //  Prevent CSRF
      secure: process.env.NODE_ENV === "production",
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

     // Store Access Token in HTTP-Only Cookie
     res.cookie("accessToken", accessToken, {
      httpOnly: false, // true if Secure from XSS
      sameSite: "strict", // Prevent CSRF
      secure: process.env.NODE_ENV === "production",
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    return { accessToken, refreshToken }; // Return both access and refresh token
  } catch (error) {
    throw error;
  }
};
