import jwt from "jsonwebtoken";

const generateToken = (userId, res) => {
  const token = jwt.sign({ userId }, process.env.JWT_SECRET, {
    expiresIn: "7d",
  });

  const isProduction = process.env.NODE_ENV === "production";

  res.cookie("jwt", token, {
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    httpOnly: true,
    // "strict" blocks cookies on cross-origin requests (Vercel ↔ Render)
    // "none" allows cross-origin BUT requires secure:true (HTTPS only)
    sameSite: isProduction ? "none" : "strict",
    secure: isProduction, // must be true when sameSite is "none"
  });

  return token;
};

export default generateToken;
