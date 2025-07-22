import jwt from "jsonwebtoken";
import { userModel } from "../models/userModel.js";

// Middleware to protect routes by verifying JWT and attaching user to req
const authMiddleware = async (req, res, next) => {
  try {
    // 1. Extract token from cookie
    const token = req.cookies["snapNest-jwt"];
    if (!token) {
      // 2. If no token, user is unauthorized
      return res.status(401).json({ message: "Please log in to access this resource" });
    }

    // 3. Verify token using JWT_SECRET
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // 4. Destructure userId from decoded payload
    const { userId } = decoded;

    // 5. Find user in DB by ID, exclude password field
    const user = await userModel.findById(userId).select("-password");
    if (!user) {
      // 6. If user not found, return unauthorized
      return res.status(401).json({ message: "No user found" });
    }

    // 7. Attach user object to request so it can be used in protected routes
    req.user = user;

    // 8. Pass control to the next middleware or route handler
    next();
  } catch (error) {
    // 9. If error occurs, send 500 response with error message
    res.status(500).json({ message: error.message });
  }
};

export default authMiddleware;
