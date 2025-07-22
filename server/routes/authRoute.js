import express from "express";
import {
  authLogin,
  authLogout,
  authSignup,
  changePassword,
  forgotPassword,
  forgotPasswordOtp,
  resetPassword,
  resetPasswordWithOtp,
  verifyOtp,
} from "../controllers/authController.js";
import authMiddleware from "../middleware/authMiddleware.js";
const authRouter = express.Router();

authRouter.post("/signup", authSignup);
authRouter.post("/login", authLogin);
authRouter.post("/logout", authLogout);
authRouter.post("/forgot-password", forgotPassword);
authRouter.post("/change-password", authMiddleware, changePassword);
authRouter.post("/reset-password", resetPassword);
authRouter.post("/forgot-password/otp", forgotPasswordOtp);
authRouter.post("/password/verify-otp", verifyOtp);
authRouter.post("/otp-reset-password", resetPasswordWithOtp);

export default authRouter;
