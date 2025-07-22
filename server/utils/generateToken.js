import jwt from "jsonwebtoken";

// Function to generate and send JWT in cookie
const generateToken = (res, userId) => {
  // 1. Create a JWT token with the userId as payload
  //    - Use your secret key from .env
  //    - Set token to expire in 24 hours
  const token = jwt.sign({ userId }, process.env.JWT_SECRET, {
    expiresIn: "24h",
  });

  // 2. Send token in cookie
  res.cookie("snapNest-jwt", token, {
    // Set cookie expiration: 15 days (in ms)
    maxAge: 15 * 24 * 60 * 60 * 1000,

    // Makes cookie inaccessible to client-side JavaScript (adds security)
    httpOnly: true,

    // For cross-site (Render frontend + backend), this must be "None"
    sameSite: "None",

    // Required when sameSite is "None" — ensures cookie is sent only over HTTPS
    secure: true,
  });
};

export default generateToken;
