import express from "express";
import {
  addComment,
  createPin,
  deleteComment,
  deletedPin,
  getAllPins,
  getSavedPins,
  getSinglePin,
  getUserPins,
  searchPosts,
  toggleSavePin,
  unSavePin,
} from "../controllers/pinController.js";
import authMiddleware from "../middleware/authMiddleware.js";
import { upload } from "../middleware/multer.js";

const pinRoutes = express.Router();
pinRoutes.post("/create", authMiddleware, upload.single("image"), createPin);
pinRoutes.get("/all-pins", authMiddleware, getAllPins);
pinRoutes.get("/single-pin/:id", authMiddleware, getSinglePin);
pinRoutes.get("/user-pins/:id", authMiddleware, getUserPins);
pinRoutes.post("/comment/:id", authMiddleware, addComment);
pinRoutes.delete("/comment/:commentId", authMiddleware, deleteComment);
pinRoutes.delete("/delete-pin/:id", authMiddleware, deletedPin);
pinRoutes.post("/save/:pinId", authMiddleware, toggleSavePin);
pinRoutes.delete("/unsave/:pinId", authMiddleware, unSavePin);
pinRoutes.get("/saved", authMiddleware, getSavedPins);
pinRoutes.get("/search",authMiddleware, searchPosts);

export default pinRoutes;
