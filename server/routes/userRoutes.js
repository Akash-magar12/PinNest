import express from "express";
import authMiddleware from "../middleware/authMiddleware.js";
import {
  deleteUser,
  editProfile,
  followAndUnfollow,
  getFollowersOrFollowing,
  getMyProfile,
  getUserFeed,
  getUserProfile,
} from "../controllers/userController.js";
import { upload } from "../middleware/multer.js";

const userRoute = express.Router();

userRoute.get("/me", authMiddleware, getMyProfile);
userRoute.get("/user-profile/:id", authMiddleware, getUserProfile);
userRoute.post("/follow/:id", authMiddleware, followAndUnfollow);
userRoute.get("/:id/:type", authMiddleware, getFollowersOrFollowing);
userRoute.put(
  "/edit-profile",
  authMiddleware,
  upload.single("profileImage"),
  editProfile
);
userRoute.get("/feed", authMiddleware, getUserFeed);
userRoute.delete("/delete", authMiddleware, deleteUser);
export default userRoute;
